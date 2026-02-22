'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    Image as ImageIcon,
    Save,
    ArrowLeft,
    Upload,
    Plus,
    X,
    ChevronRight,
    ChevronDown,
    Activity
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { updateCollection, checkSlugAvailability } from "@/lib/actions/collections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ProductPicker } from "./product-picker";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

// Reuse similar schema but for Edit (fields optional?)
const formSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    slug: z.string().min(3, "El slug es requerido"),
    description: z.string().optional(),
    image_url: z.string().optional(),
    product_ids: z.array(z.string()).default([]),
    is_active: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectionDetailProps {
    initialData: any;
    id: string;
}

export function CollectionDetail({ initialData, id }: CollectionDetailProps) {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData.image_url);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
    const [products, setProducts] = useState<any[]>(initialData.products || []);
    const [seoOpen, setSeoOpen] = useState(false);
    const [loadingLog, setLoadingLog] = useState("");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description || "",
            product_ids: initialData.products?.map((p: any) => p.id) || [],
            is_active: initialData.is_active,
        }
    });

    // Sync state when initialData changes (e.g. after server action + refresh)
    useEffect(() => {
        setImagePreview(initialData.image_url);
        setProducts(initialData.products || []);
        form.reset({
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description || "",
            image_url: initialData.image_url,
            product_ids: initialData.products?.map((p: any) => p.id) || [],
            is_active: initialData.is_active,
        });
        setImageFile(null); // Clear file
    }, [initialData, form]);

    const watchedProductIds = form.watch("product_ids");

    // Sync products state with form ids (for filtering updates)
    useEffect(() => {
        // If IDs change via picker, we might need to fetch new product details if we don't have them?
        // Actually, the Picker selects IDs. If we have them in `products` list, show them.
        // If the user adds NEW products, we might need to know their details to show them in the inline list.
        // BUT ProductPicker only returns IDs.
        // Solution: ProductPicker usually is for selection. 
        // If we want to show the detail list, we need the full objects.
        // My ProductPicker has a cache or local state.
        // Let's rely on the Picker to "Select", and then we might need to fetch details for new IDs?
        // OR: Can ProductPicker return full objects? 
        // For now, let's just accept that we might not show details for NEWLY added items unless we fetch them.
        // OR: Reuse ProductPicker's internal cache?
        // Simplest: The "Inline List" IS the way to manage products. 
        // If I use the Sheet to ADD products, when I confirm, I should ideally get the full product objects back.
        // But the `onSelectionChange` only gives IDs.

        // Let's update `onSelectionChange` logic or just fetch missing products?
        // Actually, for this iteration, let's keep the `ProductPicker` inside the sheet as the MAIN way to view selection?
        // NO, the prompt IMAGE shows an INLINE list "Productos (12)" with "Editar Orden".
        // And "Agregar Productos" button.

        // If I Add from Sheet, I need to add to `products` state.
        // I will make `ProductPicker` expose selected objects if possible?
        // Currently it does not.

        // WORKAROUND: When Sheet closes, if new IDs exist that are not in `products`, fetch brief info?
        // Or just trust that on SAVE and RELOAD (revalidate) they appear?
        // User Experience: They expect to see what they added.

        // I'll leave strictly "IDs" management for now. If visual list needs update, I might need a helper.
        // Only existing products (initial) are shown fully? 
        // Let's try to pass `onProductsSelected` prop to ProductPicker? No.

    }, [watchedProductIds]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        setLoadingLog("Iniciando...");
        console.log("Submitting form data:", data);
        try {
            // Check slug if changed
            if (data.slug !== initialData.slug) {
                setLoadingLog("Verificando disponibilidad...");
                const isAvailable = await checkSlugAvailability(data.slug);
                if (!isAvailable) {
                    toast({ title: "Error", description: "El slug ya existe", variant: "destructive" });
                    setIsSubmitting(false);
                    return;
                }
            }

            let imageUrl = data.image_url || imagePreview;
            console.log("Initial imageUrl (from preview/data):", imageUrl);

            // Note: form doesn't have image_url field explicitly in schema but we send it.
            // If new file:
            if (imageFile) {
                setLoadingLog("Subiendo imagen de portada...");
                console.log("New image file detected:", imageFile.name);
                const supabase = createClient();
                const fileName = `collections/${data.slug}-${Date.now()}`;

                console.log("Uploading to:", fileName);

                // Add Timeout Race
                console.log(`Starting upload. File size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);

                const uploadPromise = supabase.storage.from('products').upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true
                });

                const timeoutPromise = new Promise<{ error: any, data: any }>((resolve) => {
                    setTimeout(() => resolve({ error: { message: "La subida de imagen excedió el tiempo de espera (60s). Revisa tu conexión o tamaño." }, data: null }), 60000);
                });

                const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

                if (uploadError) {
                    console.error("Upload error details:", uploadError);
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
                imageUrl = publicUrl;
                console.log("New Public URL generated:", imageUrl);
                setLoadingLog("Imagen subida con éxito...");
            } else {
                console.log("No new image file selected.");
            }

            setLoadingLog("Guardando cambios...");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            formData.append("description", data.description || "");
            formData.append("image_url", imageUrl || "");
            formData.append("is_active", String(data.is_active));
            formData.append("product_ids", data.product_ids.join(","));

            console.log("Sending updateCollection with image_url:", imageUrl);

            const res = await updateCollection(id, formData);
            if (!res.success) throw new Error(res.message);

            toast({ title: "Éxito", description: "Colección actualizada" });
            router.refresh();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
            setLoadingLog("");
        }
    };

    // Helper to remove product from list
    const removeProduct = (pid: string) => {
        const current = form.getValues("product_ids");
        form.setValue("product_ids", current.filter(id => id !== pid));
        setProducts(prev => prev.filter(p => p.id !== pid));
    };

    // Helper for adding products with state sync
    const handleProductSelection = (ids: string[], newProducts?: any[]) => {
        form.setValue("product_ids", ids);
        // If we have new products, add them to our local 'products' state if not already there
        if (newProducts && newProducts.length > 0) {
            setProducts(prev => {
                const combined = [...prev];
                newProducts.forEach(np => {
                    if (!combined.find(p => p.id === np.id)) {
                        combined.push(np);
                    }
                });
                return combined;
            });
        }
    };

    // Let's implement the UI.

    return (
        <div className="min-h-screen bg-background font-sans transition-colors duration-500 pb-32">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 border border-transparent hover:border-border/30 rounded-none transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-brand rounded-full animate-pulse opacity-50"></div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">Editor de Colecciones</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground tracking-[0.1em] uppercase truncate max-w-[200px] sm:max-w-md">{form.watch("name") || "Sin Nombre"}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-foreground text-background font-bold hover:bg-foreground/90 h-11 px-8 rounded-none uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Guardando</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="w-3.5 h-3.5" />
                                <span>Guardar Cambios</span>
                            </div>
                        )}
                    </Button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-7 space-y-12">

                    {/* Primary Info */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                            <div className="w-1.5 h-4 bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                            <h2 className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">Información General</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] ml-1">Título de Colección</Label>
                                <Input
                                    {...form.register("name")}
                                    className="h-14 bg-card border-border/50 rounded-none focus-visible:ring-brand/50 text-base font-medium tracking-tight uppercase"
                                    placeholder="EJ. ESSENTIALS SUMMER 2024"
                                />
                                {form.formState.errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{form.formState.errors.name.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] ml-1">Slug URL</Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono opacity-50">/</div>
                                    <Input
                                        {...form.register("slug")}
                                        className="h-14 bg-card border-border/50 rounded-none pl-7 font-mono text-sm focus-visible:ring-brand/50"
                                        placeholder="summer-collection"
                                    />
                                </div>
                                <p className="text-[9px] text-muted-foreground/60 uppercase tracking-widest px-1">Identificador único para la URL pública.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] ml-1">Descripción Narrativa</Label>
                                <Textarea
                                    {...form.register("description")}
                                    className="min-h-[160px] bg-card border-border/50 rounded-none resize-none focus-visible:ring-brand/50 p-4 text-sm leading-relaxed"
                                    placeholder="DESCRIBE EL CONCEPTO DE ESTA COLECCIÓN..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Product Selection */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                                <h2 className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">
                                    Productos Vinculados <span className="text-muted-foreground ml-2 opacity-50 font-normal">[{watchedProductIds.length}]</span>
                                </h2>
                            </div>

                            <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="h-10 px-6 rounded-none border-border/50 hover:bg-brand/10 hover:text-brand transition-all uppercase tracking-[0.2em] text-[10px] font-bold">
                                        <Plus className="w-3.5 h-3.5 mr-2" /> Gestionar Lista
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[95vh] rounded-none p-0 flex flex-col bg-background border-t-brand/30">
                                    <SheetHeader className="px-8 py-6 border-b border-border/30 flex flex-row items-center justify-between space-y-0 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                                        <div className="flex flex-col text-left">
                                            <span className="text-[9px] font-bold text-brand uppercase tracking-[0.3em]">Selector Avanzado</span>
                                            <SheetTitle className="text-2xl font-bold uppercase tracking-[0.1em]">Catálogo de Productos</SheetTitle>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Cancelar</Button>
                                            <Button className="bg-brand text-white hover:bg-brand/90 px-8 rounded-none uppercase tracking-[0.2em] text-[10px] font-bold h-11" onClick={() => setIsProductSheetOpen(false)}>Confirmar Selección</Button>
                                        </div>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto w-full relative pb-20">
                                        <ProductPicker
                                            selectedIds={watchedProductIds}
                                            onSelectionChange={handleProductSelection}
                                            onConfirm={() => setIsProductSheetOpen(false)}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="grid grid-cols-1 gap-px bg-border/20 border border-border/50 overflow-hidden">
                            <AnimatePresence initial={false}>
                                {products.filter(p => watchedProductIds.includes(p.id)).length > 0 ? (
                                    products.filter(p => watchedProductIds.includes(p.id)).map((prod, idx) => (
                                        <motion.div
                                            key={prod.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group bg-card hover:bg-secondary/40 dark:hover:bg-white/[0.02] transition-all p-5 flex items-center gap-6 relative overflow-hidden"
                                        >
                                            <div className="relative w-16 h-16 bg-secondary/30 dark:bg-white/5 border border-border/30 overflow-hidden shrink-0 group-hover:border-brand/30 transition-colors">
                                                {prod.product_images?.[0]?.image_url ? (
                                                    <Image src={prod.product_images[0].image_url} alt={prod.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : <div className="w-full h-full flex-center text-[10px] font-bold opacity-30">N/A</div>}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-bold text-brand uppercase tracking-widest">#{prod.id.slice(0, 8)}</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-foreground uppercase tracking-tight truncate group-hover:text-brand transition-colors">{prod.name}</h4>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">MXN ${(prod.price || 0).toLocaleString()}</p>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-none w-10 h-10 transition-all border border-transparent hover:border-red-500/20"
                                                onClick={() => removeProduct(prod.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="bg-card/30 p-16 text-center space-y-4 border border-dashed border-border/50">
                                        <div className="w-12 h-12 bg-secondary/50 mx-auto flex items-center justify-center opacity-30">
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">No hay productos en esta colección</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>

                {/* Right Column: Status & Aesthetics */}
                <div className="lg:col-span-5 space-y-12">

                    {/* Visual Configuration */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                            <div className="w-1.5 h-4 bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                            <h2 className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">Estética Visual</h2>
                        </div>

                        <div className="space-y-6">
                            <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] ml-1">Imagen de Portada (Premium)</Label>
                            <div className="relative w-full aspect-[4/3] bg-card border border-border/50 group overflow-hidden hover:border-brand/40 transition-all duration-700 shadow-sm hover:shadow-2xl hover:shadow-brand/5">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Cover Preview" fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground space-y-4 opacity-40">
                                        <ImageIcon className="w-12 h-12 stroke-[1px]" />
                                        <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Sin Medios Seleccionados</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-12">
                                    <label className="cursor-pointer bg-foreground text-background px-8 py-3 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:bg-brand transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        <Upload className="w-4 h-4" />
                                        <span>Seleccionar Archivo</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                                    </label>
                                </div>

                                {imageFile && (
                                    <div className="absolute top-4 left-4 bg-brand text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                                        Nuevo Archivo Pendiente
                                    </div>
                                )}
                            </div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed text-center opacity-60">Recomendado: 1200x800px min. Formato JPG/PNG/WebP optimizado.</p>
                        </div>
                    </section>

                    {/* Publication Controls */}
                    <section className="space-y-6 p-8 bg-card border border-border/50 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand/5 rounded-full blur-3xl"></div>

                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold text-foreground uppercase tracking-[0.3em] mb-3">Estado de Publicación</h3>
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-2 h-2 rounded-full", form.watch("is_active") ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/30")} />
                                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">{form.watch("is_active") ? "Visible en Tienda" : "Modo Borrador"}</span>
                                </div>
                            </div>
                            <Switch
                                checked={form.watch("is_active")}
                                onCheckedChange={(val) => form.setValue("is_active", val)}
                                className="data-[state=checked]:bg-brand rounded-none"
                            />
                        </div>

                        <div className="pt-6 border-t border-border/30 relative z-10 opacity-70">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                                {form.watch("is_active")
                                    ? "La colección y sus productos vinculados son accesibles para todos los visitantes del catálogo público."
                                    : "La colección está oculta. Solo personal con acceso administrativo puede previsualizar esta sección."}
                            </p>
                        </div>
                    </section>

                    {/* Advanced View options */}
                    <div className="border border-border/50 overflow-hidden bg-card">
                        <button
                            onClick={() => setSeoOpen(!seoOpen)}
                            className="w-full h-14 flex items-center justify-between px-6 hover:bg-secondary/40 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-brand group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold text-foreground uppercase tracking-[0.3em]">Configuración SEO</span>
                            </div>
                            {seoOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        <AnimatePresence>
                            {seoOpen && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden border-t border-border/30"
                                >
                                    <div className="p-8 space-y-4">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-loose opacity-70 italic border-l border-brand/20 pl-4">
                                            Los metadatos SEO se generan automáticamente basándose en el título y descripción. Las configuraciones manuales personalizadas estarán disponibles en la próxima actualización del motor de indexación de Glittershop.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Loading Overlay Minimalist */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 transition-colors"
                    >
                        <div className="flex flex-col items-center gap-8 max-w-xs text-center">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-[1px] border-brand/10 rounded-full" />
                                <div className="absolute inset-0 border-t-[1px] border-brand rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Save className="w-6 h-6 text-brand" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-foreground animate-pulse">{loadingLog || "Procesando Datos"}</h3>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">Estamos sincronizando tus cambios con la infraestructura global por favor no cierres esta ventana.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

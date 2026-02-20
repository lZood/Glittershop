'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Image as ImageIcon, Save, ArrowLeft, Upload, Plus, X, ChevronRight, ChevronDown } from "lucide-react";
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
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </Button>
                <h1 className="text-base font-bold text-slate-900 truncate max-w-[200px]">{form.watch("name")}</h1>
                <Button
                    disabled={isSubmitting}
                    onClick={form.handleSubmit(onSubmit)}
                    className="text-[#b47331] font-bold hover:bg-[#b47331]/10 hover:text-[#a1662a] bg-transparent h-9 px-3"
                >
                    Guardar
                </Button>
            </header>

            <main className="max-w-lg mx-auto p-4 space-y-8">

                {/* Status Toggle - Simplified */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2.5 h-2.5 rounded-full", form.watch("is_active") ? "bg-green-500" : "bg-slate-300")} />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{form.watch("is_active") ? "Publicado" : "Borrador"}</span>
                            <span className="text-[10px] text-slate-400">Visible en la tienda</span>
                        </div>
                    </div>
                    <Switch
                        checked={form.watch("is_active")}
                        onCheckedChange={(val) => form.setValue("is_active", val)}
                        className="data-[state=checked]:bg-[#b47331]"
                    />
                </div>

                {/* General Info - Simplified */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-slate-900 px-2">Información General</h2>
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500 font-medium ml-1">Nombre</Label>
                            <Input {...form.register("name")} className="h-12 bg-white border-transparent shadow-sm rounded-2xl focus-visible:ring-[#b47331]" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500 font-medium ml-1">Slug</Label>
                            <Input {...form.register("slug")} className="h-12 bg-white border-transparent shadow-sm rounded-2xl font-mono text-xs focus-visible:ring-[#b47331]" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500 font-medium ml-1">Descripción</Label>
                            <Textarea {...form.register("description")} className="min-h-[100px] bg-white border-transparent shadow-sm rounded-2xl resize-none focus-visible:ring-[#b47331]" />
                        </div>
                    </div>
                </section>

                {/* Products List - Simplified */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            Productos <span className="text-slate-400 font-normal">({watchedProductIds.length})</span>
                        </h2>
                        <Button variant="ghost" className="text-[#b47331] text-xs font-bold h-auto p-0 hover:bg-transparent">Editar Orden</Button>
                    </div>

                    <div className="space-y-2">
                        {/* Inline list */}
                        {products.filter(p => watchedProductIds.includes(p.id)).map(prod => (
                            <div key={prod.id} className="flex items-center gap-3 p-3 bg-white shadow-sm hover:shadow-md rounded-2xl transition-all group relative">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-100 shrink-0">
                                    {prod.product_images?.[0]?.image_url ? (
                                        <Image src={prod.product_images[0].image_url} alt={prod.name} fill className="object-cover" />
                                    ) : <div className="w-full h-full bg-slate-200" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{prod.name}</h4>
                                    <p className="text-xs text-slate-400 font-mono">${(prod.price || 0).toFixed(2)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8"
                                    onClick={() => removeProduct(prod.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="w-full h-12 text-[#b47331] font-bold bg-white shadow-sm hover:bg-[#b47331]/5 hover:text-[#a1662a] rounded-2xl flex items-center justify-center gap-2 mt-2 border border-dashed border-slate-200">
                                    <Plus className="w-4 h-4" /> Agregar Productos
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[90vh] rounded-t-[2rem] p-0 flex flex-col">
                                <SheetHeader className="px-6 pt-6 pb-4 border-b flex flex-row items-center justify-between space-y-0">
                                    <Button variant="ghost" className="text-slate-400 p-0 hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Cancelar</Button>
                                    <SheetTitle className="text-base font-bold">Seleccionar Productos</SheetTitle>
                                    <Button variant="ghost" className="text-[#b47331] font-bold p-0 hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Listo</Button>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto w-full relative">
                                    <ProductPicker
                                        selectedIds={watchedProductIds}
                                        onSelectionChange={handleProductSelection}
                                        onConfirm={() => setIsProductSheetOpen(false)}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </section>

                {/* Cover Image - Simplified */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-slate-900 px-2">Imagen de Portada</h2>
                    <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden shadow-sm bg-white group border border-slate-200/50">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Cover" fill className="object-cover" />
                        ) : (
                            <div className="flex-center w-full h-full text-slate-400">Sin Imagen</div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end justify-end p-4">
                            <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                                <ImageIcon className="w-4 h-4" /> Cambiar
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                            </label>
                        </div>
                    </div>
                </section>

                {/* SEO Config */}
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setSeoOpen(!seoOpen)}
                        className="w-full flex items-center justify-between p-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
                    >
                        Configuración SEO
                        {seoOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </button>
                    {seoOpen && (
                        <div className="p-4 pt-0 space-y-3">
                            <p className="text-xs text-slate-500">Configuración de meta tags y visualización en buscadores.</p>
                            {/* Placeholder for SEO fields */}
                        </div>
                    )}
                </div>

            </main>

            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="p-4 bg-white rounded-full shadow-2xl shadow-[#b47331]/20 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-[#b47331]/10 border-t-[#b47331] animate-spin" />
                            <Save className="w-6 h-6 text-[#b47331]" />
                        </div>
                        <p className="text-sm font-bold text-slate-600 animate-pulse">{loadingLog || "Procesando..."}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

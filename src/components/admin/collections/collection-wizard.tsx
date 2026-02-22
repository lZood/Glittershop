'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Image as ImageIcon, Save, ArrowLeft, Upload, Plus, PackageOpen } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { createCollection, checkSlugAvailability } from "@/lib/actions/collections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ProductPicker } from "./product-picker";
import { cn } from "@/lib/utils";

// Schema
const formSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    slug: z.string().min(3, "El slug es requerido"),
    description: z.string().optional(),
    product_ids: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

import { motion, AnimatePresence } from "framer-motion";

export function CollectionWizard() {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingLog, setLoadingLog] = useState("");
    const [slugError, setSlugError] = useState("");
    const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            product_ids: [],
        }
    });

    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue("name", name);
        if (!form.getValues("slug") || form.getValues("slug") === slugify(form.formState.defaultValues?.name || "")) {
            form.setValue("slug", slugify(name));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: "Error", description: "Imagen muy grande (max 5MB)", variant: "destructive" });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: FormValues, status: 'draft' | 'active') => {
        setIsSubmitting(true);
        setLoadingLog("Iniciando...");

        try {
            setLoadingLog("Verificando disponibilidad...");
            const isAvailable = await checkSlugAvailability(data.slug);
            if (!isAvailable) {
                setSlugError("Este slug ya está en uso");
                setIsSubmitting(false);
                return;
            }
            setSlugError("");

            let imageUrl = "";
            if (imageFile) {
                setLoadingLog("Subiendo imagen de portada...");
                const supabase = createClient();
                const fileExt = imageFile.name.split('.').pop() || 'png';
                const fileName = `collections/${data.slug}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('collection_images')
                    .upload(fileName, imageFile, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: imageFile.type
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('collection_images').getPublicUrl(fileName);
                imageUrl = publicUrl;
            }

            setLoadingLog(status === 'active' ? "Publicando colección..." : "Guardando borrador...");
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            formData.append("description", data.description || "");
            formData.append("image_url", imageUrl);
            formData.append("is_active", String(status === 'active'));
            formData.append("product_ids", data.product_ids.join(","));

            const res = await createCollection({} as any, formData);
            if (res.message || res.errors) throw new Error(res.message || "Error al crear colección");

            setLoadingLog("¡Listo!");
            toast({ title: "Éxito", description: "Colección guardada correctamente" });

            setTimeout(() => {
                router.push("/admin/collections");
            }, 1000);

        } catch (error: any) {
            console.error(error);
            toast({ title: "Error", description: error.message || "Ocurrió un error", variant: "destructive" });
            setIsSubmitting(false);
        }
    };

    const selectedCount = form.watch("product_ids").length;

    return (
        <div className="min-h-screen bg-background flex flex-col relative font-sans transition-colors duration-500">
            {/* Loading Overlay */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 border-2 border-brand/20 rounded-full animate-ping absolute inset-0"></div>
                            <div className="w-16 h-16 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-sm font-bold text-foreground mt-8 uppercase tracking-[0.3em] animate-pulse">{loadingLog}</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-[0.1em]">Procesando infraestructura</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md border-b border-border/50 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-none hover:bg-secondary border border-transparent hover:border-border/50 transition-all">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">Gestor de Contenido</span>
                        <h1 className="text-xl font-medium tracking-[0.1em] uppercase text-foreground">Nueva Colección</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => router.back()} className="text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all rounded-none">
                        Cancelar
                    </Button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto p-8 pb-32 space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {/* General Info */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-[2px] bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                            <h2 className="text-[11px] font-bold text-foreground tracking-[0.2em] uppercase">Información General</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Nombre</Label>
                                <Input
                                    {...form.register("name")}
                                    onChange={handleNameChange}
                                    placeholder="NOMBRE DE LA COLECCIÓN"
                                    className="h-12 rounded-none border-border/50 bg-secondary/5 text-sm uppercase tracking-wider focus-visible:ring-brand shadow-sm"
                                />
                                {form.formState.errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{form.formState.errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Slug (URL)</Label>
                                <div className="flex rounded-none border border-border/50 overflow-hidden bg-secondary/5 focus-within:ring-1 focus-within:ring-brand transition-all shadow-sm">
                                    <div className="bg-secondary/20 px-3 py-3 text-[9px] font-bold text-muted-foreground uppercase border-r border-border/50 flex items-center tracking-widest">
                                        /collections/
                                    </div>
                                    <input
                                        {...form.register("slug")}
                                        className="flex-1 px-3 py-3 text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground/30 uppercase tracking-wider"
                                        placeholder="URL-IDENTIFICADOR"
                                    />
                                </div>
                                {slugError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{slugError}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Descripción</Label>
                                <Textarea
                                    {...form.register("description")}
                                    placeholder="ESCRIBE LA INSPIRACIÓN DE ESTA COLECCIÓN..."
                                    className="min-h-[120px] rounded-none border-border/50 bg-secondary/5 text-sm uppercase tracking-wider focus-visible:ring-brand shadow-sm resize-none p-4"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Image Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-[2px] bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                                <h2 className="text-[11px] font-bold text-foreground tracking-[0.2em] uppercase">Imagen de Portada</h2>
                            </div>
                            <span className="text-[8px] font-bold bg-brand/10 text-brand px-2 py-0.5 uppercase tracking-widest border border-brand/20">Requerido</span>
                        </div>

                        <div className="group relative">
                            <div className={cn(
                                "w-full aspect-[21/9] bg-secondary/5 border border-dashed border-border/50 rounded-none flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500",
                                imagePreview ? "border-solid border-border/50" : "hover:bg-secondary/10 hover:border-brand/30"
                            )}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleImageSelect}
                                />

                                {imagePreview ? (
                                    <>
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1200px) 100vw, 800px" />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-sm">
                                            <div className="border border-white/30 px-6 py-2 flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                                                <Upload className="w-4 h-4" /> Cambiar Imagen
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-8 space-y-4">
                                        <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center mx-auto text-muted-foreground transition-all group-hover:scale-110 group-hover:text-brand">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Subir Imagen</p>
                                            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">1200 x 600px RECOMENDADO</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Products Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-[2px] bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                                <h2 className="text-[11px] font-bold text-foreground tracking-[0.2em] uppercase">Curaduría de Productos</h2>
                            </div>
                            <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="h-8 border-border/50 hover:bg-brand hover:text-white hover:border-brand transition-all rounded-none uppercase text-[8px] font-bold tracking-widest">
                                        Añadir Productos
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[90vh] rounded-none p-0 flex flex-col bg-background border-t-brand">
                                    <SheetHeader className="px-8 pt-8 pb-6 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
                                        <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground p-0 hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Cancelar</Button>
                                        <div className="text-center">
                                            <SheetTitle className="text-sm font-bold uppercase tracking-[0.3em]">Selección de Catálogo</SheetTitle>
                                            <SheetDescription className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1 text-center">Gestión de inventario para colección</SheetDescription>
                                        </div>
                                        <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-widest text-brand p-0 hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Confirmar</Button>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto w-full relative">
                                        <ProductPicker
                                            selectedIds={form.watch("product_ids")}
                                            onSelectionChange={(ids) => form.setValue("product_ids", ids)}
                                            onConfirm={() => setIsProductSheetOpen(false)}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {selectedCount > 0 ? (
                            <div className="bg-secondary/5 border border-border/50 rounded-none p-8 flex items-center justify-between group hover:border-brand/30 transition-all duration-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                        <PackageOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground uppercase tracking-wider">{selectedCount} Productos Seleccionados</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Sincronizados con esta colección</p>
                                    </div>
                                </div>
                                <Button variant="link" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand p-0 h-auto" onClick={() => setIsProductSheetOpen(true)}>
                                    Modificar Selección
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-secondary/5 border border-dashed border-border/50 rounded-none p-12 flex flex-col items-center justify-center text-center space-y-4 hover:bg-secondary/10 hover:border-brand/20 transition-all duration-500">
                                <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-muted-foreground">
                                    <PackageOpen className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Catálogo Vacío</p>
                                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">No hay productos vinculados. Una colección requiere al menos un artículo para ser relevante.</p>
                                </div>
                            </div>
                        )}
                    </section>
                </motion.div>

                {/* Sticky Actions Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border/50 z-40">
                    <div className="max-w-2xl mx-auto flex gap-4">
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            variant="outline"
                            onClick={form.handleSubmit(d => onSubmit(d, 'draft'))}
                            className="flex-1 h-14 rounded-none border-border group hover:bg-secondary transition-all flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <Save className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">Guardar Borrador</span>
                        </Button>
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={form.handleSubmit(d => onSubmit(d, 'active'))}
                            className="flex-[2] h-14 rounded-none bg-foreground text-background dark:bg-white dark:text-black hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all font-bold shadow-xl overflow-hidden relative group"
                        >
                            {/* Inner Glow Effect */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 text-[10px] uppercase tracking-[0.4em]">Publicar Colección</span>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

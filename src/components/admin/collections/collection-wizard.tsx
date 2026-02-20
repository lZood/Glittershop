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

    // Slugify helper
    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    // Auto-generate slug
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
        const msgStart = "Iniciando...";
        setLoadingLog(msgStart);

        try {
            // 1. Check Slug
            const msgSlug = "Verificando disponibilidad...";
            setLoadingLog(msgSlug);

            const isAvailable = await checkSlugAvailability(data.slug);
            if (!isAvailable) {
                setSlugError("Este slug ya está en uso");
                setIsSubmitting(false);
                return;
            }
            setSlugError("");

            // 2. Upload Image
            let imageUrl = "";
            if (imageFile) {
                const msgUpload = "Subiendo imagen de portada...";
                setLoadingLog(msgUpload);
                console.log(msgUpload);
                console.log("Image File Details:", {
                    name: imageFile.name,
                    size: imageFile.size,
                    type: imageFile.type
                });

                const supabase = createClient();
                const fileExt = imageFile.name.split('.').pop() || 'png';
                const fileName = `collections/${data.slug}-${Date.now()}.${fileExt}`;
                console.log("Attempting upload to:", fileName);

                // Race condition for timeout
                const uploadPromise = supabase.storage.from('collection_images').upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: imageFile.type
                });

                const timeoutPromise = new Promise<{ error: any, data: any }>((resolve) => {
                    setTimeout(() => resolve({ error: { message: "La subida de imagen excedió el tiempo de espera (60s). Revisa tu conexión." }, data: null }), 60000);
                });

                const { error: uploadError, data: uploadData } = await Promise.race([uploadPromise, timeoutPromise]) as any;

                if (uploadError) {
                    console.error("Upload Error details:", uploadError);
                    throw uploadError;
                }

                console.log("Upload Success:", uploadData);

                const { data: { publicUrl } } = supabase.storage.from('collection_images').getPublicUrl(fileName);
                imageUrl = publicUrl;
                console.log("Image uploaded:", imageUrl);
            }

            // 3. Create Collection
            const msgCreate = status === 'active' ? "Publicando colección..." : "Guardando borrador...";
            setLoadingLog(msgCreate);
            console.log(msgCreate);

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            formData.append("description", data.description || "");
            formData.append("image_url", imageUrl);
            formData.append("is_active", String(status === 'active'));
            formData.append("product_ids", data.product_ids.join(","));

            const res = await createCollection({} as any, formData);

            if (res.message) {
                throw new Error(res.message);
            }

            if (res.errors) {
                console.error(res.errors);
                throw new Error("Error de validación en el servidor");
            }

            // Success
            const msgSuccess = "¡Listo!";
            setLoadingLog(msgSuccess);
            console.log(msgSuccess);
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
        <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans">
            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[60] flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <Loader2 className="w-12 h-12 text-[#b47331] animate-spin mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 animate-pulse">{loadingLog}</h3>
                    <p className="text-sm text-slate-400 mt-2">Por favor no cierres esta ventana</p>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </Button>
                <h1 className="text-lg font-bold text-slate-900">Nueva Colección</h1>
                <Button variant="ghost" onClick={() => router.back()} className="text-[#b47331] font-medium hover:text-[#a1662a] hover:bg-transparent -mr-2">
                    Cancelar
                </Button>
            </header>

            <main className="flex-1 w-full max-w-lg mx-auto p-4 pb-32 space-y-8">

                {/* General Info */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-slate-900">Información General</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-600 text-xs uppercase tracking-wider font-bold">Nombre de la Colección</Label>
                            <Input
                                {...form.register("name")}
                                onChange={handleNameChange}
                                placeholder="e.g., Verano Dorado"
                                className="h-12 rounded-2xl border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[#b47331]"
                            />
                            {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-600 text-xs uppercase tracking-wider font-bold">Slug (URL)</Label>
                            <div className="flex rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#b47331] focus-within:ring-offset-2">
                                <div className="bg-slate-50 px-3 py-3 text-slate-400 text-sm border-r border-slate-100 flex items-center">
                                    /collections/
                                </div>
                                <input
                                    {...form.register("slug")}
                                    className="flex-1 px-3 py-3 text-sm text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                                    placeholder="verano-dorado"
                                />
                            </div>
                            {slugError && <p className="text-xs text-red-500">{slugError}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-600 text-xs uppercase tracking-wider font-bold">Descripción</Label>
                            <Textarea
                                {...form.register("description")}
                                placeholder="Describe la inspiración de esta colección..."
                                className="min-h-[120px] rounded-2xl border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[#b47331] resize-none p-4"
                            />
                        </div>
                    </div>
                </section>

                {/* Image Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">Imagen de Portada</h2>
                        <span className="text-[10px] font-bold bg-[#b47331]/10 text-[#b47331] px-2 py-0.5 rounded-full">Requerido</span>
                    </div>

                    <div className="relative group">
                        <div className={cn(
                            "w-full aspect-[2/1] bg-white border-2 border-dashed rounded-3xl flex flex-col items-center justify-center relative overflow-hidden transition-all",
                            imagePreview ? "border-solid border-slate-200" : "border-[#b47331]/30 hover:bg-[#b47331]/5"
                        )}>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={handleImageSelect}
                            />

                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white text-sm font-bold">
                                            <Upload className="w-4 h-4" /> Cambiar Imagen
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6 space-y-2">
                                    <div className="w-12 h-12 bg-[#b47331]/10 rounded-full flex items-center justify-center mx-auto text-[#b47331]">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Subir Imagen</p>
                                    <p className="text-xs text-slate-400">Recomendado: 1200x600px</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">Productos</h2>
                        <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="secondary" className="rounded-full bg-[#b47331]/10 text-[#b47331] hover:bg-[#b47331]/20 w-8 h-8">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[90vh] rounded-t-[2rem] p-0 flex flex-col">
                                <SheetHeader className="px-6 pt-6 pb-4 border-b flex flex-row items-center justify-between space-y-0">
                                    <Button variant="ghost" className="text-slate-400 p-0 hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Cancelar</Button>
                                    <SheetTitle className="text-base font-bold">Seleccionar Productos</SheetTitle>
                                    <SheetDescription className="sr-only">Selecciona productos para tu colección</SheetDescription>
                                    <Button variant="ghost" className="text-[#b47331] font-bold p-0 hover:bg-transparent" onClick={() => setIsProductSheetOpen(false)}>Listo</Button>
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
                        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <PackageOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{selectedCount} Productos Seleccionados</p>
                                    <p className="text-xs text-slate-400">Listos para agrupar</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600" onClick={() => setIsProductSheetOpen(true)}>
                                Editar Selección
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                <PackageOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-600">No hay productos seleccionados</p>
                                <p className="text-xs text-slate-400 max-w-[200px] mx-auto">Selecciona los productos que formarán parte de esta colección.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl mt-2 border-slate-200" onClick={() => setIsProductSheetOpen(true)}>
                                Seleccionar Productos
                            </Button>
                        </div>
                    )}
                </section>

                {/* Actions */}
                <div className="pt-4 pb-8 flex flex-col sm:flex-row gap-3">
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(d => onSubmit(d, 'active'), (errors) => console.error("Validation errors active:", errors))}
                        className="w-full h-14 rounded-2xl bg-[#b47331] hover:bg-[#a1662a] text-white font-bold shadow-lg shadow-[#b47331]/20 text-sm uppercase tracking-wide order-1 sm:order-2"
                    >
                        Publicar Colección
                    </Button>
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        variant="outline"
                        onClick={form.handleSubmit(d => onSubmit(d, 'draft'), (errors) => console.error("Validation errors draft:", errors))}
                        className="w-full h-14 rounded-2xl border-[#b47331] text-[#b47331] font-bold hover:bg-[#b47331]/5 text-sm uppercase tracking-wide order-2 sm:order-1"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Borrador
                    </Button>
                </div>
            </main>
        </div>
    );
}

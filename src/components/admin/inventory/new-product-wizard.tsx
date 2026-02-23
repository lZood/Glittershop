'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createCategory, type Category } from '@/lib/actions/categories';
import { X, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Step1Info } from "./steps/step-1-info";
import { Step2Stock } from "./steps/step-2-stock";
import { Step3Media } from "./steps/step-3-media";
import { Step4Preview } from "./steps/step-4-preview";
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { createProduct, updateProduct, uploadProductImage } from '@/lib/actions/products';
import { Point, Area } from 'react-easy-crop';
import { Form } from '@/components/ui/form';

// --- Constants & Schema from ProductForm ---

const COLOR_MAP: Record<string, string> = {
    "Oro": "#FFD700",
    "Oro Blanco": "#E1E1E1",
    "Oro Rosa": "#B76E79",
    "Plata": "#C0C0C0",
    "Negro": "#000000",
    "Rojo": "#FF0000",
    "Azul": "#0000FF",
    "Verde": "#008000",
    "Amarillo": "#FFFF00",
    "Blanco": "#FFFFFF",
};

const NUMERIC_COLOR_MAP: Record<string, string> = {
    "Oro": "01",
    "Plata": "02",
    "Oro Rosa": "03",
    "Oro Blanco": "04",
    "Negro": "05",
    "Rojo": "06",
    "Azul": "07",
    "Verde": "08",
    "Amarillo": "09",
    "Blanco": "10",
};

const productSchema = z.object({
    title: z.string().min(2, "El tÃ­tulo debe tener al menos 2 caracteres"),
    slug: z.string().min(2, "El slug es requerido").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invÃ¡lido (solo minÃºsculas y guiones)"),
    description: z.string().optional(),
    base_price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    sale_price: z.coerce.number().min(0).optional(),
    cost_price: z.coerce.number().min(0).optional(),
    is_active: z.boolean().default(false),
    category: z.string().min(1, "Selecciona una categorÃ­a"),
    has_variants: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    size_guide_type: z.enum(['none', 'ring', 'bracelet', 'necklace']).default('none'),
    care_instructions: z.string().optional(),
    video: z.string().optional(),
    variants: z.array(z.object({
        sku: z.string().min(1, "SKU requerido"),
        material: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        stock: z.coerce.number().min(0),
        price_adjustment: z.coerce.number().default(0),
    })).min(1, "Debes tener al menos una variante"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// Helper for image cropping
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => { console.log('Image loaded:', url); resolve(image); });
        image.addEventListener('error', (error) => { console.error('Image load error:', error); reject(error); });
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    console.log('getCroppedImg start:', imageSrc);
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) { reject(new Error('Canvas is empty')); return; }
            console.log('getCroppedImg complete, blob size:', blob.size);
            resolve(blob);
        }, 'image/jpeg', 0.95);
    });
}

interface NewProductWizardProps {
    initialData?: any;
    availableCategories?: Category[];
}

export function NewProductWizard({ initialData, availableCategories = [] }: NewProductWizardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // State for Categories
    const [categories, setCategories] = useState<Category[]>(availableCategories);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    // Helper to extract unique colors and sizes from variants
    const initialColors = useMemo(() => {
        if (!initialData?.product_variants) return [
            { name: 'Oro', hex: '#FFD700' },
            { name: 'Plata', hex: '#C0C0C0' }
        ];

        const uniqueColors = new Map();
        initialData.product_variants.forEach((v: any) => {
            if (v.color && !uniqueColors.has(v.color)) {
                uniqueColors.set(v.color, {
                    name: v.color,
                    hex: (v.color_metadata as any)?.hex || COLOR_MAP[v.color] || '#CCCCCC'
                });
            }
        });

        // If no colors found in variants, return defaults
        return uniqueColors.size > 0 ? Array.from(uniqueColors.values()) : [
            { name: 'Oro', hex: '#FFD700' },
            { name: 'Plata', hex: '#C0C0C0' }
        ];
    }, [initialData]);

    const initialSizes = useMemo(() => {
        if (!initialData?.product_variants) return ['6', '7', '8'];
        const uniqueSizes = new Set<string>();
        initialData.product_variants.forEach((v: any) => {
            if (v.size) uniqueSizes.add(v.size);
        });
        return uniqueSizes.size > 0 ? Array.from(uniqueSizes) : ['6', '7', '8'];
    }, [initialData]);

    // State for Variants Generation
    const [colors, setColors] = useState<{ name: string; hex: string }[]>(initialColors);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');
    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);

    // State for Images
    const [images, setImages] = useState<Record<string, File[]>>({ 'default': [] });
    // Initialize previews from existing images
    const initialPreviews = useMemo(() => {
        if (!initialData?.product_images) return {};
        const groups: Record<string, any[]> = {};

        initialData.product_images.forEach((img: any) => {
            const colorKey = img.color || 'default';
            if (!groups[colorKey]) groups[colorKey] = [];

            groups[colorKey].push({
                url: img.image_url,
                isExisting: true,
                storagePath: img.image_path || "",
                isPrimary: img.is_primary
            });
        });
        return groups;
    }, [initialData]);

    const [previewUrls, setPreviewUrls] = useState<Record<string, {
        url: string;
        isExisting?: boolean;
        storagePath?: string;
        crop?: Point;
        zoom?: number;
        pixelCrop?: Area;
        isPrimary?: boolean;
    }[]>>(initialPreviews);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video || null);
    const [loadingLog, setLoadingLog] = useState<string>("");

    // Framer State for Step 3
    const [framerConfig, setFramerConfig] = useState<{ isOpen: boolean; colorKey: string; index: number } | null>(null);

    // Form Initialization
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        mode: "onChange",
        defaultValues: initialData ? {
            title: initialData.name,
            slug: initialData.slug,
            description: initialData.description || "",
            base_price: initialData.original_price || initialData.price || 0,
            sale_price: initialData.original_price ? initialData.price : undefined,
            cost_price: initialData.cost_price || undefined,
            is_active: initialData.is_active,
            category: initialData.categories?.name || "",
            has_variants: true,
            tags: initialData.tags || [],
            size_guide_type: initialData.size_guide_type as any || 'none',
            care_instructions: initialData.care_instructions || "",
            video: initialData.video || "",
            variants: initialData.product_variants?.map((v: any) => ({
                sku: v.sku,
                material: "Oro 10k",
                color: v.color || "Oro",
                size: v.size || "Adjustable",
                stock: v.stock,
                price_adjustment: v.price_adjustment || 0
            })) || []
        } : {
            title: "",
            slug: "",
            description: "",
            base_price: 0,
            sale_price: undefined,
            cost_price: undefined,
            is_active: false,
            category: "",
            has_variants: true,
            tags: [],
            size_guide_type: 'none',
            care_instructions: "",
            video: "",
            variants: [{
                sku: "",
                material: "Oro 10k",
                color: "Oro",
                size: "Adjustable",
                stock: 0,
                price_adjustment: 0
            }]
        }
    });

    const { fields, replace, remove } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // --- Logic Methods ---

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                const res = await createCategory(newCategory.trim());
                if (res.success && res.data) {
                    setCategories([...categories, res.data]);
                    form.setValue('category', res.data.name);
                    setNewCategory('');
                    setIsAddingCategory(false);
                    toast({ title: "CategorÃ­a creada", description: `Se ha creado "${res.data.name}"` });
                } else {
                    toast({ variant: "destructive", title: "Error", description: res.error || "Error al crear categorÃ­a" });
                }
            } catch (err) {
                toast({ variant: "destructive", title: "Error", description: "Error al comunicar con el servidor" });
            }
        }
    };

    const generateVariants = () => {
        if (colors.length === 0) {
            toast({ title: "Faltan colores", description: "Agrega al menos un color", variant: "destructive" });
            return;
        }
        if (selectedSizes.length === 0) {
            toast({ title: "Faltan tallas", description: "Selecciona al menos una talla", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        const currentSlug = form.getValues('slug');
        const currentCategoryName = form.getValues('category');

        if (!currentSlug) {
            toast({ title: "Falta el Slug", description: "Define primero la URL en Info", variant: "destructive" });
            setIsGenerating(false);
            return;
        }

        const matchedCat = categories.find(c => c.name === currentCategoryName);
        const catPrefix = matchedCat ? matchedCat.id.toString().padStart(2, '0') : '90';
        const modelId = Math.floor(1000 + Math.random() * 9000).toString();
        const newVariants: any[] = [];

        colors.forEach(color => {
            selectedSizes.forEach(size => {
                const colorCode = NUMERIC_COLOR_MAP[color.name] || '99';
                const generatedSku = `${catPrefix}-${modelId}-${colorCode}-${size}`;
                newVariants.push({
                    sku: generatedSku,
                    color: color.name,
                    size: size,
                    stock: 5,
                    price_adjustment: 0,
                });
            });
        });

        replace(newVariants);
        setIsGenerating(false);
        toast({ title: "Inventario Generado", description: `Se crearon ${newVariants.length} combinaciones.` });
    };

    // Img Handlers
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, colorKey: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => ({ ...prev, [colorKey]: [...(prev[colorKey] || []), ...newFiles] }));
            const newPreviews = newFiles.map(file => ({
                url: URL.createObjectURL(file),
            }));
            setPreviewUrls(prev => ({ ...prev, [colorKey]: [...(prev[colorKey] || []), ...newPreviews] }));
        }
    };

    const removeImage = (colorKey: string, index: number) => {
        setImages(prev => ({ ...prev, [colorKey]: prev[colorKey].filter((_, i) => i !== index) }));
        setPreviewUrls(prev => ({ ...prev, [colorKey]: prev[colorKey].filter((_, i) => i !== index) }));
    };

    const handleFramerSave = async (crop: Point, zoom: number, pixelCrop: Area) => {
        if (!framerConfig) return;

        // Generate the cropped image immediately
        const colorKey = framerConfig.colorKey;
        const index = framerConfig.index;
        const currentItem = previewUrls[colorKey]?.[index];

        if (!currentItem) return;

        try {
            const croppedBlob = await getCroppedImg(currentItem.url, pixelCrop);
            const newUrl = URL.createObjectURL(croppedBlob);

            setPreviewUrls(prev => {
                const newList = [...(prev[colorKey] || [])];
                if (newList[index]) {
                    // Update URL and remove crop data since it's now "baked in"
                    newList[index] = {
                        ...newList[index],
                        url: newUrl,
                        crop: undefined,
                        zoom: undefined,
                        pixelCrop: undefined
                    };
                }
                return { ...prev, [colorKey]: newList };
            });
            setFramerConfig(null);
        } catch (error) {
            console.error("Failed to crop image:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo recortar la imagen" });
        }
    };

    // Video Handler
    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast({ title: "Archivo muy grande", description: "MÃ¡x 50MB", variant: "destructive" });
                return;
            }
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Submit Handler
    async function onSubmit(data: ProductFormValues, status: 'draft' | 'active' = 'active') {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setLoadingLog('Iniciando proceso...');
        console.log('ðŸš€ onSubmit: Iniciando proceso de guardado...');

        try {
            // Helper: compress image before upload
            async function compressImage(blob: Blob, maxWidth = 1200, quality = 0.85): Promise<Blob> {
                console.log('ðŸ—œï¸ Comprimiendo imagen...');
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('No canvas context')); return; }
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob(
                            (result) => {
                                if (!result) { reject(new Error('Compression failed')); return; }
                                console.log(`âœ… Comprimida: ${(blob.size / 1024).toFixed(0)}KB â†’ ${(result.size / 1024).toFixed(0)}KB`);
                                resolve(result);
                            },
                            'image/jpeg',
                            quality
                        );
                    };
                    img.onerror = () => reject(new Error('Failed to load image for compression'));
                    img.src = URL.createObjectURL(blob);
                });
            }

            // 1. Process Images
            setLoadingLog('Procesando imÃ¡genes...');
            const imageUrls: any[] = [];

            const allItemsToProcess: { colorKey: string, item: any, index: number }[] = [];
            Object.entries(previewUrls).forEach(([colorKey, items]) => {
                items.forEach((item, index) => allItemsToProcess.push({ colorKey, item, index }));
            });

            // Upload Loop via Server Action
            let processedCount = 0;
            for (const { colorKey, item } of allItemsToProcess) {
                processedCount++;
                setLoadingLog(`Subiendo imagen ${processedCount} de ${allItemsToProcess.length}...`);
                console.log(`ðŸ“¸ Procesando imagen ${processedCount}...`);

                if (item.isExisting && !item.pixelCrop) {
                    imageUrls.push({
                        url: item.url,
                        color: colorKey === 'default' ? undefined : colorKey,
                        isPrimary: item.isPrimary || false,
                        storagePath: item.storagePath || ""
                    });
                    continue;
                }

                let blobToUpload: Blob;
                if (item.pixelCrop) {
                    blobToUpload = await getCroppedImg(item.url, item.pixelCrop);
                } else {
                    const res = await fetch(item.url);
                    blobToUpload = await res.blob();
                }

                // Compress if larger than 200KB to keep server payload small
                if (blobToUpload.size > 200 * 1024) {
                    blobToUpload = await compressImage(blobToUpload, 1200, 0.75);
                }

                const fileName = `${data.slug}/${colorKey}-${Date.now()}.jpg`;

                const formData = new FormData();
                formData.append('file', blobToUpload, fileName);
                formData.append('fileName', fileName);

                console.log(`ðŸ“¤ Enviando a servidor: ${fileName} (${(blobToUpload.size / 1024).toFixed(0)}KB)`);
                const uploadRes = await uploadProductImage(formData);

                if (!uploadRes.success) {
                    throw new Error(`Error al subir imagen: ${uploadRes.error}`);
                }

                imageUrls.push({
                    url: uploadRes.url || "",
                    color: colorKey === 'default' ? undefined : colorKey,
                    isPrimary: item.isPrimary || false,
                    storagePath: uploadRes.storagePath
                });
            }

            // Ensure at least one image is primary if any exist
            if (imageUrls.length > 0 && !imageUrls.some(img => img.isPrimary)) {
                imageUrls[0].isPrimary = true;
            }

            // 2. Video via Server Action (limit to 10MB for direct transport)
            let videoUrl = "";
            if (videoFile) {
                setLoadingLog('Subiendo video...');
                console.log('ðŸ“¹ Procesando video...');

                if (videoFile.size > 10 * 1024 * 1024) {
                    throw new Error("El video es demasiado grande para este mÃ©todo (mÃ¡x 10MB).");
                }

                const fileName = `${data.slug}/video-${Date.now()}.${videoFile.name.split('.').pop()}`;
                const formData = new FormData();
                formData.append('file', videoFile, fileName);
                formData.append('fileName', fileName);

                const uploadRes = await uploadProductImage(formData);

                if (!uploadRes.success) throw new Error(`Error al subir video: ${uploadRes.error}`);
                videoUrl = uploadRes.url || "";
            }

            // 3. Save to DB
            setLoadingLog('Guardando producto...');
            const variantsData = data.variants.map(v => ({
                ...v,
                color_metadata: v.color ? { hex: COLOR_MAP[v.color] || '#CCCCCC', name: v.color } : undefined
            }));

            const serverPayload = {
                ...data,
                video: videoUrl || initialData?.video,
                imageUrls,
                variants: variantsData,
                is_active: status === 'active'
            };

            let result;
            if (initialData?.id) {
                result = await updateProduct(initialData.id, serverPayload);
            } else {
                result = await createProduct(serverPayload);
            }

            if (!result.success) throw new Error(result.error);

            setLoadingLog('Â¡Ã‰xito!');
            toast({ title: "Ã‰xito", description: status === 'active' ? "Producto publicado" : "Borrador guardado" });
            router.push('/admin/inventory');

        } catch (error: any) {
            console.error('âŒ Error fatal en onSubmit:', error);
            setLoadingLog('');
            toast({ variant: "destructive", title: "Error", description: error.message });
            setIsSubmitting(false);
        }
    }

    // Wizard Navigation
    const handleNext = async () => {
        const fieldsToValidate =
            currentStep === 1 ? ['title', 'slug', 'category', 'base_price'] :
                currentStep === 2 ? ['variants'] : [];

        // @ts-ignore
        const isValid = await form.trigger(fieldsToValidate as any);
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        } else {
            toast({ title: "Faltan datos", description: "Revisa los campos requeridos", variant: "destructive" });
        }
    };

    // Render Step
    const renderStep = () => {
        const commonProps = { form, NUMERIC_COLOR_MAP };

        switch (currentStep) {
            case 1:
                return (
                    <Step1Info
                        form={form}
                        categories={categories}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        isAddingCategory={isAddingCategory}
                        setIsAddingCategory={setIsAddingCategory}
                        handleAddCategory={handleAddCategory}
                    />
                );
            case 2:
                return (
                    <Step2Stock
                        form={form}
                        colors={colors}
                        setColors={setColors}
                        newColorName={newColorName}
                        setNewColorName={setNewColorName}
                        newColorHex={newColorHex}
                        setNewColorHex={setNewColorHex}
                        selectedSizes={selectedSizes}
                        setSelectedSizes={setSelectedSizes}
                        generateVariants={generateVariants}
                        isGenerating={isGenerating}
                        fields={fields}
                        remove={remove}
                        NUMERIC_COLOR_MAP={NUMERIC_COLOR_MAP}
                    />
                );
            case 3:
                return (
                    <Step3Media
                        form={form}
                        colors={colors}
                        images={images}
                        handleImageSelect={handleImageSelect}
                        removeImage={removeImage}
                        previewUrls={previewUrls}
                        videoPreview={videoPreview}
                        handleVideoSelect={handleVideoSelect}
                        framerConfig={framerConfig}
                        setFramerConfig={setFramerConfig}
                        handleFramerSave={handleFramerSave}
                        NUMERIC_COLOR_MAP={NUMERIC_COLOR_MAP}
                    />
                );
            case 4:
                return (
                    <Step4Preview
                        form={form}
                        previewUrls={previewUrls}
                        videoPreview={videoPreview}
                        colors={colors}
                        onSubmit={(status) => form.handleSubmit((data) => onSubmit(data, status))()}
                        isSubmitting={isSubmitting}
                        onBack={() => setCurrentStep(3)}
                    />
                );
            default: return null;
        }
    };

    return (
        <Form {...form}>
            <div className="flex flex-col h-screen bg-background relative">
                {isSubmitting && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
                        <h3 className="text-lg font-bold text-foreground animate-pulse">{loadingLog}</h3>
                    </div>
                )}

                <header className="bg-card px-4 py-3 flex items-center justify-between border-b border-border/50 sticky top-0 z-20">
                    <Link href="/admin/inventory">
                        <Button variant="ghost" size="icon" className="hover:bg-secondary rounded-full">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </Link>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
                        </span>
                        <h1 className="text-sm font-bold text-foreground">{form.watch('title') || 'Sin Título'}</h1>
                    </div>
                    <div className="w-10" />
                </header>

                <div className="bg-card pb-4 pt-2 px-6 flex justify-between items-center relative z-10 border-b border-border/50 shadow-sm">
                    <div className="flex flex-col items-center gap-1 z-10 cursor-pointer" onClick={() => setCurrentStep(1)}>
                        <div
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                                currentStep >= 1 ? 'bg-brand text-brand-foreground shadow-lg shadow-brand/30' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                        </div>
                        <span className={cn('text-[10px] font-bold uppercase tracking-wider', currentStep >= 1 ? 'text-brand' : 'text-muted-foreground')}>
                            Info
                        </span>
                    </div>
                    <div className="flex-1 h-[2px] bg-muted mx-2 relative">
                        <div className={cn('absolute left-0 top-0 h-full bg-brand transition-all duration-500', currentStep >= 2 ? 'w-full' : 'w-0')} />
                    </div>

                    <div className="flex flex-col items-center gap-1 z-10 cursor-pointer" onClick={() => setCurrentStep(2)}>
                        <div
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                                currentStep >= 2 ? 'bg-brand text-brand-foreground shadow-lg shadow-brand/30' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                        </div>
                        <span className={cn('text-[10px] font-bold uppercase tracking-wider', currentStep >= 2 ? 'text-brand' : 'text-muted-foreground')}>
                            Stock
                        </span>
                    </div>
                    <div className="flex-1 h-[2px] bg-muted mx-2 relative">
                        <div className={cn('absolute left-0 top-0 h-full bg-brand transition-all duration-500', currentStep >= 3 ? 'w-full' : 'w-0')} />
                    </div>

                    <div className="flex flex-col items-center gap-1 z-10 cursor-pointer" onClick={() => setCurrentStep(3)}>
                        <div
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                                currentStep >= 3 ? 'bg-brand text-brand-foreground shadow-lg shadow-brand/30' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
                        </div>
                        <span className={cn('text-[10px] font-bold uppercase tracking-wider', currentStep >= 3 ? 'text-brand' : 'text-muted-foreground')}>
                            Fotos
                        </span>
                    </div>
                    <div className="flex-1 h-[2px] bg-muted mx-2 relative">
                        <div className={cn('absolute left-0 top-0 h-full bg-brand transition-all duration-500', currentStep >= 4 ? 'w-full' : 'w-0')} />
                    </div>

                    <div className="flex flex-col items-center gap-1 z-10 cursor-pointer" onClick={() => setCurrentStep(4)}>
                        <div
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                                currentStep >= 4 ? 'bg-brand text-brand-foreground shadow-lg shadow-brand/30' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            4
                        </div>
                        <span className={cn('text-[10px] font-bold uppercase tracking-wider', currentStep >= 4 ? 'text-brand' : 'text-muted-foreground')}>
                            Fin
                        </span>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto bg-background p-4 pb-32 md:p-6 md:pb-32">
                    <div className="max-w-3xl mx-auto">{renderStep()}</div>
                </main>

                {currentStep < 4 && (
                    <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 p-4 z-20">
                        <div className="max-w-3xl mx-auto flex gap-4">
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep((p) => p - 1)}
                                    className="flex-1 h-12 rounded-xl border-border text-muted-foreground font-bold hover:bg-secondary active:bg-secondary/80 active:scale-[0.98] transition-all"
                                >
                                    Atrás
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                className={cn(
                                    'flex-1 h-12 rounded-xl bg-brand hover:bg-brand/90 active:bg-brand/80 text-brand-foreground font-bold shadow-lg shadow-brand/25 transition-all active:scale-95',
                                    currentStep === 1 && 'w-full'
                                )}
                            >
                                Siguiente Paso <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </footer>
                )}
            </div>
        </Form>
    );
}

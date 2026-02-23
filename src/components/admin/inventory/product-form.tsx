'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createCategory, type Category } from '@/lib/actions/categories';
import { Loader2, Plus, Trash2, UploadCloud, X, ArrowLeft, ArrowRight, Palette, User, Shield, Package, Calculator, Sparkles, Ruler, MinusCircle, MessageSquare } from 'lucide-react';
import { AdminReviewsList } from "./admin-reviews-list";

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


import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Point, Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { ProductPreview } from './product-preview';
import { ImageFramer } from './image-framer';
import { createClient } from '@/lib/supabase/client';
import { createProduct, updateProduct } from '@/lib/actions/products';

// --- Schema Definition ---
const productSchema = z.object({
    title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
    slug: z.string().min(2, "El slug es requerido").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (solo minúsculas y guiones)"),
    description: z.string().optional(),
    base_price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    sale_price: z.coerce.number().min(0).optional(),
    cost_price: z.coerce.number().min(0).optional(),
    is_active: z.boolean().default(false),
    category: z.string().min(1, "Selecciona una categoría"),
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

type ProductFormValues = z.infer<typeof productSchema>;

// --- Constants ---
const SIZES = ['5', '6', '7', '8', '9', '10', 'Ajustable'];
// const INITIAL_CATEGORIES = ['Anillos', 'Collares', 'Pulseras', 'Aretes']; // Removed in favor of DB
const MARKETING_TAGS = [
    { id: 'new', label: 'Nuevo' },
    { id: 'bestseller', label: 'Más Vendido' },
    { id: 'limited', label: 'Edición Limitada' },
    { id: 'sale', label: 'Oferta' },
    { id: 'exclusive', label: 'Exclusivo' },
];


interface ProductFormProps {
    initialData?: any;
    availableCategories: Category[];
}

// --- Helper: Crop Image ---
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg', 0.95);
    });
}

export function ProductForm({ initialData, availableCategories = [] }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Progress Dialog State
    const [progressOpen, setProgressOpen] = useState(false);
    const [progressLogs, setProgressLogs] = useState<{ step: string, status: 'pending' | 'loading' | 'success' | 'error', message?: string }[]>([]);

    // Helper to add/update logs
    const addLog = (step: string, status: 'pending' | 'loading' | 'success' | 'error', message?: string) => {
        setProgressLogs(prev => [...prev, { step, status, message }]);
    };

    const updateLastLog = (status: 'pending' | 'loading' | 'success' | 'error', message?: string) => {
        setProgressLogs(prev => {
            const newLogs = [...prev];
            if (newLogs.length > 0) {
                newLogs[newLogs.length - 1] = { ...newLogs[newLogs.length - 1], status, message };
            }
            return newLogs;
        });
    };

    // Advanced State
    const [colors, setColors] = useState<{ name: string; hex: string }[]>([
        { name: 'Oro', hex: '#FFD700' },
        { name: 'Plata', hex: '#C0C0C0' }
    ]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');

    // Images grouped by color key (or 'default')
    // For editing, we need to handle existing URLs differently than new Files
    // Maybe we just initialize previewUrls with existing data?
    const [images, setImages] = useState<Record<string, File[]>>({ 'default': [] });
    // Stores: url, and react-easy-crop state (crop/zoom) + output (pixelCrop)
    const [previewUrls, setPreviewUrls] = useState<Record<string, {
        url: string;
        isExisting?: boolean; // Flag for existing images
        storagePath?: string; // Needed for existing images to preserve valid object structure
        crop?: Point;
        zoom?: number;
        pixelCrop?: Area // CHANGED: Renamed from croppedArea to pixelCrop for clarity
    }[]>>({});

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video || null);

    const [activeImageTab, setActiveImageTab] = useState('default');

    // Image Framer State
    const [framerConfig, setFramerConfig] = useState<{ isOpen: boolean; colorKey: string; index: number } | null>(null);

    // Categories now objects
    const [categories, setCategories] = useState<Category[]>(availableCategories);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        initialData && initialData.product_variants
            ? Array.from(new Set(initialData.product_variants.map((v: any) => v.size))).filter(Boolean) as string[]
            : ['6', '7', '8']
    ); // Default selected sizes

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            title: initialData.name,
            slug: initialData.slug,
            description: initialData.description || "",
            base_price: initialData.base_price,
            sale_price: initialData.sale_price || undefined,
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
                material: "Oro 10k", // Default or extract if stored
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

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // Initialize state from initialData
    useEffect(() => {
        if (initialData) {
            // Populate Images
            const newPreviewUrls: Record<string, any[]> = { 'default': [] };

            initialData.product_images?.forEach((img: any) => {
                const key = img.color || 'default';
                if (!newPreviewUrls[key]) newPreviewUrls[key] = [];
                newPreviewUrls[key].push({
                    url: img.image_url,
                    isExisting: true,
                    storagePath: img.storage_path,
                    isPrimary: img.is_primary
                });
            });

            // Sort by primary locally if needed, but DB order usually suffices or is_primary flag
            setPreviewUrls(newPreviewUrls);

            // Populate Colors from Variants
            const distinctColors = new Set<string>();
            initialData.product_variants?.forEach((v: any) => {
                if (v.color) distinctColors.add(v.color);
            });
            // If we have custom colors, we might need to update the `colors` state to include them
            // For now assuming standard or existing logic covers it
        }
    }, [initialData]);
    // Watch values for preview
    const watchedTitle = form.watch('title');
    const watchedPrice = form.watch('base_price');
    const hasVariants = form.watch('has_variants');
    const watchedVariants = form.watch('variants');

    // Filter colors based on generated SKUs
    const visibleColors = useMemo(() => {
        if (!hasVariants) return [];
        const activeColorNames = new Set((watchedVariants || []).map((v: any) => v.color).filter(Boolean));
        return colors.filter(c => activeColorNames.has(c.name));
    }, [hasVariants, watchedVariants, colors]);

    // Auto-switch image tab based on mode and visible colors
    useEffect(() => {
        if (hasVariants && visibleColors.length > 0) {
            if (activeImageTab === 'default' || !visibleColors.find(c => c.name === activeImageTab)) {
                setActiveImageTab(visibleColors[0].name);
            }
        } else {
            setActiveImageTab('default');
        }
    }, [hasVariants, visibleColors, activeImageTab]);
    const watchedSalePrice = form.watch('sale_price');
    const watchedCategory = form.watch('category');
    const watchedDescription = form.watch('description');
    const watchedCostPrice = form.watch('cost_price') || 0;
    const watchedTags = form.watch('tags');

    // Calculate Margin
    const effectivePrice = watchedSalePrice && watchedSalePrice > 0 ? watchedSalePrice : watchedPrice;
    const margin = effectivePrice > 0 ? ((effectivePrice - watchedCostPrice) / effectivePrice * 100).toFixed(1) : '0';
    const isMarginPositive = parseFloat(margin) > 0;

    // Ensure at least one variant exists for single mode
    useEffect(() => {
        if (!hasVariants && fields.length === 0) {
            append({ sku: '', stock: 0, price_adjustment: 0 });
        }
    }, [hasVariants, fields.length, append]);

    // Auto-select Size Guide based on Category
    useEffect(() => {
        if (!watchedCategory) return;

        const lowerCat = watchedCategory.toLowerCase();
        let newGuideType = 'none';

        if (lowerCat.includes('anillo') || lowerCat.includes('ring')) {
            newGuideType = 'ring';
        } else if (lowerCat.includes('ollar') || lowerCat.includes('adena') || lowerCat.includes('ecklace')) {
            newGuideType = 'necklace';
        } else if (lowerCat.includes('pulsera') || lowerCat.includes('racelet') || lowerCat.includes('brazalete')) {
            newGuideType = 'bracelet';
        }

        // Update size guide type based on category
        form.setValue('size_guide_type', newGuideType as any);
    }, [watchedCategory, form]);

    // --- Color Management ---
    const addColor = () => {
        if (newColorName && newColorHex) {
            if (colors.some(c => c.name === newColorName)) {
                toast({ title: "Error", description: "Ese color ya existe", variant: "destructive" });
                return;
            }
            const newColor = { name: newColorName, hex: newColorHex };
            setColors([...colors, newColor]);
            setNewColorName('');

            // Initialize image array for new color
            setImages(prev => ({ ...prev, [newColorName]: [] }));
            setPreviewUrls(prev => ({ ...prev, [newColorName]: [] }));
        }
    };

    const removeColor = (name: string) => {
        setColors(colors.filter(c => c.name !== name));
        // Optional: Cleanup images for deleted color
    };

    // --- Image Upload Handlers ---
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, colorKey: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            setImages(prev => ({
                ...prev,
                [colorKey]: [...(prev[colorKey] || []), ...newFiles]
            }));

            const newPreviews = newFiles.map(file => ({
                url: URL.createObjectURL(file),
                // No default crop needed, renders as 'cover' by default
            }));
            setPreviewUrls(prev => ({
                ...prev,
                [colorKey]: [...(prev[colorKey] || []), ...newPreviews]
            }));
        }
    };

    const removeImage = (colorKey: string, index: number) => {
        setImages(prev => ({
            ...prev,
            [colorKey]: prev[colorKey].filter((_, i) => i !== index)
        }));
        setPreviewUrls(prev => ({
            ...prev,
            [colorKey]: prev[colorKey].filter((_, i) => i !== index)
        }));
    };

    const moveImage = (colorKey: string, index: number, direction: 'left' | 'right') => {
        const currentList = images[colorKey] || [];
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === currentList.length - 1) return;

        const newIndex = direction === 'left' ? index - 1 : index + 1;

        const newImages = [...currentList];
        const tempImage = newImages[index];
        newImages[index] = newImages[newIndex];
        newImages[newIndex] = tempImage;

        setImages(prev => ({ ...prev, [colorKey]: newImages }));

        const currentPreviews = previewUrls[colorKey] || [];
        const newPreviews = [...currentPreviews];
        const tempPreview = newPreviews[index];
        newPreviews[index] = newPreviews[newIndex];
        newPreviews[newIndex] = tempPreview;

        setPreviewUrls(prev => ({ ...prev, [colorKey]: newPreviews }));
    };




    const handleFramerSave = (crop: Point, zoom: number, pixelCrop: Area) => {
        if (!framerConfig) return;
        setPreviewUrls(prev => {
            const newList = [...(prev[framerConfig.colorKey] || [])];
            if (newList[framerConfig.index]) {
                newList[framerConfig.index] = {
                    ...newList[framerConfig.index],
                    crop,
                    zoom,
                    pixelCrop // Store pixels!
                };
            }
            return { ...prev, [framerConfig.colorKey]: newList };
        });
        setFramerConfig(null);
    };

    // --- Category Handler ---
    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                const res = await createCategory(newCategory.trim());
                if (res.success && res.data) {
                    setCategories([...categories, res.data]);
                    form.setValue('category', res.data.name);
                    setNewCategory('');
                    setIsAddingCategory(false);
                    toast({ title: "Categoría creada", description: `Se ha creado "${res.data.name}" con código ${res.data.id}` });
                } else {
                    toast({ variant: "destructive", title: "Error", description: res.error || "Error al crear categoría" });
                }
            } catch (err) {
                toast({ variant: "destructive", title: "Error", description: "Error al comunicar con el servidor" });
            }
        }
    };

    // --- Video Handler ---
    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                toast({ title: "Archivo muy grande", description: "El video debe pesar menos de 50MB", variant: "destructive" });
                return;
            }
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // --- Auto-Generate Variants ---
    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    // --- Auto-Generate Variants ---
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

        // Get slug from form, fallback to a safe default if empty, but prefer slug
        // Remove 'slug' from dependency array to avoid unnecessary re-renders if we were using it in useEffect,
        // but here we just read it on click.
        // We really want to enforce the slug is present for good SKUs.
        const currentSlug = form.getValues('slug');
        const currentCategoryName = form.getValues('category');

        if (!currentSlug) {
            toast({ title: "Falta el Slug", description: "Define primero la URL Amigable en la pestaña INFO", variant: "destructive" });
            setIsGenerating(false);
            return;
        }

        // 1. Get Numeric Category Prefix (from DB ID)
        const matchedCat = categories.find(c => c.name === currentCategoryName);
        // Format ID to 2 digits (e.g. 1 -> 01, 12 -> 12)
        const catPrefix = matchedCat ? matchedCat.id.toString().padStart(2, '0') : '90';

        // 2. Generate Random Model ID (4 digits)
        const modelId = Math.floor(1000 + Math.random() * 9000).toString();

        const newVariants: any[] = [];

        // Clear existing variants? Or append? usually replace for smart gen

        colors.forEach(color => {
            selectedSizes.forEach(size => {
                const colorCode = NUMERIC_COLOR_MAP[color.name] || '99';
                // SKU Logic: CAT(2digits)-MODEL(4digits)-COL-SIZ (e.g. 01-5932-01-7)
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
        toast({
            title: "Inventario Generado",
            description: `Se crearon ${newVariants.length} combinaciones (Colores x Tallas).`,
        });
    };

    async function onSubmit(data: ProductFormValues) {
        if (isSubmitting) return;
        console.log("🚨 [DEBUG CLIENT] SUBMIT STARTED at", new Date().toISOString());
        console.log("📦 [DEBUG CLIENT] Form Data:", JSON.stringify(data, null, 2));
        setIsSubmitting(true);
        setProgressOpen(true);
        setProgressLogs([]); // Reset logs

        try {
            addLog("Iniciando validación...", 'loading');
            console.log("🔹 Fase 0: Validación Previa");

            const supabase = createClient();

            // 0. Pre-check: Validar Slug
            // 0. Pre-check: Validar Slug
            // Removed client-side check to prevent timeouts. 
            // We rely on Server Action (code 23505) to return "slug taken" error.
            console.log("🔍 Slug será validado en servidor:", data.slug);
            updateLastLog('success', "Iniciando proceso...");

            // Verify Connectivity & Env Vars
            console.log("🔍 Checking Env Vars:", {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "MISSING",
                key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "MISSING"
            });

            const pingResult = await supabase.from('products').select('id').limit(1).maybeSingle();
            if (pingResult.error) {
                console.error("❌ Connectivity Check Failed:", pingResult.error);
                updateLastLog('error', "Error de conectividad con Supabase. Revisa tu conexión.");
                throw new Error("Connectivity check failed");
            }
            console.log("✅ Supabase Connectivity OK");

            // Verify Authentication first (Non-blocking attempt)
            console.log("🔐 Buscando sesión (con timeout 5s)...");

            // Timeout wrapper
            const getSessionWithTimeout = () => new Promise<any>((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error("Timeout obteniendo sesión")), 5000); // Reduced to 5s
                supabase.auth.getSession().then((res) => { // Reverted to getSession for speed
                    clearTimeout(timer);
                    resolve(res);
                }).catch((err) => {
                    clearTimeout(timer);
                    resolve({ data: { session: null }, error: err }); // Resolve with null instead of reject
                });
            });

            let sessionUser = null;
            try {
                const { data: { session }, error: authError } = await getSessionWithTimeout();
                sessionUser = session?.user;

                if (authError) {
                    console.warn("⚠️ Auth Check Warning (Client-side):", authError);
                    updateLastLog('loading', "Verificación de sesión lenta... intentando guardar de todos modos.");
                } else if (!sessionUser) {
                    console.warn("⚠️ No active session found on client (might exist on server).");
                    updateLastLog('loading', "No se detectó sesión activa en navegador. Intentando envío...");
                } else {
                    console.log("🔐 Auth Check: Valid Session Found", sessionUser.id);
                }
            } catch (e) {
                console.warn("⚠️ Auth Check Skipped due to timeout/error", e);
                updateLastLog('loading', "Saltando verificación de sesión local...");
            }

            // Proceed regardless of client-side auth check result. 
            // Server action will handle the final authority check.

            // 1. Upload Images
            console.log("🔹 Fase 1: Procesando Imágenes");
            addLog("Procesando imágenes...", 'loading');

            const imageUrls: { url: string, color?: string, isPrimary: boolean, storagePath: string }[] = [];
            let processedCount = 0;

            // Flatten all previewUrls to process them in order
            // We trust previewUrls as the Source of Truth for what should be on the product.
            const allItemsToProcess: { colorKey: string, item: any, index: number }[] = [];
            Object.entries(previewUrls).forEach(([colorKey, items]) => {
                items.forEach((item, index) => {
                    allItemsToProcess.push({ colorKey, item, index });
                });
            });

            console.log(`📸 Total items to process: ${allItemsToProcess.length}`);

            for (const { colorKey, item, index } of allItemsToProcess) {
                processedCount++;
                const isPrimary = allItemsToProcess.length > 0 && processedCount === 1; // First image overall is primary? Or first per color? Usually first overall or explicitly set.
                // Assuming simple logic: First image of Default or first valid image is primary if not set.
                // Actually, let's keep logic simple: strict order.

                try {
                    // CASE A: Existing Image with NO modification
                    if (item.isExisting && !item.pixelCrop) {
                        imageUrls.push({
                            url: item.url,
                            color: colorKey === 'default' ? undefined : colorKey,
                            isPrimary: index === 0 && colorKey === 'default', // Legacy logic
                            storagePath: item.storagePath || ""
                        });
                        continue;
                    }

                    // CASE B: New Image OR Existing Image Modified (Need to upload/re-upload)
                    let blobToUpload: Blob;

                    if (item.pixelCrop) {
                        // Crop required
                        addLog(`Recortando imagen ${processedCount}...`, 'loading');
                        blobToUpload = await getCroppedImg(item.url, item.pixelCrop);
                    } else {
                        // No crop, just fetch the current blob (for new images) or download existing (edge case)
                        // For new images, item.url is blob:http... so fetch is fast.
                        const res = await fetch(item.url);
                        blobToUpload = await res.blob();
                    }

                    // Upload
                    const fileExt = "jpg"; // We force JPEG in getCroppedImg, or detect mime
                    const fileName = `${data.slug}/${colorKey}-${index}-${Date.now()}.${fileExt}`;

                    addLog(`Subiendo imagen ${processedCount}...`, 'loading');

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(fileName, blobToUpload, { cacheControl: '3600', upsert: true });

                    if (uploadError) throw uploadError;

                    const publicUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;

                    imageUrls.push({
                        url: publicUrl,
                        color: colorKey === 'default' ? undefined : colorKey,
                        isPrimary: index === 0 && colorKey === 'default',
                        storagePath: fileName
                    });

                } catch (err: any) {
                    console.error("Error processing image:", err);
                    updateLastLog('error', `Error al procesar imagen ${processedCount}: ${err.message}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            updateLastLog('success', `Imágenes procesadas.`);

            // 2. Upload Video
            let videoUrl = "";
            if (videoFile) {
                console.log("🔹 Fase 2: Subiendo Video");
                addLog("Subiendo video...", 'loading');
                const fileExt = videoFile.name.split('.').pop();
                const fileName = `${data.slug}/video-${Date.now()}.${fileExt}`;

                const { error: videoUploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, videoFile);

                if (videoUploadError) {
                    console.error("❌ Error video:", videoUploadError);
                    updateLastLog('error', "Error subiendo video");
                    throw videoUploadError;
                }

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
                videoUrl = publicUrl;
                updateLastLog('success', "Video subido.");
                console.log("✅ Video subido:", videoUrl);
            }

            // 3. Server Action
            console.log("🔹 Fase 3: Server Action - PREPARING PAYLOAD");
            addLog("Guardando en base de datos...", 'loading');

            // Prepared variants with color metadata
            const variantsData = data.variants.map(v => ({
                ...v,
                color_metadata: v.color ? { hex: COLOR_MAP[v.color] || '#CCCCCC', name: v.color } : undefined
            }));

            const serverPayload = {
                ...data,
                video: videoUrl || initialData?.video,
                imageUrls,
                variants: variantsData
            };

            console.log("🚀 [DEBUG CLIENT] Sending Payload to Server Action:", JSON.stringify(serverPayload, null, 2));

            let result;
            if (initialData?.id) {
                console.log("🔄 Calling updateProduct with ID:", initialData.id);
                result = await updateProduct(initialData.id, serverPayload);
            } else {
                console.log("✨ Calling createProduct");
                result = await createProduct(serverPayload);
            }

            console.log("📡 Respuesta Server Action:", result);

            if (!result.success) {
                console.error("❌ Error Server Action:", result.error);
                updateLastLog('error', result.error);
                throw new Error(result.error);
            }

            updateLastLog('success', "Producto guardado correctamente.");
            addLog("¡Listo! Redirigiendo...", 'success');
            console.log("🏁 Éxito Total");

            setTimeout(() => {
                router.push('/admin/inventory');
            }, 1000);

        } catch (error: any) {
            console.error("🚨 CATCH GENERAL:", error);
            // Error is already logged in the last step mostly, but let's ensure
            if (progressLogs[progressLogs.length - 1]?.status !== 'error') {
                addLog("Error Fatal", 'error', error.message || "Error desconocido");
            }
        } finally {
            setIsSubmitting(false);
            // Don't close modal automatically on error so user can read
        }
    }

    const setDraftAndSubmit = () => {
        form.setValue('is_active', false);
        // We need to trigger submit programmatically or let the button be type="submit"
        // Since the button is inside the form, type="submit" works.
    };

    const setPublishAndSubmit = () => {
        form.setValue('is_active', true);
    }

    const onInvalid = (errors: any) => {
        console.error("❌ [DEBUG] FORMULARIO INVÁLIDO:", errors);
        console.warn("⚠️ Errores de validación en el formulario:", errors);
        toast({
            title: "Revisa el formulario",
            description: "Hay campos obligatorios vacíos o con errores.",
            variant: "destructive"
        });
    };

    return (
        <Form {...form}>
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    {/* Sticky Section Navigation for Mobile */}
                    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur shadow-sm -mx-4 px-4 py-2 border-b md:relative md:top-0 md:bg-transparent md:shadow-none md:border-none md:px-0 md:mx-0 mb-6">
                        <TabsList className="grid grid-cols-4 w-full h-12 bg-secondary/20 rounded-full p-1">
                            <TabsTrigger value="basic" className="rounded-full text-xs uppercase font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <User className="w-3 h-3 mr-1.5 hidden sm:block" /> Info
                            </TabsTrigger>
                            <TabsTrigger value="variants" className="rounded-full text-xs uppercase font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Palette className="w-3 h-3 mr-1.5 hidden sm:block" /> Stock
                            </TabsTrigger>
                            <TabsTrigger value="media" className="rounded-full text-xs uppercase font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <UploadCloud className="w-3 h-3 mr-1.5 hidden sm:block" /> Fotos
                            </TabsTrigger>
                            {initialData?.id && (
                                <TabsTrigger value="reviews" className="rounded-full text-xs uppercase font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <MessageSquare className="w-3 h-3 mr-1.5 hidden sm:block" /> Reseñas
                                </TabsTrigger>
                            )}
                            <TabsTrigger value="preview" className="rounded-full text-xs uppercase font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground lg:hidden">
                                <Shield className="w-3 h-3 mr-1.5 hidden sm:block" /> Preview
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* MAIN CONTENT AREA */}
                        <div className="lg:col-span-2">
                            <TabsContent value="preview" className="lg:hidden animate-in fade-in zoom-in-95 duration-500">
                                <ProductPreview
                                    title={watchedTitle}
                                    category={watchedCategory}
                                    price={watchedPrice}
                                    salePrice={watchedSalePrice}
                                    images={previewUrls}
                                    description={watchedDescription}
                                    colors={colors}
                                    sizes={selectedSizes}
                                    tags={watchedTags}
                                />
                            </TabsContent>
                            <TabsContent value="basic" className="space-y-6 mt-0 animate-in fade-in duration-500">
                                {/* 1. Basic Info */}
                                <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
                                    <div className="h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Detalles Básicos</CardTitle>
                                        <CardDescription className="text-sm uppercase tracking-widest font-bold opacity-70">Identificación y descripción</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">Nombre del Producto</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: Anillo de Oro 'Luz de Luna'" {...field} className="bg-background/50 border-border/50 h-11 focus:ring-primary/20" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField
                                                control={form.control}
                                                name="slug"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">URL Amigable (Slug)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input placeholder="anillo-oro-luz-luna" {...field} className="bg-background/50 border-border/50 h-11 pl-3 font-mono text-sm" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">Categoría</FormLabel>
                                                        {isAddingCategory ? (
                                                            <div className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                                                                <Input
                                                                    value={newCategory}
                                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                                    placeholder="Ej: Dijes"
                                                                    className="h-11"
                                                                />
                                                                <Button type="button" size="sm" onClick={handleAddCategory} className="h-11 px-4">OK</Button>
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => setIsAddingCategory(false)} className="h-11 w-11"><X className="h-4 w-4" /></Button>
                                                            </div>
                                                        ) : (
                                                            <Select onValueChange={(val) => val === 'new_category_action' ? setIsAddingCategory(true) : field.onChange(val)} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11 bg-background/50 border-border/50">
                                                                        <SelectValue placeholder="Selecciona..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {categories.map(cat => (
                                                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                                                    ))}
                                                                    <Separator className="my-1" />
                                                                    <SelectItem value="new_category_action" className="font-bold text-primary focus:bg-primary/10">
                                                                        + CREAR NUEVA
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">Descripción Premium</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Escribe la historia de esta pieza..."
                                                            className="min-h-[120px] bg-background/50 border-border/50 resize-none focus:ring-primary/20 text-sm"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* MARKETING TAGS */}
                                        <div className="space-y-3 pt-2">
                                            <Label className="text-sm font-bold uppercase tracking-wider opacity-70 flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-primary" />
                                                Etiquetas de Marketing
                                            </Label>
                                            <FormField
                                                control={form.control}
                                                name="tags"
                                                render={() => (
                                                    <FormItem>
                                                        <div className="flex flex-wrap gap-3">
                                                            {MARKETING_TAGS.map((item) => (
                                                                <FormField
                                                                    key={item.id}
                                                                    control={form.control}
                                                                    name="tags"
                                                                    render={({ field }) => {
                                                                        return (
                                                                            <FormItem
                                                                                key={item.id}
                                                                                className="flex flex-row items-start space-x-2 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(item.id)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            return checked
                                                                                                ? field.onChange([...field.value, item.id])
                                                                                                : field.onChange(
                                                                                                    field.value?.filter(
                                                                                                        (value) => value !== item.id
                                                                                                    )
                                                                                                )
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal text-sm cursor-pointer">
                                                                                    {item.label}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                        )
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* TECHNICAL SPECS */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                            <FormField
                                                control={form.control}
                                                name="size_guide_type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70 flex items-center gap-2">
                                                            <Ruler className="w-3 h-3" /> Guía de Tallas
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-background/50">
                                                                    <SelectValue placeholder="Selecciona..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="none">Ninguna</SelectItem>
                                                                <SelectItem value="ring">Anillos</SelectItem>
                                                                <SelectItem value="bracelet">Pulseras</SelectItem>
                                                                <SelectItem value="necklace">Collares</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="care_instructions"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">Cuidados</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ej: No mojar con perfumes" {...field} className="bg-background/50 h-10" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 2. PRICING (Moved for better mobile accessibility) */}
                                <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Precios y Visibilidad</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-5">
                                            <FormField
                                                control={form.control}
                                                name="base_price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Precio Base</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                                                                <Input type="number" placeholder="0.00" {...field} className="h-12 pl-7 font-black text-lg bg-background/50 border-border/50" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="sale_price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-pink-500">Oferta (Opcional)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-pink-500">$</span>
                                                                <Input type="number" placeholder="0.00" {...field} className="h-12 pl-7 font-black text-lg bg-background/50 border-border/20 text-pink-500" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="is_active"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10">
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="w-4 h-4 text-primary" />
                                                            <FormLabel className="font-black uppercase tracking-widest text-xs">Estatus del Producto</FormLabel>
                                                        </div>
                                                        <FormDescription className="text-xs uppercase font-bold opacity-60">Visible inmediatamente en la tienda</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* FINANZAS & PROFIT MARGIN */}
                                <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
                                    <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 flex justify-between items-center">
                                        <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                            <Calculator className="w-4 h-4 text-primary" />
                                            Finanzas
                                        </CardTitle>
                                        <Badge variant={isMarginPositive ? "default" : "destructive"} className="text-xs uppercase tracking-widest">
                                            Margen: {margin}%
                                        </Badge>
                                    </div>
                                    <CardContent className="space-y-4 p-4">
                                        <FormField
                                            control={form.control}
                                            name="cost_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70 text-muted-foreground">Costo de Producción (Interno)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground opacity-50">$</span>
                                                            <Input type="number" placeholder="0.00" {...field} className="h-10 pl-7 font-mono bg-background/50 border-dashed" />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription className="text-xs">No visible para el cliente</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="variants" className="space-y-6 mt-0 animate-in fade-in duration-500">
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* 1. VARIANT CONFIGURATION */}
                                        <Card className="border-none shadow-md bg-card/50">
                                            <CardHeader className="pb-3 bg-primary/5 border-b border-primary/10">
                                                <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                                    <Palette className="w-4 h-4 text-primary" />
                                                    Configuración de Variantes
                                                </CardTitle>
                                                <CardDescription className="text-xs">Define los atributos para generar tu inventario</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Left: Attributes */}
                                                <div className="space-y-6">
                                                    {/* Colors */}
                                                    <div className="space-y-3">
                                                        <Label className="text-xs uppercase font-black tracking-widest opacity-70">1. Colores / Acabados</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {colors.map((color) => (
                                                                <div key={color.name} className="flex items-center gap-2 bg-background border px-3 py-1.5 rounded-full shadow-sm">
                                                                    <div className="w-4 h-4 rounded-full border shadow-inner" style={{ backgroundColor: color.hex }} />
                                                                    <span className="text-xs font-bold uppercase">{color.name}</span>
                                                                    <button type="button" onClick={() => removeColor(color.name)} className="hover:text-destructive transition-colors ml-1">
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2 max-w-sm">
                                                            <Input
                                                                placeholder="Nombre (ej. Oro)"
                                                                value={newColorName}
                                                                onChange={(e) => setNewColorName(e.target.value)}
                                                                className="h-9 text-sm"
                                                            />
                                                            <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-full border shadow-sm cursor-pointer group">
                                                                <Input
                                                                    type="color"
                                                                    value={newColorHex}
                                                                    onChange={(e) => setNewColorHex(e.target.value)}
                                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-none cursor-pointer opacity-0 group-hover:opacity-100"
                                                                />
                                                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: newColorHex }} />
                                                            </div>
                                                            <Button type="button" size="icon" onClick={addColor} disabled={!newColorName} className="h-9 w-9 shrink-0 bg-primary text-primary-foreground">
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Sizes */}
                                                    <div className="space-y-3">
                                                        <Label className="text-xs uppercase font-black tracking-widest opacity-70">2. Tallas Disponibles</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {SIZES.map(size => (
                                                                <Button
                                                                    key={size}
                                                                    type="button"
                                                                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => toggleSize(size)}
                                                                    className={`h-8 px-4 text-xs font-bold rounded-full transition-all ${selectedSizes.includes(size) ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100'}`}
                                                                >
                                                                    {size}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Generator Action */}
                                                <div className="flex flex-col justify-end">
                                                    <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 space-y-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-primary/20 p-2 rounded-lg">
                                                                <Sparkles className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-black uppercase tracking-wide text-primary">Generador Inteligente de SKUs</h4>
                                                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                                    Crea automáticamente todas las combinaciones posibles usando el <strong>Slug</strong> del producto.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-background rounded-lg border border-dashed border-primary/20 p-3 flex flex-col items-center justify-center gap-1">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Formato de SKU</span>
                                                            <code className="text-sm font-mono font-black text-primary tracking-wider">
                                                                {(() => {
                                                                    const slg = form.getValues('slug');
                                                                    const catName = form.getValues('category');
                                                                    if (!slg) return '00-0000-00-0';

                                                                    const matched = categories.find(c => c.name === catName);
                                                                    const pfx = matched ? matched.id.toString().padStart(2, '0') : '00';

                                                                    const mdl = 'XXXX';
                                                                    return `${pfx}-${mdl}-01-TALLA`;
                                                                })()}
                                                            </code>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest shadow-lg h-10"
                                                            onClick={generateVariants}
                                                            disabled={isGenerating}
                                                        >
                                                            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                                            Generar {colors.length * selectedSizes.length} Combinaciones
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 2. INVENTORY TABLE */}
                                        <Card className="border-none shadow-md overflow-hidden flex flex-col h-full bg-white dark:bg-zinc-900 ring-1 ring-border/50">
                                            <div className="bg-secondary/20 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-background p-2 rounded-md shadow-sm">
                                                        <Package className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black uppercase tracking-wide leading-none">Inventario Actual</h3>
                                                        <p className="text-xs text-muted-foreground mt-1">{fields.length} variantes generadas</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                                                    <Label className="text-xs uppercase font-bold opacity-60 cursor-pointer" htmlFor="simple-mode">Modo Simple</Label>
                                                    <FormField
                                                        control={form.control}
                                                        name="has_variants"
                                                        render={({ field }) => (
                                                            <Switch
                                                                id="simple-mode"
                                                                checked={!field.value}
                                                                onCheckedChange={(c) => field.onChange(!c)}
                                                                className="scale-75 data-[state=checked]:bg-primary"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <CardContent className="p-0">
                                                {hasVariants ? (
                                                    <div className="relative w-full overflow-auto">
                                                        <Table>
                                                            <TableHeader className="bg-muted/30 sticky top-0 z-10">
                                                                <TableRow className="hover:bg-transparent border-b border-border/50">
                                                                    <TableHead className="w-[15%] text-xs font-black uppercase pl-6">Color</TableHead>
                                                                    <TableHead className="w-[15%] text-xs font-black uppercase text-center">Talla</TableHead>
                                                                    <TableHead className="w-[40%] text-xs font-black uppercase">SKU</TableHead>
                                                                    <TableHead className="w-[20%] text-xs font-black uppercase text-center">Stock</TableHead>
                                                                    <TableHead className="w-[10%]"></TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {fields.length === 0 && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={5} className="h-48 text-center bg-muted/5">
                                                                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                                                                                <Package className="w-10 h-10 mb-2 opacity-20" />
                                                                                <p className="text-sm font-bold uppercase tracking-wide">Inventario Vacío</p>
                                                                                <p className="text-xs max-w-xs mx-auto">Utiliza el generador de arriba para crear tus variantes automáticamente.</p>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                                {fields.map((field, index) => (
                                                                    <TableRow key={field.id} className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0">
                                                                        <TableCell className="font-medium text-sm py-3 pl-6">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-4 h-4 rounded-full border shadow-sm ring-1 ring-inset ring-black/10" style={{ backgroundColor: colors.find(c => c.name === form.watch(`variants.${index}.color`))?.hex || '#ccc' }} />
                                                                                <span className="font-semibold">{form.watch(`variants.${index}.color`)}</span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 text-center">
                                                                            <Badge variant="outline" className="font-mono bg-background/50">
                                                                                {form.watch(`variants.${index}.size`)}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                            <FormField
                                                                                control={form.control}
                                                                                name={`variants.${index}.sku`}
                                                                                render={({ field }) => (
                                                                                    <Input
                                                                                        {...field}
                                                                                        className="h-9 font-mono text-xs border-transparent bg-muted/30 focus:bg-background focus:border-primary transition-all px-3 rounded-md w-full"
                                                                                        placeholder="SKU-CODE"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                            <FormField
                                                                                control={form.control}
                                                                                name={`variants.${index}.stock`}
                                                                                render={({ field }) => (
                                                                                    <div className="flex justify-center">
                                                                                        <Input
                                                                                            type="number"
                                                                                            {...field}
                                                                                            className="h-9 w-20 text-center font-bold text-sm bg-background border-border"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="py-3 text-right pr-4">
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-50 group-hover:opacity-100 transition-all rounded-full"
                                                                                onClick={() => remove(index)}
                                                                            >
                                                                                <MinusCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="p-12 flex flex-col items-center justify-center space-y-6 text-center bg-muted/10">
                                                        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center ring-4 ring-background shadow-sm">
                                                            <Package className="w-10 h-10 text-primary opacity-80" />
                                                        </div>
                                                        <div className="space-y-2 max-w-md">
                                                            <h3 className="font-black text-xl uppercase tracking-tight text-foreground">Producto Único</h3>
                                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                                Este producto se gestiona como una unidad simple, sin variaciones de color o talla. Ideal para piezas únicas o estandarizadas.
                                                            </p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-5 w-full max-w-lg mt-4 bg-card p-6 rounded-xl border shadow-sm">
                                                            <FormField
                                                                control={form.control}
                                                                name={`variants.0.sku`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Código SKU</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} className="font-mono text-center h-11 bg-muted/30" placeholder="Ej: ANILLO-UNICO" />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`variants.0.stock`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Existencias</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number" {...field} className="text-center font-bold text-lg h-11 bg-muted/30" />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-6 mt-0 animate-in fade-in duration-500">
                                {/* 5. Images (Grouped by Color) */}
                                <Card className="border-none shadow-md overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 h-1"></div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Galería Visual</CardTitle>
                                        <CardDescription className="text-xs uppercase font-bold opacity-60">Selecciona el color para ver sus fotos específicas</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {/* visibleColors computation moved outside JSX and potentially wrapped in useMemo */}
                                        {/* Assuming `useMemo` is imported and used at the top of the component function */}
                                        {/*
                                        const visibleColors = useMemo(() => {
                                            const currentVariants = form.getValues('variants') || [];
                                            const activeColorNames = new Set(currentVariants.map(v => v.color).filter(Boolean));
                                            return colors.filter(c => activeColorNames.has(c.name));
                                        }, [form.getValues('variants'), colors]);
                                        */}
                                        {/* For this example, I'll assume `visibleColors` is already defined in the scope above this snippet. */}
                                        <Tabs defaultValue={hasVariants && visibleColors.length > 0 ? visibleColors[0].name : 'default'} value={activeImageTab} onValueChange={setActiveImageTab} className="p-6 pt-0">
                                            <TabsList className="flex flex-nowrap overflow-x-auto h-auto gap-2 bg-transparent p-0 mb-6 scrollbar-hide">
                                                {(!hasVariants || visibleColors.length === 0) && (
                                                    <TabsTrigger value="default" className="rounded-full border px-4 py-2 text-xs uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                                        General
                                                    </TabsTrigger>
                                                )}
                                                {visibleColors.map(color => (
                                                    <TabsTrigger
                                                        key={color.name}
                                                        value={color.name}
                                                        className="rounded-full border px-4 py-2 text-xs uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 shrink-0 shadow-sm"
                                                    >
                                                        <div className="w-3 h-3 rounded-full border shadow-inner" style={{ backgroundColor: color.hex }} />
                                                        {color.name}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>

                                            {/* Content Loop */}
                                            {[
                                                ...((!hasVariants || visibleColors.length === 0) ? ['default'] : []),
                                                ...visibleColors.map(c => c.name)
                                            ].map((tabKey) => (
                                                <TabsContent key={tabKey} value={tabKey} className="mt-0 animate-in zoom-in-95 duration-300">
                                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {(previewUrls[tabKey] || []).map((item, index) => (
                                                            <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 bg-muted group shadow-sm hover:shadow-lg transition-all">
                                                                <img
                                                                    src={item.url}
                                                                    alt={`Preview ${index}`}
                                                                    className="w-full h-full object-cover transition-all duration-200"
                                                                    style={item.pixelCrop ? {
                                                                        position: 'absolute',
                                                                        top: '0',
                                                                        left: '0',
                                                                        width: `${10000 / item.pixelCrop.width}%`,
                                                                        height: `${10000 / item.pixelCrop.height}%`,
                                                                        transform: `translate(-${item.pixelCrop.x}%, -${item.pixelCrop.y}%)`,
                                                                        transformOrigin: '0 0'
                                                                    } : {}}
                                                                />

                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                                                                    <div className="flex gap-1">
                                                                        <Button type="button" variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={() => moveImage(tabKey, index, 'left')} disabled={index === 0}>
                                                                            <ArrowLeft className="h-4 w-4" />
                                                                        </Button>

                                                                        <Button
                                                                            type="button"
                                                                            variant="secondary"
                                                                            size="icon"
                                                                            className="h-8 w-8 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                                                                            onClick={() => setFramerConfig({ isOpen: true, colorKey: tabKey, index: index })}
                                                                        >
                                                                            <Sparkles className="h-4 w-4 text-white" />
                                                                        </Button>

                                                                        <Button type="button" variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={() => moveImage(tabKey, index, 'right')} disabled={index === (previewUrls[tabKey]?.length || 0) - 1}>
                                                                            <ArrowRight className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                    <Button type="button" variant="destructive" size="sm" className="h-7 px-4 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg" onClick={() => removeImage(tabKey, index)}>
                                                                        <Trash2 className="h-3 w-3 mr-1" /> Borrar
                                                                    </Button>
                                                                </div>

                                                                {index === 0 && (
                                                                    <div className="absolute top-2 left-2">
                                                                        <Badge className="bg-white/95 text-black hover:bg-white text-[10px] font-black uppercase tracking-tighter shadow-xl px-2 py-0.5 border-none rounded-full">
                                                                            Vista {tabKey}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                        <label
                                                            className="aspect-[4/5] border-3 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group p-4 border-muted"
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4">
                                                                <UploadCloud className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Añadir a {tabKey === 'default' ? 'General' : tabKey}</span>
                                                            <span className="text-[10px] font-medium text-muted-foreground/60 mt-2">JPG, PNG hasta 5MB</span>
                                                            <Input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleImageSelect(e, tabKey)}
                                                            />
                                                        </label>
                                                    </div>
                                                </TabsContent>
                                            ))}
                                        </Tabs >

                                        <Separator className="my-6" />

                                        {/* VIDEO SECTION */}
                                        <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-primary/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <UploadCloud className="w-4 h-4 text-primary" /> Video del Producto (Opcional)
                                                </Label>
                                                {videoPreview && (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => { setVideoFile(null); setVideoPreview(null); }} className="text-destructive text-xs h-6">
                                                        <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                                    </Button>
                                                )}
                                            </div>

                                            {!videoPreview ? (
                                                <div className="h-24 rounded-lg bg-background/50 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors relative">
                                                    <input
                                                        type="file"
                                                        accept="video/mp4,video/webm,video/ogg"
                                                        onChange={handleVideoSelect}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                    <UploadCloud className="h-6 w-6 text-muted-foreground mb-1" />
                                                    <span className="text-xs text-muted-foreground font-medium">Click para subir video (Max 50MB)</span>
                                                </div>
                                            ) : (
                                                <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-inner max-w-sm mx-auto">
                                                    <video src={videoPreview} controls className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {initialData?.id && (
                                <TabsContent value="reviews" className="animate-in fade-in zoom-in-95 duration-500">
                                    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                                                <MessageSquare className="w-5 h-5 text-primary" /> Opiniones de Clientes
                                            </CardTitle>
                                            <CardDescription>
                                                Visualiza lo que dicen tus clientes sobre este producto.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <AdminReviewsList productId={initialData.id} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}
                        </div>

                        {/* DESKTOP SIDEBAR: Preview & Sticky Save */}
                        <div className="hidden lg:block space-y-8 sticky top-24">
                            {/* Live Preview Card */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <ProductPreview
                                    title={watchedTitle}
                                    category={watchedCategory}
                                    price={watchedPrice}
                                    salePrice={watchedSalePrice}
                                    images={previewUrls}
                                    description={watchedDescription}
                                    colors={colors}
                                    sizes={selectedSizes}
                                    tags={watchedTags}
                                    video={videoFile}
                                />
                            </div>


                        </div>
                    </div>
                </Tabs>


                {/* Floating Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 md:sticky md:bottom-auto flex items-center justify-between gap-4">
                    <div className="hidden md:flex items-center text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        Cambios guardados localmente
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 md:flex-none border-primary/20 hover:bg-primary/5 hover:text-primary"
                            onClick={() => router.back()}
                        >
                            <X className="w-4 h-4 mr-2" /> Cancelar
                        </Button>
                        <Button
                            type="submit"
                            onClick={setDraftAndSubmit}
                            variant="secondary"
                            disabled={isSubmitting}
                            className="flex-1 md:flex-none bg-secondary/80 hover:bg-secondary font-bold text-secondary-foreground"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
                            Guardar Borrador
                        </Button>
                        <Button
                            type="submit"
                            onClick={setPublishAndSubmit}
                            disabled={isSubmitting}
                            className="flex-[2] md:flex-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 stroke-[3]" />}
                            Publicar
                        </Button>
                    </div>
                </div>

            </form>

            <ImageFramer
                isOpen={!!framerConfig?.isOpen}
                onClose={() => setFramerConfig(null)}
                imageUrl={framerConfig ? previewUrls[framerConfig.colorKey][framerConfig.index]?.url : ''}
                initialCrop={framerConfig ? previewUrls[framerConfig.colorKey][framerConfig.index]?.crop : undefined}
                initialZoom={framerConfig ? previewUrls[framerConfig.colorKey][framerConfig.index]?.zoom : undefined}
                onSave={handleFramerSave}
                aspectRatio={3 / 4}
            />

            {/* Progress Dialog */}
            <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Estado de Publicación</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Progreso de la actualización del producto...
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-black/5 dark:bg-white/5">
                        <div className="space-y-4">
                            {progressLogs.map((log, index) => (
                                <div key={index} className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5">
                                        {log.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                        {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {log.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                        {log.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-muted" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "font-medium",
                                            log.status === 'error' ? "text-red-500" :
                                                log.status === 'success' ? "text-green-600" : "text-foreground"
                                        )}>
                                            {log.step}
                                        </p>
                                        {log.message && (
                                            <p className="text-xs text-muted-foreground mt-1">{log.message}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </Form>
    );
}

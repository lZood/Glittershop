'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, UploadCloud, X, ArrowLeft, ArrowRight, Palette, User, Shield, Package, Calculator, Sparkles, Ruler, MinusCircle } from 'lucide-react';
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
const INITIAL_CATEGORIES = ['Anillos', 'Collares', 'Pulseras', 'Aretes'];
const MARKETING_TAGS = [
    { id: 'new', label: 'Nuevo' },
    { id: 'bestseller', label: 'Más Vendido' },
    { id: 'limited', label: 'Edición Limitada' },
    { id: 'sale', label: 'Oferta' },
    { id: 'exclusive', label: 'Exclusivo' },
];

export function ProductForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    // Advanced State
    const [colors, setColors] = useState<{ name: string; hex: string }[]>([
        { name: 'Oro', hex: '#FFD700' },
        { name: 'Plata', hex: '#C0C0C0' }
    ]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');

    // Images grouped by color key (or 'default')
    const [images, setImages] = useState<Record<string, File[]>>({ 'default': [] });
    const [previewUrls, setPreviewUrls] = useState<Record<string, string[]>>({ 'default': [] });
    const [activeImageTab, setActiveImageTab] = useState('default');

    // Dynamic lists
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(['6', '7', '8']); // Default selected sizes

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            base_price: 0,
            sale_price: 0,
            cost_price: 0,
            is_active: false,
            category: "",
            has_variants: true,
            tags: [],
            size_guide_type: 'none',
            care_instructions: "",
            variants: [],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // Watch values for preview
    const watchedTitle = form.watch('title');
    const watchedPrice = form.watch('base_price');
    const watchedSalePrice = form.watch('sale_price');
    const watchedCategory = form.watch('category');
    const watchedDescription = form.watch('description');
    const hasVariants = form.watch('has_variants');
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

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
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

    // --- Category Handler ---
    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, newCategory.trim()]);
            form.setValue('category', newCategory.trim());
            setNewCategory('');
            setIsAddingCategory(false);
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
        const baseSlug = form.getValues('slug') || 'p';
        const newVariants: any[] = [];

        // Generate combinations
        colors.forEach(color => {
            selectedSizes.forEach(size => {
                newVariants.push({
                    sku: `${baseSlug}-${color.name.substring(0, 3).toUpperCase()}-${size}`,
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
        toast({ title: "💎 Procesando...", description: "Estamos guardando tu nueva creación..." });
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log({ ...data, images, colors });
        toast({
            title: "✨ Producto Guardado",
            description: "La pieza se ha registrado correctamente en el inventario.",
            className: "bg-primary text-white font-bold"
        });
        router.push('/admin/inventory');
    }

    return (
        <Form {...form}>
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* CONTROLS (Left/Top) */}
                                    <div className="lg:col-span-4 space-y-6">
                                        <Card className="border-none shadow-md overflow-hidden bg-card/50">
                                            <CardHeader className="pb-3 bg-primary/5 border-b border-primary/10">
                                                <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                                    <Palette className="w-4 h-4 text-primary" />
                                                    1. Definir Opciones
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6 p-5">
                                                {/* Colors */}
                                                <div className="space-y-3">
                                                    <Label className="text-xs uppercase font-black tracking-widest opacity-70">Colores / Acabados</Label>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {colors.map((color) => (
                                                            <div key={color.name} className="flex items-center gap-2 bg-background border px-2 py-1.5 rounded-full shadow-sm">
                                                                <div className="w-4 h-4 rounded-full border shadow-inner" style={{ backgroundColor: color.hex }} />
                                                                <span className="text-xs font-bold uppercase">{color.name}</span>
                                                                <button type="button" onClick={() => removeColor(color.name)} className="hover:text-destructive transition-colors ml-1">
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Nombre (ej. Oro)"
                                                            value={newColorName}
                                                            onChange={(e) => setNewColorName(e.target.value)}
                                                            className="h-9 text-sm flex-1"
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
                                                    <Label className="text-xs uppercase font-black tracking-widest opacity-70">Tallas Disponibles</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {SIZES.map(size => (
                                                            <Button
                                                                key={size}
                                                                type="button"
                                                                variant={selectedSizes.includes(size) ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => toggleSize(size)}
                                                                className={`h-8 px-3 text-xs font-bold rounded-full transition-all ${selectedSizes.includes(size) ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100'}`}
                                                            >
                                                                {size}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    className="w-full bg-primary text-primary-foreground font-black uppercase text-sm tracking-widest shadow-lg hover:scale-[1.02] transition-transform"
                                                    onClick={generateVariants}
                                                >
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generar Combinaciones
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* LIST (Right/Bottom) */}
                                    <div className="lg:col-span-8">
                                        <Card className="border-none shadow-md overflow-hidden h-full flex flex-col">
                                            <div className="bg-secondary/20 px-4 py-3 border-b flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-primary" />
                                                    <span className="text-lg font-black uppercase tracking-wide">2. Inventario ({fields.length})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs uppercase font-bold mr-2 opacity-60">Modo Simple</Label>
                                                    <FormField
                                                        control={form.control}
                                                        name="has_variants"
                                                        render={({ field }) => (
                                                            <Switch checked={!field.value} onCheckedChange={(c) => field.onChange(!c)} />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                                                {hasVariants ? (
                                                    <Table>
                                                        <TableHeader className="bg-background/50 sticky top-0 z-10 backdrop-blur-sm">
                                                            <TableRow className="hover:bg-transparent border-b border-border/50">
                                                                <TableHead className="w-[100px] text-xs font-black uppercase">Color</TableHead>
                                                                <TableHead className="w-[80px] text-xs font-black uppercase">Talla</TableHead>
                                                                <TableHead className="text-xs font-black uppercase">SKU</TableHead>
                                                                <TableHead className="w-[80px] text-xs font-black uppercase text-center">Stock</TableHead>
                                                                <TableHead className="w-[50px]"></TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {fields.length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} className="h-32 text-center">
                                                                        <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                                                            <Package className="w-8 h-8 mb-2" />
                                                                            <p className="text-sm font-medium">Sin variantes generadas</p>
                                                                            <p className="text-xs">Usa el panel de la izquierda para comenzar</p>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                            {fields.map((field, index) => (
                                                                <TableRow key={field.id} className="group hover:bg-muted/30 transition-colors">
                                                                    <TableCell className="font-medium text-sm py-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: colors.find(c => c.name === form.watch(`variants.${index}.color`))?.hex || '#ccc' }} />
                                                                            {form.watch(`variants.${index}.color`)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm py-2 font-mono bg-muted/20 text-center rounded-sm mx-1">
                                                                        {form.watch(`variants.${index}.size`)}
                                                                    </TableCell>
                                                                    <TableCell className="py-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`variants.${index}.sku`}
                                                                            render={({ field }) => (
                                                                                <Input {...field} className="h-7 text-xs font-mono border-transparent bg-transparent hover:bg-background hover:border-input focus:bg-background focus:border-primary transition-all px-2" />
                                                                            )}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="py-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`variants.${index}.stock`}
                                                                            render={({ field }) => (
                                                                                <Input type="number" {...field} className="h-8 text-center font-bold text-sm" />
                                                                            )}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="py-2 text-right">
                                                                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all" onClick={() => remove(index)}>
                                                                            <MinusCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                ) : (
                                                    <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Package className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg">Producto Único</h3>
                                                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Este producto no tiene variantes de color o talla. Se maneja como un item único.</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                                                            <FormField
                                                                control={form.control}
                                                                name={`variants.0.sku`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-sm">SKU</FormLabel>
                                                                        <FormControl><Input {...field} /></FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`variants.0.stock`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-sm">Stock</FormLabel>
                                                                        <FormControl><Input type="number" {...field} /></FormControl>
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
                                        <Tabs defaultValue="default" value={activeImageTab} onValueChange={setActiveImageTab} className="p-6 pt-0">
                                            <TabsList className="flex flex-nowrap overflow-x-auto h-auto gap-2 bg-transparent p-0 mb-6 scrollbar-hide">
                                                <TabsTrigger value="default" className="rounded-full border px-4 py-2 text-xs uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                                    General
                                                </TabsTrigger>
                                                {colors.map(color => (
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

                                            {['default', ...colors.map(c => c.name)].map((tabKey) => (
                                                <TabsContent key={tabKey} value={tabKey} className="mt-0 animate-in zoom-in-95 duration-300">
                                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {(previewUrls[tabKey] || []).map((url, index) => (
                                                            <div key={index} className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 bg-muted group shadow-sm hover:shadow-lg transition-all">
                                                                <img src={url} alt={`Preview ${index}`} className="object-cover w-full h-full" />

                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                                                    <div className="flex gap-2">
                                                                        <Button type="button" variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-lg" onClick={() => moveImage(tabKey, index, 'left')} disabled={index === 0}>
                                                                            <ArrowLeft className="h-5 w-5" />
                                                                        </Button>
                                                                        <Button type="button" variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-lg" onClick={() => moveImage(tabKey, index, 'right')} disabled={index === (previewUrls[tabKey]?.length || 0) - 1}>
                                                                            <ArrowRight className="h-5 w-5" />
                                                                        </Button>
                                                                    </div>
                                                                    <Button type="button" variant="destructive" size="sm" className="h-9 px-6 rounded-full font-bold uppercase text-xs tracking-widest shadow-lg" onClick={() => removeImage(tabKey, index)}>
                                                                        <Trash2 className="h-4 w-4 mr-2" /> Borrar
                                                                    </Button>
                                                                </div>

                                                                {index === 0 && (
                                                                    <div className="absolute top-2 left-2">
                                                                        <Badge className="bg-white/95 text-black hover:bg-white text-xs font-black uppercase tracking-tighter shadow-xl px-3 py-1 border-none rounded-full">Principal</Badge>
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
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </TabsContent>
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
                                />
                            </div>


                        </div>
                    </div>
                </Tabs>


            </form>
        </Form>
    );
}

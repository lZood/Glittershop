import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Globe, Box, Tag, DollarSign, Image as ImageIcon, Video, Layers, ChevronRight, Share2, Printer, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { DeleteProductButton } from "./delete-button";
import { VariantsTable } from "./variants-table";

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (name),
            product_variants (*),
            product_images (*)
        `)
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const mainImage = product.product_images?.find((img: any) => img.is_primary) || product.product_images?.[0];
    const otherImages = product.product_images?.filter((img: any) => img.id !== mainImage?.id) || [];

    return (
        <div className="space-y-6 animate-in fade-in-50 pb-20 md:pb-10 p-4 md:p-8 bg-background/50 min-h-screen">
            {/* Breadcrumb / Nav */}
            <nav className="flex items-center text-sm text-muted-foreground mb-2">
                <Link href="/admin/inventory" className="hover:text-primary transition-colors">Inventario</Link>
                <ChevronRight className="h-3 w-3 mx-2" />
                <span className="font-medium text-foreground truncate">{product.name}</span>
            </nav>

            {/* Header Moderno con Banner de Estado */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-center md:items-start gap-4">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden shadow-sm border bg-muted flex-shrink-0">
                        {mainImage ? (
                            <Image
                                src={mainImage.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                <ImageIcon className="h-8 w-8 opacity-20" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground line-clamp-1">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={product.is_active ? "default" : "secondary"} className="rounded-full px-2 py-0 text-[10px] md:text-xs">
                                {product.is_active ? '● Publicado' : '○ Borrador'}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">#{product.slug}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Button variant="outline" size="sm" className="rounded-full h-8 text-xs flex-shrink-0">
                        <Share2 className="h-3 w-3 mr-1" />
                        Compartir
                    </Button>
                    <Button asChild variant="default" size="sm" className="rounded-full h-8 text-xs shadow-sm flex-shrink-0">
                        <Link href={`/admin/inventory/edit/${product.id}`}>
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" size="sm" className="rounded-full h-8 text-xs shadow-sm flex-shrink-0">
                        <Link href={`/products/${product.slug}`} target="_blank">
                            <Eye className="mr-1 h-3 w-3" />
                            Ver en Tienda
                        </Link>
                    </Button>
                    <div className="flex-shrink-0">
                        <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Columna Izquierda (Detalles y Stats) - 8 columnas */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Tarjetas de Estadísticas "Family Friendly" (Coloridas y Redondeadas) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 flex flex-col justify-center items-center text-center space-y-1">
                            <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                                <DollarSign className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Precio</span>
                            <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                {formatCurrency(product.sale_price || product.price)}
                            </span>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-center items-center text-center space-y-1">
                            <div className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
                                <Box className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Stock</span>
                            <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {product.stock} <span className="text-[10px] font-normal opacity-70">unid.</span>
                            </span>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-center items-center text-center space-y-1">
                            <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
                                <Tag className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Categoría</span>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate w-full px-1">
                                {product.categories?.name || "General"}
                            </span>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-xl border border-orange-100 dark:border-orange-900/50 flex flex-col justify-center items-center text-center space-y-1">
                            <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-1">
                                <Layers className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Variantes</span>
                            <span className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                {product.product_variants?.length || 0}
                            </span>
                        </div>
                    </div>

                    {/* Descripción con estilo "Papel" */}
                    <Card className="rounded-2xl border-none shadow-sm bg-muted/30">
                        <CardHeader className="py-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                📄 Sobre el Producto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
                                {product.description ? (
                                    <p className="whitespace-pre-line">{product.description}</p>
                                ) : (
                                    <span className="italic opacity-50">El vendedor no ha añadido una descripción todavía.</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabla de Variantes Interactiva */}
                    <VariantsTable variants={product.product_variants} />
                </div>

                {/* Columna Derecha (Media y Extras) - 4 columnas */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Preview de Multimedia */}
                    <Card className="rounded-2xl border shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/10 pb-3 py-3">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Galería Visual
                                <span className="text-[10px] text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                                    {product.product_images?.length} items
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-3">
                            <div className="aspect-[3/4] relative rounded-lg overflow-hidden border bg-zinc-100 dark:bg-zinc-900 shadow-inner group">
                                {mainImage ? (
                                    <>
                                        <Image
                                            src={mainImage.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <Badge className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border-none text-white text-[10px]">Principal</Badge>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sin imagen</div>
                                )}
                            </div>

                            {otherImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {otherImages.slice(0, 4).map((img: any) => (
                                        <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border hover:ring-2 ring-primary/50 transition-all cursor-pointer">
                                            <Image
                                                src={img.image_url}
                                                alt="Thumb"
                                                fill
                                                className="object-cover"
                                                sizes="100px"
                                            />
                                        </div>
                                    ))}
                                    {otherImages.length > 4 && (
                                        <div className="aspect-square rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border">
                                            +{otherImages.length - 4}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="bg-muted/10 border-t p-2">
                            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8">
                                <Link href={`/products/${product.slug}`} target="_blank">
                                    <Globe className="w-3 h-3 mr-2" />
                                    Ver en Tienda
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Detalles Técnicos */}
                    <Card className="rounded-2xl border-none shadow-sm bg-zinc-50 dark:bg-zinc-900/50">
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                                    <Tag className="w-3 h-3" /> Etiquetas
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {product.tags && product.tags.length > 0 ? product.tags.map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 text-[10px]">
                                            #{tag}
                                        </Badge>
                                    )) : (
                                        <span className="text-xs text-muted-foreground">Sin etiquetas.</span>
                                    )}
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            <div>
                                <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Cuidados</h4>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-black/20 p-2.5 rounded-lg border border-border/50">
                                    {product.care_instructions || "No especificado."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Box, Tag, DollarSign, ChevronRight, Share2, Eye, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
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
        <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 lg:px-0 pt-6">
            {/* Breadcrumb / Nav */}
            <nav className="flex items-center gap-2">
                <Link href="/admin/inventory" className="text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">Inventario</Link>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-foreground uppercase tracking-[0.2em] text-[10px] font-bold truncate max-w-[200px]">{product.name}</span>
            </nav>

            {/* Header Moderno */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
                <div className="flex items-start gap-6">
                    <div className="relative h-24 w-24 border border-border/50 bg-secondary/30 flex-shrink-0">
                        {mainImage ? (
                            <Image
                                src={mainImage.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full text-muted-foreground uppercase tracking-widest text-[10px] font-bold">S/I</div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold">Producto ID: #{product.slug}</span>
                            <Badge variant="outline" className={cn("rounded-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]",
                                product.is_active ? "bg-green-500/10 text-green-700 border-green-500/20" : "bg-slate-500/10 text-slate-700 border-slate-500/20"
                            )}>
                                {product.is_active ? '● Publicado' : '○ Borrador'}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-medium tracking-[0.05em] uppercase text-foreground leading-tight">{product.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 rounded-none bg-background hover:bg-secondary text-foreground font-bold uppercase tracking-[0.1em] text-[10px]">
                        <Share2 className="h-3.5 w-3.5 mr-2" />
                        Compartir
                    </Button>
                    <Link href={`/admin/inventory/edit/${product.id}`}>
                        <Button variant="outline" size="sm" className="h-10 rounded-none bg-background hover:bg-secondary text-foreground font-bold uppercase tracking-[0.1em] text-[10px]">
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            Editar
                        </Button>
                    </Link>
                    <Link href={`/products/${product.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="h-10 rounded-none bg-background hover:bg-secondary text-foreground font-bold uppercase tracking-[0.1em] text-[10px]">
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            Ver Tienda
                        </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
            </header>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Columna Izquierda (Detalles y Stats) - 8 columnas */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Tarjetas de Estadísticas Limpias */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background border border-border/50 p-6 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                <DollarSign className="w-3 h-3" /> Precio
                            </span>
                            <div className="space-y-1">
                                <span className="text-2xl font-medium text-foreground tracking-tight">
                                    {formatCurrency(product.price)}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                    <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase">
                                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}% DCTO
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-background border border-border/50 p-6 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                <Box className="w-3 h-3" /> Stock
                            </span>
                            <span className="text-2xl font-medium text-foreground tracking-tight">
                                {product.stock} <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">UNID</span>
                            </span>
                        </div>

                        <div className="bg-background border border-border/50 p-6 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Categoría
                            </span>
                            <span className="text-sm font-bold text-foreground uppercase tracking-widest truncate">
                                {product.categories?.name || "General"}
                            </span>
                        </div>

                        <div className="bg-background border border-border/50 p-6 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                <Layers className="w-3 h-3" /> Variantes
                            </span>
                            <span className="text-2xl font-medium text-foreground tracking-tight">
                                {product.product_variants?.length || 0}
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="border border-border/50 bg-background p-8">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] block mb-6">Detalles del Producto</span>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed text-sm tracking-wide">
                            {product.description ? (
                                <p className="whitespace-pre-line">{product.description}</p>
                            ) : (
                                <span className="italic opacity-50 uppercase text-[10px] tracking-widest font-bold">Sin descripción del producto.</span>
                            )}
                        </div>
                    </div>

                    {/* Tabla de Variantes Interactiva */}
                    <VariantsTable variants={product.product_variants} />
                </div>

                {/* Columna Derecha (Media y Extras) - 4 columnas */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Galería Visual */}
                    <div className="border border-border/50 bg-background p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Galería Visual</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/50 px-2 py-0.5">{product.product_images?.length} Items</span>
                        </div>

                        <div className="aspect-[3/4] relative border border-border/20 group overflow-hidden">
                            {mainImage ? (
                                <>
                                    <Image
                                        src={mainImage.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-black/50 backdrop-blur-md border-none text-white text-[10px] rounded-none uppercase tracking-widest font-bold">Principal</Badge>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Sin imagen</div>
                            )}
                        </div>

                        {otherImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {otherImages.slice(0, 4).map((img: any) => (
                                    <div key={img.id} className="relative aspect-square border border-border/20 hover:border-foreground transition-colors cursor-pointer overflow-hidden">
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
                                    <div className="aspect-square bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/20 uppercase tracking-widest">
                                        +{otherImages.length - 4}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Detalles Técnicos */}
                    <div className="border border-border/50 bg-secondary/10 p-6 space-y-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Etiquetas
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {product.tags && product.tags.length > 0 ? product.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="rounded-none bg-background border border-border/50 text-[10px] uppercase tracking-widest font-bold py-1 px-3">
                                        #{tag}
                                    </Badge>
                                )) : (
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sin etiquetas.</span>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-border/30" />

                        <div>
                            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] mb-4 block">Cuidados</span>
                            <div className="text-[11px] text-foreground bg-background p-4 border border-border/50 leading-relaxed tracking-wide uppercase font-medium">
                                {product.care_instructions || "No especificado."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

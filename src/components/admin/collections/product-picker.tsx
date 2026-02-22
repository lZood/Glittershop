'use client';

import { useState, useEffect } from "react";
import { Search, X, Check, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// Import server action
import { searchProducts } from "@/lib/actions/collections";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    product_images: { image_url: string }[];
    product_variants: { sku: string; stock: number }[];
}

interface ProductPickerProps {
    selectedIds: string[];
    onSelectionChange: (ids: string[], newlySelected?: Product[]) => void;
    onConfirm?: () => void;
}

const FILTER_TAGS = ["Todos", "Anillos", "Novedades", "Diamantes", "Collares", "Aretes"];

import { motion, AnimatePresence } from "framer-motion";

export function ProductPicker({ selectedIds, onSelectionChange, onConfirm }: ProductPickerProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Todos");
    const [selectedProductsCache, setSelectedProductsCache] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsSearching(true);
            try {
                const prods = await searchProducts(query);
                setResults(prods as any);
            } catch (err) {
                console.error("Error fetching products in picker:", err);
            }
            setIsSearching(false);
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const toggleProduct = (product: Product) => {
        const idStr = String(product.id);
        const isSelected = selectedIds.includes(idStr);
        if (isSelected) {
            onSelectionChange(selectedIds.filter(id => id !== idStr));
        } else {
            onSelectionChange([...selectedIds, idStr], [product]);
            if (!selectedProductsCache.find(p => String(p.id) === idStr)) {
                setSelectedProductsCache(prev => [...prev, product]);
            }
        }
    };

    const clearSelection = () => {
        onSelectionChange([]);
    };

    const getProductInfo = (prod: Product) => {
        const variant = prod.product_variants?.[0];
        const price = prod.price || 0;
        const sku = variant?.sku || prod.slug?.toUpperCase() || "N/A";
        const stock = prod.product_variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
        const image = prod.product_images?.[0]?.image_url;
        return { price, sku, stock, image };
    };

    const filteredResults = activeFilter === "Todos"
        ? results
        : results.filter(p => p.name.toLowerCase().includes(activeFilter.toLowerCase().slice(0, -1)));

    return (
        <div className="flex flex-col h-full bg-background transition-colors duration-500">
            {/* Header / Search Area */}
            <div className="bg-background/80 backdrop-blur-md p-6 pb-4 space-y-6 border-b border-border/50 z-20 sticky top-0">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand transition-colors" />
                    <Input
                        placeholder="BUSCAR POR NOMBRE O SKU..."
                        className="pl-12 h-14 rounded-none border-border/50 bg-secondary/5 text-[11px] font-bold uppercase tracking-[0.2em] focus-visible:ring-brand placeholder:text-muted-foreground/30 shadow-inner"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                    {FILTER_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveFilter(tag)}
                            className={cn(
                                "px-5 py-2 rounded-none text-[9px] font-bold uppercase tracking-[0.2em] border transition-all duration-300 whitespace-nowrap",
                                activeFilter === tag
                                    ? "bg-foreground text-background border-foreground shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:bg-white dark:text-black"
                                    : "bg-transparent text-muted-foreground border-border/50 hover:border-brand/40 hover:text-brand"
                            )}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <AnimatePresence mode="popLayout">
                    {isSearching ? (
                        <motion.div
                            key="searching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 space-y-4"
                        >
                            <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground animate-pulse text-center">Consultando Catálogo</span>
                        </motion.div>
                    ) : filteredResults.length === 0 ? (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-24 space-y-4 flex flex-col items-center"
                        >
                            <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-muted-foreground">
                                <X className="w-6 h-6 opacity-20" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em]">Sin Resultados</p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-[0.1em]">Ajusta los términos de búsqueda</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div key="results" className="grid grid-cols-1 gap-4">
                            {filteredResults.map((prod, index) => {
                                const idStr = String(prod.id);
                                const isSelected = selectedIds.includes(idStr);
                                const { price, sku, stock, image } = getProductInfo(prod);

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={prod.id}
                                        onClick={() => toggleProduct(prod)}
                                        className={cn(
                                            "relative bg-secondary/5 p-4 rounded-none border transition-all duration-500 cursor-pointer flex items-center gap-6 group overflow-hidden",
                                            isSelected
                                                ? "border-brand shadow-[0_0_20px_rgba(180,115,49,0.1)]"
                                                : "border-border/50 hover:bg-secondary/10 hover:border-brand/30"
                                        )}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-brand/5 blur-xl -mr-4 -mt-4"></div>
                                        )}

                                        <div className="w-20 h-20 bg-secondary/20 border border-border/20 rounded-none overflow-hidden relative shrink-0">
                                            {image ? (
                                                <Image src={image} alt={prod.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="80px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[8px] font-bold uppercase tracking-tighter">Sin Imagen</div>
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-brand/40 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all duration-500">
                                                    <Check className="w-8 h-8 text-white stroke-[3px]" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-sm font-medium text-foreground tracking-wide uppercase truncate group-hover:text-brand transition-colors">{prod.name}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-r border-border/50 pr-3">SKU: {sku}</span>
                                                    <span className={cn(
                                                        "text-[9px] font-bold uppercase tracking-widest",
                                                        stock > 0 ? "text-emerald-500/80" : "text-rose-500/80"
                                                    )}>
                                                        {stock > 0 ? `DISPONIBLE (${stock})` : 'AGOTADO'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-sm font-bold text-brand tracking-widest">
                                                    ${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </p>
                                                {prod.original_price && prod.original_price > price && (
                                                    <p className="text-[9px] text-muted-foreground line-through decoration-muted-foreground/50 tracking-widest">
                                                        ${prod.original_price.toLocaleString('es-MX')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "w-2 h-2 rounded-none transition-all duration-500",
                                            isSelected ? "bg-brand scale-125 shadow-[0_0_8px_rgba(180,115,49,0.5)]" : "bg-border group-hover:bg-brand/30"
                                        )}></div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>

                <div className="h-32"></div>
            </div>

            {/* Sticky Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 p-8 bg-background/90 backdrop-blur-lg border-t border-border/50 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                    >
                        <div className="max-w-xl mx-auto flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-foreground uppercase tracking-[0.2em]">{selectedIds.length}</span>
                                    <span className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-0.5">Artículos en Selección</span>
                                </div>
                                <button
                                    onClick={clearSelection}
                                    className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-3 h-3" /> Reiniciar
                                </button>
                            </div>
                            {onConfirm && (
                                <Button
                                    className="h-14 rounded-none bg-foreground text-background dark:bg-white dark:text-black hover:bg-brand hover:text-white transition-all font-bold tracking-[0.3em] uppercase text-[10px] shadow-2xl relative group overflow-hidden"
                                    onClick={onConfirm}
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Check className="w-4 h-4 mr-3" />
                                    Confirmar Selección de Catálogo
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

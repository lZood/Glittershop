'use client';

import { useState } from "react";
import { Search, Plus, Filter, AlertTriangle, ArrowUpDown, ChevronDown, ArrowLeft, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryCard } from "./inventory-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as motion from "framer-motion/client";

interface InventoryClientProps {
    products: any[];
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'name-asc';

export function InventoryClient({ products }: InventoryClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todo");
    const [sortOrder, setSortOrder] = useState<SortOption>('newest');

    // Extract unique product categories for the dropdown
    const productCategories = Array.from(new Set(products.map(p => p.categories?.name || "Sin Categoría"))).sort();

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.slug && product.slug.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedCategory === "Todo") return true;
        if (selectedCategory === "Stock Bajo") return product.stock > 0 && product.stock <= 5;
        if (selectedCategory === "Agotado") return product.stock === 0;

        return product.categories?.name === selectedCategory || (selectedCategory === "Sin Categoría" && !product.categories?.name);
    }).sort((a, b) => {
        switch (sortOrder) {
            case 'price-asc':
                return (a.price) - (b.price);
            case 'price-desc':
                return (b.price) - (a.price);
            case 'stock-asc':
                return a.stock - b.stock;
            case 'stock-desc':
                return b.stock - a.stock;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'newest':
            default:
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
    });

    const filterOptions = ["Todo", "Stock Bajo", "Agotado"];

    return (
        <div className="space-y-10 pb-32 max-w-5xl mx-auto px-4 lg:px-8 pt-6 transition-colors duration-500">
            {/* Header - Fixed & Compact */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sticky top-0 bg-background/80 backdrop-blur-xl z-30 py-6 border-b border-border/30 sm:border-none">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 border border-transparent hover:border-border/30 rounded-none transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Layers className="w-3 h-3 text-brand" />
                            <span className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold block">Gestión Digital</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-[0.1em] uppercase text-foreground">Inventario</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-11 gap-2 text-foreground border-border/50 rounded-none bg-card hover:bg-secondary dark:hover:bg-brand/10 uppercase tracking-[0.15em] text-[10px] font-bold shadow-sm transition-all">
                                <ArrowUpDown className="w-4 h-4 text-brand" />
                                <span>Ordenar</span>
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none w-52 font-bold uppercase tracking-widest text-[10px] p-1 bg-card border-border/50 shadow-2xl">
                            <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSortOrder('newest')}>Más recientes</DropdownMenuItem>
                            <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSortOrder('name-asc')}>Nombre (A-Z)</DropdownMenuItem>
                            <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSortOrder('price-asc')}>Precio: Menor a Mayor</DropdownMenuItem>
                            <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSortOrder('price-desc')}>Precio: Mayor a Menor</DropdownMenuItem>
                            <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSortOrder('stock-asc')}>Stock: Menor a Mayor</DropdownMenuItem>
                            <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSortOrder('stock-desc')}>Stock: Mayor a Menor</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/admin/collections" className="hidden sm:block">
                        <Button variant="outline" size="sm" className="h-11 gap-2 text-foreground border-border/50 rounded-none bg-card hover:bg-secondary dark:hover:bg-brand/10 uppercase tracking-[0.15em] text-[10px] font-bold shadow-sm">
                            Colecciones
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Premium Search & Slider Section */}
            <div className="space-y-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 dark:bg-brand/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand transition-colors" />
                    <Input
                        placeholder="Filtrar por nombre, categoría o SKU..."
                        className="pl-12 bg-card border-border/50 rounded-none h-16 focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand placeholder:text-muted-foreground placeholder:tracking-widest placeholder:uppercase placeholder:text-[10px] text-sm uppercase tracking-wider relative z-10 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* SLIDER CONTENIDO: CONTROL TOTAL DE ANCHO PARA MÓVIL */}
                <div className="w-full overflow-hidden relative border-b border-border/30">
                    <style jsx global>{`
                        .hide-scroll::-webkit-scrollbar { display: none; }
                        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>

                    <div className="flex overflow-x-auto hide-scroll flex-nowrap items-center gap-2 py-3 scroll-smooth touch-pan-x">
                        {filterOptions.map((status) => {
                            const isActive = selectedCategory === status;
                            return (
                                <button
                                    key={status}
                                    onClick={() => setSelectedCategory(status)}
                                    className={cn(
                                        "px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all whitespace-nowrap border shrink-0 font-bold",
                                        isActive
                                            ? "bg-brand text-brand-foreground border-brand shadow-md font-bold"
                                            : "bg-card text-muted-foreground border-border/50 hover:border-brand/40"
                                    )}
                                >
                                    {status}
                                </button>
                            );
                        })}

                        <div className="w-[1px] h-6 bg-border/50 shrink-0 mx-1"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={cn(
                                        "px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all whitespace-nowrap border shrink-0 flex items-center gap-2 font-bold",
                                        !filterOptions.includes(selectedCategory)
                                            ? "bg-brand text-brand-foreground border-brand shadow-md"
                                            : "bg-card text-muted-foreground border-border/50 hover:border-brand/40 font-bold"
                                    )}
                                >
                                    {!filterOptions.includes(selectedCategory) ? selectedCategory : "Categorías"}
                                    <ChevronDown className={cn("w-3 h-3 transition-transform", !filterOptions.includes(selectedCategory) && "rotate-180")} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 max-h-[400px] overflow-y-auto rounded-none font-bold uppercase tracking-widest text-[10px] bg-card border-border/50 shadow-2xl p-1">
                                <DropdownMenuItem className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSelectedCategory("Todo")}>Todas las categorías</DropdownMenuItem>
                                {productCategories.map(cat => (
                                    <DropdownMenuItem key={cat} className="p-3 rounded-none focus:bg-brand focus:text-white" onClick={() => setSelectedCategory(cat)}>
                                        {cat}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Indicador visual de scroll (derecha) */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden"></div>
                </div>
            </div>

            {/* Dynamic Results Count */}
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Resultados:</span>
                <Badge variant="outline" className="rounded-none border-brand/30 text-brand bg-brand/5 px-3 py-1 text-[10px] font-bold">
                    {filteredProducts.length} PRODUCTOS
                </Badge>
            </div>

            {/* Enhanced Products Grid/List */}
            <div className="grid grid-cols-1 gap-8">
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 flex flex-col items-center border border-border/50 bg-secondary/10 dark:bg-white/[0.02] shadow-inner"
                    >
                        <div className="w-20 h-20 rounded-none flex items-center justify-center mb-8 text-muted-foreground/30 border border-border/50 rotate-45 transform group-hover:rotate-90 transition-transform duration-1000">
                            <Search className="-rotate-45 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold tracking-[0.2em] text-foreground uppercase mb-3">Sin Resultados</h3>
                        <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase max-w-xs leading-relaxed">No encontramos productos que coincidan con tu búsqueda o filtros actuales.</p>
                        <Button
                            variant="ghost"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("Todo"); }}
                            className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:text-white transition-colors h-12 px-10 rounded-none border border-border/50"
                        >
                            Limpiar Filtros
                        </Button>
                    </motion.div>
                ) : (
                    filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.4 }}
                        >
                            <InventoryCard product={product} />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Premium FAB - Floating Action Button (Elevado para móvil) */}
            <Link href="/admin/inventory/new" className="fixed bottom-24 right-6 sm:bottom-12 sm:right-12 z-50 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-brand shadow-[0_15px_30px_rgba(180,115,49,0.4)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-brand-foreground hover:scale-105 active:scale-90 transition-all cursor-pointer border-2 border-white/20 relative z-10">
                        <Plus className="w-8 h-8 sm:w-10 sm:h-10 group-hover:rotate-180 transition-transform duration-500" strokeWidth={3} />
                    </div>
                </div>
            </Link>
        </div>
    );
}


'use client';

import { useState } from "react";
import { Search, Bell, Plus, Filter, AlertTriangle, ArrowUpDown, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InventoryCard } from "./inventory-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                // Assuming created_at exists, if not fallback to 0 equivalent (no sort change)
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
    });

    return (
        <div className="space-y-6 pb-24 w-full max-w-[100vw] overflow-x-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <Button size="sm" variant="secondary" className="h-8 px-4 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-sm hover:bg-white border border-slate-100">
                            Inventario
                        </Button>
                        <Link href="/admin/collections">
                            <Button size="sm" variant="ghost" className="h-8 px-4 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200">
                                Colecciones
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600 border-slate-200 rounded-xl">
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold hidden sm:inline">Ordenar</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setSortOrder('newest')}>Más recientes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOrder('name-asc')}>Nombre (A-Z)</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOrder('price-asc')}>Precio: Menor a Mayor</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOrder('price-desc')}>Precio: Mayor a Menor</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOrder('stock-asc')}>Stock: Menor a Mayor</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOrder('stock-desc')}>Stock: Mayor a Menor</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </Button>
                </div>
            </header>

            {/* Search */}
            <div className="relative px-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Buscar por nombre o SKU..."
                    className="pl-10 bg-white border-slate-200 rounded-xl h-12 shadow-sm focus-visible:ring-[#b47331]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 px-1 overflow-x-auto pb-2 scrollbar-hide items-center">
                {/* Status Filters */}
                {["Todo", "Stock Bajo", "Agotado"].map((status) => {
                    const isAlert = status === "Stock Bajo" || status === "Agotado";
                    const isActive = selectedCategory === status;

                    return (
                        <button
                            key={status}
                            onClick={() => setSelectedCategory(status)}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                                isActive
                                    ? "bg-[#b47331] text-white border-[#b47331] shadow-md shadow-[#b47331]/20"
                                    : isAlert
                                        ? "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {isAlert && <AlertTriangle className="w-3 h-3" />}
                            {status}
                        </button>
                    );
                })}

                {/* Dynamic Category Chip (if selected and not a status) */}
                {!["Todo", "Stock Bajo", "Agotado"].includes(selectedCategory) && (
                    <button
                        onClick={() => setSelectedCategory(selectedCategory)} // Keep active or toggle?
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 bg-[#b47331] text-white border-[#b47331] shadow-md shadow-[#b47331]/20"
                    >
                        {selectedCategory}
                    </button>
                )}

                {/* Categories Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border transition-colors shrink-0",
                                // Highlight if category selected?
                                !["Todo", "Stock Bajo", "Agotado"].includes(selectedCategory) ? "bg-[#b47331]/10 border-[#b47331] text-[#b47331]" : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-[#b47331] hover:text-white hover:border-[#b47331]"
                            )}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 max-h-60 overflow-y-auto">
                        <DropdownMenuItem disabled className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categorías</DropdownMenuItem>
                        {productCategories.map(cat => (
                            <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)} className="cursor-pointer">
                                {cat}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">RESUMEN</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total: {filteredProducts.length} Items</span>
            </div>

            {/* List */}
            <div className="space-y-3 px-1">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <Filter className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>No se encontraron productos</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <InventoryCard key={product.id} product={product} />
                    ))
                )}
            </div>

            {/* FAB */}
            <Link href="/admin/inventory/new" className="fixed bottom-24 right-5 md:right-8 z-50">
                <div className="w-14 h-14 rounded-full bg-[#b47331] shadow-lg shadow-[#b47331]/40 flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer">
                    <Plus className="w-7 h-7" strokeWidth={3} />
                </div>
            </Link>
        </div>
    );
}

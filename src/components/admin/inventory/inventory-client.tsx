'use client';

import { useState } from "react";
import { Search, Bell, Plus, Filter, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InventoryCard } from "./inventory-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InventoryClientProps {
    products: any[];
}

export function InventoryClient({ products }: InventoryClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todo");

    // Extract unique categories
    const categories = ["Todo", "Stock Bajo", "Agotado", ...Array.from(new Set(products.map(p => p.categories?.name || "Sin Categoría")))];

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.slug && product.slug.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedCategory === "Todo") return true;
        if (selectedCategory === "Stock Bajo") return product.stock > 0 && product.stock <= 5;
        if (selectedCategory === "Agotado") return product.stock === 0;

        return product.categories?.name === selectedCategory || (selectedCategory === "Sin Categoría" && !product.categories?.name);
    });

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Design shows back arrow but we might be at root inventory. Let's keep it simple or add if nested */}
                    {/* <Button variant="ghost" size="icon" className="-ml-2"><ArrowLeft className="w-5 h-5" /></Button> */}
                    <h1 className="text-xl font-bold text-slate-900">Gestión de Inventario</h1>
                </div>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Buscar por nombre o SKU..."
                    className="pl-9 bg-white border-slate-200 rounded-xl h-12 shadow-sm focus-visible:ring-pink-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {categories.map((cat) => {
                    const isAlert = cat === "Stock Bajo" || cat === "Agotado";
                    const isActive = selectedCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                isActive
                                    ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                                    : isAlert
                                        ? "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {isAlert && <AlertTriangle className="w-3 h-3" />}
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">RESUMEN</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total: {filteredProducts.length} Items</span>
            </div>

            {/* List */}
            <div className="space-y-3">
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
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 shadow-lg shadow-pink-300 flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer">
                    <Plus className="w-7 h-7" strokeWidth={3} />
                </div>
            </Link>
        </div>
    );
}

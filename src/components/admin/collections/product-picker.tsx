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

export function ProductPicker({ selectedIds, onSelectionChange, onConfirm }: ProductPickerProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Todos");
    // We maintain a local cache of selected products to display them even if not in current search results
    const [selectedProductsCache, setSelectedProductsCache] = useState<Product[]>([]);

    useEffect(() => {
        // Initial load or search
        const fetchProducts = async () => {
            console.log("Fetching products with query:", query);
            setIsSearching(true);
            try {
                const prods = await searchProducts(query);
                console.log("Products received:", prods);
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
            // Add to cache if new
            if (!selectedProductsCache.find(p => String(p.id) === idStr)) {
                setSelectedProductsCache(prev => [...prev, product]);
            }
        }
    };

    const clearSelection = () => {
        onSelectionChange([]);
    };

    // Helper to get display info
    const getProductInfo = (prod: Product) => {
        const variant = prod.product_variants?.[0];
        const price = prod.price || 0;
        const sku = variant?.sku || prod.slug?.toUpperCase() || "N/A";
        const stock = prod.product_variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
        const image = prod.product_images?.[0]?.image_url;
        return { price, sku, stock, image };
    };

    // Combined list: If there is a query, show results.
    // However, the design implies we might want to see checked items too?
    // For now, standard search behavior.

    // To mimic "Filters", we can just visually toggle them, 
    // real implementation would filter `results`.
    const filteredResults = activeFilter === "Todos"
        ? results
        : results.filter(p => p.name.toLowerCase().includes(activeFilter.toLowerCase().slice(0, -1))); // Basic mock filter

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header / Search Area */}
            <div className="bg-white p-4 pb-2 space-y-4 shadow-sm z-10 sticky top-0">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Buscar por nombre o SKU..."
                        className="pl-12 h-12 rounded-full border-slate-200 bg-slate-50 text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {FILTER_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveFilter(tag)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all",
                                activeFilter === tag
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isSearching ? (
                    <p className="text-center text-slate-400 py-8">Cargando...</p>
                ) : filteredResults.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                        <p className="font-bold text-slate-900">No se encontraron productos</p>
                        <p className="text-sm text-slate-500">Intenta con otro término de búsqueda</p>
                    </div>
                ) : (
                    filteredResults.map(prod => {
                        const idStr = String(prod.id);
                        const isSelected = selectedIds.includes(idStr);
                        const { price, sku, stock, image } = getProductInfo(prod);

                        return (
                            <div
                                key={prod.id}
                                onClick={() => toggleProduct(prod)}
                                className={cn(
                                    "relative bg-white p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 hover:shadow-md",
                                    isSelected
                                        ? "border-[#b47331] shadow-[#b47331]/10"
                                        : "border-transparent shadow-sm hover:border-slate-200"
                                )}
                            >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                                    {image ? (
                                        <Image src={image} alt={prod.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 64px" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No img</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 truncate">{prod.name}</h3>
                                        <Badge variant="secondary" className={cn(
                                            "text-[10px] h-5 px-1.5 rounded-md font-bold",
                                            stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {stock > 0 ? `Stock: ${stock}` : 'Agotado'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono">SKU: {sku}</p>
                                    <p className="text-sm font-bold text-[#b47331]">
                                        ${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                {/* Checkbox */}
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    isSelected
                                        ? "bg-[#b47331] border-[#b47331] text-white"
                                        : "border-slate-300 bg-white"
                                )}>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Spacer for fixed footer */}
                <div className="h-24"></div>
            </div>

            {/* Footer */}
            {selectedIds.length > 0 && (
                <div className="bg-white border-t p-4 pb-6 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="font-bold text-slate-700">{selectedIds.length} productos seleccionados</span>
                        <button onClick={clearSelection} className="font-bold text-[#b47331] hover:text-[#a1662a]">
                            Borrar Selección
                        </button>
                    </div>
                    {onConfirm && (
                        <Button
                            className="w-full bg-[#b47331] hover:bg-[#a1662a] rounded-xl h-12 text-base font-bold shadow-lg shadow-[#b47331]/20 sticky bottom-4 transition-all active:scale-95"
                            onClick={onConfirm}
                        >
                            Confirmar Selección
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

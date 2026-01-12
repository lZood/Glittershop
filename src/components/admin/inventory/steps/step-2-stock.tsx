'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Wand2, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Step2Stock() {
    const [skus, setSkus] = useState([
        { id: 1, variant: 'Oro - Talla 6', sku: 'GLT-ORO-06', stock: 12, color: 'bg-[#D4AF37]' },
        { id: 2, variant: 'Oro - Talla 7', sku: 'GLT-ORO-07', stock: 8, color: 'bg-[#D4AF37]' },
        { id: 3, variant: 'Plata - Talla 6', sku: 'GLT-PLT-06', stock: 0, color: 'bg-slate-300' },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Stock y Variantes</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Configura los colores, tallas y códigos de inventario para este producto.
                </p>
            </div>

            {/* Config Section */}
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <Label className="text-slate-900 font-bold uppercase text-xs tracking-wider">COLORES / ACABADOS</Label>
                        <Button variant="ghost" className="text-[#b47331] text-xs font-bold hover:bg-[#b47331]/10 px-2 h-8">
                            <Plus className="w-3 h-3 mr-1" />
                            Agregar
                        </Button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#b47331] bg-[#b47331]/5 text-slate-900 font-bold text-sm shrink-0">
                            <span className="w-4 h-4 rounded-full bg-[#D4AF37]"></span>
                            Oro
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#b47331] bg-[#b47331]/5 text-slate-900 font-bold text-sm shrink-0">
                            <span className="w-4 h-4 rounded-full bg-[#C69C6D]"></span>
                            Plata
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-500 font-medium text-sm shrink-0 hover:bg-slate-50">
                            <span className="w-4 h-4 rounded-full bg-slate-200"></span>
                            Oro Rosa
                        </button>
                    </div>
                </div>

                <div>
                    <div className="mb-3">
                        <Label className="text-slate-900 font-bold uppercase text-xs tracking-wider">TALLAS DISPONIBLES</Label>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:border-[#b47331] hover:text-[#b47331] transition-colors shrink-0">5</button>
                        <button className="w-12 h-12 rounded-full bg-[#b47331] text-white shadow-lg shadow-[#b47331]/30 flex items-center justify-center font-bold shrink-0">6</button>
                        <button className="w-12 h-12 rounded-full bg-[#b47331] text-white shadow-lg shadow-[#b47331]/30 flex items-center justify-center font-bold shrink-0">7</button>
                        <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:border-[#b47331] hover:text-[#b47331] transition-colors shrink-0">8</button>
                        <button className="h-12 px-6 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:border-[#b47331] hover:text-[#b47331] transition-colors shrink-0">Ajustable</button>
                    </div>
                </div>
            </div>

            {/* Generator */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#b47331]/20 flex items-center justify-center text-[#b47331]">
                        <Wand2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">Generador Inteligente</h3>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">FORMATO DE SKU</Label>
                    <Input value="GLT - {COLOR} - {TALLA}" className="bg-white border-slate-200 rounded-xl h-10 font-mono text-sm" readOnly />
                </div>

                <Button variant="outline" className="w-full h-12 rounded-xl bg-[#faecd6] border-none text-[#b47331] hover:bg-[#b47331] hover:text-white font-bold transition-all transform active:scale-95">
                    Generar Combinaciones
                </Button>
            </div>

            {/* List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">Inventario Actual</h3>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{skus.length}</span>
                </div>

                {skus.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm relative group">
                        <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-1">
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className={cn("w-12 h-12 rounded-full shadow-inner", item.color)}></div>
                            <div>
                                <h4 className="font-bold text-slate-900">{item.variant}</h4>
                                <p className="text-xs text-slate-400">Variante principal</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase">SKU</Label>
                                <Input defaultValue={item.sku} className="h-10 rounded-xl border-slate-200 bg-slate-50/50" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase">STOCK</Label>
                                <Input
                                    defaultValue={item.stock}
                                    className={cn(
                                        "h-10 rounded-xl border-slate-200 text-center font-bold",
                                        item.stock === 0 ? "text-red-500 bg-red-50" : "text-slate-900"
                                    )}
                                />
                            </div>
                        </div>
                        {item.stock === 0 && (
                            <div className="flex items-center gap-1.5 mt-3 text-red-500 text-xs font-bold">
                                <AlertCircle className="w-3 h-3" />
                                <span>Sin Stock</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, Link as LinkIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Step1Info() {
    const [visibility, setVisibility] = useState(true);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Basic Details Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detalles Básicos</h3>

                <div className="space-y-2">
                    <Label className="text-slate-900 font-bold">Nombre del Producto</Label>
                    <div className="relative">
                        <Input
                            placeholder="Ej: Anillo de Diamante Solitario"
                            className="bg-red-50/50 border-red-200 text-red-900 placeholder:text-slate-300 h-12 rounded-xl focus-visible:ring-red-500"
                        />
                        <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-3.5" />
                    </div>
                    <p className="text-red-500 text-xs font-medium">El nombre es obligatorio para continuar.</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-900 font-bold">URL Amigable (Slug)</Label>
                    <div className="relative">
                        <Input
                            placeholder="anillo-diamante-solitario"
                            className="bg-slate-50 border-slate-200 text-slate-500 h-12 rounded-xl pr-10"
                            readOnly
                        />
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-900 font-bold">Categoría</Label>
                    <Select>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                            <SelectValue placeholder="Seleccionar Categoría" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="rings">Anillos</SelectItem>
                            <SelectItem value="necklaces">Collares</SelectItem>
                            <SelectItem value="bracelets">Pulseras</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-900 font-bold">Descripción Premium</Label>
                    <Textarea
                        placeholder="Detalles del material, quilates, inspiración del diseño..."
                        className="min-h-[120px] rounded-xl border-slate-200"
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-900 font-bold">Etiquetas de Marketing</Label>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" className="border-[#b47331] text-[#b47331] bg-[#b47331]/10 hover:bg-[#b47331]/20 hover:text-[#b47331] rounded-lg h-9">
                            Nuevo
                        </Button>
                        <Button variant="outline" className="border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg h-9">
                            Más Vendido
                        </Button>
                        <Button variant="outline" className="border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg h-9">
                            Exclusivo
                        </Button>
                        <Button variant="outline" className="border-slate-200 border-dashed text-slate-400 hover:text-slate-600 rounded-lg h-9 w-9 p-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Precios y Visibilidad</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-900 font-bold">Precio Base</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400 font-medium">$</span>
                            <Input placeholder="0.00" className="pl-7 h-12 rounded-xl border-slate-200" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-900 font-bold">Oferta (Opcional)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400 font-medium">$</span>
                            <Input placeholder="-" className="pl-7 h-12 rounded-xl border-slate-200" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border(slate-200) border rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <Label className="text-slate-900 font-bold text-base">Visible en tienda</Label>
                        <p className="text-slate-400 text-xs mt-0.5">Producto activo para clientes</p>
                    </div>
                    <Switch
                        checked={visibility}
                        onCheckedChange={setVisibility}
                        className={cn(
                            "data-[state=checked]:bg-[#b47331]",
                            "data-[state=unchecked]:bg-slate-200"
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-slate-900 font-bold">Costo de Producción</Label>
                        {/* Eye off icon handled via standard lucide if needed, or just standard text for now */}
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-3.5 text-slate-400 font-medium">$</span>
                        <Input placeholder="0.00" className="pl-7 h-12 rounded-xl border-slate-100 bg-slate-50/50" />
                    </div>
                    <p className="text-[10px] text-slate-400">Este valor es invisible para los clientes.</p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Step3Media() {
    const [activeTab, setActiveTab] = useState('oro');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Galería Visual</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Gestiona las imágenes para cada variante de color.
                </p>
            </div>

            {/* Color Tabs */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Label className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">VARIANTE ACTIVA</Label>
                    <button className="text-[#b47331] text-xs font-bold hover:underline">Editar colores</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('oro')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm shrink-0 transition-all",
                            activeTab === 'oro'
                                ? "border-[#b47331] bg-[#b47331] text-white shadow-md shadow-[#b47331]/20"
                                : "border-slate-200 bg-white text-slate-500 hover:border-[#b47331] hover:text-[#b47331]"
                        )}
                    >
                        <span className={cn("w-3 h-3 rounded-full bg-white", activeTab !== 'oro' && "bg-[#D4AF37]")}></span>
                        Oro
                    </button>
                    <button
                        onClick={() => setActiveTab('plata')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm shrink-0 transition-all",
                            activeTab === 'plata'
                                ? "border-[#b47331] bg-[#b47331] text-white"
                                : "border-slate-200 bg-white text-slate-500 hover:border-[#b47331] hover:text-[#b47331]"
                        )}
                    >
                        <span className="w-3 h-3 rounded-full bg-[#C0C0C0]"></span>
                        Plata
                    </button>
                    <button
                        onClick={() => setActiveTab('rose')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm shrink-0 transition-all",
                            activeTab === 'rose'
                                ? "border-[#b47331] bg-[#b47331] text-white"
                                : "border-slate-200 bg-white text-slate-500 hover:border-[#b47331] hover:text-[#b47331]"
                        )}
                    >
                        <span className="w-3 h-3 rounded-full bg-[#E0BFB8]"></span>
                        Rose Gold
                    </button>
                </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#b47331]/30 bg-[#b47331]/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#b47331]/10 transition-colors">
                <div className="w-16 h-16 bg-[#faecd6] rounded-full flex items-center justify-center text-[#b47331] mb-4">
                    <ImagePlus className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Toca para subir fotos</h3>
                <p className="text-slate-400 text-xs">JPG, PNG. Max 5MB</p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 group">
                    {/* Mock Image */}
                    <div className="w-full h-full bg-white flex items-center justify-center">
                        <div className="w-3/4 h-3/4 border-2 border-[#D4AF37] rounded-full border-t-transparent animate-spin opacity-20 hidden"></div>
                        <img src="https://placehold.co/200x200/png?text=Necklace" className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Product" />
                    </div>
                    <button className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                        <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Principal</span>
                </div>

                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 group">
                    <div className="w-full h-full bg-white flex items-center justify-center">
                        <img src="https://placehold.co/200x200/png?text=Model" className="w-full h-full object-cover" alt="Model" />
                    </div>
                    <button className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                        <X className="w-3 h-3" />
                    </button>
                </div>

                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                    <div className="w-8 h-8 rounded-full border-2 border-[#b47331] border-t-transparent animate-spin"></div>
                </div>
            </div>

            {/* Video Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-bold text-slate-900 text-lg">Video del Producto</h3>
                    <span className="text-slate-400 text-sm">(Opcional)</span>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Video className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">Muestra el brillo en ...</h4>
                        <p className="text-xs text-slate-400">MP4, MOV. Max 50MB</p>
                    </div>
                    <Button variant="secondary" className="bg-[#faecd6] text-[#b47331] font-bold border-none hover:bg-[#b47331]/20">
                        Subir
                    </Button>
                </div>
            </div>
        </div>
    );
}

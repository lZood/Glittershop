'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Video, X, Crop, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImageFramer } from "../image-framer";
import { UseFormReturn } from "react-hook-form";
import { Point, Area } from 'react-easy-crop';

interface Step3MediaProps {
    form: UseFormReturn<any>;
    colors: { name: string; hex: string }[];
    images: Record<string, File[]>;
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>, colorKey: string) => void;
    removeImage: (colorKey: string, index: number) => void;
    previewUrls: Record<string, { url: string; crop?: Point; zoom?: number; pixelCrop?: Area }[]>;
    videoPreview: string | null;
    handleVideoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    framerConfig: { isOpen: boolean; colorKey: string; index: number } | null;
    setFramerConfig: (config: { isOpen: boolean; colorKey: string; index: number } | null) => void;
    handleFramerSave: (crop: Point, zoom: number, pixelCrop: Area) => void;
    NUMERIC_COLOR_MAP: Record<string, string>;
}

export function Step3Media({
    form,
    colors,
    images, handleImageSelect, removeImage, previewUrls,
    videoPreview, handleVideoSelect,
    framerConfig, setFramerConfig, handleFramerSave
}: Step3MediaProps) {

    const [activeTab, setActiveTab] = useState(colors[0]?.name || '');

    // Update active tab when colors change if current active is invalid
    if (activeTab === '' && colors.length > 0) {
        setActiveTab(colors[0].name);
    }

    const currentImages = previewUrls[activeTab] || [];

    const openFramer = (index: number) => {
        setFramerConfig({ isOpen: true, colorKey: activeTab, index });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Multimedia</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Añade fotos de alta calidad y un video para destacar tu producto.
                </p>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Galería de Fotos</h3>
                        <p className="text-[10px] text-slate-400">Sube fotos por variante de color.</p>
                    </div>
                </div>

                {/* Color Tabs */}
                {colors.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {colors.map(color => (
                            <button
                                key={color.name}
                                onClick={() => setActiveTab(color.name)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all",
                                    activeTab === color.name
                                        ? "bg-[#b47331] text-white shadow-lg shadow-[#b47331]/20"
                                        : "bg-white border border-slate-200 text-slate-500 hover:border-[#b47331]/50"
                                )}
                            >
                                <span className="w-2 h-2 rounded-full border border-white/50" style={{ backgroundColor: color.hex }} />
                                {color.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Primero debes añadir colores en el paso anterior.</span>
                    </div>
                )}

                {/* Image Grid */}
                {colors.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Previews */}
                        {currentImages.map((img, idx) => (
                            <div key={idx} className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 animate-in fade-in duration-300">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex flex-col items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => removeImage(activeTab, idx)}
                                        className="bg-white/90 hover:bg-red-500 hover:text-white text-slate-500 p-1.5 rounded-full shadow-sm transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                        onClick={() => openFramer(idx)}
                                        className="bg-white/90 hover:bg-[#b47331] hover:text-white text-slate-500 px-3 py-1.5 rounded-full shadow-sm transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm"
                                    >
                                        <Crop className="w-3 h-3" />
                                        <span>Editar</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Button */}
                        <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2 relative group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#b47331] transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-[#b47331] transition-colors">Añadir Foto</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                onChange={(e) => handleImageSelect(e, activeTab)}
                            />
                        </div>
                    </div>
                )}

                {colors.length > 0 && currentImages.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed text-slate-400">
                        <p className="text-xs">No hay imágenes para esta variante.</p>
                    </div>
                )}
            </div>

            <div className="h-px bg-slate-100" />

            {/* Video Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Video className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Video del Producto</h3>
                        <p className="text-[10px] text-slate-400">Opcional. Máx 50MB.</p>
                    </div>
                </div>

                <div className="relative group">
                    {videoPreview ? (
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-md">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <video src={videoPreview} className="w-full h-full object-cover" controls />
                            <button
                                onClick={() => handleVideoSelect({ target: { files: null } } as any)}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="relative h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2">
                            <Video className="w-8 h-8 text-slate-300" />
                            <span className="text-xs font-bold text-slate-400">Subir Video (MP4)</span>
                            <Input
                                type="file"
                                accept="video/mp4,video/quicktime"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleVideoSelect}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Framer Modal */}
            {framerConfig && framerConfig.isOpen && (
                <ImageFramer
                    isOpen={framerConfig.isOpen}
                    onClose={() => setFramerConfig(null)}
                    imageUrl={previewUrls[framerConfig.colorKey]?.[framerConfig.index]?.url}
                    initialCrop={previewUrls[framerConfig.colorKey]?.[framerConfig.index]?.crop}
                    initialZoom={previewUrls[framerConfig.colorKey]?.[framerConfig.index]?.zoom}
                    onSave={handleFramerSave}
                />
            )}
        </div>
    );
}

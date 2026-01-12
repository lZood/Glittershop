'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sparkles, RotateCcw, Check, X, Grid3X3 } from 'lucide-react';

interface ImageFramerProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    initialCrop?: Point; // Internal editor state (pan)
    initialZoom?: number; // Internal editor state (zoom)
    onSave: (crop: Point, zoom: number, croppedAreaPixels: Area) => void;
    aspectRatio?: number; // Default 3/4
}

export function ImageFramer({
    isOpen,
    onClose,
    imageUrl,
    initialCrop = { x: 0, y: 0 },
    initialZoom = 1,
    onSave,
    aspectRatio = 3 / 4,
}: ImageFramerProps) {
    const [crop, setCrop] = useState<Point>(initialCrop);
    const [zoom, setZoom] = useState(initialZoom);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = () => {
        if (croppedAreaPixels) {
            onSave(crop, zoom, croppedAreaPixels);
        }
        onClose();
    };

    const handleReset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-black border-none select-none">
                <DialogTitle className="sr-only">Editor de Imagen</DialogTitle>
                <div className="relative h-[85vh] flex flex-col">
                    {/* Top Bar */}
                    <div className="absolute top-0 inset-x-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-white font-bold text-sm drop-shadow-md">Editor de Imagen</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full pointer-events-auto">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative bg-neutral-900 border-y border-white/10">
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            style={{
                                containerStyle: { background: '#1c1c1c' },
                                cropAreaStyle: { border: '2px solid white', boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' },
                            }}
                            showGrid={false} // Clean look, we can add a custom toggle if wanted
                        />

                        {/* Custom Grid Overlay (Optional visual) */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            {/* This would be complex to sync with exact crop area visually without strictly querying DOM, 
                     but react-easy-crop has built-in grid if we enable showGrid={true}. 
                     Let's stick to built-in for simplicity and correctness. */}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-6 bg-neutral-950 border-t border-white/10 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-white/40">Zoom / Escala</span>
                                <span className="text-primary italic">{(zoom * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Slider
                                    value={[zoom]}
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    onValueChange={([val]) => setZoom(val)}
                                    className="flex-1"
                                />
                                <button
                                    onClick={handleReset}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    title="Restablecer"
                                >
                                    <RotateCcw className="w-4 h-4 text-white/60" />
                                </button>
                                {/* Optional: Grid Toggle could ensure grid is visible? Default `react-easy-crop` shows grid on drag. */}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1 text-white/50 hover:text-white hover:bg-white/10 h-12 uppercase font-black text-[10px] tracking-widest rounded-xl"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-[2] bg-white text-black hover:bg-white/90 h-12 rounded-xl uppercase font-black text-xs tracking-[0.15em]"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Terminar
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

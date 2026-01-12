'use client';

import { useState } from "react";
import { X, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Step1Info } from "./steps/step-1-info";
import { Step2Stock } from "./steps/step-2-stock";
import { Step3Media } from "./steps/step-3-media";

export function NewProductWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4; // Info, Stock, Media, Publish/Done? Mockups show 3 circles but labels imply 4 steps possibly? Image shows 3 circles: Info, Stock, Fotos. Let's stick to 3 based on image header. Actually images show "Paso 3 de 4" in media?? Wait, Image 1 headers shows "1 INFO 2 STOCK 3 FOTOS". Image 3 header says "Paso 3 de 4" ... ambiguous. Let's stick to 3 visible steps + maybe a review step? Or just 3.
    // Re-reading visual: Image 1: 1 INFO, 2 STOCK, 3 FOTOS.
    // Image 2: PASO 2: STOCK Y VARIANTES.
    // Image 3: Paso 3 de 4. This implies there is a 4th step. Maybe "Review" or "Publish".
    // For now I will implement the 3 known steps and maybe a placeholder 4th.

    // Correction: Let's assume 3 steps are primary configuration. 

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Info />;
            case 2: return <Step2Stock />;
            case 3: return <Step3Media />;
            default: return <Step1Info />;
        }
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="flex flex-col h-screen bg-white md:bg-slate-50 relative">
            {/* Header (Fixed) */}
            <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
                <Link href="/admin/inventory">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </Button>
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Nuevo Producto</h1>
                </div>
                <Button variant="ghost" className="text-[#b47331] font-bold text-sm px-2 hover:bg-[#b47331]/10">
                    GUARDAR
                </Button>
            </header>

            {/* Stepper (Fixed below header) */}
            <div className="bg-white pb-4 pt-2 px-6 flex justify-between items-center relative z-10 border-b border-slate-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                        currentStep >= 1 ? "bg-[#b47331] text-white shadow-lg shadow-[#b47331]/30" : "bg-slate-100 text-slate-300"
                    )}>
                        {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider transition-colors",
                        currentStep >= 1 ? "text-[#b47331]" : "text-slate-300"
                    )}>Info</span>
                </div>

                {/* Connector 1-2 */}
                <div className="flex-1 h-[2px] bg-slate-100 mx-2 relative">
                    <div className={cn("absolute left-0 top-0 h-full bg-[#b47331] transition-all duration-500", currentStep >= 2 ? "w-full" : "w-0")} />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                        currentStep >= 2 ? "bg-[#b47331] text-white shadow-lg shadow-[#b47331]/30" : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                        {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                    </div>
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider transition-colors",
                        currentStep >= 2 ? "text-[#b47331]" : "text-slate-300"
                    )}>Stock</span>
                </div>

                {/* Connector 2-3 */}
                <div className="flex-1 h-[2px] bg-slate-100 mx-2 relative">
                    <div className={cn("absolute left-0 top-0 h-full bg-[#b47331] transition-all duration-500", currentStep >= 3 ? "w-full" : "w-0")} />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                        currentStep >= 3 ? "bg-[#b47331] text-white shadow-lg shadow-[#b47331]/30" : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                        3
                    </div>
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider transition-colors",
                        currentStep >= 3 ? "text-[#b47331]" : "text-slate-300"
                    )}>Fotos</span>
                </div>
            </div>

            {/* Main Content (Scrollable) */}
            <main className="flex-1 overflow-y-auto bg-white p-4 pb-32 md:p-6 md:pb-32">
                <div className="max-w-3xl mx-auto">
                    {renderStep()}
                </div>
            </main>

            {/* Footer Navigation (Fixed) */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20">
                <div className="max-w-3xl mx-auto flex gap-4">
                    {currentStep > 1 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                        >
                            Atrás
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                        className={cn(
                            "flex-1 h-12 rounded-xl bg-[#b47331] hover:bg-[#9a632a] text-white font-bold shadow-lg shadow-[#b47331]/25 transition-transform active:scale-95",
                            currentStep === 1 && "w-full"
                        )}
                    >
                        {currentStep === 3 ? "Publicar Producto" : "Siguiente Paso"}
                        {currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </footer>
        </div>
    );
}

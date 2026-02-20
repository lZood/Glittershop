'use client';

import { Check, ShoppingCart, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutStepperProps {
    currentStep: 'cart' | 'shipping' | 'payment';
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
    const steps = [
        { id: 'cart', label: 'CARRITO', icon: ShoppingCart },
        { id: 'shipping', label: 'ENVÍO', icon: Truck },
        { id: 'payment', label: 'PAGO', icon: CreditCard },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-center gap-4 md:gap-12 relative">
                {/* Connecting Line - Background */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10 hidden" />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 group">

                            {/* Circle */}
                            <div
                                className={cn(
                                    "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isActive
                                        ? "border-primary text-primary bg-background shadow-[0_0_15px_rgba(234,88,12,0.3)] scale-110"
                                        : isCompleted
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground/30 text-muted-foreground bg-background"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-6 h-6 md:w-8 md:h-8" />
                                ) : (
                                    <step.icon className={cn("w-5 h-5 md:w-7 md:h-7", isActive && "stroke-[2.5px]")} />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-xs md:text-sm font-bold tracking-widest uppercase transition-colors duration-300",
                                    isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

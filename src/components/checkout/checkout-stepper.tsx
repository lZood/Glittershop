'use client';

import { Check, ShoppingCart, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CheckoutStepperProps {
    currentStep: 'cart' | 'shipping' | 'payment' | 'confirmation';
}

const steps = [
    { id: 'cart', label: 'Carrito', icon: ShoppingCart },
    { id: 'shipping', label: 'Envío', icon: Truck },
    { id: 'payment', label: 'Pago', icon: CreditCard },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
    let currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentStep === 'confirmation') {
        currentStepIndex = steps.length;
    }

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12 px-4">
            <div className="relative flex justify-between items-center">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary/30 -translate-y-1/2 rounded-full -z-10" />

                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full -z-10"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 relative group">
                            <motion.div
                                className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-background",
                                    isActive ? "border-primary text-primary shadow-[0_0_15px_rgba(184,115,51,0.3)]" :
                                        isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                            "border-muted-foreground/30 text-muted-foreground"
                                )}
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5 md:w-6 md:h-6" />
                                ) : (
                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                )}
                            </motion.div>

                            <span
                                className={cn(
                                    "text-xs md:text-sm font-bold uppercase tracking-wider absolute -bottom-6 md:-bottom-8 whitespace-nowrap transition-colors duration-300",
                                    isActive ? "text-primary" :
                                        isCompleted ? "text-foreground" :
                                            "text-muted-foreground"
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

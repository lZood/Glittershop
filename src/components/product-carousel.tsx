'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

type ProductCarouselProps = {
    title: string;
    products: Product[];
    className?: string;
};

export function ProductCarousel({ title, products, className }: ProductCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        skipSnaps: false,
        dragFree: true
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (!products.length) return null;

    return (
        <div className={cn("py-8", className)}>
            <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{title}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8 md:h-10 md:w-10 border-muted-foreground/20 hover:bg-secondary hover:text-foreground"
                        onClick={scrollPrev}
                    >
                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="sr-only">Previous slide</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8 md:h-10 md:w-10 border-muted-foreground/20 hover:bg-secondary hover:text-foreground"
                        onClick={scrollNext}
                    >
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="sr-only">Next slide</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0 pl-4"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

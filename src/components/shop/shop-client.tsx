'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListFilter, Plus, Minus } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type FilterButtonsProps = {
    sortOption: string;
    setSortOption: (value: string) => void;
    isSortMenuOpen: boolean;
    setIsSortMenuOpen: (isOpen: boolean) => void;
};

const FilterButtons = ({ sortOption, setSortOption, isSortMenuOpen, setIsSortMenuOpen }: FilterButtonsProps) => (
    <div className="border-t border-b grid grid-cols-2 divide-x bg-transparent">
        <DropdownMenu open={isSortMenuOpen} onOpenChange={setIsSortMenuOpen}>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none w-full hover:bg-slate-50 transition-colors">
                    <span>CLASIFICAR POR</span>
                    {isSortMenuOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuRadioGroup
                    className="p-2"
                    value={sortOption}
                    onValueChange={setSortOption}>
                    <DropdownMenuRadioItem value="recomendado">Recomendado</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="reciente">Más reciente</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="precio-bajo">El precio más bajo</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="precio-alto">El precio más alto</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none hover:bg-slate-50 transition-colors">
                    <span>FILTRO</span>
                    <ListFilter className="w-4 h-4" />
                </button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Filtrar Productos</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Categoría</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-anillos-page" />
                                <Label htmlFor="cat-anillos-page">Anillos</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-collares-page" />
                                <Label htmlFor="cat-collares-page">Collares</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-pulseras-page" />
                                <Label htmlFor="cat-pulseras-page">Pulseras</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-aretes-page" />
                                <Label htmlFor="cat-aretes-page">Aretes</Label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Precio</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-1-page" />
                                <Label htmlFor="price-1-page">Menos de $1000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-2-page" />
                                <Label htmlFor="price-2-page">$1000 - $2000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-3-page" />
                                <Label htmlFor="price-3-page">Más de $2000</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetClose asChild>
                    <Button className="w-full bg-[#B87333] hover:bg-[#a0632a]">Aplicar Filtros</Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    </div>
);

interface ShopClientProps {
    initialProducts: Product[];
}

export function ShopClient({ initialProducts }: ShopClientProps) {
    const [activeTag, setActiveTag] = useState('Ver Todo');
    const [sortOption, setSortOption] = useState('recomendado');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

    const [isSticky, setIsSticky] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const stickyRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    const PRODUCTS_PER_PAGE = 32;
    const [visibleProductsCount, setVisibleProductsCount] = useState(PRODUCTS_PER_PAGE);

    // Client-side filtering logic could go here
    const [filteredProducts, setFilteredProducts] = useState(initialProducts);

    useEffect(() => {
        let result = [...initialProducts];

        // Filter by Tag
        if (activeTag !== 'Ver Todo') {
            if (activeTag === 'Los Más Vendidos') {
                // Implement logic if you have 'sales' data, otherwise maybe filter by rating?
                // For now, let's just shuffle or do nothing, or filter by a specific tag
            } else {
                result = result.filter(p => p.category === activeTag);
            }
        }

        // Sort
        if (sortOption === 'precio-bajo') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'precio-alto') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'reciente') {
            // Assuming ID or new field if available, for now reverse
            // result.reverse(); 
        }

        setFilteredProducts(result);
    }, [activeTag, sortOption, initialProducts]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const stickyElement = stickyRef.current;

            if (!stickyElement) return;

            const stickyOffsetTop = stickyElement.offsetTop;

            // Toggle sticky state
            if (currentScrollY > stickyOffsetTop - 64) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

            // Toggle visibility
            if (isSticky) {
                if (currentScrollY > lastScrollY.current) {
                    setIsHeaderVisible(false);
                } else {
                    setIsHeaderVisible(true);
                }
            } else {
                setIsHeaderVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isSticky]);

    const tags = ['Ver Todo', 'Los Más Vendidos', 'Anillos', 'Collares', 'Pulseras'];
    const visibleProducts = filteredProducts.slice(0, visibleProductsCount);

    return (
        <div className="bg-background min-h-screen">
            <section className="container mx-auto px-4 md:px-10 py-8">
                <h1 className="text-4xl font-bold text-left mb-6 uppercase tracking-widest text-[#B87333]">Ver Todo</h1>

                <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 -mx-4 px-4 scrollbar-hide">
                    {tags.map(tag => (
                        <Button
                            key={tag}
                            variant={activeTag === tag ? 'default' : 'outline'}
                            className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeTag === tag ? 'bg-[#B87333] text-white hover:bg-[#a0632a]' : 'bg-transparent text-foreground border-border hover:bg-slate-50'}`}
                            onClick={() => setActiveTag(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>

                <div ref={stickyRef} className={cn('mb-8', isSticky ? 'h-[53px]' : '')}>
                    <div
                        className={cn(
                            'w-full z-30 transition-transform duration-300',
                            isSticky ? 'fixed top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'relative bg-background',
                            !isHeaderVisible && isSticky && '-translate-y-full'
                        )}
                    >
                        <FilterButtons
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            isSortMenuOpen={isSortMenuOpen}
                            setIsSortMenuOpen={setIsSortMenuOpen}
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                    {visibleProducts.length > 0 ? visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    )) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
                            <p className="text-lg">No encontramos productos con estos filtros.</p>
                            <Button variant="link" onClick={() => { setActiveTag('Ver Todo'); }}>Ver todos los productos</Button>
                        </div>
                    )}
                </div>

                {/* Load More Section */}
                {filteredProducts.length > visibleProductsCount && (
                    <div className="text-center mt-16">
                        <p className="text-muted-foreground mb-4 text-xs tracking-widest uppercase">
                            Mostrando {visibleProductsCount} de {filteredProducts.length} productos
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-full border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-white uppercase tracking-wider h-12 px-8 transition-all duration-300"
                            onClick={() => setVisibleProductsCount(prev => prev + PRODUCTS_PER_PAGE)}
                        >
                            Cargar más
                        </Button>
                    </div>
                )}

            </section>
        </div>
    );
}

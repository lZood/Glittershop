'use client';

import { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchOverlay({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);
    const [totalResults, setTotalResults] = useState(0);
    const debouncedQuery = useDebounce(query, 300);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentQuery = searchParams.get('q') || '';

    // Mock suggestions based on query
    const getSuggestions = (q: string) => {
        if (!q) return [];
        const terms = ['Aretes', 'Anillos', 'Collares', 'Pulseras', 'Oro', 'Plata', 'Diamante'];
        return terms.filter(t => t.toLowerCase().includes(q.toLowerCase())).map(t => `${t} de lujo`);
    };

    const suggestions = getSuggestions(debouncedQuery);

    // Smart clearing/preservation of query
    useEffect(() => {
        if (isOpen) {
            if (currentQuery) {
                setQuery(currentQuery);
            } else {
                setQuery('');
            }
        }
    }, [isOpen, currentQuery]);

    useEffect(() => {
        if (debouncedQuery.trim() === '') {
            setResults([]);
            setTotalResults(0);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        setTotalResults(filtered.length);
        setResults(filtered.slice(0, 4)); // Take top 4 for the slider/grid

    }, [debouncedQuery]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/?q=${encodeURIComponent(query)}`);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setTotalResults(0);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Search">
                    <Search className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="top"
                overlayClassName="bg-transparent top-16 z-30"
                className="h-auto min-h-[400px] w-full border-b-0 p-0 [&>button]:hidden top-16 shadow-none z-40 overflow-hidden"
            >
                {/* Isolated Glass Background Layer */}
                <div
                    className="absolute inset-0 z-[-1] backdrop-blur-[25px] backdrop-saturate-[210%] backdrop-brightness-[1.25] bg-white/[0.05] border-b border-white/10"
                    style={{ isolation: 'isolate' }}
                />

                <div className="container mx-auto max-w-7xl px-4 md:px-8 py-6 relative" style={{ isolation: 'isolate' }}>
                    {/* Custom Header Row */}
                    <div className="flex items-center justify-between mb-8 pt-4">
                        <span className="text-sm font-semibold tracking-widest text-foreground uppercase">Buscar</span>
                        <SheetClose className="p-2 hover:bg-secondary/50 rounded-full transition-colors">
                            <X className="h-6 w-6 text-foreground hover:text-muted-foreground" />
                            <span className="sr-only">Cerrar</span>
                        </SheetClose>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center justify-between mb-8 md:mb-12 relative">
                        <div className="flex-1 max-w-4xl mx-auto relative">
                            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-muted-foreground/20 focus-within:border-primary transition-colors">
                                <Search className="h-6 w-6 text-foreground mr-4" />
                                <Input
                                    placeholder="Escribe para buscar..."
                                    className="flex-1 text-2xl md:text-3xl font-light border-0 bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 text-foreground"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-4"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="max-w-7xl mx-auto">
                        {query ? (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">

                                {/* Desktop: Left Column (Suggestions) */}
                                <div className="hidden md:block md:col-span-3 space-y-6 border-r border-border/40 pr-6">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Sugerencias</h3>
                                    <ul className="space-y-3">
                                        {suggestions.length > 0 ? suggestions.map((s, i) => (
                                            <li key={i}>
                                                <button
                                                    onClick={() => setQuery(s)}
                                                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                                                >
                                                    <Search className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                                                    <span className="text-lg text-foreground">{s}</span>
                                                </button>
                                            </li>
                                        )) : (
                                            <li className="text-muted-foreground/50 italic">No hay sugerencias</li>
                                        )}
                                        <li className="pt-4">
                                            <button
                                                onClick={() => setQuery(query)}
                                                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                                            >
                                                <Search className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                                                <span className="text-lg text-foreground">Buscar "{query}"</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Right Column (Results) - Desktop Grid / Mobile Slider */}
                                <div className="md:col-span-9">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                        {results.length > 0 ? 'Más Populares' : 'Resultados'}
                                    </h3>

                                    {results.length > 0 ? (
                                        <div className="
                                    flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory 
                                    md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0
                                    scrollbar-hide
                                ">
                                            {results.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="
                                                group flex flex-col gap-3 
                                                min-w-[130px] w-[35vw] md:w-auto md:min-w-0 
                                                snap-start
                                            "
                                                >
                                                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary/30">
                                                        {product.image && (
                                                            <Image
                                                                src={product.image.imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                                                        <p className="text-xs text-muted-foreground">${product.price}</p>
                                                    </div>
                                                </Link>
                                            ))}

                                            {/* View More Card (5th slot in slider / Grid) */}
                                            {totalResults > 4 && (
                                                <button
                                                    onClick={() => handleSearchSubmit()}
                                                    className="
                                                group flex flex-col gap-3 h-full text-left
                                                min-w-[130px] w-[35vw] md:w-auto md:min-w-0 
                                                snap-start
                                            "
                                                >
                                                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary/30 border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                            <ArrowRight className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Ver {totalResults - 4} más</span>
                                                    </div>
                                                    <div className="text-center opacity-0">
                                                        <h4 className="font-medium text-base">Placeholder</h4>
                                                        <p className="text-muted-foreground">$0</p>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <p className="text-lg font-light">No encontramos resultados para "{query}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Empty State / Initial View */
                            <div className="py-8 md:py-12">
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Tendencias</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Anillos de Compromiso', 'Collares de Oro', 'Aretes de Perla', 'Colección Luz de Luna'].map((term) => (
                                        <Button
                                            key={term}
                                            variant="outline"
                                            className="rounded-full px-6 border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors"
                                            onClick={() => setQuery(term)}
                                        >
                                            {term}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

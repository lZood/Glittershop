'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data Structure - Preserved exactly as requested
const menuData = [
    {
        id: 'novedades',
        label: 'Novedades',
        columns: [
            {
                title: 'Lo Nuevo',
                items: [
                    { label: 'Recién Llegados', href: '/shop?sort=newest' },
                    { label: 'Edición Limitada', href: '/shop?tag=limited' },
                    { label: 'Más Vendidos', href: '/shop?sort=bestsellers' },
                ]
            },
            {
                title: 'Tendencias',
                items: [
                    { label: 'Minimalista', href: '/shop?style=minimalist' },
                    { label: 'Statement Pieces', href: '/shop?style=statement' },
                    { label: 'Layering', href: '/shop?style=layering' },
                ]
            }
        ],
        image: {
            src: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop',
            alt: 'Novedades',
            caption: 'Descubre lo último'
        }
    },
    {
        id: 'colecciones',
        label: 'Colecciones',
        columns: [
            {
                title: 'Destacadas',
                items: [
                    { label: 'Luz de Luna', href: '/collections/luz-de-luna' },
                    { label: 'Verano Mediterráneo', href: '/collections/verano-mediterraneo' },
                    { label: 'Elegancia Eterna', href: '/collections/eternal' },
                ]
            },
            {
                title: 'Colaboraciones',
                items: [
                    { label: 'Glitter x Artist', href: '/collections/collabs' },
                    { label: 'Disney x Glitter', href: '/collections/disney' },
                ]
            }
        ],
        image: {
            src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
            alt: 'Colecciones',
            caption: 'Historias que brillan'
        }
    },
    {
        id: 'bracelets',
        label: 'Brazaletes',
        columns: [
            {
                title: 'Estilo',
                items: [
                    { label: 'Todos los brazaletes', href: '/shop?category=bracelets' },
                    { label: 'Cadena de serpiente', href: '/shop?style=snake-chain' },
                    { label: 'Rígidos', href: '/shop?style=bangle' },
                    { label: 'Cuero', href: '/shop?style=leather' },
                    { label: 'Eslabones', href: '/shop?style=link' },
                ]
            },
            {
                title: 'Colección',
                items: [
                    { label: 'Glitter Moments', href: '/collections/moments' },
                    { label: 'Glitter ME', href: '/collections/me' },
                    { label: 'Glitter Reflexions', href: '/collections/reflexions' },
                ]
            },
            {
                title: 'Metal',
                items: [
                    { label: 'Plata', href: '/shop?metal=silver' },
                    { label: 'Oro', href: '/shop?metal=gold' },
                    { label: 'Oro Rosa', href: '/shop?metal=rose-gold' },
                ]
            }
        ],
        image: {
            src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
            alt: 'Brazaletes',
            caption: 'Descubre tu estilo'
        }
    },
    {
        id: 'rings',
        label: 'Anillos',
        columns: [
            {
                title: 'Categoría',
                items: [
                    { label: 'Todos los anillos', href: '/shop?category=rings' },
                    { label: 'De compromiso', href: '/shop?category=engagement' },
                    { label: 'Apilables', href: '/shop?category=stackable' },
                    { label: 'Con piedras', href: '/shop?category=stones' },
                ]
            },
            {
                title: 'Metal',
                items: [
                    { label: 'Plata', href: '/shop?metal=silver' },
                    { label: 'Oro', href: '/shop?metal=gold' },
                    { label: 'Oro Rosa', href: '/shop?metal=rose-gold' },
                ]
            }
        ],
        image: {
            src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop',
            alt: 'Anillos',
            caption: 'Promesas eternas'
        }
    },
    {
        id: 'earrings',
        label: 'Aretes',
        columns: [
            {
                title: 'Estilo',
                items: [
                    { label: 'Todos los aretes', href: '/shop?category=earrings' },
                    { label: 'Broqueles', href: '/shop?style=studs' },
                    { label: 'Aros', href: '/shop?style=hoops' },
                    { label: 'Colgantes', href: '/shop?style=drops' },
                ]
            }
        ],
        image: {
            src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop',
            alt: 'Aretes',
            caption: 'Brilla con luz propia'
        }
    },
    {
        id: 'necklaces',
        label: 'Collares',
        columns: [
            {
                title: 'Estilo',
                items: [
                    { label: 'Todos los collares', href: '/shop?category=necklaces' },
                    { label: 'Con dije', href: '/shop?style=pendant' },
                    { label: 'Cadenas', href: '/shop?style=chain' },
                ]
            }
        ],
        image: {
            src: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop',
            alt: 'Collares',
            caption: 'Elegancia atemporal'
        }
    }
];

export default function MegaMenu() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveId(id);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveId(null);
        }, 100);
    };

    return (
        <nav className="hidden md:flex items-center justify-center flex-1 px-4" onMouseLeave={handleMouseLeave}>
            <ul className="flex items-center justify-center gap-8 h-full w-full max-w-4xl mx-auto">
                {menuData.map((item) => (
                    <li
                        key={item.id}
                        className="h-full flex items-center"
                        onMouseEnter={() => handleMouseEnter(item.id)}
                    >
                        <Link
                            href={`/shop?category=${item.id}`}
                            className={cn(
                                "text-sm font-bold transition-colors uppercase tracking-wide py-2 border-b-2 border-transparent",
                                activeId === item.id
                                    ? "text-primary border-primary"
                                    : "text-foreground hover:text-primary"
                            )}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Mega Menu Panel */}
            {menuData.map((item) => (
                <div
                    key={item.id}
                    className={cn(
                        "fixed left-0 top-16 w-full border-b transition-all duration-300 ease-in-out z-30",
                        // EXACT same blur classes as Header and Wishlist Sub-header
                        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                        activeId === item.id
                            ? "opacity-100 visible"
                            : "opacity-0 invisible pointer-events-none"
                    )}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="container mx-auto px-8 py-12">
                        <div className="grid grid-cols-12 gap-8">

                            {/* Title Column */}
                            <div className={cn(
                                "col-span-2 border-r border-border/50 pr-8",
                                activeId === item.id && "animate-in fade-in slide-in-from-top-4 duration-500 delay-75 fill-mode-both"
                            )}>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-foreground">{item.label}</h2>
                                <Link
                                    href={`/shop?category=${item.id}`}
                                    className="inline-flex items-center text-sm font-bold text-primary hover:underline"
                                >
                                    Ver todo
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>

                            {/* Links Columns */}
                            <div className={cn(
                                "col-span-7 grid grid-cols-4 gap-8",
                                activeId === item.id && "animate-in fade-in slide-in-from-top-4 duration-500 delay-150 fill-mode-both"
                            )}>
                                {item.columns.map((col, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{col.title}</h3>
                                        <ul className="space-y-2">
                                            {col.items.map((link, linkIdx) => (
                                                <li key={linkIdx}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-sm text-foreground/80 hover:text-primary transition-colors block py-0.5 font-medium"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Image Column */}
                            <div className={cn(
                                "col-span-3 pl-8 border-l border-border/50",
                                activeId === item.id && "animate-in fade-in slide-in-from-top-4 duration-500 delay-200 fill-mode-both"
                            )}>
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg group cursor-pointer">
                                    <Image
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                        <p className="text-white font-bold text-lg leading-tight">{item.image.caption}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </nav>
    );
}

'use client';

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    ArrowLeft,
    MoreHorizontal,
    Trash2,
    Edit3,
    ExternalLink,
    Loader2,
<<<<<<< HEAD
    AlertCircle,
    ArrowUpDown,
    ChevronDown,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
=======
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
>>>>>>> d6ebb696ba508c157f322a677b719639c2c7a394
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCollection } from "@/lib/actions/collections";
import { toast } from "@/hooks/use-toast";
import * as motion from "framer-motion/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ClientCollectionsListProps {
    initialCollections: any[];
}

export function ClientCollectionsList({ initialCollections }: ClientCollectionsListProps) {
    const router = useRouter();
    const [collections, setCollections] = useState(initialCollections);
    const [isDeleting, setIsDeleting] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState<any>(null);
<<<<<<< HEAD
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<'newest' | 'name-asc' | 'name-desc'>('newest');
    const [isVisible, setIsVisible] = useState(true);

    // Track scroll for FAB visibility
    useState(() => {
        if (typeof window === 'undefined') return;
        let lastScrollValue = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollValue && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollValue = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
=======
>>>>>>> d6ebb696ba508c157f322a677b719639c2c7a394

    const handleDelete = async () => {
        if (!collectionToDelete) return;

        setIsDeleting(true);
        try {
            const res = await deleteCollection(collectionToDelete.id);
            if (res.success) {
                toast({ title: "Éxito", description: "Colección eliminada correctamente" });
                setCollections(prev => prev.filter(c => c.id !== collectionToDelete.id));
            } else {
                toast({ title: "Error", description: res.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Ocurrió un error inesperado", variant: "destructive" });
        } finally {
            setIsDeleting(false);
            setCollectionToDelete(null);
        }
    };

    return (
        <div className="space-y-8 pb-32 max-w-5xl mx-auto px-4 lg:px-8 pt-6">
            {/* Header */}
<<<<<<< HEAD
            <div className="pt-24 sm:pt-12 mb-12">
                <h1 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase text-foreground">Colecciones</h1>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative group flex-1">
                        <div className="absolute inset-0 bg-brand/5 dark:bg-brand/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand transition-colors" />
                        <Input
                            placeholder="Buscar colecciones..."
                            className="pl-12 bg-card border-border/50 rounded-none h-16 focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand placeholder:text-muted-foreground placeholder:tracking-widest placeholder:uppercase placeholder:text-[10px] text-sm uppercase tracking-wider relative z-10 shadow-sm"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-11 gap-2 text-foreground border-border/50 rounded-none bg-card hover:bg-secondary uppercase tracking-[0.15em] text-[10px] font-bold shadow-sm">
                                    <ArrowUpDown className="w-4 h-4 text-brand" />
                                    <span>Ordenar</span>
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-none w-52 font-bold uppercase tracking-widest text-[10px] p-1 bg-card">
                                <DropdownMenuItem className="p-3 focus:bg-brand focus:text-white" onClick={() => setSortOrder('newest')}>Más recientes</DropdownMenuItem>
                                <DropdownMenuItem className="p-3 focus:bg-brand focus:text-white" onClick={() => setSortOrder('name-asc')}>Nombre (A-Z)</DropdownMenuItem>
                                <DropdownMenuItem className="p-3 focus:bg-brand focus:text-white" onClick={() => setSortOrder('name-desc')}>Nombre (Z-A)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCollections.map((collection, idx) => (
=======
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sticky top-0 bg-background/80 backdrop-blur-xl z-30 py-6 border-b border-border/30 sm:border-none">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-secondary border border-transparent hover:border-border/30 rounded-none transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-3 w-3 bg-brand rounded-full animate-pulse opacity-50"></div>
                            <span className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold block">Gestión de Catálogo</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-[0.1em] uppercase text-foreground">Colecciones</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/inventory">
                        <Button variant="outline" size="sm" className="h-11 gap-2 text-foreground border-border/50 rounded-none bg-card hover:bg-secondary uppercase tracking-[0.15em] text-[10px] font-bold shadow-sm transition-all">
                            Inventario
                        </Button>
                    </Link>
                    <Link href="/admin/collections/new">
                        <Button size="sm" className="h-11 gap-2 bg-foreground text-background border-border rounded-none hover:bg-foreground/90 uppercase tracking-[0.15em] text-[10px] font-bold shadow-lg transition-all">
                            <Plus className="w-4 h-4" />
                            <span>Nueva Colección</span>
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {collections.map((collection, idx) => (
>>>>>>> d6ebb696ba508c157f322a677b719639c2c7a394
                    <motion.div
                        key={collection.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative"
                    >
                        <div className="border border-border/50 bg-card p-6 space-y-6 hover:border-brand/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden h-full flex flex-col">
                            {/* Accent Glow */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="aspect-[16/9] bg-secondary/30 border border-border/20 relative overflow-hidden shrink-0">
                                {collection.image_url ? (
                                    <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold">Sin imagen de portada</div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <Badge variant="outline" className={cn(
                                        "rounded-none px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border shadow-sm",
                                        collection.is_active
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    )}>
                                        {collection.is_active ? 'Publicada' : 'Borrador'}
                                    </Badge>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-none bg-background/80 backdrop-blur-md border border-border/50 hover:bg-brand hover:text-white transition-all shadow-lg active:scale-95">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none font-bold uppercase tracking-widest text-[10px] bg-card border-border/50 shadow-2xl p-1 w-52">
                                            <DropdownMenuItem asChild className="p-3 focus:bg-brand focus:text-white cursor-pointer">
                                                <Link href={`/admin/collections/${collection.id}`} className="flex items-center">
                                                    <Edit3 className="w-3.5 h-3.5 mr-2" /> Editar Detalles
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="p-3 focus:bg-brand focus:text-white cursor-pointer">
                                                <Link href={`/collections/${collection.slug}`} target="_blank" className="flex items-center">
                                                    <ExternalLink className="w-3.5 h-3.5 mr-2" /> Vista Previa
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-border/30" />
                                            <DropdownMenuItem
                                                className="p-3 text-red-600 focus:bg-red-500 focus:text-white cursor-pointer"
                                                onClick={() => setCollectionToDelete(collection)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar Colección
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between pt-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[1px] w-4 bg-brand/50"></div>
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground block">/{collection.slug}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground tracking-tight uppercase group-hover:text-brand transition-colors duration-300">{collection.name}</h3>
                                    {collection.description && (
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 uppercase tracking-wide leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                            {collection.description}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-6">
                                    <Link href={`/admin/collections/${collection.id}`} className="block">
                                        <Button variant="outline" className="w-full rounded-none border-border/50 uppercase tracking-[0.2em] text-[10px] font-bold h-12 group-hover:bg-foreground group-hover:text-background transition-all duration-500 shadow-sm">
                                            Configurar Colección
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {collections.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-32 text-center flex flex-col items-center border border-dashed border-border/50 bg-secondary/5"
                    >
                        <div className="w-16 h-16 bg-secondary/50 flex items-center justify-center border border-border/30 mb-6 group">
                            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-brand group-hover:rotate-90 transition-all duration-500" />
                        </div>
                        <h3 className="text-xl font-bold tracking-[0.1em] text-foreground uppercase mb-3">Sin Colecciones Activas</h3>
                        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase max-w-xs leading-relaxed mb-8 opacity-60">Empieza creando una nueva para organizar nítidamente tus productos y mejorar la navegación de tus clientes.</p>
                        <Link href="/admin/collections/new">
                            <Button className="rounded-none uppercase tracking-[0.2em] text-[10px] bg-foreground text-background h-12 px-8 shadow-xl hover:shadow-brand/20 transition-all">Crear Primera Colección</Button>
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!collectionToDelete} onOpenChange={(open) => !open && setCollectionToDelete(null)}>
                <AlertDialogContent className="rounded-none bg-card border-border/50 shadow-2xl max-w-md">
                    <AlertDialogHeader>
                        <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="uppercase tracking-[0.1em] font-bold text-xl">¿Confirmar Eliminación?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[11px] uppercase tracking-wider leading-relaxed py-4 opacity-70">
                            Estás a punto de borrar la colección <span className="text-foreground font-bold underline">"{collectionToDelete?.name}"</span>. Esta acción eliminará permanentemente la colección y sus relaciones, pero <span className="italic">no borrará los productos</span> asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-none uppercase text-[10px] font-bold tracking-widest h-12 border-border/50 flex-1">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-none uppercase text-[10px] font-bold tracking-widest h-12 flex-1 shadow-lg shadow-red-500/20"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                    Eliminando...
                                </>
                            ) : "Confirmar Eliminación"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Loading Overlay Global */}
            {isDeleting && (
                <div className="fixed inset-0 z-[100] bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-foreground animate-pulse">Sincronizando Base de Datos</span>
                    </div>
                </div>
            )}
<<<<<<< HEAD
            {/* Premium FABs */}
            <div className="fixed bottom-24 right-6 sm:bottom-12 sm:right-12 z-50 flex flex-col gap-4 items-end">
                {/* Mobile Floating Sort Button */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
                    className="md:hidden"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="w-12 h-12 rounded-none bg-background shadow-xl border-brand/30 text-brand">
                                <ArrowUpDown className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none w-52 font-bold uppercase tracking-widest text-[10px] p-1 bg-card mb-2">
                            <DropdownMenuItem className="p-3" onClick={() => setSortOrder('newest')}>Más recientes</DropdownMenuItem>
                            <DropdownMenuItem className="p-3" onClick={() => setSortOrder('name-asc')}>Nombre (A-Z)</DropdownMenuItem>
                            <DropdownMenuItem className="p-3" onClick={() => setSortOrder('name-desc')}>Nombre (Z-A)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </motion.div>

                <Link href="/admin/collections/new" className="group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-brand shadow-[0_15px_30px_rgba(180,115,49,0.4)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-brand-foreground hover:scale-105 active:scale-90 transition-all cursor-pointer border-2 border-white/20 relative z-10">
                            <Plus className="w-8 h-8 sm:w-10 sm:h-10 group-hover:rotate-180 transition-transform duration-500" strokeWidth={3} />
                        </div>
                    </div>
                </Link>
            </div>
=======
>>>>>>> d6ebb696ba508c157f322a677b719639c2c7a394
        </div>
    );
}

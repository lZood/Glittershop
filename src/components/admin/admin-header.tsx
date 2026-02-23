'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gem, Settings, Store, LogOut, Search, Bell } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Moon, Sun, Monitor } from "lucide-react";
import * as motion from "framer-motion/client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/supabase/session-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminHeader() {
    const { theme, setTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(true);
    const { user, profile } = useSession();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        console.log('AdminHeader: Iniciando proceso de cierre de sesión...');
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('AdminHeader: Error al cerrar sesión en Supabase:', error.message);
            } else {
                console.log('AdminHeader: Sesión cerrada en Supabase con éxito.');
            }
            // Forzar recarga completa para limpiar todo el estado de la app
            console.log('AdminHeader: Redirigiendo a /login...');
            window.location.href = '/login';
        } catch (err) {
            console.error('AdminHeader: Error inesperado durante el cierre de sesión:', err);
            window.location.href = '/login';
        }
    };

    const userName = profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
        : user?.email?.split('@')[0] || "Administrador";

    const userEmail = user?.email || "admin@glittershop.com";
    const initial = userName.charAt(0).toUpperCase() || "A";

    useEffect(() => {
        let lastScrollValue = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollValue;

            if (Math.abs(delta) < 5) return;

            if (currentScrollY > lastScrollValue && currentScrollY > 60) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollValue) {
                setIsVisible(true);
            }

            lastScrollValue = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-between px-6 h-16 bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 md:left-64 lg:left-72 z-40 border-b border-border/50"
        >
            {/* Logo Mobile */}
            <div className="flex items-center">
                <h1 className="text-xs font-bold text-foreground tracking-[0.3em] uppercase">Glitters shop</h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand rounded-full"></span>
                </Button>

                <div className="w-px h-4 bg-border/50 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand rounded-full"></span>
                </Button>

                <div className="w-px h-4 bg-border/50 mx-1"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative group cursor-pointer pl-2 flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] font-bold text-foreground uppercase tracking-widest leading-none mb-0.5">{userName}</p>
                                <p className="text-[8px] text-muted-foreground uppercase tracking-tighter leading-none opacity-60">Admin</p>
                            </div>
                            <Avatar className="w-9 h-9 rounded-none border border-border/50 transition-all group-hover:border-brand bg-secondary/50">
                                <AvatarFallback className="rounded-none text-xs font-bold uppercase text-brand">{initial}</AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 rounded-none border-border/50 shadow-2xl p-0">
                        <div className="px-4 py-4 border-b border-border/50 bg-secondary/20 flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-none border border-border/30">
                                <AvatarFallback className="rounded-none text-sm font-bold uppercase text-brand bg-background">{initial}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-foreground uppercase tracking-widest truncate">{userName}</p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">{userEmail}</p>
                            </div>
                        </div>
                        <div className="p-1">
                            <DropdownMenuItem asChild className="rounded-none cursor-pointer hover:bg-secondary focus:bg-secondary p-3">
                                <Link href="/admin/settings" className="flex items-center">
                                    <Settings className="mr-3 h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Ajustes</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-none cursor-pointer hover:bg-secondary focus:bg-secondary p-3">
                                <Link href="/" target="_blank" className="flex items-center">
                                    <Store className="mr-3 h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Ir a la Tienda</span>
                                </Link>
                            </DropdownMenuItem>

                            <div className="h-px bg-border/50 my-1"></div>

                            {/* Theme Section */}
                            <div className="px-3 py-2 border-b border-border/50">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Tema</span>
                            </div>
                            <div className="p-1 grid grid-cols-3 gap-1">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1.5 p-2 transition-all group",
                                        theme === 'light' ? "bg-brand/10 text-brand" : "hover:bg-secondary dark:hover:bg-white/5 text-muted-foreground"
                                    )}
                                >
                                    <Sun className="h-3.5 w-3.5" />
                                    <span className="text-[7px] font-bold uppercase">Claro</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1.5 p-2 transition-all group",
                                        theme === 'dark' ? "bg-brand/10 text-brand" : "hover:bg-secondary dark:hover:bg-white/5 text-muted-foreground"
                                    )}
                                >
                                    <Moon className="h-3.5 w-3.5" />
                                    <span className="text-[7px] font-bold uppercase">Oscuro</span>
                                </button>
                                <button
                                    onClick={() => setTheme('system')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1.5 p-2 transition-all group",
                                        theme === 'system' ? "bg-brand/10 text-brand" : "hover:bg-secondary dark:hover:bg-white/5 text-muted-foreground"
                                    )}
                                >
                                    <Monitor className="h-3.5 w-3.5" />
                                    <span className="text-[7px] font-bold uppercase">Auto</span>
                                </button>
                            </div>

                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                                className="rounded-none cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 p-3 text-red-500"
                            >
                                <LogOut className="mr-3 h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.header>
    );
}

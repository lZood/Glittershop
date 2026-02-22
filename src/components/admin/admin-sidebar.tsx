'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    ChevronRight,
    Search,
    Bell,
    LogOut,
    Gem,
    Store,
    Layers,
    BarChart3,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const menuItems = [
    {
        title: "Principal",
        items: [
            {
                label: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
                activeMatch: (path: string) => path === "/admin"
            },
            {
                label: "Pedidos",
                href: "/admin/orders",
                icon: ShoppingBag,
                activeMatch: (path: string) => path.startsWith("/admin/orders") || path.startsWith("/admin/orders/")
            }
        ]
    },
    {
        title: "Catálogo",
        items: [
            {
                label: "Inventario",
                href: "/admin/inventory",
                icon: Package,
                activeMatch: (path: string) => path.startsWith("/admin/inventory")
            },
            {
                label: "Colecciones",
                href: "/admin/collections",
                icon: Layers,
                activeMatch: (path: string) => path.startsWith("/admin/collections")
            }
        ]
    },
    {
        title: "Análisis",
        items: [
            {
                label: "Analytics",
                href: "/admin/analytics",
                icon: BarChart3,
                activeMatch: (path: string) => path.startsWith("/admin/analytics")
            }
        ]
    },
    {
        title: "Clientes",
        items: [
            {
                label: "Usuarios",
                href: "/admin/users",
                icon: Users,
                activeMatch: (path: string) => path.startsWith("/admin/users")
            }
        ]
    }
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <aside className="hidden md:flex w-72 flex-col bg-background border-r border-border/50 h-screen sticky top-0 transition-colors duration-500">
            {/* Header / Logo */}
            <div className="p-6 h-20 flex items-center justify-between border-b border-border/10">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-sm font-bold text-foreground tracking-[0.3em] uppercase">Glitters Shop</h2>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Admin v3.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20 transition-all">
                {menuItems.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <h3 className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = item.activeMatch(pathname);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-between px-3 h-11 transition-all duration-300 overflow-hidden",
                                            isActive
                                                ? "bg-brand/5 text-brand"
                                                : "text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground"
                                        )}
                                    >
                                        {/* Active Indicator Glow */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 bg-brand/5 border-r-2 border-brand"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className="flex items-center gap-3.5 relative z-10">
                                            <div className={cn(
                                                "w-8 h-8 flex items-center justify-center transition-all duration-300",
                                                isActive ? "scale-110" : "group-hover:scale-110"
                                            )}>
                                                <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                                            </div>
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase tracking-[0.15em] transition-colors",
                                                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {isActive && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(180,115,49,0.8)] relative z-10"></div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Dropdown */}
            <div className="p-4 border-t border-border/50 bg-secondary/10 flex flex-col gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-3 hover:bg-secondary/50 dark:hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-border/30 group px-2">
                            <div className="relative">
                                <Avatar className="w-9 h-9 rounded-none border border-border/50">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="rounded-none uppercase text-[10px] font-bold">AD</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-foreground uppercase tracking-widest truncate">Admin</p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wider truncate">Gestión</p>
                            </div>
                            <Settings className="w-3.5 h-3.5 text-muted-foreground group-hover:rotate-45 transition-transform duration-500" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-none border-border/50 shadow-xl bg-card" side="right" sideOffset={10}>
                        <div className="px-3 py-2 border-b border-border/50">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Configuración</span>
                        </div>
                        <DropdownMenuItem asChild className="rounded-none cursor-pointer hover:bg-secondary dark:hover:bg-white/5 focus:bg-secondary p-3">
                            <Link href="/admin/settings" className="flex items-center">
                                <Settings className="mr-3 h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Ajustes</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none cursor-pointer hover:bg-secondary dark:hover:bg-white/5 focus:bg-secondary p-3">
                            <Link href="/" target="_blank" className="flex items-center">
                                <Store className="mr-3 h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Visitar Tienda</span>
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

                        <div className="h-px bg-border/50 my-1"></div>
                        <DropdownMenuItem className="rounded-none cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 p-3 text-red-500">
                            <LogOut className="mr-3 h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}

// Re-import motion from framer-motion/client for indicator
import { motion } from "framer-motion";

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

export function AdminHeader() {
    const { theme, setTheme } = useTheme();
    return (
        <header className="flex items-center justify-between px-6 h-16 bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border/50">
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative group cursor-pointer pl-2">
                            <Avatar className="w-8 h-8 rounded-none border border-border/50 transition-all group-hover:border-brand">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="rounded-none text-[8px] font-bold uppercase">AD</AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-none border-border/50 shadow-2xl p-0">
                        <div className="px-4 py-3 border-b border-border/50 bg-secondary/20">
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Administrador</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">admin@glittershop.com</p>
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
                            <DropdownMenuItem className="rounded-none cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 p-3 text-red-500">
                                <LogOut className="mr-3 h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

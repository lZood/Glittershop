'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gem, Settings, Store, LogOut, User } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#faecd6] flex items-center justify-center text-[#b47331]">
                    <Gem className="w-5 h-5 fill-current" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Glittershop</h1>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="relative cursor-pointer">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm transition-transform hover:scale-105">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/admin/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Ajustes</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/" className="cursor-pointer">
                            <Store className="mr-2 h-4 w-4" />
                            <span>Ir a la Tienda</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

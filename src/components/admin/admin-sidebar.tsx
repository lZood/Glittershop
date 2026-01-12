'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingBag,
    BarChart2,
    Settings,
    LogOut,
    Gem,
    ChevronRight,
    Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
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
            activeMatch: (path: string) => path.startsWith("/admin/orders")
        },
        {
            label: "Inventario",
            href: "/admin/inventory",
            icon: Package,
            activeMatch: (path: string) => path.startsWith("/admin/inventory")
        },
        {
            label: "Clientes",
            href: "/admin/customers",
            icon: Users,
            activeMatch: (path: string) => path.startsWith("/admin/customers")
        },
        {
            label: "Analíticas",
            href: "/admin/analytics",
            icon: BarChart2,
            activeMatch: (path: string) => path.startsWith("/admin/analytics")
        }
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 font-sans z-40">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#faecd6] flex items-center justify-center text-[#b47331] shadow-sm">
                    <Gem className="w-6 h-6 fill-current" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">Glittershop</span>
            </div>

            <div className="flex-1 px-4 space-y-2 py-4">
                {navItems.map((item) => {
                    const isActive = item.activeMatch(pathname);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-[#faecd6] text-[#b47331] font-bold shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn("w-5 h-5", isActive && "fill-current opacity-20")} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 mt-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                            <Avatar className="w-10 h-10 border border-white shadow-sm">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
                                <p className="text-xs text-slate-500 truncate">admin@glittershop.com</p>
                            </div>
                            <Settings className="w-4 h-4 text-slate-400" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Ajustes</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/">
                                <Store className="mr-2 h-4 w-4" />
                                <span>Ir a la Tienda</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingBag,
    BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminBottomNav() {
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-2 flex justify-around items-center z-50 pb-safe md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = item.activeMatch(pathname);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[64px]",
                            isActive ? "text-[#b47331]" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Icon className={cn("w-6 h-6", isActive && "fill-current opacity-20")} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

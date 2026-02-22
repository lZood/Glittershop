'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Menu,
    Moon,
    Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";

export function AdminBottomNav() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

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
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 dark:bg-black/80 backdrop-blur-xl border-t border-border/50 px-4 py-3 flex justify-around items-center z-50 pb-safe md:hidden shadow-2xl transition-colors duration-500">
            {navItems.map((item) => {
                const isActive = item.activeMatch(pathname);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "relative flex flex-col items-center gap-1.5 p-2 transition-all duration-300 min-w-[70px] active:scale-95 group",
                        )}
                    >
                        {/* Active Glow/Indicator */}
                        {isActive && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-brand shadow-[0_0_8px_rgba(180,115,49,0.8)]"></div>
                        )}

                        <Icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
                        )} strokeWidth={isActive ? 2.5 : 2} />

                        <span className={cn(
                            "text-[8px] uppercase font-bold tracking-[0.2em] transition-colors",
                            isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}

        </nav>
    );
}

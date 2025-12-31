'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    Settings,
    ShieldAlert,
    LogOut,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Inventario',
        href: '/admin/inventory',
        icon: Package,
    },
    {
        title: 'Pedidos',
        href: '/admin/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Clientes',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Promociones',
        href: '/admin/promotions',
        icon: Tag,
    },
];

const settingsItems = [
    {
        title: 'Auditoría',
        href: '/admin/settings/audit-logs',
        icon: ShieldAlert,
    },
    {
        title: 'Configuración',
        href: '/admin/settings',
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/admin" className="flex items-center gap-2 font-bold">
                    <span className="text-xl text-primary">GlitterShop</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Admin</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Torre de Control
                    </div>
                    {sidebarItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}

                    <div className="mt-6 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sistema
                    </div>
                    {settingsItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="border-t p-4">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-primary mt-2"
                    asChild
                >
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a la Tienda
                    </Link>
                </Button>
            </div>
        </div>
    );
}

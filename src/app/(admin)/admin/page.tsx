import { createClient } from "@/lib/supabase/server";
import {
    Plus,
    TrendingUp,
    ArrowRight,
    Clock,
    Box,
    ShoppingBag,
    Users,
    AlertTriangle,
    ChevronRight,
    ExternalLink,
    BarChart3,
    ArrowUpRight,
    Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // 1. Fetch Revenue
    const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .neq('status', 'cancelled');

    const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) || 0;

    // 2. Pending Orders
    const { count: pendingOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    // 3. Total Products
    const { count: totalProductsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    // 4. Low Stock Products (< 5 units)
    const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 5);

    // 5. Recent Orders (Last 3)
    const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
            id,
            total_amount,
            status,
            created_at,
            guest_email,
            profiles (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-24 px-4 lg:px-8 pt-6 transition-colors duration-500">

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2"
            >
                <div className="flex items-center gap-2">
                    <div className="h-4 w-[2px] bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">Resumen Ejecutivo</span>
                </div>
                <h1 className="text-4xl font-medium tracking-tight uppercase text-foreground">Overview</h1>
            </motion.div>

            {/* Responsive Stats Grid: 2x2 on Mobile, 4x1 on Desktop - Dark Mode Ready */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Ingresos Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Link href="/admin/analytics" className="group block h-full">
                        <div className="bg-card border border-border/50 p-6 h-full relative overflow-hidden transition-all duration-500 group-hover:border-brand/50 shadow-sm group-hover:shadow-xl group-hover:shadow-brand/10">
                            {/* Theme-aware Ambient Light */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand/10 dark:bg-brand/20 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-brand/20"></div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 transform group-hover:translate-x-1 transition-transform">
                                        <TrendingUp className="w-2.5 h-2.5" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">+8.2%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">Ingresos</p>
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-brand transition-colors truncate">
                                        {formatCurrency(totalRevenue)}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Pedidos Pendientes Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/admin/orders" className="group block h-full">
                        <div className="bg-card border border-border/50 p-6 h-full relative overflow-hidden transition-all duration-500 group-hover:border-blue-500/50 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-500/10">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <span className="flex items-center gap-1 text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5">
                                        <Activity className="w-2 h-2 animate-pulse" /> Live
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">Pendientes</p>
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
                                        {pendingOrdersCount || 0}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Inventario Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/admin/inventory" className="group block h-full">
                        <div className="bg-card border border-border/50 p-6 h-full relative overflow-hidden transition-all duration-500 group-hover:border-foreground/30 shadow-sm group-hover:shadow-xl group-hover:shadow-foreground/5">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-foreground/5 dark:bg-white/5 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                                        <Box className="w-5 h-5" />
                                    </div>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest border border-border/50 px-1.5 py-0.5">Sync</span>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">Inventario</p>
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:tracking-wider duration-500">
                                        {totalProductsCount || 0}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Stock Crítico Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link href="/admin/inventory" className="group block h-full">
                        <div className={cn(
                            "bg-card border border-border/50 p-6 h-full relative overflow-hidden transition-all duration-500 shadow-sm group-hover:shadow-xl",
                            (lowStockCount || 0) > 0
                                ? "group-hover:border-red-500/50 group-hover:shadow-red-500/10"
                                : "group-hover:border-green-500/50 group-hover:shadow-green-500/10"
                        )}>
                            <div className={cn(
                                "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl transition-all duration-1000 opacity-20 group-hover:opacity-40",
                                (lowStockCount || 0) > 0 ? "bg-red-500" : "bg-green-500"
                            )}></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className={cn(
                                        "w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 transition-all duration-500",
                                        (lowStockCount || 0) > 0 ? "group-hover:bg-red-500 group-hover:text-white" : "group-hover:bg-green-500 group-hover:text-white"
                                    )}>
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {(lowStockCount || 0) > 0 && <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>}
                                        <span className={cn(
                                            "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5",
                                            (lowStockCount || 0) > 0 ? "text-red-500 bg-red-500/10" : "text-green-600 dark:text-green-400 bg-green-500/10"
                                        )}>
                                            {(lowStockCount || 0) > 0 ? 'Acción' : 'Normal'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">Crito</p>
                                    <h3 className={cn("text-2xl font-bold tracking-tight transition-colors", (lowStockCount || 0) > 0 ? "text-red-500" : "text-foreground")}>
                                        {lowStockCount || 0}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">

                {/* Left Side: Activity Feed - Dark Mode Optimized */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-brand" />
                            <h2 className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">Pedidos Recientes</h2>
                        </div>
                        <Link href="/admin/orders" className="text-[10px] uppercase font-bold text-brand hover:underline tracking-[0.2em] flex items-center gap-2 group/all">
                            Ver todo <ChevronRight className="w-3 h-3 transition-transform group-hover/all:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-px bg-border/20 border border-border/50 overflow-hidden">
                        {recentOrders && recentOrders.length > 0 ? recentOrders.map((order, idx) => {
                            const customerName = order.profiles
                                ? `${(order.profiles as any).first_name} ${(order.profiles as any).last_name}`.trim()
                                : order.guest_email || 'Cliente Invitado';

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <Link href={`/admin/orders/${order.id}`}>
                                        <div className="group bg-card hover:bg-secondary/40 dark:hover:bg-white/[0.03] transition-all p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
                                            {/* Hover Glow Effect */}
                                            <div className="absolute inset-0 bg-brand/5 dark:bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className="relative z-10 flex items-center gap-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">ID</span>
                                                    <span className="font-mono text-xs font-bold text-foreground border-b border-brand/30 group-hover:border-brand transition-colors">#{order.id}</span>
                                                </div>
                                                <div className="hidden sm:block h-10 w-px bg-border/50"></div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Cliente</span>
                                                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider truncate max-w-[120px]">{customerName}</span>
                                                </div>
                                            </div>

                                            <div className="relative z-10 flex items-center gap-10">
                                                <div className="text-right hidden md:block">
                                                    <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total</span>
                                                    <span className="text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                                                        {formatCurrency(Number(order.total_amount))}
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className={cn(
                                                    "rounded-none px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm group-hover:shadow-md transition-all",
                                                    getStatusColor(order.status)
                                                )}>
                                                    {order.status}
                                                </Badge>
                                                <div className="w-10 h-10 flex items-center justify-center bg-secondary/80 dark:bg-white/5 border border-border/30 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:rotate-12">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        }) : (
                            <div className="bg-card/50 border border-border/30 border-dashed p-16 text-center">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em] opacity-30">No hay actividad</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Quick Management - Theme Aware */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                            <Plus className="w-4 h-4 text-brand" />
                            <h2 className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">Acciones Rápidas</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/admin/inventory/new" className="group p-6 bg-card border border-border/50 hover:border-brand/50 transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-brand/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:rotate-90">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground transition-all group-hover:tracking-[0.2em]">Nuevo Producto</span>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                            </Link>

                            <Link href="/admin/collections" className="group p-6 bg-card border border-border/50 hover:border-brand/50 transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-brand/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 group-hover:bg-brand group-hover:text-white transition-all">
                                        <ExternalLink className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground transition-all group-hover:tracking-[0.2em]">Colecciones</span>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                            </Link>
                        </div>
                    </div>

                    {/* System Status Block - High Contrast Dark Mode */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-foreground dark:bg-white p-8 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 dark:bg-black/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-background dark:text-foreground/40 uppercase tracking-[0.3em]">Estado Global</span>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest leading-none">Healthy</span>
                                </div>
                            </div>
                            <h4 className="text-background dark:text-foreground text-lg font-bold tracking-[0.1em] uppercase leading-tight">Infraestructura Crítica Operativa</h4>
                            <Button variant="outline" className="w-full rounded-none border-background/20 dark:border-foreground/20 bg-transparent text-background dark:text-foreground hover:bg-background hover:text-foreground dark:hover:bg-foreground dark:hover:text-background h-10 text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl">
                                Diagnóstico de Red
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

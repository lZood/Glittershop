'use client';

import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    subMonths,
    isSameDay,
    startOfDay,
    parseISO,
    subDays
} from 'date-fns';
import { es } from 'date-fns/locale';

interface AnalyticsClientProps {
    orders: any[];
    totalProducts: number;
    customerCreationDates: string[];
}

export function AnalyticsClient({ orders, totalProducts, customerCreationDates }: AnalyticsClientProps) {
    // 1. Calculate Summary Stats
    const stats = useMemo(() => {
        const totalSales = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
        const orderCount = orders.length;
        const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
        const customerCount = customerCreationDates.length;

        // Last 30 days growth (simplified comparison)
        const lastMonth = subMonths(new Date(), 1);
        const recentSales = orders
            .filter(o => new Date(o.created_at) > lastMonth)
            .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

        const previousMonthSales = orders
            .filter(o => {
                const date = new Date(o.created_at);
                return date > subMonths(lastMonth, 1) && date <= lastMonth;
            })
            .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

        const salesGrowth = previousMonthSales > 0
            ? ((recentSales - previousMonthSales) / previousMonthSales) * 100
            : 0;

        return {
            totalSales,
            orderCount,
            avgOrderValue,
            customerCount,
            salesGrowth
        };
    }, [orders, customerCreationDates]);

    // 2. Prepare Chart Data (Daily Sales last 30 days)
    const salesChartData = useMemo(() => {
        const days = eachDayOfInterval({
            start: subDays(new Date(), 29),
            end: new Date()
        });

        return days.map(day => {
            const dayOrders = orders.filter(o => isSameDay(parseISO(o.created_at), day));
            return {
                name: format(day, 'dd MMM', { locale: es }),
                monto: dayOrders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0),
                pedidos: dayOrders.length
            };
        });
    }, [orders]);

    // 3. Category Distribution
    const categoryData = useMemo(() => {
        const categories: Record<string, number> = {};
        orders.forEach(order => {
            order.order_items?.forEach((item: any) => {
                const cat = item.product?.category || 'Sin Categoría';
                categories[cat] = (categories[cat] || 0) + (Number(item.price) * item.quantity);
            });
        });

        return Object.entries(categories).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [orders]);

    const COLORS = ['#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-24 px-4 lg:px-8 pt-6 transition-colors duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-2"
                >
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-[2px] bg-brand shadow-[0_0_8px_rgba(180,115,49,0.5)]"></div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">Centro de Control</span>
                    </div>
                    <h1 className="text-4xl font-medium tracking-tight uppercase text-foreground">Analytics</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3"
                >
                    <div className="bg-card border border-border/50 px-4 py-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group cursor-pointer hover:border-brand/30 transition-all">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Últimos 30 días</span>
                        <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                    </div>
                    <button className="bg-foreground text-background dark:bg-white dark:text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all shadow-lg active:scale-95">
                        Exportar Reporte
                    </button>
                </motion.div>
            </div>

            {/* Summary Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Ventas Totales"
                    value={formatCurrency(stats.totalSales)}
                    subvalue={`${stats.salesGrowth >= 0 ? '+' : ''}${stats.salesGrowth.toFixed(1)}% vs mes pasado`}
                    icon={<DollarSign className="w-5 h-5" />}
                    trend={stats.salesGrowth >= 0 ? 'up' : 'down'}
                    delay={0.1}
                />
                <StatCard
                    label="Pedidos"
                    value={stats.orderCount.toString()}
                    subvalue="Órdenes procesadas"
                    icon={<ShoppingBag className="w-5 h-5" />}
                    trend="neutral"
                    delay={0.2}
                />
                <StatCard
                    label="Ticket Promedio"
                    value={formatCurrency(stats.avgOrderValue)}
                    subvalue="Valor por orden"
                    icon={<TrendingUp className="w-5 h-5" />}
                    trend="up"
                    delay={0.3}
                />
                <StatCard
                    label="Clientes"
                    value={stats.customerCount.toString()}
                    subvalue="Usuarios registrados"
                    icon={<Users className="w-5 h-5" />}
                    trend="up"
                    delay={0.4}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Sales Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-8 bg-card border border-border/50 p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative"
                >
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Rendimiento de Ventas</h3>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Flujo de ingresos diario</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-brand"></div>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Monto (MXN)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesChartData}>
                                <defs>
                                    <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--border), 0.1)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 600 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="monto"
                                    stroke="var(--brand)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMonto)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gradient Background Decoration */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand/5 rounded-full blur-[100px] pointer-events-none"></div>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-4 bg-card border border-border/50 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center justify-between"
                >
                    <div className="w-full space-y-1 self-start mb-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Distribución por Categoría</h3>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Ventas por tipo de producto</p>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationBegin={500}
                                    animationDuration={1500}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3 pt-6 border-t border-border/10">
                        {categoryData.map((item, idx) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[120px]">{item.name}</span>
                                </div>
                                <span className="text-[10px] font-bold text-foreground">{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="lg:col-span-7 space-y-6"
                >
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <Activity className="w-4 h-4 text-brand" />
                        <h2 className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">Productos Destacados</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-px bg-border/20 border border-border/50 overflow-hidden">
                        {orders.slice(0, 4).map((order) => (
                            <div key={order.id} className="bg-card hover:bg-secondary/40 transition-all p-5 flex items-center justify-between group relative overflow-hidden">
                                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-10 h-10 bg-secondary/50 flex items-center justify-center border border-border/30 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:scale-110">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-brand transition-colors">#{order.id.slice(0, 8)}</p>
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">{format(parseISO(order.created_at), "dd 'de' MMMM", { locale: es })}</p>
                                    </div>
                                </div>
                                <div className="relative z-10 text-right">
                                    <p className="text-[11px] font-bold text-foreground">{formatCurrency(Number(order.total_amount))}</p>
                                    <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-1">Completado</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Efficiency / KPI Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="lg:col-span-5 bg-foreground dark:bg-white p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 dark:bg-black/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-all duration-1000"></div>

                    <div className="relative z-10 space-y-8">
                        <div>
                            <span className="text-[9px] font-bold text-background/50 dark:text-foreground/40 uppercase tracking-[0.3em]">Kpi Operativo</span>
                            <h4 className="text-3xl font-bold tracking-tight text-white dark:text-black uppercase mt-2">Productividad Óptima</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] font-bold text-white/70 dark:text-black/70 uppercase">Eficiencia de Envío</span>
                                    <span className="text-[11px] font-bold text-white dark:text-black">94%</span>
                                </div>
                                <div className="h-1 bg-white/10 dark:bg-black/10 w-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '94%' }}
                                        transition={{ duration: 1.5, delay: 1 }}
                                        className="h-full bg-brand shadow-[0_0_10px_rgba(180,115,49,0.8)]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] font-bold text-white/70 dark:text-black/70 uppercase">Retención de Clientes</span>
                                    <span className="text-[11px] font-bold text-white dark:text-black">68%</span>
                                </div>
                                <div className="h-1 bg-white/10 dark:bg-black/10 w-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '68%' }}
                                        transition={{ duration: 1.5, delay: 1.2 }}
                                        className="h-full bg-brand shadow-[0_0_10px_rgba(180,115,49,0.8)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-10">
                        <button className="w-full bg-background dark:bg-foreground text-foreground dark:text-background h-12 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all shadow-xl">
                            Analizar Estrategia
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ label, value, subvalue, icon, trend, delay }: {
    label: string,
    value: string,
    subvalue: string,
    icon: React.ReactNode,
    trend: 'up' | 'down' | 'neutral',
    delay: number
}) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <div className="bg-card border border-border/50 p-6 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-brand/30">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-brand/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-secondary/50 dark:bg-white/5 flex items-center justify-center border border-border/30 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                            {icon}
                        </div>
                        {trend !== 'neutral' && (
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-0.5 transform group-hover:translate-x-1 transition-transform",
                                trend === 'up' ? "text-green-600 bg-green-500/10" : "text-red-500 bg-red-500/10"
                            )}>
                                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                <span className="text-[8px] font-bold uppercase tracking-widest">Growth</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">{label}</p>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-brand transition-colors">
                            {value}
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">{subvalue}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-foreground text-background dark:bg-white dark:text-black p-4 border border-border/50 shadow-2xl rounded-none min-w-[150px]">
                <p className="text-[9px] font-bold uppercase tracking-widest border-b border-background/20 dark:border-foreground/20 pb-2 mb-2">{payload[0].payload.name}</p>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest flex justify-between">
                        <span className="opacity-70 dark:opacity-50">Ventas:</span>
                        <span>${payload[0].value.toLocaleString()}</span>
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest border-t border-background/10 dark:border-foreground/10 pt-1 flex justify-between">
                        <span className="opacity-70 dark:opacity-50">Órdenes:</span>
                        <span>{payload[0].payload.pedidos}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-foreground text-background dark:bg-white dark:text-black p-3 border border-border/50 shadow-2xl">
                <p className="text-[8px] font-bold uppercase tracking-widest mb-1">{payload[0].name}</p>
                <p className="text-[10px] font-bold tracking-tight">${payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

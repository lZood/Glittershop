'use client';

import { useState, useEffect } from "react";
import { Search, Bell, Eye, Truck, MoreHorizontal, Filter, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllOrdersForAdmin } from "./actions";

const FILTER_TABS = ["Todos", "Pendientes", "Pagados", "Enviados", "Cancelados"];

export default function OrdersPage() {
    const [selectedTab, setSelectedTab] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const result = await getAllOrdersForAdmin();

            if (result.success && result.data) {
                const formattedOrders = (result.data as any[]).map(o => {
                    // Try parsing shipping address if it's a string, or parse directly if it's already JSON
                    let parsedAddress = o.shipping_address;
                    if (typeof parsedAddress === 'string') {
                        try {
                            parsedAddress = JSON.parse(parsedAddress);
                        } catch (e) {
                            // ignore parse error
                        }
                    }

                    const customerName =
                        parsedAddress?.full_name
                        || o.guest_email
                        || 'Cliente Desconocido';

                    const itemsCount = o.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

                    let statusLabel = 'Pendiente';
                    const rawStatus = (o.status || '').toLowerCase();
                    if (rawStatus === 'paid' || rawStatus === 'pagado') statusLabel = 'Pagado';
                    else if (rawStatus === 'shipped' || rawStatus === 'enviado') statusLabel = 'Enviado';
                    else if (rawStatus === 'cancelled' || rawStatus === 'cancelado') statusLabel = 'Cancelado';

                    const dateObj = new Date(o.created_at);
                    const formattedDate = dateObj.toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return {
                        id: `#GS-${o.id}`,
                        realId: o.id,
                        customer: customerName,
                        amount: o.total_amount,
                        items: itemsCount,
                        date: formattedDate,
                        status: statusLabel
                    };
                });
                setOrders(formattedOrders);
            } else {
                console.error("Error fetching orders:", result.error);
            }
            setLoading(false);
        }

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedTab === "Todos") return true;
        if (selectedTab === "Pendientes") return order.status === "Pendiente";
        if (selectedTab === "Pagados") return order.status === "Pagado";
        if (selectedTab === "Enviados") return order.status === "Enviado";
        if (selectedTab === "Cancelados") return order.status === "Cancelado";

        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pagado': return "bg-green-50 text-green-700 border-green-200/50";
            case 'Pendiente': return "bg-amber-50 text-amber-700 border-amber-200/50";
            case 'Enviado': return "bg-blue-50 text-blue-700 border-blue-200/50";
            case 'Cancelado': return "bg-red-50 text-red-700 border-red-200/50";
            default: return "bg-slate-50 text-slate-700 border-slate-200/50";
        }
    };

    return (
        <div className="space-y-8 pb-24 max-w-4xl mx-auto px-4 lg:px-0 pt-6">
            {/* Header */}
            <div className="pt-24 sm:pt-12 mb-12">
                <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase text-foreground">Pedidos</h1>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por ID o cliente..."
                    className="pl-11 bg-transparent border-border rounded-none h-14 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground placeholder:text-muted-foreground placeholder:tracking-wide placeholder:uppercase placeholder:text-xs text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Tabs - Premium Slider */}
            <div className="w-full overflow-hidden relative border-b border-border/30">
                <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                <div className="flex overflow-x-auto no-scrollbar flex-nowrap items-center gap-0 py-1 scroll-smooth touch-pan-x">
                    {FILTER_TABS.map((tab) => {
                        const isActive = selectedTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={cn(
                                    "px-6 py-4 text-[10px] tracking-[0.25em] uppercase transition-all whitespace-nowrap border-b-2 shrink-0 font-bold",
                                    isActive
                                        ? "text-brand border-brand bg-brand/[0.03]"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"
                                )}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Visual shadow indicator for mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden"></div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-20 animate-pulse text-muted-foreground text-xs uppercase tracking-widest">
                        Cargando pedidos...
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-24 flex flex-col items-center border border-border bg-secondary/20">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-muted-foreground border border-border">
                            <Filter className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium tracking-[0.1em] text-foreground uppercase mb-2">Sin Resultados</h3>
                        <p className="text-muted-foreground text-xs tracking-widest uppercase">Intenta ajustando los filtros.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <Card key={order.realId} className="border border-border/50 shadow-none rounded-none bg-background hover:border-border transition-colors group">
                            <div className="p-6 md:p-8">
                                {/* Top Row: Status & Order ID + Amount */}
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium tracking-[0.1em] text-muted-foreground uppercase">{order.id}</span>
                                            <Badge variant="outline" className={cn("rounded-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]", getStatusColor(order.status))}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] font-medium text-muted-foreground uppercase">
                                            <ClockIcon className="w-3.5 h-3.5" />
                                            {order.date}
                                        </div>
                                    </div>
                                    <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                                        <p className="text-2xl text-foreground font-medium">
                                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.amount)}
                                        </p>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em]">{order.items} {order.items === 1 ? 'Artículo' : 'Artículos'}</p>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground block mb-2">Comprador</span>
                                    <h3 className="text-lg font-medium text-foreground tracking-[0.05em] uppercase">{order.customer}</h3>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4">
                                    {order.status === 'Enviado' ? (
                                        <Link href={`/admin/orders/${order.realId}`} className="flex-1">
                                            <Button variant="outline" className="w-full rounded-none bg-background hover:bg-secondary text-foreground font-semibold uppercase tracking-[0.1em] h-12 text-xs">
                                                <Truck className="w-4 h-4 mr-2" />
                                                Rastrear Envío
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href={`/admin/orders/${order.realId}`} className="flex-1">
                                            <Button className="w-full rounded-none bg-foreground hover:bg-foreground/90 text-background font-semibold uppercase tracking-[0.1em] h-12 text-xs transition-transform group-hover:shadow-md">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                        </Link>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-none bg-background text-foreground hover:bg-secondary hover:text-foreground">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none">
                                            <DropdownMenuItem className="text-xs tracking-[0.05em] uppercase font-medium">Ver Detalles Completos</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs tracking-[0.05em] uppercase font-medium">Contactar Cliente</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs tracking-[0.05em] uppercase font-medium text-red-600">Cancelar Pedido</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    )
}

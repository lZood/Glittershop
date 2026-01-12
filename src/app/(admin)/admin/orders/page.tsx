'use client';

import { useState } from "react";
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

// Mock Data
const ORDERS = [
    { id: '#GS-9872', customer: 'Elena Rodríguez', amount: 1250.00, items: 3, date: 'Hoy, 14:30', status: 'Pagado' },
    { id: '#GS-9871', customer: 'Marco Antonio', amount: 840.50, items: 1, date: 'Hoy, 12:15', status: 'Pendiente' },
    { id: '#GS-9869', customer: 'Sofía Valdivia', amount: 2100.00, items: 5, date: 'Ayer, 18:05', status: 'Enviado' },
    { id: '#GS-9865', customer: 'Julian Castro', amount: 45.00, items: 1, date: '23 Oct, 10:20', status: 'Cancelado' },
];

const FILTER_TABS = ["Todos", "Pendientes", "Pagados", "Enviados", "Cancelados"];

export default function OrdersPage() {
    const [selectedTab, setSelectedTab] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = ORDERS.filter(order => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedTab === "Todos") return true;
        // Simple mapping for demo; in real app status would probably match exactly or be mapped
        if (selectedTab === "Pendientes") return order.status === "Pendiente";
        if (selectedTab === "Pagados") return order.status === "Pagado";
        if (selectedTab === "Enviados") return order.status === "Enviado";
        if (selectedTab === "Cancelados") return order.status === "Cancelado";

        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pagado': return "bg-green-100 text-green-700 border-green-200";
            case 'Pendiente': return "bg-amber-100 text-amber-700 border-amber-200";
            case 'Enviado': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'Cancelado': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="space-y-6 pb-24 max-w-2xl mx-auto md:max-w-4xl">
            {/* Header */}
            <header className="flex items-center justify-between sticky top-0 bg-[#F8F9FC] z-20 py-2">
                <div className="flex items-center gap-3">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 -ml-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Gestión de Pedidos</h1>
                </div>
                <Button variant="ghost" size="icon" className="relative rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                <Input
                    placeholder="Buscar por ID o cliente..."
                    className="pl-9 bg-white border-slate-200 rounded-2xl h-12 shadow-sm focus-visible:ring-pink-500 focus-visible:border-pink-500 placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {FILTER_TABS.map((tab) => {
                    const isActive = selectedTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={cn(
                                "flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                                isActive
                                    ? "bg-[#fd2e93] text-white border-[#fd2e93] shadow-md shadow-pink-200"
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                            )}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <Filter className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No se encontraron pedidos</h3>
                        <p className="text-slate-500 text-sm">Prueba ajustando los filtros de búsqueda.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <Card key={order.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                            <div className="p-5">
                                {/* Top Row: Status & Order ID + Amount */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-2 items-center">
                                        <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getStatusColor(order.status))}>
                                            {order.status}
                                        </Badge>
                                        <span className="text-xs font-medium text-slate-400">{order.id}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-pink-600 text-lg">
                                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.amount)}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{order.items} Artículos</p>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">{order.customer}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        {order.date}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    {order.status === 'Enviado' ? (
                                        <Button className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 shadow-lg shadow-slate-200">
                                            <Truck className="w-4 h-4 mr-2" />
                                            Rastrear Envío
                                        </Button>
                                    ) : (
                                        <Button className="flex-1 rounded-xl bg-[#fd2e93] hover:bg-[#d61b75] text-white font-bold h-11 shadow-lg shadow-pink-200">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Detalles
                                        </Button>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem className="font-medium">Editar Pedido</DropdownMenuItem>
                                            <DropdownMenuItem className="font-medium">Contactar Cliente</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 font-medium">Cancelar Pedido</DropdownMenuItem>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
        </svg>
    )
}

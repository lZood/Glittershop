'use client';

import { useState } from "react";
import { Search, Plus, Filter, Mail, Phone, MapPin, History, Tag, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const CUSTOMERS = [
    {
        id: 1,
        name: 'Sofía Martínez',
        email: 'sofia.m@example.com',
        phone: '+52 55 1234 5678',
        totalSpent: 1250.00,
        orders: 12,
        status: 'Active',
        isVip: true,
        image: 'https://i.pravatar.cc/150?u=sofia',
        lastOrder: '2 days ago'
    },
    {
        id: 2,
        name: 'Mateo Ruiz',
        email: 'mateo.ruiz@example.com',
        phone: '+52 55 8765 4321',
        totalSpent: 450.00,
        orders: 3,
        status: 'Active',
        isVip: false,
        image: 'https://i.pravatar.cc/150?u=mateo',
        lastOrder: '1 week ago'
    },
    {
        id: 3,
        name: 'Valentina López',
        email: 'valentina.l@example.com',
        phone: '+52 55 5555 5555',
        totalSpent: 0.00,
        orders: 0,
        status: 'Inactive',
        isVip: false,
        image: 'https://i.pravatar.cc/150?u=valentina',
        lastOrder: 'Never'
    },
    {
        id: 4,
        name: 'Carlos Vega',
        email: 'carlos.v@example.com',
        phone: '+52 55 9999 8888',
        totalSpent: 890.50,
        orders: 5,
        status: 'Active',
        isVip: false,
        image: 'https://i.pravatar.cc/150?u=carlos',
        lastOrder: '3 days ago'
    },
];

const FILTERS = ["Todos", "VIP", "Recientes", "Inactivos"];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("Todos");
    const [expandedId, setExpandedId] = useState<number | null>(1); // Default first expanded

    const filteredCustomers = CUSTOMERS.filter(customer => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedTab === "Todos") return true;
        if (selectedTab === "VIP") return customer.isVip;
        if (selectedTab === "Inactivos") return customer.status === 'Inactive';
        // Mock logic for 'Recientes'
        if (selectedTab === "Recientes") return true;

        return true;
    });

    return (
        <div className="space-y-6 pb-24 max-w-2xl mx-auto md:max-w-4xl">
            {/* Header */}
            <header className="flex items-center justify-between sticky top-0 bg-[#F8F9FC] z-20 py-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-900">Gestión de Clientes</h1>
                </div>
                <Button className="rounded-full h-10 w-10 bg-[#b47331] hover:bg-[#9a632a] text-white shadow-lg shadow-[#b47331]/20 p-0 flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                </Button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b47331]" />
                <Input
                    placeholder="Buscar por nombre o email..."
                    className="pl-9 bg-white border-slate-200 rounded-2xl h-12 shadow-sm focus-visible:ring-[#b47331] focus-visible:border-[#b47331] placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {FILTERS.map((tab) => {
                    const isActive = selectedTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={cn(
                                "flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                                isActive
                                    ? "bg-[#b47331] text-white border-[#b47331] shadow-md shadow-[#b47331]/20"
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                            )}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredCustomers.map((customer) => {
                    const isExpanded = expandedId === customer.id;

                    return (
                        <motion.div
                            layout
                            key={customer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card
                                onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                                className={cn(
                                    "border-none shadow-sm rounded-3xl overflow-hidden cursor-pointer transition-all duration-300",
                                    isExpanded ? "bg-white ring-2 ring-[#b47331]/20 shadow-xl" : "bg-white hover:bg-slate-50"
                                )}
                            >
                                <div className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className={cn("border-2 border-white shadow-sm", isExpanded ? "w-16 h-16" : "w-12 h-12")}>
                                                <AvatarImage src={customer.image} />
                                                <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            {customer.isVip && (
                                                <Badge className="absolute -bottom-1 -right-1 bg-[#b47331] text-white border-2 border-white px-1.5 py-0 text-[10px] shadow-sm">
                                                    VIP
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={cn("font-bold text-slate-900 truncate transition-all", isExpanded ? "text-lg" : "text-base")}>
                                                        {customer.name}
                                                    </h3>
                                                    <p className="text-slate-500 text-sm truncate">{customer.email}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    {!isExpanded && (
                                                        <div className="flex items-center gap-2">
                                                            {customer.status === 'Active' ? (
                                                                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                                            ) : (
                                                                <span className="flex h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                                                            )}
                                                            <p className="font-bold text-slate-900">
                                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(customer.totalSpent)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {isExpanded && (
                                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-6 space-y-6">
                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Gastado</p>
                                                            <p className="text-xl font-black text-slate-900">
                                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(customer.totalSpent)}
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pedidos</p>
                                                            <p className="text-xl font-black text-slate-900">{customer.orders}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acciones Rápidas</h4>
                                                        <Button className="w-full rounded-xl bg-[#b47331] hover:bg-[#9a632a] text-white font-bold h-12 shadow-md shadow-[#b47331]/20">
                                                            <History className="w-4 h-4 mr-2" />
                                                            Ver Historial de Pedidos
                                                        </Button>
                                                        <div className="flex gap-3">
                                                            <Button variant="outline" className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-11">
                                                                <Tag className="w-4 h-4 mr-2 text-slate-400" />
                                                                Enviar Cupón
                                                            </Button>
                                                            <Button variant="outline" className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-11">
                                                                <Edit className="w-4 h-4 mr-2 text-slate-400" />
                                                                Editar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-center text-xs font-medium text-slate-400 mt-8">
                Mostrando {filteredCustomers.length} de {CUSTOMERS.length} clientes
            </p>
        </div>
    );
}

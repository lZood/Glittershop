'use client';

import { useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    MousePointerClick,
    ShoppingBag,
    Calendar,
    ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock Data
const CHART_DATA = [
    { name: "Sep 1", value: 1000 },
    { name: "Sep 5", value: 2500 },
    { name: "Sep 10", value: 1800 },
    { name: "Sep 15", value: 3200 },
    { name: "Sep 20", value: 2400 },
    { name: "Sep 25", value: 3800 },
    { name: "Sep 30", value: 2900 },
    { name: "Oct 5", value: 4500 },
];

const TOP_PRODUCTS = [
    { id: 1, name: "Anillo Diamante Solitario", category: "Joyería Fina", price: 22500, sales: 45, image: "/placeholder.png" }, // Using placeholders, will be replaced by real images in real app
    { id: 2, name: "Collar de Oro 18k", category: "Colección Real", price: 15000, sales: 30, image: "/placeholder.png" },
    { id: 3, name: "Pulsera Plata Sterling", category: "Accesorios Diarios", price: 2800, sales: 26, image: "/placeholder.png" },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Analíticas de Ventas</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full h-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700">
                            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                            <span className="text-xs font-semibold">Últimos 30 días</span>
                            <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Últimos 7 días</DropdownMenuItem>
                        <DropdownMenuItem>Últimos 30 días</DropdownMenuItem>
                        <DropdownMenuItem>Este Mes</DropdownMenuItem>
                        <DropdownMenuItem>Este Año</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Revenue */}
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden relative">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-2 py-1 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                +12%
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">$124,500</h3>
                        </div>
                    </CardContent>
                </Card>

                {/* Conversion */}
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden relative">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
                                <MousePointerClick className="w-6 h-6" />
                            </div>
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none rounded-full px-2 py-1 flex items-center gap-1">
                                <ArrowDownRight className="w-3 h-3" />
                                -0.5%
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Tasa de Conversión</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">3.2%</h3>
                        </div>
                    </CardContent>
                </Card>

                {/* Avg Value */}
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden relative">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-2 py-1 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                +5%
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Valor Promedio</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">$450</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Tendencia de Ingresos</p>
                            <CardTitle className="text-xl font-bold text-slate-900">Visión General</CardTitle>
                        </div>
                        <span className="text-sm font-bold text-pink-500">Septiembre 2023</span>
                    </div>
                </CardHeader>
                <CardContent className="p-0 h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#ec4899', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#ec4899"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Breakdown & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categories */}
                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardHeader>
                        <p className="text-sm text-slate-500 font-medium">Desglose de Ventas</p>
                        <CardTitle className="text-xl font-bold text-slate-900">Por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-700">Anillos</span>
                                <span className="text-pink-600">45%</span>
                            </div>
                            <Progress value={45} className="h-2 bg-slate-100" indicatorClassName="bg-pink-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-700">Collares</span>
                                <span className="text-purple-600">30%</span>
                            </div>
                            <Progress value={30} className="h-2 bg-slate-100" indicatorClassName="bg-purple-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-700">Pulseras</span>
                                <span className="text-blue-600">25%</span>
                            </div>
                            <Progress value={25} className="h-2 bg-slate-100" indicatorClassName="bg-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900">Productos Más Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {TOP_PRODUCTS.map((prod) => (
                            <div key={prod.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                                    <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                                    <p className="text-xs text-slate-500">{prod.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-pink-600 text-sm">
                                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(prod.price)}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">{prod.sales} ventas</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

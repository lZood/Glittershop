'use client';

import {
    Plus,
    Truck,
    TrendingUp,
    ArrowRight,
    DollarSign,
    ClipboardList,
    Clock,
    Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { motion } from "framer-motion";

// Mock Data
const RECENT_ORDERS = [
    { id: '#2023', user: 'Maria Rodriguez', items: 2, amount: 450.00, status: 'Pagado', statusColor: 'bg-green-100 text-green-700', icon: '💍' },
    { id: '#2022', user: 'Carlos Mendez', items: 1, amount: 1250.00, status: 'Enviado', statusColor: 'bg-blue-100 text-blue-700', icon: '💎' },
    { id: '#2021', user: 'Sofia L.', items: 3, amount: 890.00, status: 'Pendiente', statusColor: 'bg-yellow-100 text-yellow-700', icon: '👑' },
    { id: '#2020', user: 'Ana Gomez', items: 1, amount: 320.00, status: 'Pagado', statusColor: 'bg-green-100 text-green-700', icon: '⌚' },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <DollarSign className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <Badge variant="secondary" className="bg-green-50 text-green-700 font-bold hover:bg-green-100">
                                    +12%
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ventas de Hoy</p>
                                <h3 className="text-2xl font-black text-slate-900">$12,450</h3>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <ClipboardList className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-bold hover:bg-amber-100">
                                    Alert
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pendientes</p>
                                <h3 className="text-2xl font-black text-slate-900">8</h3>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Additional mock stats for desktop filling */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden hidden md:block">
                    <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Package className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">En Envío</p>
                            <h3 className="text-2xl font-black text-slate-900">14</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden hidden md:block">
                    <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Clock className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tiempo Promedio</p>
                            <h3 className="text-2xl font-black text-slate-900">24h</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 px-1">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin/inventory/new">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-pink-50 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-center h-40 shadow-sm border border-pink-100 cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shadow-lg shadow-pink-200 flex items-center justify-center text-white mb-1">
                                <Plus className="w-7 h-7" strokeWidth={3} />
                            </div>
                            <span className="font-bold text-slate-900 leading-tight">Añadir <br />Producto</span>
                        </motion.div>
                    </Link>

                    <Link href="/admin/orders">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-blue-50 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-center h-40 shadow-sm border border-blue-100 cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-500 shadow-lg shadow-blue-200 flex items-center justify-center text-white mb-1">
                                <Truck className="w-7 h-7" />
                            </div>
                            <span className="font-bold text-slate-900 leading-tight">Gestionar <br />Pedidos</span>
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Analytics Banner */}
            <Link href="/admin/analytics">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-3xl bg-slate-900 p-6 md:p-8 relative overflow-hidden shadow-xl"
                >
                    {/* Abstract background effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full filter blur-3xl opacity-20 transform translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10 transform -translate-x-4 translate-y-4"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Reportes</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ver Analíticas</h2>
                            <p className="text-slate-400 text-sm max-w-[200px]">Rendimiento de ventas y métricas clave.</p>
                        </div>
                        <Button size="icon" className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                    </div>
                </motion.div>
            </Link>

            {/* Recent Orders */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold text-slate-900">Pedidos Recientes</h2>
                    <Button variant="ghost" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-bold text-sm h-8 px-2">
                        Ver todo
                    </Button>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                    {RECENT_ORDERS.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                                    {order.icon}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-slate-900 text-sm truncate">{order.id}</p>
                                    <p className="text-xs text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">{order.user} • {order.items} Items</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                                <p className="font-bold text-slate-900 text-sm">${order.amount.toFixed(2)}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${order.statusColor.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{order.status}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

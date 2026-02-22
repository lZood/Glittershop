'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Box, Copy, ExternalLink, Package, RefreshCw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { getOrderDetails, updateOrderStatus, updateOrderTracking } from "../actions";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkydropxSheet } from "@/components/skydropx/SkydropxSheet";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Tracking & Packing State
    const [trackingNumber, setTrackingNumber] = useState("");
    const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    async function fetchOrder() {
        setLoading(true);
        const res = await getOrderDetails(orderId);
        if (res.success && res.data) {
            setOrder(res.data);

            // Parse shipping address
            let addressInfo = (res.data as any).shipping_address;
            if (typeof addressInfo === 'string') {
                try { addressInfo = JSON.parse(addressInfo); } catch (e) { }
            }
            if (addressInfo?.tracking_number) {
                setTrackingNumber(addressInfo.tracking_number);
            }
        }
        setLoading(false);
    }

    const togglePacked = (itemId: string) => {
        setPackedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        await updateOrderStatus(orderId, newStatus);
        setOrder((prev: any) => ({ ...prev, status: newStatus }));
        setUpdating(false);
    };

    const handleSaveTracking = async () => {
        if (!trackingNumber.trim()) return;
        setUpdating(true);
        await updateOrderTracking(orderId, trackingNumber);
        setOrder((prev: any) => ({ ...prev, status: 'Enviado' }));
        setUpdating(false);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pagado':
            case 'paid': return "bg-green-50 text-green-700 border-green-200/50";
            case 'pendiente': return "bg-amber-50 text-amber-700 border-amber-200/50";
            case 'enviado':
            case 'shipped': return "bg-blue-50 text-blue-700 border-blue-200/50";
            case 'cancelado':
            case 'cancelled': return "bg-red-50 text-red-700 border-red-200/50";
            default: return "bg-slate-50 text-slate-700 border-slate-200/50";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pagado':
            case 'paid': return "Pagado";
            case 'pendiente': return "Pendiente";
            case 'enviado':
            case 'shipped': return "Enviado";
            case 'cancelado':
            case 'cancelled': return "Cancelado";
            default: return "Pendiente";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-muted-foreground text-xs uppercase tracking-widest flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Cargando Detalles...
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8 text-center text-muted-foreground uppercase tracking-widest">
                No se encontró la orden.
                <br />
                <Button variant="link" onClick={() => router.push('/admin/orders')} className="mt-4">
                    Volver a Pedidos
                </Button>
            </div>
        );
    }

    let address = order.shipping_address;
    if (typeof address === 'string') {
        try { address = JSON.parse(address); } catch (e) { }
    }

    const customerName = address?.full_name || order.guest_email || 'Cliente Desconocido';
    const totalItems = order.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
    const subtotal = order.order_items?.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0) || 0;
    const shippingCost = subtotal >= 800 ? 0 : 150;
    const actualTotal = Number(order.total_amount) || 0;
    const hasDiscount = actualTotal < (subtotal + shippingCost);
    const discountAmount = hasDiscount ? (subtotal + shippingCost) - actualTotal : 0;
    const packedCount = Object.values(packedItems).filter(Boolean).length;
    const allPacked = packedCount === order.order_items?.length && order.order_items?.length > 0;

    const copyAddress = () => {
        const text = `${address?.full_name}\n${address?.street} ${address?.exterior_number} ${address?.interior_number || ''}\nCol. ${address?.neighborhood}, C.P. ${address?.postal_code}\n${address?.city}, ${address?.state}, ${address?.country}\nTeléfono: ${address?.phone}\nInstrucciones: ${address?.delivery_instructions || 'N/A'}`;
        navigator.clipboard.writeText(text);
        alert('Dirección copiada al portapapeles');
    };

    return (
        <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 lg:px-0 pt-6 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-20 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-none bg-background text-foreground hover:bg-secondary">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold mb-1 block">Pedido</span>
                        <h1 className="text-3xl font-medium tracking-[0.1em] uppercase text-foreground">
                            #GS-{order.id}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={cn("rounded-none h-12 px-6 uppercase tracking-[0.15em] text-xs font-bold border-2 transition-all", getStatusColor(order.status))} disabled={updating}>
                                {getStatusLabel(order.status)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none w-48 font-medium uppercase tracking-widest text-xs">
                            <DropdownMenuItem onClick={() => handleStatusChange('Pendiente')}>Marcar Pendiente</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('Pagado')}>Marcar Pagado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('Enviado')}>Marcar Enviado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('Cancelado')} className="text-red-600">Cancelar Pedido</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Column 1 & 2: Main Content (Items & Timeline) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Pick & Pack Checklist */}
                    <Card className="rounded-none border border-border shadow-none overflow-hidden">
                        <div className="bg-secondary/30 p-4 border-b border-border flex items-center justify-between">
                            <h2 className="uppercase tracking-[0.15em] text-sm font-bold flex items-center gap-2">
                                <Box className="w-4 h-4" /> Checklist de Empaque
                            </h2>
                            <Badge variant="outline" className={cn("rounded-none tracking-[0.1em] text-[10px] uppercase font-bold", allPacked ? "bg-green-100 text-green-700 border-green-200" : "bg-background")}>
                                {packedCount} / {order.order_items?.length || 0} Empacados
                            </Badge>
                        </div>
                        <div className="divide-y divide-border">
                            {order.order_items?.map((item: any) => {
                                const isPacked = packedItems[item.id] || false;
                                return (
                                    <div key={item.id} className={cn("p-4 flex items-center gap-4 transition-colors", isPacked ? "bg-green-50/30" : "hover:bg-secondary/10")}>
                                        <Checkbox
                                            checked={isPacked}
                                            onCheckedChange={() => togglePacked(item.id)}
                                            className="w-5 h-5 rounded-none border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                        />

                                        <div className="w-16 h-16 bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                                            {item.product?.product_images?.[0]?.image_url ? (
                                                <img src={item.product.product_images[0].image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 text-muted-foreground/50" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className={cn("text-sm font-bold uppercase tracking-wider", isPacked && "line-through text-muted-foreground")}>{item.product?.name || 'Artículo Desconocido'}</h3>
                                            <div className="flex gap-4 mt-2">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Cant: {item.quantity}</p>
                                                {(item.variant_color || item.variant_size) && (
                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                                                        Variante: {item.variant_color} {item.variant_size}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-medium">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.price)}</p>
                                            <Badge variant="outline" className="mt-1 rounded-none text-[9px] uppercase tracking-widest border-border">
                                                Stock: {item.product?.stock ?? '?'}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {allPacked && (
                            <div className="bg-green-600 text-white p-3 text-center text-xs uppercase tracking-[0.2em] font-bold">
                                ¡Listo para enviar!
                            </div>
                        )}
                    </Card>

                </div>

                {/* Column 3: Logistics & Summary */}
                <div className="space-y-8">

                    {/* Logistics Card */}
                    <Card className="rounded-none border border-border shadow-none">
                        <div className="bg-foreground text-background p-4 border-b border-border">
                            <h2 className="uppercase tracking-[0.15em] text-sm font-bold flex items-center gap-2">
                                <Truck className="w-4 h-4" /> Envío y Logística
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Dirección</span>
                                    <button onClick={copyAddress} className="text-[10px] uppercase tracking-widest flex items-center gap-1 text-primary hover:underline font-bold">
                                        <Copy className="w-3 h-3" /> Copiar
                                    </button>
                                </div>
                                <div className="bg-secondary/20 p-4 border border-border/50 text-sm font-mono whitespace-pre-line text-muted-foreground leading-relaxed">
                                    {address?.full_name}<br />
                                    {address?.street} {address?.exterior_number} {address?.interior_number}<br />
                                    Col. {address?.neighborhood}, C.P. {address?.postal_code}<br />
                                    {address?.city}, {address?.state}, {address?.country}<br />
                                    Tel: {address?.phone}
                                    {address?.delivery_instructions && (
                                        <span className="block mt-2 pt-2 border-t border-border/50 italic">
                                            Nota: {address?.delivery_instructions}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground block">Guía de Rastreo (Añadir)</span>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Ej. THX12345678"
                                        className="rounded-none h-10 border-border bg-background placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                    <Button onClick={handleSaveTracking} disabled={updating || !trackingNumber} className="rounded-none h-10 font-bold uppercase tracking-widest px-6 text-xs bg-primary hover:bg-primary/90 text-background">
                                        {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Guardar'}
                                    </Button>
                                </div>
                                {address?.tracking_number && (
                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-2">
                                        <Check className="w-3 h-3" /> Guía generada y guardada.
                                    </p>
                                )}
                                {address?.label_url && (
                                    <a href={address.label_url} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1 mt-1 hover:underline">
                                        <ExternalLink className="w-3 h-3" /> Imprimir Etiqueta
                                    </a>
                                )}
                            </div>

                            <div className="pt-4 border-t border-border mt-4">
                                <SkydropxSheet
                                    orderId={orderId}
                                    totalAmount={order.total_amount}
                                    onSuccess={(tn, label) => {
                                        setTrackingNumber(tn);
                                        setOrder((prev: any) => ({
                                            ...prev,
                                            shipping_address: { ...address, tracking_number: tn, label_url: label },
                                            status: 'Enviado'
                                        }));
                                    }}
                                />
                            </div>

                        </div>
                    </Card>

                    {/* Financial Summary */}
                    <Card className="rounded-none border border-border shadow-none">
                        <div className="bg-secondary/30 p-4 border-b border-border">
                            <h2 className="uppercase tracking-[0.15em] text-sm font-bold">Resumen de Pago</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Artículos ({totalItems})</span>
                                <span className="font-medium">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Envío</span>
                                <span className="font-medium">{shippingCost === 0 ? "Gratis" : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(shippingCost)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span className="uppercase tracking-widest text-[10px] font-bold">Cupón / Descuento</span>
                                    <span className="font-medium">-{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(discountAmount)}</span>
                                </div>
                            )}

                            <div className="pt-4 border-t border-border mt-4 flex justify-between items-end">
                                <span className="uppercase tracking-[0.2em] text-xs font-bold text-foreground">Total Pagado</span>
                                <span className="text-3xl text-foreground font-medium">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(order.total_amount))}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-border mt-4">
                                <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold block mb-1">Método de Pago</span>
                                <div className="flex items-center gap-2 text-sm text-foreground font-medium uppercase tracking-wider">
                                    <div className="w-8 h-5 bg-secondary flex items-center justify-center border border-border rounded-sm">
                                        <svg viewBox="0 0 40 40" className="w-4 h-4 text-primary" fill="currentColor">
                                            <path d="M40 19.98c0 11.05-8.95 20-20 20s-20-8.95-20-20 8.95-20 20-20 20 8.95 20 20zM19.16 28.71c-1.39 0-3.15-.31-4.78-1.04v-4.04c1.61 1.05 3.1 1.63 4.54 1.63 1.8 0 2.58-.8 2.58-1.92 0-1.28-1.09-1.84-3.3-2.61-2.91-1.04-4.63-2.6-4.63-5.27 0-3.38 2.59-5.78 6.4-5.78 1.48 0 3.03.29 4.3.93v3.9c-1.27-.86-2.61-1.33-3.87-1.33-1.46 0-2.32.76-2.32 1.83 0 1.25 1.15 1.7 3.32 2.45 3.06 1.06 4.6 2.57 4.6 5.41.01 3.54-2.58 5.84-6.84 5.84z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs">Procesado de Forma Segura vía Stripe</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Customer Info */}
                    <Card className="rounded-none border border-border shadow-none">
                        <div className="p-6 space-y-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground block mb-2">Contacto de Cliente</span>
                            <p className="text-sm font-bold uppercase tracking-wider text-foreground">{customerName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{order.guest_email}</p>
                            <p className="text-xs text-muted-foreground font-mono">{address?.phone}</p>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )
}

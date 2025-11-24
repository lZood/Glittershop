'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle2,
    MapPin,
    CreditCard,
    HelpCircle,
    Download
} from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    // Mock Data based on ID (in a real app, fetch this)
    const order = {
        id: params.id,
        date: '22 Nov 2025',
        status: 'En camino',
        total: '$12,450',
        subtotal: '$10,950',
        shipping: '$150',
        tax: '$1,350',
        items: [
            {
                ...PlaceHolderImages.find(p => p.id === 'product-necklace-1'),
                quantity: 1,
                price: '$10,950',
                attributes: 'Oro 18k, 45cm'
            }
        ],
        timeline: [
            { status: 'Pedido Realizado', date: '22 Nov, 10:30 AM', completed: true },
            { status: 'Procesando', date: '22 Nov, 02:15 PM', completed: true },
            { status: 'Enviado', date: '23 Nov, 09:00 AM', completed: true },
            { status: 'Entregado', date: 'Estimado: 25 Nov', completed: false },
        ]
    };

    return (
        <div className="min-h-screen bg-background pb-20 pt-8">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">

                {/* Back Button */}
                <div className="mb-6">
                    <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
                        <Link href="/profile">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Volver a mi Perfil
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Pedido #{order.id}
                            <Badge className="text-base px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90">
                                {order.status}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1">Realizado el {order.date}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Factura
                        </Button>
                        <Button>
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Ayuda
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Items & Timeline */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Items List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Artículos del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary border flex-shrink-0">
                                            {item.imageUrl && (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt="Product"
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">{item.name || 'Producto'}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.attributes}</p>
                                                </div>
                                                <p className="font-bold text-lg">{item.price}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <Badge variant="secondary" className="font-normal">
                                                    Cantidad: {item.quantity}
                                                </Badge>
                                                <Button variant="link" className="h-auto p-0 text-primary">
                                                    Escribir Reseña
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Seguimiento del Envío</CardTitle>
                                <CardDescription>Paquete gestionado por DHL Express</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                                    {order.timeline.map((step, index) => (
                                        <div key={index} className="relative">
                                            <div className={`absolute -left-[29px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-background z-10 ${step.completed ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                                                {step.completed ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                                            </div>
                                            <div>
                                                <p className={`font-bold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.status}</p>
                                                <p className="text-xs text-muted-foreground">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column: Summary & Info */}
                    <div className="space-y-6">

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Envío</span>
                                    <span>{order.shipping}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Impuestos</span>
                                    <span>{order.tax}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total</span>
                                    <span className="font-black text-xl text-primary">{order.total}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Dirección de Envío
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-1">
                                <p className="font-bold text-foreground">José Carlos</p>
                                <p>Av. Reforma 222, Col. Juárez</p>
                                <p>Cuauhtémoc, CDMX</p>
                                <p>CP 06600, México</p>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    Método de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-zinc-800 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                                <div className="text-sm">
                                    <p className="font-bold">•••• 4242</p>
                                    <p className="text-xs text-muted-foreground">Expira 12/28</p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </div>
    );
}

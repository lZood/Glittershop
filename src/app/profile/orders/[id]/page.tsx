
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
    Download,
    ArrowLeft
} from 'lucide-react';

import { getOrderById } from '@/lib/actions/orders';
import { notFound } from 'next/navigation';

const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'Pendiente';
        case 'paid': return 'Pagado';
        case 'shipped': return 'Enviado';
        case 'delivered': return 'Entregado';
        case 'cancelled': return 'Cancelado';
        default: return status || 'Recibido';
    }
};

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = await params;
    // Fetch real order from DB
    const orderData = await getOrderById(orderId);

    if (!orderData) {
        notFound();
    }

    const {
        id,
        created_at,
        status,
        total_amount,
        order_items,
        shipping_address
    } = orderData;

    const shippingAddressObj = typeof shipping_address === 'string'
        ? JSON.parse(shipping_address)
        : (shipping_address || {});

    const date = new Date(created_at).toLocaleDateString();

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }

    const total = formatMoney(total_amount);
    // Approximate fields for visual structure (Stripe takes care of tax/shipping exactly, but we use order details here)
    const subtotal = total; // We are tracking total only right now in `orders`

    // Simulate timeline based on status
    const isCompleted = status === 'delivered' || status === 'Completado' || status === 'Entregado';
    const isShipped = status === 'shipped' || status === 'Enviado' || isCompleted;

    // Si ya está pagado, asumimos "Procesando" como completado
    const isPaid = status === 'paid' || status === 'Pagado' || isShipped;

    const timeline = [
        { status: 'Pedido Realizado', date: date, completed: true },
        { status: 'Procesando', date: isPaid ? date : '', completed: isPaid },
        { status: 'Enviado', date: '', completed: isShipped },
        { status: 'Entregado', date: '', completed: isCompleted },
    ];

    return (
        <div className="min-h-screen bg-secondary/5 pb-20 pt-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-6 -ml-4 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <Link href="/profile">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a Pedidos
                    </Link>
                </Button>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-4">
                            Pedido #{id}
                            <Badge className="text-sm px-4 py-1.5 shadow-sm uppercase tracking-wider font-extrabold bg-gradient-to-r from-green-600 to-green-500 text-white border-none">
                                {translateStatus(status)}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Realizado el <span className="text-foreground">{date}</span></p>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <Button variant="outline" className="rounded-full shadow-sm hover:border-primary/50 transition-colors">
                            <Download className="w-4 h-4 mr-2" />
                            Factura
                        </Button>
                        <Button className="rounded-full shadow-lg shadow-primary/20" asChild>
                            <Link href="/contact">Ayuda</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content (Left) */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Order Items */}
                        <Card className="border-none shadow-md overflow-hidden rounded-3xl">
                            <CardHeader className="bg-secondary/20 border-b border-border/50">
                                <CardTitle className="font-extrabold uppercase tracking-widest text-sm opacity-80">Artículos del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                {order_items.map((item: any, index: number) => {
                                    const variantText = [item.variant_color, item.variant_size].filter(Boolean).join(' • ');
                                    const image = item.product?.product_images?.[0]?.image_url;
                                    return (
                                        <div key={index} className="flex gap-6 items-start group">
                                            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white border shadow-sm flex-shrink-0">
                                                {image ? (
                                                    <Image
                                                        src={image}
                                                        alt="Product"
                                                        fill
                                                        className="object-cover p-1 transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                                                        <Package className="w-6 h-6 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h3 className="font-black text-lg md:text-xl text-foreground/90 leading-tight">{item.product?.name || 'Producto'}</h3>
                                                        <p className="text-sm text-primary font-bold mt-1">{variantText}</p>
                                                    </div>
                                                    <p className="font-black text-xl text-foreground">{formatMoney(item.price)}</p>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <Badge variant="secondary" className="font-bold bg-secondary/50 uppercase tracking-widest text-[10px]">
                                                        CANT: {item.quantity}
                                                    </Badge>
                                                    <Button variant="link" className="h-auto p-0 font-bold hover:text-primary/80 transition-colors uppercase text-xs tracking-wider">
                                                        Escribir Reseña
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        {/* Tracking Timeline */}
                        <Card className="border-none shadow-md overflow-hidden rounded-3xl">
                            <CardHeader className="bg-secondary/20 border-b border-border/50">
                                <CardTitle className="font-extrabold uppercase tracking-widest text-sm opacity-80 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Rastreo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
                                    {timeline.map((step, index) => (
                                        <div key={index} className="relative">
                                            <div className={`absolute -left-[33px] w-7 h-7 rounded-full border-[3px] flex items-center justify-center bg-background z-10 transition-colors ${step.completed ? 'border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'border-muted text-muted-foreground'}`}>
                                                {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                                            </div>
                                            <div className="-mt-1">
                                                <p className={`font-black uppercase tracking-widest text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.status}</p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{step.date || '...'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <Card className="border-none shadow-md overflow-hidden rounded-3xl sticky top-24">
                            <CardHeader className="bg-secondary/20 border-b border-border/50">
                                <CardTitle className="font-extrabold uppercase tracking-widest text-sm opacity-80">Resumen Financiero</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="flex justify-between items-center px-2 py-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <span className="font-black uppercase tracking-widest text-sm text-primary">Total Pagado</span>
                                    <span className="font-black text-2xl text-foreground">{total}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping details */}
                        <Card className="border-none shadow-md overflow-hidden rounded-3xl">
                            <CardHeader className="bg-secondary/20 border-b border-border/50">
                                <CardTitle className="font-extrabold uppercase tracking-widest text-sm opacity-80 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Dirección de Entrega
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2 p-6 leading-relaxed">
                                {shippingAddressObj?.full_name ? (
                                    <>
                                        <p className="font-bold text-foreground">{shippingAddressObj.full_name}</p>
                                        <p>{shippingAddressObj.street} {shippingAddressObj.exterior_number} {shippingAddressObj.interior_number && `Int ${shippingAddressObj.interior_number}`}</p>
                                        <p>{shippingAddressObj.neighborhood}, {shippingAddressObj.city}</p>
                                        <p>CP {shippingAddressObj.postal_code}, {shippingAddressObj.state}</p>
                                    </>
                                ) : (
                                    <p>No se especificó la dirección de envío.</p>
                                )}
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

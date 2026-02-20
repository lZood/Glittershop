'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  MapPin,
  Bell,
  ChevronRight,
  Star,
  Trophy,
  Mail,
  Phone,
  Plus,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { useSession } from '@/lib/supabase/session-provider';
import { createClient } from '@/lib/supabase/client';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, isLoading } = useSession();

  // Debug logs
  console.log('ProfilePage: Current State', {
    hasSession: !!session,
    hasUser: !!session?.user,
    hasProfile: !!profile,
    isLoading,
    userId: session?.user?.id
  });

  const user = session?.user;
  const [activeTab, setActiveTab] = useState('overview');

  const hasEmailInLastName = profile?.last_name && profile.last_name.includes('@');
  const lastName = profile?.last_name && !hasEmailInLastName ? profile.last_name : '';

  const displayName = profile?.first_name
    ? `${profile.first_name}${lastName ? ' ' + lastName : ''}`
    : user?.user_metadata?.first_name
    || user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Usuario';

  const initials = displayName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    console.log('Profile: Logout initiated');
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      console.log('Profile: Sign out successful');
      window.location.href = '/login';
    } catch (error) {
      console.error('Profile: Logout error:', error);
      // Forced redirect as fallback
      window.location.href = '/login';
    }
  };

  // Mock Data
  const recentOrder = {
    id: 'GS-88291',
    date: '22 Nov 2025',
    status: 'En camino',
    total: '$12,450',
    items: [PlaceHolderImages.find(p => p.id === 'product-necklace-1')]
  };

  const orders = [
    recentOrder,
    {
      id: 'GS-88102',
      date: '15 Oct 2025',
      status: 'Entregado',
      total: '$4,200',
      items: [PlaceHolderImages.find(p => p.id === 'product-ring-2')]
    },
    {
      id: 'GS-87955',
      date: '02 Sep 2025',
      status: 'Entregado',
      total: '$8,900',
      items: [PlaceHolderImages.find(p => p.id === 'product-earrings-1')]
    }
  ];

  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('ProfilePage: No user found, redirecting to login...');
      router.push('/login');
    }

    // Si terminó de cargar y no hay sesión ni usuario, y hubo timeout
    if (!isLoading && !session && !user) {
      setConnectionError(true);
    }
  }, [isLoading, user, session, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (connectionError && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <CardTitle>Error de Conexión</CardTitle>
            <CardDescription>
              No pudimos conectar con el servidor de Supabase. Por favor, verifica que tu conexión a internet sea estable y que el servidor esté activo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs bg-muted p-2 rounded font-mono break-all text-muted-foreground">
              URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
            </div>
            <Button className="w-full" onClick={() => window.location.reload()}>
              Reintentar conexión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect se encargará de la redirección
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Hero Section */}
      <div className="bg-secondary/30 border-b pb-8 pt-8 md:pt-12 relative overflow-hidden">
        {/* Close Button (X) */}
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/50 backdrop-blur hover:bg-background/80" asChild>
            <Link href="/">
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="mb-8">
            <Button variant="ghost" size="sm" className="bg-background/50 backdrop-blur hover:bg-background/80 flex items-center gap-2 group" asChild>
              <Link href="/">
                <ChevronRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                Volver a la Tienda
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background relative shadow-xl">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl md:text-4xl font-black bg-secondary text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-background rounded-full p-1.5 border border-border shadow-sm">
                <div className="bg-green-500 w-3 h-3 md:w-4 md:h-4 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">
                  Hola, {displayName}
                </h1>
                <p className="text-sm font-medium text-muted-foreground font-sans bg-muted/50 px-3 py-1 rounded-full border border-border/50 mb-4">
                  {user?.email}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge variant="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-background/50 backdrop-blur border-border/50">
                    Miembro desde {new Date(user?.created_at || Date.now()).getFullYear()}
                  </Badge>
                  <Badge className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none shadow-sm">
                    <Trophy className="w-3 h-3 mr-1.5" />
                    Oro Member
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1 bg-background/50 backdrop-blur p-4 rounded-xl border border-border/50 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Puntos Glitter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">2,450</span>
                <span className="text-xs font-medium text-muted-foreground">pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>

          {/* Navigation Tabs */}
          <div className="flex items-center overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="h-auto p-1 bg-muted/80 backdrop-blur rounded-full flex-nowrap">
              <TabsTrigger value="overview" className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                Ajustes
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Dashboard Content */}
            <div className="lg:col-span-2 space-y-8">
              <TabsContent value="overview" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Active Order Card */}
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-secondary/20">
                  <CardHeader className="border-b bg-secondary/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Pedido en Curso</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 font-bold uppercase text-[10px]">
                        {recentOrder.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border shadow-sm flex-shrink-0">
                        {recentOrder.items[0] && (
                          <Image
                            src={recentOrder.items[0].imageUrl}
                            alt="Product"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover p-1"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Pedido #{recentOrder.id}</p>
                        <h3 className="font-bold text-lg leading-tight">Collar de Diamantes "Eternity"</h3>
                        <p className="text-sm font-medium">Llega el <span className="text-primary">28 de Noviembre</span></p>
                      </div>
                      <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="mt-6 bg-secondary/30 rounded-full h-2 w-full overflow-hidden">
                      <div className="bg-primary h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] animate-pulse"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span>Procesado</span>
                      <span>Enviado</span>
                      <span>Entregado</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/wishlist" className="group">
                    <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                          <Heart className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black">12</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Favoritos</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <div className="group">
                    <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                          <Star className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black">3</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cupones</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

              </TabsContent>

              <TabsContent value="orders" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Pedidos</CardTitle>
                    <CardDescription>Revisa el estado de tus compras recientes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary border">
                            {order.items[0] && (
                              <Image
                                src={order.items[0].imageUrl}
                                alt="Product"
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm">Pedido #{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                            <div className="mt-1">
                              <Badge variant="outline" className="text-[10px] font-bold uppercase">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                          <p className="font-bold">{order.total}</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/profile/orders/${order.id}`}>Ver Detalles</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

                <Accordion type="single" collapsible className="w-full space-y-4">

                  {/* Personal Information */}
                  <AccordionItem value="personal-info" className="border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Información Personal</p>
                          <p className="text-xs text-muted-foreground font-normal">Nombre, Email, Teléfono</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre Completo</Label>
                          <Input id="name" defaultValue={displayName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={user?.email || ''} readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" placeholder="+52 (55) 1234 5678" />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button>Guardar Cambios</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Addresses */}
                  <AccordionItem value="addresses" className="border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Direcciones</p>
                          <p className="text-xs text-muted-foreground font-normal">Gestiona tus direcciones de envío</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg flex items-start justify-between bg-background">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm">Casa</span>
                              <Badge className="text-[10px]">Principal</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Av. Reforma 222, Col. Juárez</p>
                            <p className="text-sm text-muted-foreground">CDMX, México, 06600</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full border-dashed">
                          <Plus className="w-4 h-4 mr-2" /> Agregar Nueva Dirección
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Payment Methods */}
                  <AccordionItem value="payment" className="border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Métodos de Pago</p>
                          <p className="text-xs text-muted-foreground font-normal">Administra tus tarjetas guardadas</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg flex items-center justify-between bg-background">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-6 bg-zinc-800 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                            <div>
                              <p className="font-bold text-sm">•••• •••• •••• 4242</p>
                              <p className="text-xs text-muted-foreground">Expira 12/28</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                        <Button variant="outline" className="w-full border-dashed">
                          <Plus className="w-4 h-4 mr-2" /> Agregar Método de Pago
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Notifications */}
                  <AccordionItem value="notifications" className="border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Notificaciones</p>
                          <p className="text-xs text-muted-foreground font-normal">Elige cómo quieres que te contactemos</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Correos de Marketing</Label>
                            <p className="text-sm text-muted-foreground">Recibe noticias sobre nuevas colecciones y ofertas.</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Notificaciones de Pedidos</Label>
                            <p className="text-sm text-muted-foreground">Actualizaciones sobre el estado de tus compras.</p>
                          </div>
                          <Switch defaultChecked disabled />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Contact Preferences */}
                  <AccordionItem value="contact" className="border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Preferencias de Contacto</p>
                          <p className="text-xs text-muted-foreground font-normal">Opciones de mensajería</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="whatsapp" />
                          <Label htmlFor="whatsapp">Contactarme por WhatsApp para soporte</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sms" />
                          <Label htmlFor="sms">Recibir alertas SMS de entrega</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>

              </TabsContent>
            </div>

            {/* Sidebar / Quick Actions (Desktop) */}
            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-black/10 rounded-full blur-xl"></div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="font-black text-xl uppercase mb-2">Invita a un amigo</h3>
                  <p className="text-sm opacity-90 mb-4">Gana 500 puntos por cada amigo que realice su primera compra.</p>
                  <Button variant="secondary" className="w-full font-bold text-xs uppercase tracking-wider">
                    Copiar Link
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Accesos Rápidos</h4>
                {(profile?.role === 'admin' || user?.user_metadata?.role === 'admin') && (
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start text-left font-medium hover:bg-secondary/50">
                      <Shield className="w-4 h-4 mr-3" />
                      Panel de Administrador
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>

          </div>
        </Tabs>
      </div>
    </div>
  );
}

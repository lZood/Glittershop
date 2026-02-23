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
  X,
  Ticket,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSession } from '@/lib/supabase/session-provider';
import { createClient } from '@/lib/supabase/client';
import { Separator } from '@/components/ui/separator';
import { getUserOrders } from '@/lib/actions/orders';
import { getUserAddresses, Address, deleteAddress } from '@/lib/actions/address';
import { AddressForm } from '@/components/checkout/address-form';
import { useWishlist } from '@/lib/store/wishlist';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

const getOrderImage = (order: any) => {
  const firstItem = order.order_items?.[0];
  if (!firstItem) return null;
  const { product_images } = firstItem.product || {};
  if (product_images && product_images.length > 0) {
    return product_images[0].image_url;
  }
  return null;
};

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, isLoading } = useSession();
  const { toast } = useToast();

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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    console.log('Profile: Logout initiated');
    setIsLoggingOut(true);

    // Failsafe timer: if signOut hangs, redirect anyway after 2.5 seconds
    const logoutTimeout = setTimeout(() => {
      console.warn('Profile: Logout timed out, forcing transition');
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }, 2500);

    try {
      const supabase = createClient();
      console.log('Profile: Calling supabase.auth.signOut...');

      await supabase.auth.signOut();

      console.log('Profile: Sign out successful');
      clearTimeout(logoutTimeout);

      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Profile: Logout error:', error);
      clearTimeout(logoutTimeout);
      window.location.href = '/login';
    }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

  const [connectionError, setConnectionError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState<string | null>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponResult, setCouponResult] = useState<{ valid: boolean, message?: string, coupon?: any } | null>(null);
  const [myCoupons, setMyCoupons] = useState<any[]>([
    { code: 'GLITTER10', name: 'Bienvenida Glitter', discount: '10%', type: 'percentage', expires: '2026-12-31' }
  ]);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [userPoints, setUserPoints] = useState(profile?.glitter_points || 0);

  useEffect(() => {
    if (profile?.glitter_points !== undefined) {
      setUserPoints(profile.glitter_points);
    }
  }, [profile?.glitter_points]);

  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserOrders(),
        getUserAddresses()
      ]).then(([fetchedOrders, fetchedAddresses]) => {
        setOrders(fetchedOrders);
        setAddresses(fetchedAddresses);
        setIsLoadingData(false);
      }).catch(err => {
        console.error('Data fetch error:', err);
      });
    }
  }, [user]);

  // Derived
  const recentOrder = orders.length > 0 ? orders[0] : null;

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
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="pt-8 md:pt-4"></div>

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
                  <Badge className={cn(
                    "px-3 py-1 text-xs font-bold uppercase tracking-wider text-white border-none shadow-sm",
                    profile?.membership_tier === 'oro' ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                      profile?.membership_tier === 'plata' ? "bg-gradient-to-r from-slate-300 to-slate-500" :
                        "bg-gradient-to-r from-amber-700 to-amber-900"
                  )}>
                    <Trophy className="w-3 h-3 mr-1.5" />
                    {profile?.membership_tier || 'Bronze'} Member
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1 bg-background/50 backdrop-blur p-4 rounded-xl border border-border/50 shadow-sm min-w-[140px]">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Puntos Glitter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">{userPoints.toLocaleString()}</span>
                <span className="text-xs font-medium text-muted-foreground">pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

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
                {recentOrder ? (
                  <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-background via-secondary/10 to-primary/5 hover:shadow-primary/10 transition-shadow duration-500 rounded-3xl relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none border border-border/50">
                    <CardHeader className="border-b border-border/50 bg-secondary/20 pb-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/80">Último Pedido</CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200/50 shadow-sm font-black uppercase tracking-wider text-[10px] px-3 py-1">
                          {translateStatus(recentOrder.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white border border-border/50 shadow-inner flex-shrink-0 group">
                          {getOrderImage(recentOrder) ? (
                            <Image
                              src={getOrderImage(recentOrder)}
                              alt="Product"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover p-1 transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                              <Package className="w-6 h-6 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">Pedido #{recentOrder.id}</p>
                          <h3 className="font-black text-xl md:text-2xl leading-tight line-clamp-2 text-foreground/90">{recentOrder.order_items?.[0]?.product?.name || 'Varios Artículos'}</h3>
                          <p className="text-sm font-medium text-muted-foreground pt-1">Fecha: <span className="text-primary font-bold">{new Date(recentOrder.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                        </div>
                        <Button size="icon" variant="default" className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-12 w-12 shrink-0 group" asChild>
                          <Link href={`/profile/orders/${recentOrder.id}`}>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                        {recentOrder ? (
                          <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-background via-secondary/10 to-primary/5 hover:shadow-primary/10 transition-shadow duration-500 rounded-3xl relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none border border-border/50">
                            <CardHeader className="border-b border-border/50 bg-secondary/20 pb-4 backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    <Package className="w-5 h-5 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/80">Último Pedido</CardTitle>
                                </div>
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200/50 shadow-sm font-black uppercase tracking-wider text-[10px] px-3 py-1">
                                  {translateStatus(recentOrder.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                              <div className="flex items-center gap-6 md:gap-8">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white border border-border/50 shadow-inner flex-shrink-0 group">
                                  {getOrderImage(recentOrder) ? (
                                    <Image
                                      src={getOrderImage(recentOrder)}
                                      alt="Product"
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      className="object-cover p-1 transition-transform duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                                      <Package className="w-6 h-6 text-muted-foreground/50" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">Pedido #{recentOrder.id}</p>
                                  <h3 className="font-black text-xl md:text-2xl leading-tight line-clamp-2 text-foreground/90">{recentOrder.order_items?.[0]?.product?.name || 'Varios Artículos'}</h3>
                                  <p className="text-sm font-medium text-muted-foreground pt-1">Fecha: <span className="text-primary font-bold">{new Date(recentOrder.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                                </div>
                                <Button size="icon" variant="default" className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-12 w-12 shrink-0 group" asChild>
                                  <Link href={`/profile/orders/${recentOrder.id}`}>
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="overflow-hidden shadow-sm rounded-3xl border-dashed border-2">
                            <CardContent className="p-12 text-center text-muted-foreground">
                              No tienes pedidos recientes. <br />
                              <Link href="/shop" className="text-primary hover:text-primary/80 transition-colors mt-4 inline-block font-black uppercase tracking-widest text-sm">Explorar Boutique</Link>
                            </CardContent>
                          </Card>
                        )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="overflow-hidden shadow-sm rounded-3xl border-dashed border-2">
                    <CardContent className="p-12 text-center text-muted-foreground">
                      No tienes pedidos recientes. <br />
                      <Link href="/shop" className="text-primary hover:text-primary/80 transition-colors mt-4 inline-block font-black uppercase tracking-widest text-sm">Explorar Boutique</Link>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/wishlist" className="group">
                    <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                          <Star className="w-6 h-6" />
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-2xl font-black">{mounted ? wishlistItems.length : '-'}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lista de deseos</p>
                            <p className="text-2xl font-black">{mounted ? wishlistItems.length : '-'}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lista de deseos</p>
                          </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <button onClick={() => setActiveTab('coupons')} className="group text-left w-full h-full">
                    <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black">{myCoupons.length}</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cupones</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                </div>

                {/* Membership Tiers Info */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-background to-secondary/10 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Beneficios de Nivel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { tier: 'bronze', label: 'Bronze', perc: '2%', color: 'from-amber-700 to-amber-900' },
                        { tier: 'plata', label: 'Plata', perc: '3%', color: 'from-slate-300 to-slate-500' },
                        { tier: 'oro', label: 'Oro', perc: '5%', color: 'from-amber-400 to-amber-600' },
                      ].map((t) => (
                        <div key={t.tier} className={cn(
                          "relative p-4 rounded-2xl flex flex-col items-center gap-1 border transition-all duration-300",
                          profile?.membership_tier === t.tier
                            ? "bg-background shadow-lg border-primary/20 scale-105 z-10"
                            : "bg-muted/30 border-transparent opacity-60"
                        )}>
                          {profile?.membership_tier === t.tier && (
                            <Badge className="absolute -top-2 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-primary text-primary-foreground border-none">
                              Tu Nivel
                            </Badge>
                          )}
                          <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white mb-1 shadow-sm", t.color)}>
                            <Trophy className="w-4 h-4" />
                          </div>
                          <span className="font-black text-xs uppercase tracking-tighter">{t.label}</span>
                          <span className="text-lg font-black text-primary leading-none">{t.perc}</span>
                          <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-tighter text-center">Cashback en Puntos</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-6 text-center italic font-medium">
                      * El porcentaje de puntos se calcula sobre el total de tu compra. ¡Sube de nivel comprando más!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Pedidos</CardTitle>
                    <CardDescription>Revisa el estado de tus compras recientes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {orders.length === 0 ? (
                      <div className="text-center p-8 text-muted-foreground">Aún no has realizado pedidos.</div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border shadow-sm group-hover:shadow-md transition-shadow">
                              {getOrderImage(order) ? (
                                <Image
                                  src={getOrderImage(order)}
                                  alt="Product"
                                  fill
                                  className="object-cover p-1 transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-secondary/20 flex flex-col items-center justify-center">
                                  <Package className="w-4 h-4 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-base text-foreground/90">Pedido #{order.id}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                              <div className="mt-2 text-left">
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-secondary/30">
                                  {translateStatus(order.status)}
                                </Badge>
                              </div>
                    {orders.length === 0 ? (
                      <div className="text-center p-8 text-muted-foreground">Aún no has realizado pedidos.</div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border shadow-sm group-hover:shadow-md transition-shadow">
                              {getOrderImage(order) ? (
                                <Image
                                  src={getOrderImage(order)}
                                  alt="Product"
                                  fill
                                  className="object-cover p-1 transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-secondary/20 flex flex-col items-center justify-center">
                                  <Package className="w-4 h-4 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-base text-foreground/90">Pedido #{order.id}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                              <div className="mt-2 text-left">
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-secondary/30">
                                  {translateStatus(order.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:pr-4">
                            <p className="font-black text-lg text-primary">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.total_amount)}</p>
                            <Button variant="ghost" className="hover:bg-primary hover:text-primary-foreground transition-colors rounded-full" asChild>
                              <Link href={`/profile/orders/${order.id}`}>Ver Detalles</Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coupons" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                {/* Points Redemption Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Canjear Puntos Glitter</h3>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter bg-primary/5 text-primary border-primary/20">
                      Tus Puntos: {userPoints.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'pts-500', points: 500, label: '$50 MXN', desc: 'Descuento' },
                      { id: 'pts-1000', points: 1000, label: '$100 MXN', desc: 'Descuento' },
                      { id: 'pts-2000', points: 2000, label: '10% OFF', desc: 'Todo el Carrito' },
                      { id: 'pts-5000', points: 5000, label: '25% OFF', desc: 'Súper Cupón' },
                    ].map((opt) => (
                      <Card key={opt.id} className={cn(
                        "relative overflow-hidden group cursor-pointer border-2 transition-all duration-300",
                        userPoints >= opt.points ? "border-primary/20 hover:border-primary bg-card" : "opacity-60 bg-muted/30 grayscale pointer-events-none"
                      )} onClick={async () => {
                        if (userPoints < opt.points || isRedeeming) return;
                        setIsRedeeming(true);
                        try {
                          const res = await fetch('/api/points/redeem', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ optionId: opt.id })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setMyCoupons([data.coupon, ...myCoupons]);
                            setUserPoints(data.remainingPoints);
                            setCouponResult({ valid: true, message: `¡Has canjeado ${opt.label} con éxito!` });
                          } else {
                            setCouponResult({ valid: false, message: data.error });
                          }
                        } catch (e) {
                          setCouponResult({ valid: false, message: 'Error de conexión' });
                        } finally {
                          setIsRedeeming(false);
                        }
                      }}>
                        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:scale-110",
                            userPoints >= opt.points ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            <Star className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                            <p className="font-black text-lg leading-none">{opt.label}</p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{opt.desc}</p>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-[10px] font-black h-5">
                            {opt.points} PTS
                          </Badge>

                          {/* Progress bar if not enough points */}
                          {userPoints < opt.points && (
                            <div className="w-full bg-secondary h-1 rounded-full mt-2 overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (userPoints / opt.points) * 100)}%` }}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card className="border-none shadow-xl bg-gradient-to-br from-secondary/20 to-primary/5 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/80">Canjear Cupón</CardTitle>
                    <CardDescription>Ingresa tu código promocional para añadirlo a tu cuenta.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Input
                          placeholder="EJ: GLITTER2026"
                          className="h-12 uppercase font-black tracking-widest text-center md:text-left"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            if (couponResult) setCouponResult(null);
                          }}
                        />
                        <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 pointer-events-none" />
                      </div>
                      <Button
                        className="h-12 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        disabled={!couponCode || isValidatingCoupon}
                        onClick={async () => {
                          setIsValidatingCoupon(true);
                          try {
                            const res = await fetch('/api/coupons/validate', {
                              method: 'POST',
                              body: JSON.stringify({ couponCode })
                            });
                            const data = await res.json();
                            setCouponResult(data);
                            if (data.valid) {
                              if (!myCoupons.find(c => c.code === data.coupon.code)) {
                                setMyCoupons([data.coupon, ...myCoupons]);
                              }
                            }
                          } catch (e) {
                            setCouponResult({ valid: false, message: 'Error de conexión' });
                          } finally {
                            setIsValidatingCoupon(false);
                          }
                        }}
                      >
                        {isValidatingCoupon ? 'Validando...' : 'Canjear'}
                      </Button>
                    </div>

                    {couponResult && (
                      <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 animate-in zoom-in-95 duration-200 ${couponResult.valid
                        ? 'bg-green-500/10 border-green-200 text-green-700'
                        : 'bg-destructive/10 border-destructive/20 text-destructive'
                        }`}>
                        {couponResult.valid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="text-sm font-bold">{couponResult.message || (couponResult.valid ? `¡Cupón ${couponResult.coupon.code} aplicado con éxito!` : 'Error al validar')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Tus Cupones Disponibles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCoupons.map((coupon) => (
                      <div key={coupon.code} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <Card className="relative border-2 border-dashed bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
                          <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Ticket className="w-5 h-5 text-primary" />
                              </div>
                              <Badge variant="secondary" className="font-black text-[10px] tracking-tighter">
                                {coupon.type === 'percentage' ? 'DESCUENTO %' : 'ABONO $'}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-black text-2xl tracking-tighter text-primary">{coupon.discount} OFF</h4>
                              <p className="text-sm font-bold text-foreground/80">{coupon.name}</p>
                              <div className="flex items-center gap-2 pt-2">
                                <code className="bg-muted px-2 py-1 rounded text-xs font-mono font-black border border-border/50 uppercase">
                                  {coupon.code}
                                </code>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-black uppercase" onClick={() => {
                                  if (typeof window !== 'undefined') {
                                    navigator.clipboard.writeText(coupon.code);
                                  }
                                }}>Copiar</Button>
                              </div>
                            </div>
                            <Separator className="my-4 opacity-50" />
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                              Vence el: {new Date(coupon.expires || Date.now()).toLocaleDateString('es-MX')}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
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
                        {isAddingAddress || editingAddress ? (
                          <div className="bg-background rounded-lg p-2 border">
                            <AddressForm
                              existingAddress={editingAddress}
                              onSuccess={async () => {
                                setIsAddingAddress(false);
                                setEditingAddress(undefined);
                                const newAddresses = await getUserAddresses();
                                setAddresses(newAddresses);
                              }}
                              onCancel={() => {
                                setIsAddingAddress(false);
                                setEditingAddress(undefined);
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            {addresses.length === 0 ? (
                              <p className="text-muted-foreground text-sm py-4 text-center">No tienes direcciones guardadas.</p>
                            ) : (
                              addresses.map(addr => (
                                <div key={addr.id} className="p-4 border rounded-lg flex items-start justify-between bg-background">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-sm">{addr.full_name}</span>
                                      {addr.is_default && <Badge className="text-[10px]">Principal</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{addr.street} {addr.exterior_number} {addr.interior_number && `Int ${addr.interior_number}`}</p>
                                    <p className="text-sm text-muted-foreground">{addr.neighborhood}, {addr.city}, {addr.state} {addr.postal_code}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => setEditingAddress(addr)}
                                      disabled={!!isDeletingAddress}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                      disabled={!!isDeletingAddress}
                                      onClick={async () => {
                                        if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
                                          setIsDeletingAddress(addr.id);
                                          const result = await deleteAddress(addr.id);
                                          if (result.success) {
                                            const newAddresses = await getUserAddresses();
                                            setAddresses(newAddresses);
                                            toast({
                                              title: "Dirección eliminada",
                                              description: "La dirección ha sido eliminada correctamente."
                                            });
                                          } else {
                                            toast({
                                              title: "Error",
                                              description: result.error || "No se pudo eliminar la dirección",
                                              variant: "destructive"
                                            });
                                          }
                                          setIsDeletingAddress(null);
                                        }
                                      }}
                                    >
                                      {isDeletingAddress === addr.id ? (
                                        <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-dashed"
                              onClick={() => setIsAddingAddress(true)}
                              disabled={!!isDeletingAddress}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Agregar Nueva Dirección
                            </Button>
                          </>
                        )}
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
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="w-4 h-4 mr-3 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                            Cerrando sesión...
                          </>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4 mr-3" />
                            Cerrar Sesión
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                </div>
              </Tabs >
            </div >
          </div >
          );
}

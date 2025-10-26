'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight } from 'lucide-react';
import { useSession } from '@/lib/supabase/session-provider';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;
  const profile = session?.profile;
  
  const orderNecklaceImage = PlaceHolderImages.find(p => p.id === 'product-necklace-1');
  const rewardsNecklaceImage = PlaceHolderImages.find(p => p.id === 'product-necklace-pearl');

  const accountLinks = [
    { href: '#', label: 'Mis Pedidos' },
    { href: '#', label: 'Mis Direcciones' },
    { href: '#', label: 'Métodos de Pago' },
    { href: '#', label: 'Mis Datos y Preferencias' },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-8">Hola, {displayName}</h1>

        {/* Order Tracking Card */}
        <Card className="mb-6 bg-amber-50/50 border-amber-200 p-0 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Tu pedido #GS-12345 está en camino</p>
              <p className="text-lg font-bold mt-1">Entrega estimada: 28 de Julio</p>
              <p className="text-sm text-muted-foreground">Collar de diamantes</p>
              <Button className="mt-4 h-9 px-6 rounded-full font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }}>
                Rastrear envío
              </Button>
            </div>
            {orderNecklaceImage && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white">
                <Image
                  src={orderNecklaceImage.imageUrl}
                  alt={orderNecklaceImage.description}
                  data-ai-hint={orderNecklaceImage.imageHint}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card className="mb-10 bg-amber-50/50 border-amber-200 p-0 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="flex-1">
              <p className="text-sm text-muted-foreground">Tienes 850 Puntos Glitter</p>
              <p className="text-xl font-bold mt-1">Desbloquea recompensas exclusivas</p>
              <Link href="#" className="text-yellow-600 font-bold text-sm mt-2 inline-block">
                Ver mis recompensas
              </Link>
            </div>
            {rewardsNecklaceImage && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white">
                <Image
                  src={rewardsNecklaceImage.imageUrl}
                  alt={rewardsNecklaceImage.description}
                  data-ai-hint={rewardsNecklaceImage.imageHint}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Section */}
        <h2 className="text-2xl font-bold mb-4">Mi Cuenta</h2>
        <Card>
          <div className="divide-y">
            {accountLinks.map((link) => (
              <Link href={link.href} key={link.label}>
                <div className="flex items-center justify-between p-4 hover:bg-accent cursor-pointer">
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
             <div onClick={handleLogout} className="flex items-center justify-between p-4 hover:bg-accent cursor-pointer">
                <span className="font-medium text-red-600">Cerrar Sesión</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

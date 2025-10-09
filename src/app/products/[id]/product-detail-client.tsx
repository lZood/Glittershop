'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Camera, Eye } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/types';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    );
  }
  return stars;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const socialImages = [
    PlaceHolderImages.find((p) => p.id === 'social-1'),
    PlaceHolderImages.find((p) => p.id === 'social-2'),
    PlaceHolderImages.find((p) => p.id === 'social-3'),
  ].filter(Boolean) as (typeof PlaceHolderImages[0])[];

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const rating = product.rating || 0;
  const reviews = product.reviews || 0;

  return (
    <div className="bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="relative aspect-square w-full max-w-md mx-auto bg-secondary rounded-lg overflow-hidden mb-6">
          {product.image && (
            <Image
              src={product.image.imageUrl}
              alt={product.description}
              data-ai-hint={product.image.imageHint}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant="outline"
            className="rounded-full bg-accent hover:bg-border text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista 360°
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-accent hover:bg-border text-sm"
          >
            <Camera className="w-4 h-4 mr-2" />
            Pruébatelo en AR
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Button variant="ghost" size="icon">
              <Star className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
            <span className="text-sm text-muted-foreground">
              {rating.toFixed(1)} ({reviews} reviews)
            </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="text-sm font-medium text-green-600 mt-1">En stock</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="size">Tamaño</label>
            <Select>
              <SelectTrigger id="size">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="metal">Metal</label>
            <Select>
              <SelectTrigger id="metal">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oro-blanco">Oro Blanco</SelectItem>
                <SelectItem value="oro-amarillo">Oro Amarillo</SelectItem>
                <SelectItem value="platino">Platino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="gem">Gema</label>
            <Select>
              <SelectTrigger id="gem">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diamante">Diamante</SelectItem>
                <SelectItem value="zafiro">Zafiro</SelectItem>
                <SelectItem value="esmeralda">Esmeralda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          Un anillo atemporal que simboliza el amor eterno. Hecho a mano con
          diamantes de origen ético y metales preciosos.
        </p>

        <Accordion type="single" collapsible className="w-full mb-8">
          <AccordionItem value="item-1">
            <AccordionTrigger>Materiales y Cuidados</AccordionTrigger>
            <AccordionContent>
              Oro de 18k, diamantes de origen ético. Limpiar suavemente con un
              paño suave.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Dimensiones</AccordionTrigger>
            <AccordionContent>
              Banda de 2mm. Diamante central de 1.5 quilates.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Origen</AccordionTrigger>
            <AccordionContent>
              Hecho a mano en nuestro taller de Valencia, España.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Envío y Devoluciones</AccordionTrigger>
            <AccordionContent>
              Envío gratuito en 3-5 días. Devoluciones gratuitas en 30 días.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="text-center text-red-500 font-bold mb-8">
          ¡Solo quedan 5 en stock!
        </p>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Así lo llevas tú</h2>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {socialImages.map((img) => (
              <div key={img.id} className="relative aspect-square">
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  data-ai-hint={img.imageHint}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Valoraciones y Reseñas</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/isabella/40/40" />
                <AvatarFallback>I</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Isabella</p>
                <p className="text-xs text-muted-foreground">Hace 1 mes</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {renderStars(5)}
                </div>
                <p className="mt-2 text-sm">
                  Precioso anillo, superó mis expectativas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/sophia/40/40" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Sophia</p>
                <p className="text-xs text-muted-foreground">Hace 2 meses</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {renderStars(4)}
                </div>
                <p className="mt-2 text-sm">
                  Buen anillo, pero el tamaño es un poco grande.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
        <div className="container mx-auto max-w-2xl">
          <Button
            className="w-full h-12 text-lg font-bold"
            style={{ backgroundColor: '#FDB813', color: 'black' }}
          >
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}

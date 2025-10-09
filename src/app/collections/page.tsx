'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type Collection = {
  name: string;
  tagline: string;
  image: ImagePlaceholder;
  href: string;
};

const collectionsData: Collection[] = [
  {
    name: 'Luz de Luna',
    tagline: 'Capturando la magia del cielo nocturno.',
    image: PlaceHolderImages.find(p => p.id === 'collection-moonlight')!,
    href: '/collections/luz-de-luna',
  },
  {
    name: 'Verano Mediterráneo',
    tagline: 'La calidez del sol y la brisa del mar en cada joya.',
    image: PlaceHolderImages.find(p => p.id === 'collection-summer-hero')!,
    href: '/collections/verano-mediterraneo',
  },
  {
    name: 'Geometría Urbana',
    tagline: 'Líneas limpias y diseños audaces para la ciudad.',
    image: PlaceHolderImages.find(p => p.id === 'collection-urban')!,
    href: '/collections/geometria-urbana',
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-background">
      <header className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Nuestras Colecciones</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Cada pieza cuenta una historia. Descubre la tuya.
        </p>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="space-y-8">
          {collectionsData.map((collection) => (
            collection.image && (
              <section key={collection.name} aria-labelledby={`collection-title-${collection.name}`}>
                <div className="relative w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden group">
                  <Image
                    src={collection.image.imageUrl}
                    alt={collection.image.description}
                    data-ai-hint={collection.image.imageHint}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h2 id={`collection-title-${collection.name}`} className="text-4xl md:text-5xl font-headline font-bold drop-shadow-lg">
                      {collection.name}
                    </h2>
                    <p className="mt-2 text-lg text-white/90 drop-shadow-md max-w-sm">
                      {collection.tagline}
                    </p>
                    <Button asChild className="mt-6 font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }} size="lg">
                      <Link href={collection.href}>Descubrir Colección</Link>
                    </Button>
                  </div>
                </div>
              </section>
            )
          ))}
        </div>
      </main>
    </div>
  );
}

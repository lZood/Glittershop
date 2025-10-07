
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GiftGuideForm from '@/components/gift-guide-form';

export default function GiftGuidePage() {
  const giftGuideImage = PlaceHolderImages.find(p => p.id === 'product-gift-guide');
  
  return (
    <div>
      <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
        {giftGuideImage && (
          <Image
            src={giftGuideImage.imageUrl}
            alt={giftGuideImage.description}
            data-ai-hint={giftGuideImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-white drop-shadow-lg">
            El Regalo Perfecto te Espera
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl !text-white/90 drop-shadow-md">
            Responde 3 preguntas rápidas y descubre la joya ideal para esa persona especial.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold text-lg" style={{ backgroundColor: '#FDB813', color: 'black' }}>
            <Link href="#gift-form">Comenzar Guía</Link>
          </Button>
        </div>
      </section>
      
      <section id="gift-form" className="container mx-auto px-4 py-16 md:py-24">
        <GiftGuideForm />
      </section>
    </div>
  );
}

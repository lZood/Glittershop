import GiftGuideForm from '@/components/gift-guide-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function GiftGuidePage() {
  const giftGuideImage = PlaceHolderImages.find(p => p.id === 'product-gift-guide');
  
  return (
    <div>
      <section className="relative w-full h-[40vh] text-white">
        {giftGuideImage && (
          <Image
            src={giftGuideImage.imageUrl}
            alt={giftGuideImage.description}
            data-ai-hint={giftGuideImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-white drop-shadow-lg">
            The Perfect Gift Awaits
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl !text-white/90 drop-shadow-md">
            Answer a few questions and let our AI-powered guide find a gift they'll treasure forever.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12 md:py-16">
        <GiftGuideForm />
      </section>
    </div>
  );
}

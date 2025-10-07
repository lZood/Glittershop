import InteractiveGiftGuideForm from '@/components/interactive-gift-guide-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function InteractiveGiftGuidePage() {
  const interactiveGiftGuideImage = PlaceHolderImages.find(p => p.id === 'interactive-gift-guide');

  return (
    <div>
      <section className="relative w-full h-[40vh] text-white">
        {interactiveGiftGuideImage && (
          <Image
            src={interactiveGiftGuideImage.imageUrl}
            alt={interactiveGiftGuideImage.description}
            data-ai-hint={interactiveGiftGuideImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-white drop-shadow-lg">
            Interactive Gift Finder
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl !text-white/90 drop-shadow-md">
            Let our AI guide you to the perfect piece of jewelry with a few simple questions.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <InteractiveGiftGuideForm />
      </section>
    </div>
  );
}

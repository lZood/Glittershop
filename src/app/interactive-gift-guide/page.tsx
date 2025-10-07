import MultiStepGiftGuide from '@/components/multi-step-gift-guide';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function InteractiveGiftGuidePage() {
  const interactiveGiftGuideImage = PlaceHolderImages.find(p => p.id === 'interactive-gift-guide');

  return (
    <div className="bg-background">
      <section className="container mx-auto px-4 py-12 md:py-16">
        <MultiStepGiftGuide />
      </section>
    </div>
  );
}

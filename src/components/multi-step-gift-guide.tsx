'use client';

import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const steps = [
  {
    id: 1,
    title: '¿Para quién es el regalo?',
    options: [
      { id: 'pareja', label: 'Para mi Pareja', imageId: 'gift-guide-couple' },
      { id: 'familiar', label: 'Para un Familiar', subLabel: '(Mamá, hermana, etc.)', imageId: 'gift-guide-family' },
      { id: 'amiga', label: 'Para una Amiga', imageId: 'gift-guide-friend' },
      { id: 'para-mi', label: 'Para Mí', imageId: 'gift-guide-for-me' },
    ],
  },
  // Add other steps here
];

export default function MultiStepGiftGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle submission
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">Paso {currentStep + 1} de {totalSteps}</p>
        <Progress value={((currentStep + 1) / totalSteps) * 100} />
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">{currentStepData.title}</h2>

      {currentStep === 0 && (
        <div className="grid grid-cols-2 gap-4">
          {currentStepData.options.map((option) => {
            const image = PlaceHolderImages.find(p => p.id === option.imageId);
            return (
              <Card key={option.id} className="cursor-pointer hover:border-primary transition-colors overflow-hidden" onClick={handleNext}>
                <div className="relative aspect-square w-full bg-secondary">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      data-ai-hint={image.imageHint}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-4 text-center">
                  <p className="font-semibold">{option.label}</p>
                  {option.subLabel && <p className="text-sm text-muted-foreground">{option.subLabel}</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

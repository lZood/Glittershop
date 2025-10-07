'use server';

import {
  generateGiftRecommendations,
  type GiftGuideInput,
  type GiftGuideOutput,
} from '@/ai/flows/gift-guide-personalization';
import { z } from 'zod';

const giftGuideSchema = z.object({
  occasion: z.string().min(3, 'Please describe the occasion.'),
  recipient: z.string().min(2, 'Please describe the recipient.'),
  stylePreferences: z.string().min(3, 'Please describe their style.'),
});

type State = {
  status: 'initial' | 'success' | 'error';
  message: string;
  data: GiftGuideOutput | null;
}

export async function getGiftSuggestions(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = giftGuideSchema.safeParse({
    occasion: formData.get('occasion'),
    recipient: formData.get('recipient'),
    stylePreferences: formData.get('stylePreferences'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: "Please fill out all fields.",
      data: null,
    };
  }
  
  try {
    const result = await generateGiftRecommendations(validatedFields.data as GiftGuideInput);
    return {
      status: 'success',
      message: 'Here are your personalized suggestions!',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'An error occurred while generating suggestions. Please try again.',
      data: null,
    };
  }
}

'use server';

import {
  generateInteractiveGiftRecommendations,
  type InteractiveGiftGuideInput,
  type InteractiveGiftGuideOutput,
} from '@/ai/flows/interactive-gift-guide';
import { z } from 'zod';

const interactiveGiftGuideSchema = z.object({
  occasion: z.string().min(3, 'Please describe the occasion.'),
  recipient: z.string().min(2, 'Please describe the recipient.'),
  jewelryType: z.string().min(3, 'Please select a jewelry type.'),
  stylePreferences: z.string().min(3, 'Please describe their style.'),
  budget: z.string().min(3, 'Please select a budget.'),
  additionalDetails: z.string().optional(),
});

type State = {
  status: 'initial' | 'success' | 'error';
  message: string;
  data: InteractiveGiftGuideOutput | null;
}

export async function getInteractiveGiftSuggestions(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = interactiveGiftGuideSchema.safeParse({
    occasion: formData.get('occasion'),
    recipient: formData.get('recipient'),
    jewelryType: formData.get('jewelryType'),
    stylePreferences: formData.get('stylePreferences'),
    budget: formData.get('budget'),
    additionalDetails: formData.get('additionalDetails'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: "Please fill out all required fields.",
      data: null,
    };
  }

  try {
    const result = await generateInteractiveGiftRecommendations(validatedFields.data as InteractiveGiftGuideInput);
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

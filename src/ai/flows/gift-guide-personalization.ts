'use server';
/**
 * @fileOverview A gift recommendation AI agent.
 *
 * - generateGiftRecommendations - A function that handles the gift recommendation process.
 * - GiftGuideInput - The input type for the generateGiftRecommendations function.
 * - GiftGuideOutput - The return type for the generateGiftRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GiftGuideInputSchema = z.object({
  occasion: z.string().describe('The occasion for the gift.'),
  recipient: z.string().describe('The recipient of the gift (e.g., mother, friend, significant other).'),
  stylePreferences: z.string().describe('The style preferences of the recipient (e.g., modern, classic, minimalist).'),
});
export type GiftGuideInput = z.infer<typeof GiftGuideInputSchema>;

const GiftGuideOutputSchema = z.object({
  productSuggestions: z.array(z.string()).describe('A list of personalized product suggestions based on the input criteria.'),
  reasoning: z.string().describe('The reasoning behind the product suggestions.'),
});
export type GiftGuideOutput = z.infer<typeof GiftGuideOutputSchema>;

export async function generateGiftRecommendations(input: GiftGuideInput): Promise<GiftGuideOutput> {
  return giftGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'giftGuidePrompt',
  input: {schema: GiftGuideInputSchema},
  output: {schema: GiftGuideOutputSchema},
  prompt: `You are a personal gift recommendation assistant. Based on the occasion, recipient, and style preferences, you will provide personalized product suggestions.

Occasion: {{{occasion}}}
Recipient: {{{recipient}}}
Style Preferences: {{{stylePreferences}}}

Please provide a list of product suggestions and the reasoning behind your choices.`,
});

const giftGuideFlow = ai.defineFlow(
  {
    name: 'giftGuideFlow',
    inputSchema: GiftGuideInputSchema,
    outputSchema: GiftGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

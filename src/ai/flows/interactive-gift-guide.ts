'use server';
/**
 * @fileOverview An interactive gift guide AI agent that provides personalized jewelry recommendations.
 *
 * - generateInteractiveGiftRecommendations - A function that handles the interactive gift recommendation process.
 * - InteractiveGiftGuideInput - The input type for the generateInteractiveGiftRecommendations function.
 * - InteractiveGiftGuideOutput - The return type for the generateInteractiveGiftRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveGiftGuideInputSchema = z.object({
  occasion: z.string().describe('The occasion for the gift (e.g., birthday, anniversary, holiday).'),
  recipient: z.string().describe('The recipient of the gift (e.g., mother, friend, significant other).'),
  jewelryType: z.string().describe('The type of jewelry desired (e.g., necklace, earrings, bracelet, ring).'),
  stylePreferences: z.string().describe('The style preferences of the recipient (e.g., modern, classic, minimalist, vintage).'),
  budget: z.string().describe('The budget for the gift (e.g., under $50, $50-$100, $100-$200, over $200).'),
  additionalDetails: z.string().optional().describe('Any additional details or preferences to consider.'),
});
export type InteractiveGiftGuideInput = z.infer<typeof InteractiveGiftGuideInputSchema>;

const InteractiveGiftGuideOutputSchema = z.object({
  productSuggestions: z.array(z.string()).describe('A list of personalized jewelry suggestions based on the input criteria.'),
  reasoning: z.string().describe('The reasoning behind the product suggestions, considering all input parameters.'),
});
export type InteractiveGiftGuideOutput = z.infer<typeof InteractiveGiftGuideOutputSchema>;

export async function generateInteractiveGiftRecommendations(input: InteractiveGiftGuideInput): Promise<InteractiveGiftGuideOutput> {
  return interactiveGiftGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveGiftGuidePrompt',
  input: {schema: InteractiveGiftGuideInputSchema},
  output: {schema: InteractiveGiftGuideOutputSchema},
  prompt: `You are an AI-powered interactive gift guide specializing in jewelry recommendations. Based on the occasion, recipient, jewelry type, style preferences, budget, and any additional details provided, you will provide personalized product suggestions.

Occasion: {{{occasion}}}
Recipient: {{{recipient}}}
Jewelry Type: {{{jewelryType}}}
Style Preferences: {{{stylePreferences}}}
Budget: {{{budget}}}
Additional Details: {{{additionalDetails}}}

Please provide a list of product suggestions and detailed reasoning behind your choices, ensuring the suggestions align with all the provided criteria. Consider the budget constraints and any additional details to refine the recommendations. Make the reasoning detailed.`, // Increased detail in reasoning prompt
});

const interactiveGiftGuideFlow = ai.defineFlow(
  {
    name: 'interactiveGiftGuideFlow',
    inputSchema: InteractiveGiftGuideInputSchema,
    outputSchema: InteractiveGiftGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getGiftSuggestions } from '@/app/gift-guide/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Bot, Lightbulb } from 'lucide-react';

const initialState = {
  status: 'initial' as 'initial' | 'success' | 'error',
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? 'Thinking...' : 'Find Gift'}
    </Button>
  );
}

export default function GiftGuideForm() {
  const [state, formAction] = useFormState(getGiftSuggestions, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <div className="max-w-2xl mx-auto">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Tell Us About Them</CardTitle>
            <CardDescription>
              The more details you provide, the better the recommendations will be.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="occasion">Occasion</Label>
              <Input type="text" id="occasion" name="occasion" placeholder="e.g., 10th Anniversary, Birthday, Graduation" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input type="text" id="recipient" name="recipient" placeholder="e.g., My wife, Best friend, Mother" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="stylePreferences">Style & Preferences</Label>
              <Textarea id="stylePreferences" name="stylePreferences" placeholder="e.g., Loves minimalist gold jewelry, wears a lot of classic pearls, prefers bold and modern designs..." />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      {state.status === 'success' && state.data && (
        <div className="mt-8">
            <Alert>
                <Bot className="h-4 w-4" />
                <AlertTitle className="font-headline">Personalized Suggestions</AlertTitle>
                <AlertDescription className="mt-2 space-y-4">
                    <div>
                        <h3 className="font-bold flex items-center gap-2 mb-1"><Lightbulb className="w-4 h-4 text-primary" />Reasoning</h3>
                        <p>{state.data.reasoning}</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Gift Ideas:</h3>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            {state.data.productSuggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}

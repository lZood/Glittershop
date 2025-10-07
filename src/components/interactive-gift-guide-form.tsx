'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getInteractiveGiftSuggestions } from '@/app/interactive-gift-guide/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Bot, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialState = {
  status: 'initial' as 'initial' | 'success' | 'error',
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }}>
      {pending ? 'Pensando...' : 'Encontrar Regalo'}
    </Button>
  );
}

export default function InteractiveGiftGuideForm() {
  const [state, formAction] = useFormState(getInteractiveGiftSuggestions, initialState);
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
            <CardTitle className="font-headline text-2xl">Encuentra la joya perfecta</CardTitle>
            <CardDescription>
              Mientras más detalles nos des, mejores serán las recomendaciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="occasion">Ocasión</Label>
                <Input type="text" id="occasion" name="occasion" placeholder="Ej: 10º Aniversario" required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="recipient">Destinatario</Label>
                <Input type="text" id="recipient" name="recipient" placeholder="Ej: Mi esposa" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="jewelryType">Tipo de Joya</Label>
                    <Select name="jewelryType" required>
                        <SelectTrigger id="jewelryType">
                            <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Necklace">Collar</SelectItem>
                            <SelectItem value="Earrings">Aretes</SelectItem>
                            <SelectItem value="Bracelet">Pulsera</SelectItem>
                            <SelectItem value="Ring">Anillo</SelectItem>
                            <SelectItem value="Any">Cualquiera</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="budget">Presupuesto</Label>
                    <Select name="budget" required>
                        <SelectTrigger id="budget">
                            <SelectValue placeholder="Seleccionar presupuesto" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="under $500">Menos de $500</SelectItem>
                            <SelectItem value="$500 - $1000">$500 - $1000</SelectItem>
                            <SelectItem value="$1000 - $2500">$1000 - $2500</SelectItem>
                            <SelectItem value="over $2500">Más de $2500</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="stylePreferences">Estilo y Preferencias</Label>
              <Textarea id="stylePreferences" name="stylePreferences" placeholder="Ej: Le encantan las joyas minimalistas de oro, usa muchas perlas clásicas..." required/>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="additionalDetails">Detalles Adicionales (Opcional)</Label>
              <Textarea id="additionalDetails" name="additionalDetails" placeholder="Ej: Su color favorito es el azul, tiene alergia al níquel..." />
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
                <AlertTitle className="font-headline">Sugerencias Personalizadas</AlertTitle>
                <AlertDescription className="mt-2 space-y-4">
                    <div>
                        <h3 className="font-bold flex items-center gap-2 mb-1"><Lightbulb className="w-4 h-4 text-primary" />Razonamiento</h3>
                        <p>{state.data.reasoning}</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Ideas de Regalo:</h3>
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

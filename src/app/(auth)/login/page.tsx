'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { CheckCircle2 } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo válido.' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function UnifiedAuthPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const checkUserExists = async ({ email }: EmailFormValues) => {
    setIsLoading(true);
    const trimmedEmail = email.trim();
    setEmail(trimmedEmail);
    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        throw new Error('Error de red al verificar el usuario');
      }

      const { exists } = await response.json();
      if (exists) {
        setStep('login');
      } else {
        setStep('register');
      }
    } catch (error: any) {
      toast({
        title: 'Error de verificación',
        description: error.message || 'No se pudo conectar con el servidor. Inténtalo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast({
        title: 'Error al iniciar sesión con Google',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAppleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast({
        title: 'Error al iniciar sesión con Apple',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" className="w-5 h-5 mr-2">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  );

  const AppleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
      <path d="M17.363 12.325c0 2.404-1.153 4.19-2.95 4.19-1.637 0-2.684-.96-3.83-1.004-.987 0-2.224.96-3.483.96-1.886 0-3.323-1.785-3.323-4.145 0-2.88 1.93-5.324 4.09-5.324 1.345 0 2.45.828 3.528.828.987 0 2.224-.873 3.651-.873 2.19 0 4.273 2.145 4.273 5.363zm-4.74-7.512c.764-.914 1.28-2.223 1.153-3.48-1.547.045-2.95.828-3.785 1.74-1.032.96-1.84 2.403-1.592 3.829 1.74.09 3.165-.873 4.224-2.089z" />
    </svg>
  );

  const handleBack = () => setStep('email');

  return (
    <div className="min-h-[calc(100vh-7rem)] px-4 py-8 sm:py-12 bg-gradient-to-b from-secondary/20 via-background to-background">
      <div className="mx-auto w-full max-w-5xl">
        <Card className="overflow-hidden border-border/60 shadow-xl">
          <div className="grid lg:grid-cols-12">
            <aside className="hidden lg:flex lg:col-span-5 bg-foreground text-background p-8 xl:p-10 flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-background/70 mb-4">Glittershop Account</p>
                <h2 className="text-3xl font-semibold leading-tight">Inicia rápido y compra sin fricción</h2>
                <p className="mt-4 text-sm text-background/75">
                  Mantén tu historial, favoritos y seguimiento de pedidos en un solo lugar.
                </p>
              </div>
              <div className="space-y-3 pt-8">
                <div className="flex items-center gap-3 text-sm text-background/85">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Checkout más rápido
                </div>
                <div className="flex items-center gap-3 text-sm text-background/85">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Estado de pedidos en tiempo real
                </div>
                <div className="flex items-center gap-3 text-sm text-background/85">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Experiencia personalizada
                </div>
              </div>
            </aside>

            <div className="lg:col-span-7 p-5 sm:p-7 md:p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-headline">
                  {step === 'email' && 'Bienvenido/a'}
                  {step === 'login' && 'Iniciar sesión'}
                  {step === 'register' && 'Crear cuenta'}
                </CardTitle>
                <CardDescription className="mt-2">
                  {step === 'email' && 'Escribe tu correo y te guiaremos al siguiente paso.'}
                  {step === 'login' && `Ingresa tu contraseña para ${email}.`}
                  {step === 'register' && `Completa tus datos para crear tu cuenta con ${email}.`}
                </CardDescription>
              </CardHeader>

              <div className="mb-6 grid grid-cols-3 gap-2">
                <div className={`h-1.5 rounded-full ${step === 'email' ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`h-1.5 rounded-full ${step === 'login' ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`h-1.5 rounded-full ${step === 'register' ? 'bg-primary' : 'bg-muted'}`} />
              </div>

              <CardContent className="p-0 grid gap-4">
                {step === 'email' && (
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(checkUserExists)} className="grid gap-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="tu@email.com" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-11" disabled={isLoading}>
                        {isLoading ? 'Verificando...' : 'Continuar'}
                      </Button>
                    </form>
                  </Form>
                )}

                {step === 'login' && <LoginForm email={email} />}
                {step === 'register' && <RegisterForm email={email} />}

                {step !== 'email' && (
                  <Button variant="link" onClick={handleBack} className="w-full">
                    Volver
                  </Button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O continuar con
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleGoogleLogin} className="h-11">
                    <GoogleIcon />
                    Google
                  </Button>
                  <Button variant="outline" onClick={handleAppleLogin} className="h-11">
                    <AppleIcon />
                    Apple
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

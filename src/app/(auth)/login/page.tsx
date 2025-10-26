'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const emailSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce una dirección de correo electrónico válida.' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function UnifiedAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const [email, setEmail] = useState('');

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const checkUserExists = async ({ email }: EmailFormValues) => {
    setEmail(email);
    // This is a simplified check. A full admin client `getUserByEmail` would be better.
    // For now, we assume if a sign-in attempt fails with a specific error, the user doesn't exist.
    // This avoids needing a separate API route.
    // Let's try to sign in silently. If it works, user exists. If not, they likely don't.
    // This is not a great pattern. A dedicated check is better.
    // The API route failed due to RLS. Let's try a different approach.
    // Let's pivot: We will show email/password fields first.
    // If sign in fails, we assume new user and show register form.
    setStep('login'); // Always go to login step first
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

  const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c1.73 0 3.2.57 4.33 1.62l2.44-2.44C18.44 1.16 15.48 0 12.48 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.94 0 11.7-4.8 11.7-11.79 0-.79-.07-1.54-.19-2.28z"
      ></path>
    </svg>
  );

  const handleBack = () => setStep('email');
  
  const onLoginFailed = () => {
    setStep('register');
  }


  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
             {step === 'email' && 'Bienvenido/a'}
             {step === 'login' && 'Iniciar Sesión'}
             {step === 'register' && 'Crear Cuenta'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Inicia sesión con tu correo electrónico o regístrate para convertirte en miembro de Glittershop.'}
            {step === 'login' && `Ingresa la contraseña para ${email}. ¿Nuevo aquí? Te guiaremos para crear una cuenta si la contraseña es incorrecta.`}
            {step === 'register' && `Parece que eres nuevo/a. Completa tus datos para crear tu cuenta para ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Continuar
                </Button>
              </form>
            </Form>
          )}

          {step === 'login' && <LoginForm email={email} onBack={handleBack} onLoginFailed={onLoginFailed} />}
          {step === 'register' && <RegisterForm email={email} onBack={handleBack} />}

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
          <Button variant="outline" onClick={handleGoogleLogin}>
              <GoogleIcon />
              Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

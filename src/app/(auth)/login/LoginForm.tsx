'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/supabase/session-provider';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  password: z.string().min(1, 'La contraseña no puede estar vacía.'),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  email: string;
}

export default function LoginForm({ email }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  // Auto-redirect if user is detected (failsafe for hanging promises)
  useEffect(() => {
    if (user) {
      console.log('User detected via useSession, redirecting...');
      router.replace('/profile');
    }
  }, [user, router]);

  const handleLogin = async (values: LoginFormValues) => {
    console.log('handleLogin started');
    setIsLoggingIn(true);
    try {
      const supabase = createClient();
      console.log('Signing in with password...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: values.password,
      });

      console.log('Sign in result:', { data, error });

      if (error) {
        console.log('Error returned from Supabase:', error.message);
        toast({
          title: 'Error al iniciar sesión',
          description: error.message === 'Invalid login credentials'
            ? 'La contraseña es incorrecta. Inténtalo de nuevo.'
            : error.message,
          variant: 'destructive',
        });
        setIsLoggingIn(false);
      } else {
        console.log('Login successful, waiting for session sync...');
        toast({ title: 'Ingresando...', description: 'Estamos preparando tu perfil.' });
        // Small delay to allow session-provider to catch the change
        setTimeout(() => {
          window.location.href = '/profile';
        }, 800);
      }
    } catch (err: any) {
      console.error('Unexpected error in handleLogin:', err);
      toast({
        title: 'Error inesperado',
        description: err.message || 'Ocurrió un error desconocido',
        variant: 'destructive'
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} disabled={isLoggingIn} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
    </Form>
  );
}

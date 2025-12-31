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

const formSchema = z.object({
  password: z.string().min(1, 'La contraseña no puede estar vacía.'),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  email: string;
}

import { useSession } from '@/lib/supabase/session-provider';
import { useEffect } from 'react';

// ... (imports remain)

export default function LoginForm({ email }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  // Auto-redirect if user is detected (failsafe for hanging promises)
  useEffect(() => {
    if (user) {
      console.log('User detected via useSession, redirecting...');
      window.location.href = '/profile';
    }
  }, [user]);

  const handleLogin = async (values: LoginFormValues) => {
    console.log('handleLogin started');
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
        throw new Error('Configuration error: Missing Supabase URL');
      }

      console.log('Creating client...');
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
      } else {
        console.log('Login successful, redirecting to /profile...');
        // Force a hard navigation to ensure the session cookie is recognized by the server/middleware immediately
        window.location.href = '/profile';
      }
    } catch (err: any) {
      console.error('Unexpected error in handleLogin:', err);
      toast({
        title: 'Error inesperado',
        description: err.message || 'Ocurrió un error desconocido',
        variant: 'destructive'
      });
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  );
}

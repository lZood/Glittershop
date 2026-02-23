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
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [inlineStatus, setInlineStatus] = useState<
    { type: 'error' | 'success' | 'loading'; text: string } | null
  >(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user, router]);

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoggingIn(true);
    setInlineStatus({ type: 'loading', text: 'Validando tus credenciales...' });

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: values.password,
      });

      if (error) {
        const errorText = error.message === 'Invalid login credentials'
          ? 'La contraseña es incorrecta. Inténtalo de nuevo.'
          : error.message;

        setInlineStatus({ type: 'error', text: errorText });
        toast({
          title: 'Error al iniciar sesión',
          description: errorText,
          variant: 'destructive',
        });
        setIsLoggingIn(false);
      } else {
        setInlineStatus({ type: 'success', text: 'Acceso correcto. Redirigiendo a tu perfil...' });
        toast({ title: 'Ingresando...', description: 'Estamos preparando tu perfil.' });

        setTimeout(() => {
          window.location.href = '/profile';
        }, 800);
      }

      console.log('Sign in result:', { data, error });
    } catch (err: any) {
      const errorText = err.message || 'Ocurrio un error desconocido';
      setInlineStatus({ type: 'error', text: errorText });
      toast({
        title: 'Error inesperado',
        description: errorText,
        variant: 'destructive',
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-sm">
        <p className="font-medium text-foreground">Acceso seguro</p>
        <p className="text-muted-foreground mt-1">Tu cuenta se valida con cifrado y sesión protegida.</p>
      </div>

      {inlineStatus && (
        <div
          className={`rounded-lg border p-3 text-sm flex items-start gap-2 ${
            inlineStatus.type === 'error'
              ? 'border-destructive/40 bg-destructive/10 text-destructive'
              : inlineStatus.type === 'success'
                ? 'border-primary/40 bg-primary/10 text-foreground'
                : 'border-border bg-muted/40 text-foreground'
          }`}
        >
          {inlineStatus.type === 'error' && <AlertCircle className="w-4 h-4 mt-0.5" />}
          {inlineStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5" />}
          {inlineStatus.type === 'loading' && <Loader2 className="w-4 h-4 mt-0.5 animate-spin" />}
          <span>{inlineStatus.text}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="grid gap-4">
          <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground break-all">
            {email}
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      disabled={isLoggingIn}
                      className="h-11 pr-11"
                      onChange={(e) => {
                        field.onChange(e);
                        if (inlineStatus?.type === 'error') setInlineStatus(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Iniciar sesión
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    // This will sign up the user and log them in automatically
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (signUpError) {
      toast({
        title: 'Error en el registro',
        description: signUpError.message,
        variant: 'destructive',
      });
      return;
    }
    
    // The user is logged in, and the session is available.
    // The profile is created by a trigger in Supabase, so we just need to redirect.
    if (signUpData.user) {
       toast({
        title: '¡Cuenta Creada!',
        description: 'Hemos creado tu cuenta exitosamente.',
      });
      router.push('/profile');
      router.refresh();
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
  
  const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c1.73 0 3.2.57 4.33 1.62l2.44-2.44C18.44 1.16 15.48 0 12.48 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.94 0 11.7-4.8 11.7-11.79 0-.79-.07-1.54-.19-2.28z"
      ></path>
    </svg>
  );

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Regístrate</CardTitle>
          <CardDescription>
            Ingresa tu información para crear una cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Nombre completo</Label>
              <Input id="full-name" placeholder="Jane Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Crear una cuenta
            </Button>
          </form>
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
        <div className="mt-4 text-center text-sm p-6 pt-0">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="underline">
            Iniciar sesión
          </Link>
        </div>
      </Card>
    </div>
  );
}

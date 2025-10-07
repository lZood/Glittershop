
import Link from 'next/link';
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

export default function LoginPage() {
  const AppleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path
        fill="currentColor"
        d="M12.152 6.896c-.922 0-2.015.54-3.09.54-1.295 0-2.86-.81-4.223-.81-.97 0-2.055.517-3.136.517-1.32 0-2.7-.922-3.955-.922-.21 0-.42.023-.63.046.233-1.424.81-3.376 2.39-4.27.97-.604 2.12-.767 3.114-.767.836 0 1.992.494 3.044.494.99 0 2.227-.813 3.61-.813.63 0 1.88.256 2.955.256.49 0 1.342-.256 2.143-.256.443 0 1.834.42 2.932.42.925 0 1.993-.443 2.932-.443.163 0 .326.023.49.046-.256 1.424-.813 3.33-2.39 4.223-.99.58-2.144.766-3.137.766-.836 0-1.992-.494-3.044-.494-.99 0-2.227.813-3.61.813-.63 0-1.88-.256-2.955-.256-.49 0-1.342.256-2.143-.256zM12.13 24c2.25 0 3.93-1.4 5.22-1.4s2.813 1.4 5.22 1.4c2.51 0 4.29-1.95 5.0-4.63-.23.14-1.63.81-3.4.81-1.61 0-3.2-.72-4.63-.72s-2.84 1.04-4.68 1.04c-1.66 0-3.32-.81-4.95-.81-1.78 0-2.98.54-3.79.54-.42 0-1.12-.23-1.84-.23-.23 0-.46.02-.7.05.79 2.1 2.45 4.9 5.15 4.9z"
      ></path>
    </svg>
  );

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
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" asChild>
            <Link href="/profile">Iniciar sesión</Link>
          </Button>
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
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <GoogleIcon />
              Google
            </Button>
            <Button variant="outline">
              <AppleIcon />
              Apple
            </Button>
          </div>
        </CardContent>
        <div className="mt-4 text-center text-sm p-6 pt-0">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="underline">
            Regístrate
          </Link>
        </div>
      </Card>
    </div>
  );
}

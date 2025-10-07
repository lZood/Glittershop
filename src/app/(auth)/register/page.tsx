
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

export default function RegisterPage() {
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
          <div className="grid gap-2">
            <Label htmlFor="full-name">Nombre completo</Label>
            <Input id="full-name" placeholder="Jane Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Crear una cuenta
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

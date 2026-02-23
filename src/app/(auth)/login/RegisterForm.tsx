'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from '@/lib/supabase/session-provider';
import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const passwordSchema = z.string()
  .min(8, 'Debe tener al menos 8 caracteres')
  .max(25, 'No puede tener más de 25 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .refine((s) => !s.includes(' '), 'No puede contener espacios');

const formSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido.'),
  lastName: z.string().min(1, 'El apellido es requerido.'),
  dob_day: z.string().min(1, 'Día requerido'),
  dob_month: z.string().min(1, 'Mes requerido'),
  dob_year: z.string().min(1, 'Ano requerido'),
  password: passwordSchema,
  receivePromotions: z.boolean().default(false),
}).refine((data) => {
  const day = parseInt(data.dob_day, 10);
  const month = parseInt(data.dob_month, 10) - 1;
  const year = parseInt(data.dob_year, 10);
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}, {
  message: 'La fecha de nacimiento no es valida.',
  path: ['dob_day'],
});

type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  email: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = [
  { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' }, { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' }, { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' }, { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export default function RegisterForm({ email }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      receivePromotions: false,
      dob_day: '',
      dob_month: '',
      dob_year: '',
    },
  });

  const passwordValue = form.watch('password');
  const passwordChecks = useMemo(() => ({
    length: passwordValue.length >= 8 && passwordValue.length <= 25,
    upper: /[A-Z]/.test(passwordValue),
    lower: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    noSpaces: !passwordValue.includes(' '),
  }), [passwordValue]);

  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user, router]);

  const handleRegister = async (values: RegisterFormValues) => {
    setIsRegistering(true);
    setStatusText('Creando tu cuenta...');
    const supabase = createClient();

    const dob = new Date(parseInt(values.dob_year), parseInt(values.dob_month) - 1, parseInt(values.dob_day)).toISOString();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          dob: dob,
        }
      }
    });

    if (signUpError) {
      toast({
        title: 'Error en el registro',
        description: signUpError.message,
        variant: 'destructive',
      });
      setStatusText(null);
      setIsRegistering(false);
      return;
    }

    toast({ title: 'Creando perfil...', description: 'Estamos preparando tu nueva cuenta.' });
    setStatusText('Activando tu sesión...');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: values.password,
    });

    if (signInError) {
      toast({
        title: 'Error al iniciar sesión después del registro',
        description: signInError.message,
        variant: 'destructive',
      });
      router.push('/login');
    } else {
      toast({
        title: 'Cuenta creada',
        description: 'Tu cuenta se creó correctamente y ya esta activa.',
      });
      setStatusText('Listo. Redirigiendo a tu perfil...');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 800);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-sm">
        <p className="font-medium text-foreground">Nuevo cliente</p>
        <p className="text-muted-foreground mt-1 break-all">Vas a crear tu cuenta con: {email}</p>
      </div>

      {statusText && (
        <div className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm text-foreground flex items-center gap-2">
          {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{statusText}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegister)} className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isRegistering} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isRegistering} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Fecha de nacimiento</FormLabel>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              <FormField
                control={form.control}
                name="dob_day"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isRegistering}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Día" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {days.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob_month"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isRegistering}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob_year"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isRegistering}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.dob_day?.message && !form.formState.errors.dob_month && !form.formState.errors.dob_year && (
              <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.dob_day.message}</p>
            )}
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crear contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      disabled={isRegistering}
                      className="h-11 pr-11"
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
                <FormDescription className="text-xs">
                  Entre 8 y 25 caracteres, 1 número, 1 mayúscula, 1 minúscula, sin espacios.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-border/60 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p className={passwordChecks.length ? 'text-foreground' : ''}>• 8 a 25 caracteres</p>
            <p className={passwordChecks.upper ? 'text-foreground' : ''}>• Al menos 1 mayúscula</p>
            <p className={passwordChecks.lower ? 'text-foreground' : ''}>• Al menos 1 minúscula</p>
            <p className={passwordChecks.number ? 'text-foreground' : ''}>• Al menos 1 número</p>
            <p className={passwordChecks.noSpaces ? 'text-foreground' : ''}>• Sin espacios</p>
          </div>

          <FormField
            control={form.control}
            name="receivePromotions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-xs">
                    Quiero recibir promociones personalizadas por correo y mensajes. Puedo retirarlo cuando quiera. Confirmo que tengo 16 años o más.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="text-xs text-muted-foreground pt-1">
            <p>Procesaremos tus datos conforme a nuestro Aviso de Privacidad.</p>
            <p className="mt-2">Al continuar, aceptas los Términos y Condiciones de membresía.</p>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isRegistering}>
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

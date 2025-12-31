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

const passwordSchema = z.string()
  .min(8, 'Debe tener al menos 8 caracteres')
  .max(25, 'No puede tener más de 25 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .refine(s => !s.includes(' '), 'No puede contener espacios');

const formSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido.'),
  lastName: z.string().min(1, 'El apellido es requerido.'),
  dob_day: z.string().min(1, 'Día requerido'),
  dob_month: z.string().min(1, 'Mes requerido'),
  dob_year: z.string().min(1, 'Año requerido'),
  password: passwordSchema,
  receivePromotions: z.boolean().default(false),
}).refine(data => {
  const day = parseInt(data.dob_day, 10);
  const month = parseInt(data.dob_month, 10) - 1; // JS months are 0-indexed
  const year = parseInt(data.dob_year, 10);
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}, {
  message: 'La fecha de nacimiento no es válida.',
  path: ['dob_day'], // Path to show the error on
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


import { useSession } from '@/lib/supabase/session-provider';
import { useEffect } from 'react';

// ... (imports remain)

export default function RegisterForm({ email }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSession();

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

  // Auto-redirect if user is detected (failsafe for hanging promises)
  useEffect(() => {
    if (user) {
      console.log('User detected via useSession, redirecting...');
      window.location.href = '/profile';
    }
  }, [user]);

  const handleRegister = async (values: RegisterFormValues) => {
    const supabase = createClient();

    const dob = new Date(parseInt(values.dob_year), parseInt(values.dob_month) - 1, parseInt(values.dob_day)).toISOString();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
      return;
    }

    // After a successful sign-up, Supabase sends a confirmation email.
    // The user's profile is created by a trigger in the backend.
    // We now just need to log the user in to create a session and redirect.
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
      // Redirect to login even if auto sign-in fails, so they can log in manually.
      router.push('/login');
    } else {
      toast({
        title: '¡Cuenta Creada!',
        description: 'Hemos creado tu cuenta exitosamente y te hemos conectado.',
      });
      // Force a hard navigation to ensure the session cookie is recognized by the server/middleware immediately
      window.location.href = '/profile';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Día" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* A single message for the combined date field */}
          {form.formState.errors.dob_day?.message && !form.formState.errors.dob_month && !form.formState.errors.dob_year && (
            <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.dob_day.message}</p>
          )}
        </div>


        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crear Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Entre 8 y 25 caracteres, 1 número, 1 mayúscula, 1 minúscula, sin espacios.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  Me gustaría recibir promociones personalizadas de Glittershop, una marca del Grupo Glittershop, por correo electrónico y mensajes de texto. Puedo retirar este consentimiento en cualquier momento. Confirmo que tengo 16 años o más.
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="text-xs text-muted-foreground pt-2">
          <p>Procesaremos tus datos personales de acuerdo con el Aviso de Privacidad de Glittershop.</p>
          <p className="mt-2">Al continuar, aceptas los Términos y Condiciones de la membresía de Glittershop.</p>
        </div>


        <Button type="submit" className="w-full">
          Crear Cuenta
        </Button>
      </form>
    </Form>
  );
}

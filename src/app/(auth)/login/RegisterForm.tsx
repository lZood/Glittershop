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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
  dob: z.date({
    required_error: 'La fecha de nacimiento es requerida.',
  }),
  password: passwordSchema,
  receivePromotions: z.boolean().default(false),
});

type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  email: string;
  onBack: () => void;
}

export default function RegisterForm({ email, onBack }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      receivePromotions: false,
    },
  });

  const handleRegister = async (values: RegisterFormValues) => {
    const supabase = createClient();
    
    // SignUp automatically logs in the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          // You might want to store other info like dob in your profiles table
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

    if (signUpData.user) {
      // The profile is created by a trigger in Supabase, but we can add more info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
            // The trigger should handle first_name and last_name from metadata
            // Add other fields if necessary
         })
        .eq('id', signUpData.user.id);
        
       if (profileError) {
            toast({
                title: 'Error al actualizar perfil',
                description: profileError.message,
                variant: 'destructive',
            });
       } else {
            toast({
                title: '¡Cuenta Creada!',
                description: 'Hemos creado tu cuenta exitosamente.',
            });
            router.push('/profile');
            router.refresh();
       }
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
        
        <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fecha de nacimiento</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Elige una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
        />

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

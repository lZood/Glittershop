'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Address, saveAddress } from '@/lib/actions/address';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// ─── Schema ───────────────────────────────────────────────────────────────────

const addressSchema = z.object({
    full_name: z.string().min(1, 'El nombre es requerido'),
    phone: z.string().min(10, 'Teléfono debe tener 10 dígitos'),
    postal_code: z.string().length(5, 'El CP debe tener 5 dígitos'),
    state: z.string().min(1, 'El estado es requerido'),
    city: z.string().min(1, 'La ciudad es requerida'),
    neighborhood: z.string().min(1, 'La colonia es requerida'),
    street: z.string().min(1, 'La calle es requerida'),
    exterior_number: z.string().min(1, 'Número exterior requerido'),
    interior_number: z.string().optional(),
    delivery_instructions: z.string().optional(),
    country: z.string().default('MX'),
    is_default: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddressFormProps {
    existingAddress?: Address;
    onSuccess: () => void;
    onCancel: () => void;
    /** Si se provee, se llama en lugar de guardar en DB (para invitados). */
    onSubmit?: (data: AddressFormData) => Promise<void>;
}

type CPStatus = 'idle' | 'loading' | 'valid' | 'invalid';

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressForm({ existingAddress, onSuccess, onCancel, onSubmit: customSubmit }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CP lookup state
    const [cpStatus, setCpStatus] = useState<CPStatus>('idle');
    const [colonias, setColonias] = useState<string[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: existingAddress
            ? {
                full_name: existingAddress.full_name,
                phone: existingAddress.phone,
                postal_code: existingAddress.postal_code,
                state: existingAddress.state,
                city: existingAddress.city,
                neighborhood: existingAddress.neighborhood,
                street: existingAddress.street,
                exterior_number: existingAddress.exterior_number || '',
                interior_number: existingAddress.interior_number || '',
                delivery_instructions: existingAddress.delivery_instructions || '',
                is_default: existingAddress.is_default,
                country: 'MX',
            }
            : { country: 'MX', is_default: false },
    });

    const postalCodeValue = watch('postal_code');
    const isDefaultValue = watch('is_default');

    // ── CP Lookup via internal proxy ──────────────────────────────────────────

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const cp = postalCodeValue?.trim();

        // Only trigger when we have exactly 5 digits
        if (!cp || cp.length !== 5 || !/^\d{5}$/.test(cp)) {
            if (cpStatus === 'valid') {
                // User edited CP after a valid lookup — reset
                setCpStatus('idle');
                setColonias([]);
            }
            return;
        }

        setCpStatus('loading');

        debounceRef.current = setTimeout(async () => {
            try {
                console.log(`[AddressForm] Consultando CP: ${cp}`);
                const res = await fetch(`/api/cp-lookup/${cp}`);
                const data = await res.json();
                console.log(`[AddressForm] Respuesta del servidor (status ${res.status}):`, data);

                if (!res.ok || data.error) {
                    console.error(`[AddressForm] Error del servidor:`, data.error);
                    throw new Error(data.error || 'CP no encontrado');
                }

                // Autocomplete only estado and ciudad — user picks colonia
                setValue('state', data.estado, { shouldValidate: false });
                setValue('city', data.ciudad, { shouldValidate: false });

                const cols: string[] = data.colonias ?? [];
                setColonias(cols);

                // Don't pre-select colonia — user must choose
                setValue('neighborhood', '', { shouldValidate: false });

                console.log(`[AddressForm] ✅ CP válido. Estado: ${data.estado}, Ciudad: ${data.ciudad}, Colonias: ${data.colonias?.length}`);
                setCpStatus('valid');
            } catch (err) {
                console.error('[AddressForm] ❌ Error en lookup CP:', err);
                setCpStatus('invalid');
                setColonias([]);
                setValue('state', '', { shouldValidate: false });
                setValue('city', '', { shouldValidate: false });
                setValue('neighborhood', '', { shouldValidate: false });
            }
        }, 600);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postalCodeValue]);

    // ── Submit ────────────────────────────────────────────────────────────────

    const onSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true);
        try {
            if (customSubmit) {
                await customSubmit(data);
                onSuccess();
            } else {
                const result = await saveAddress(data, existingAddress?.id);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(existingAddress ? 'Dirección actualizada' : 'Dirección guardada');
                    onSuccess();
                }
            }
        } catch {
            toast.error('Ocurrió un error al guardar la dirección');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Nombre y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="full_name">Nombre Completo</Label>
                    <Input id="full_name" placeholder="Ej. Juan Pérez" {...register('full_name')} />
                    {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="10 dígitos"
                        maxLength={10}
                        inputMode="numeric"
                        onKeyDown={(e) => {
                            // Allow: backspace, delete, tab, escape, enter, arrows, home, end
                            const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                            if (allowed.includes(e.key)) return;
                            // Block anything that's not a digit
                            if (!/^\d$/.test(e.key)) e.preventDefault();
                        }}
                        onPaste={(e) => {
                            const text = e.clipboardData.getData('text');
                            if (!/^\d+$/.test(text)) e.preventDefault();
                        }}
                        {...register('phone')}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
            </div>

            {/* ── Código Postal ── */}
            <div className="space-y-1.5">
                <Label htmlFor="postal_code" className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Código Postal (CP)
                </Label>
                <div className="relative max-w-[160px]">
                    <Input
                        id="postal_code"
                        placeholder="00000"
                        maxLength={5}
                        inputMode="numeric"
                        onKeyDown={(e) => {
                            const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                            if (allowed.includes(e.key)) return;
                            if (!/^\d$/.test(e.key)) e.preventDefault();
                        }}
                        onPaste={(e) => {
                            const text = e.clipboardData.getData('text');
                            if (!/^\d+$/.test(text)) e.preventDefault();
                        }}
                        className={`pr-9 ${cpStatus === 'valid'
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : cpStatus === 'invalid'
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                            }`}
                        {...register('postal_code')}
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        {cpStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                        {cpStatus === 'valid' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {cpStatus === 'invalid' && <XCircle className="w-4 h-4 text-destructive" />}
                    </div>
                </div>
                {errors.postal_code && (
                    <p className="text-xs text-destructive">{errors.postal_code.message}</p>
                )}
                {cpStatus === 'invalid' && !errors.postal_code && (
                    <p className="text-xs text-destructive">Código postal no encontrado en México</p>
                )}
                {cpStatus === 'valid' && (
                    <p className="text-xs text-green-600">✓ CP válido — estado y ciudad autocompletados</p>
                )}
            </div>

            {/* Estado y Ciudad — autocompletados, de solo lectura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                        id="state"
                        placeholder="Se autocompleta con el CP"
                        readOnly
                        className="bg-muted/50 cursor-default"
                        {...register('state')}
                    />
                    {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="city">Ciudad / Municipio</Label>
                    <Input
                        id="city"
                        placeholder="Se autocompleta con el CP"
                        readOnly
                        className="bg-muted/50 cursor-default"
                        {...register('city')}
                    />
                    {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
            </div>

            {/* Colonia — el usuario elige */}
            <div className="space-y-1.5">
                <Label htmlFor="neighborhood">Colonia</Label>
                {colonias.length > 0 ? (
                    <select
                        id="neighborhood"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('neighborhood')}
                    >
                        <option value="">— Selecciona tu colonia —</option>
                        {colonias.map((col) => (
                            <option key={col} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>
                ) : (
                    <Input
                        id="neighborhood"
                        placeholder="Ingresa el CP primero para ver colonias"
                        disabled={cpStatus !== 'valid'}
                        className={cpStatus !== 'valid' ? 'bg-muted/30 cursor-not-allowed' : ''}
                        {...register('neighborhood')}
                    />
                )}
                {errors.neighborhood && (
                    <p className="text-xs text-destructive">{errors.neighborhood.message}</p>
                )}
            </div>

            {/* Calle */}
            <div className="space-y-1.5">
                <Label htmlFor="street">Calle</Label>
                <Input id="street" placeholder="Ej. Av. Reforma" {...register('street')} />
                {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
            </div>

            {/* No. Ext / Int */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="exterior_number">No. Exterior</Label>
                    <Input id="exterior_number" placeholder="Ej. 123" {...register('exterior_number')} />
                    {errors.exterior_number && (
                        <p className="text-xs text-destructive">{errors.exterior_number.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="interior_number">No. Interior (Opcional)</Label>
                    <Input id="interior_number" placeholder="Ej. Depto 4B" {...register('interior_number')} />
                </div>
            </div>

            {/* Referencias */}
            <div className="space-y-1.5">
                <Label htmlFor="delivery_instructions">Referencias de Entrega</Label>
                <Input
                    id="delivery_instructions"
                    placeholder="Ej. Casa blanca con rejas negras, entre Calle A y B"
                    {...register('delivery_instructions')}
                />
                <p className="text-xs text-muted-foreground">
                    Ayuda al repartidor a encontrar tu domicilio.
                </p>
            </div>

            {/* Default */}
            <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                    id="is_default"
                    checked={isDefaultValue}
                    onCheckedChange={(checked) => setValue('is_default', checked as boolean)}
                />
                <Label htmlFor="is_default" className="text-sm font-normal cursor-pointer">
                    Establecer como dirección predeterminada
                </Label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {existingAddress ? 'Actualizar' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
}

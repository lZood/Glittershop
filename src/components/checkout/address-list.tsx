'use client';

import { Address, deleteAddress } from '@/lib/actions/address';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddressListProps {
    addresses: Address[];
    selectedAddressId?: string;
    onSelect: (address: Address) => void;
    onAdd: () => void;
    onEdit: (address: Address) => void;
}

export function AddressList({ addresses, selectedAddressId, onSelect, onAdd, onEdit }: AddressListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

        setDeletingId(id);
        const result = await deleteAddress(id);
        setDeletingId(null);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Dirección eliminada');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
                <div
                    key={address.id}
                    onClick={() => onSelect(address)}
                    className={cn(
                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50",
                        selectedAddressId === address.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-muted bg-card"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <MapPin className={cn("w-4 h-4", selectedAddressId === address.id ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-semibold truncate max-w-[150px]">{address.full_name}</span>
                        </div>
                        {address.is_default && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">Default</span>
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1 ml-6">
                        <p className="font-medium text-foreground">
                            {address.street} {address.exterior_number} {address.interior_number ? `Int. ${address.interior_number}` : ''}
                        </p>
                        <p>Col. {address.neighborhood}</p>
                        <p>{address.city}, {address.state}, CP {address.postal_code}</p>
                        <p>Tel: {address.phone}</p>
                        {address.delivery_instructions && (
                            <p className="text-xs italic mt-1 pt-1 border-t border-border/50">
                                "Ref: {address.delivery_instructions}"
                            </p>
                        )}
                    </div>

                    <div className="absolute top-4 right-4 flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(address);
                            }}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            disabled={deletingId === address.id}
                            onClick={(e) => handleDelete(e, address.id)}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            ))}

            <button
                onClick={onAdd}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/30 transition-all min-h-[160px] group"
            >
                <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="font-medium text-muted-foreground group-hover:text-foreground">Agregar Nueva Dirección</span>
            </button>
        </div>
    );
}

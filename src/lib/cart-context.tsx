'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export type CartItem = {
    product: Product;
    quantity: number;
    color?: string;
    size?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, color?: string, size?: string) => void;
    updateQuantity: (productId: string, color: string | undefined, size: string | undefined, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    lastAddedItem: CartItem | null;
    isSuccessSheetOpen: boolean;
    setIsSuccessSheetOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
    const [isSuccessSheetOpen, setIsSuccessSheetOpen] = useState(false);

    // Load from local storage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('cart');
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cart", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: CartItem) => {
        setItems((currentItems) => {
            const existingItemIndex = currentItems.findIndex(
                (item) =>
                    item.product.id === newItem.product.id &&
                    item.color === newItem.color &&
                    item.size === newItem.size
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                return updatedItems;
            }

            return [...currentItems, newItem];
        });

        // toast({
        //     title: "Producto agregado",
        //     description: `${newItem.product.name} se agregó a tu carrito.`,
        // });
        setLastAddedItem(newItem);
        setIsSuccessSheetOpen(true);
    };

    const removeItem = (productId: string, color?: string, size?: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) =>
                !(item.product.id === productId && item.color === color && item.size === size)
            )
        );
    };

    const updateQuantity = (productId: string, color: string | undefined, size: string | undefined, quantity: number) => {
        setItems((currentItems) =>
            currentItems.map((item) => {
                if (item.product.id === productId && item.color === color && item.size === size) {
                    return { ...item, quantity: Math.max(1, quantity) };
                }
                return item;
            })
        );
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const subtotal = items.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartCount,
            subtotal,
            isCartOpen,
            setIsCartOpen,
            lastAddedItem,
            isSuccessSheetOpen,
            setIsSuccessSheetOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

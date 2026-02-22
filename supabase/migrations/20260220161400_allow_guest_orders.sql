-- Allow orders to have a NULL user_id for guest checkouts
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Store guest email
ALTER TABLE public.orders ADD COLUMN guest_email TEXT;

-- Store color/size in order items
ALTER TABLE public.order_items ADD COLUMN variant_color TEXT;
ALTER TABLE public.order_items ADD COLUMN variant_size TEXT;

-- Migration to add tracking_number to orders table
ALTER TABLE public.orders
ADD COLUMN tracking_number VARCHAR(255);

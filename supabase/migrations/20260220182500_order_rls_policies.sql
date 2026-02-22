-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders"
ON public.orders FOR ALL TO authenticated
USING (public.is_admin());

-- RLS policies for order_items
CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can view all order items"
ON public.order_items FOR ALL TO authenticated
USING (public.is_admin());

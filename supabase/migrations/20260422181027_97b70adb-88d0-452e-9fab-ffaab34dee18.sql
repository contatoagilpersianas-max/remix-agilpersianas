CREATE POLICY "Anyone can create order"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
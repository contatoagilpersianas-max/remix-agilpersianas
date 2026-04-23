CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, code)
);

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert redemption"
  ON public.coupon_redemptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read redemptions"
  ON public.coupon_redemptions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.is_first_purchase(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.orders
    WHERE customer_email = _email
      AND payment_status IN ('pago','aprovado','confirmed')
  ) AND NOT EXISTS (
    SELECT 1 FROM public.coupon_redemptions
    WHERE email = _email AND code = 'BEMVINDO10'
  );
$$;
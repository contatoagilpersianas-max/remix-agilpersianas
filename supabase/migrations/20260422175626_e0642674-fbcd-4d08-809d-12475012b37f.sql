ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS asaas_payment_id text,
  ADD COLUMN IF NOT EXISTS asaas_invoice_url text,
  ADD COLUMN IF NOT EXISTS asaas_pix_qrcode text,
  ADD COLUMN IF NOT EXISTS asaas_pix_payload text;

CREATE INDEX IF NOT EXISTS idx_orders_asaas_payment_id ON public.orders(asaas_payment_id);
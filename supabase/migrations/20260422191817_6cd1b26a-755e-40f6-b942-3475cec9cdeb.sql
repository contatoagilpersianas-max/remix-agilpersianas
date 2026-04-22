ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight_kg numeric NOT NULL DEFAULT 2,
ADD COLUMN IF NOT EXISTS package_length_cm integer NOT NULL DEFAULT 60,
ADD COLUMN IF NOT EXISTS package_width_cm integer NOT NULL DEFAULT 15,
ADD COLUMN IF NOT EXISTS package_height_cm integer NOT NULL DEFAULT 15;

INSERT INTO public.site_settings (key, value)
VALUES ('shipping', '{"origin_cep":"36080-220"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = jsonb_set(coalesce(site_settings.value,'{}'::jsonb), '{origin_cep}', '"36080-220"'::jsonb);
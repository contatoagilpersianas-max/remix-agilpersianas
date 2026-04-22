-- Add show_in_menu to categories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS show_in_menu boolean NOT NULL DEFAULT true;

-- Add ambient subcategories under "Ambientes" so /catalogo?ambiente=sala filtros funcionem
DO $$
DECLARE
  amb_id uuid;
BEGIN
  SELECT id INTO amb_id FROM public.categories WHERE slug = 'ambientes' LIMIT 1;
  IF amb_id IS NOT NULL THEN
    INSERT INTO public.categories (name, slug, parent_id, position, active, show_in_menu, icon)
    VALUES
      ('Sala', 'sala', amb_id, 0, true, true, '🛋️'),
      ('Quarto', 'quarto', amb_id, 1, true, true, '🛏️'),
      ('Escritório', 'escritorio', amb_id, 2, true, true, '💼'),
      ('Sacada', 'sacada', amb_id, 3, true, true, '🌿')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Site settings: contact info (canonical source for footer/topbar)
INSERT INTO public.site_settings (key, value)
VALUES
  ('contact', '{"cnpj":"52.355.734/0001-97","whatsapp":"5532351202810","whatsapp_display":"(32) 35120281","email":"contato@agilpersianas.com.br","phone_display":"(32) 3512-0281","address_visible":false}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
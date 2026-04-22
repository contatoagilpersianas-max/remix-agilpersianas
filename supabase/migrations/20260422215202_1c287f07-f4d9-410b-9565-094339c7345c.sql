
-- 1) Subcategorias: adicionar parent_id em categories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);

-- 2) Novos campos para produtos (catálogo premium)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sale_price numeric,
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock_min integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_days integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'simples',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS manual_pdf_url text,
  ADD COLUMN IF NOT EXISTS installation text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

-- 3) Tabela de associação produto x categorias (múltiplas categorias)
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads product_categories"
  ON public.product_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins manage product_categories"
  ON public.product_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4) Galeria estruturada (separada do jsonb existente, opcional avançado)
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  color text,
  position integer NOT NULL DEFAULT 0,
  size_kb integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id, position);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads product_images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins manage product_images"
  ON public.product_images FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5) Bucket de mídia para uploads do admin (capa, galeria, manual PDF)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-media');

CREATE POLICY "Admins upload product-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update product-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete product-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

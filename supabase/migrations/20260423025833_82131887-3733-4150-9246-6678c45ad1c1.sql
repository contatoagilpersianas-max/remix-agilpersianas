ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS bestseller boolean NOT NULL DEFAULT false;
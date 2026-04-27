ALTER TABLE public.products
  ALTER COLUMN min_width_cm TYPE numeric USING min_width_cm::numeric,
  ALTER COLUMN max_width_cm TYPE numeric USING max_width_cm::numeric,
  ALTER COLUMN min_height_cm TYPE numeric USING min_height_cm::numeric,
  ALTER COLUMN max_height_cm TYPE numeric USING max_height_cm::numeric;
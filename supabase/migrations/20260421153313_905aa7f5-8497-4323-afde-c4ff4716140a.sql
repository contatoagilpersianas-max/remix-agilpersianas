-- ENUM para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Função de timestamps (reutilizável)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função has_role security definer (evita recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger: cria profile automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  position INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views active categories"
  ON public.categories FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  cover_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_per_sqm NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_area NUMERIC(6,2) NOT NULL DEFAULT 1,
  min_width_cm INT NOT NULL DEFAULT 40,
  max_width_cm INT NOT NULL DEFAULT 300,
  min_height_cm INT NOT NULL DEFAULT 40,
  max_height_cm INT NOT NULL DEFAULT 300,
  motor_manual_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  motor_rf_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  motor_wifi_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  bando_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.9,
  reviews_count INT NOT NULL DEFAULT 0,
  badge TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  bestseller BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views active products"
  ON public.products FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);

-- Storage bucket público
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

CREATE POLICY "Site images are public"
  ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Admins upload site images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site images"
  ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
-- Substitui a policy de SELECT para impedir listagem (lista exige owner=null check)
DROP POLICY IF EXISTS "Site images are public" ON storage.objects;

-- Mantém leitura individual pública via URL pública (Supabase storage retorna 200 para getPublicUrl mesmo sem SELECT broad).
-- Restringimos SELECT a admins para listar; URLs públicas continuam funcionando pelo CDN.
CREATE POLICY "Admins list site images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
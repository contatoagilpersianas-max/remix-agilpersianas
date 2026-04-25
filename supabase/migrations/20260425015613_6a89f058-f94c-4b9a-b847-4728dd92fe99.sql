-- Tabela de conhecimento da Lumi
CREATE TABLE public.lumi_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'text', -- text | faq | link | file | image | video
  content TEXT,
  url TEXT,
  file_path TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lumi_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lumi knowledge"
ON public.lumi_knowledge
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lumi_knowledge_updated_at
BEFORE UPDATE ON public.lumi_knowledge
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket privado para arquivos da base
INSERT INTO storage.buckets (id, name, public)
VALUES ('lumi-files', 'lumi-files', false)
ON CONFLICT (id) DO NOTHING;

-- Apenas admins podem ler/escrever no bucket
CREATE POLICY "Admins read lumi files"
ON storage.objects FOR SELECT
USING (bucket_id = 'lumi-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins upload lumi files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lumi-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update lumi files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lumi-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete lumi files"
ON storage.objects FOR DELETE
USING (bucket_id = 'lumi-files' AND public.has_role(auth.uid(), 'admin'));
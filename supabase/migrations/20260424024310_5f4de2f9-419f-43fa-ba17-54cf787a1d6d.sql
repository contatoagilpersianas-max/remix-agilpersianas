
CREATE TABLE public.lumi_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  lead_name TEXT,
  lead_phone TEXT,
  lead_status TEXT NOT NULL DEFAULT 'browsing',
  product_interest TEXT,
  message_count INTEGER NOT NULL DEFAULT 0,
  last_user_message TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lumi_conversations_visitor ON public.lumi_conversations(visitor_id);
CREATE INDEX idx_lumi_conversations_status ON public.lumi_conversations(lead_status);
CREATE INDEX idx_lumi_conversations_updated ON public.lumi_conversations(updated_at DESC);

ALTER TABLE public.lumi_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lumi conversations"
ON public.lumi_conversations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Edge function uses service role; inserts/updates via service key bypass RLS.
-- We do NOT allow anon write directly.

CREATE TRIGGER set_lumi_conversations_updated_at
BEFORE UPDATE ON public.lumi_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, RefreshCcw, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  /** Sugestão inicial para o prompt (ex.: nome do produto). */
  suggestion?: string;
  /** Quando o usuário confirma a imagem gerada. Recebe a URL pública. */
  onApply: (url: string) => void;
  /** Pasta no bucket product-media. */
  folder?: string;
  /** Texto do botão "aplicar". */
  applyLabel?: string;
  /** Compacto (cabe ao lado do upload de capa). */
  compact?: boolean;
};

export function AIImageGenerator({
  suggestion = "",
  onApply,
  folder = "ai-generated",
  applyLabel = "Usar como capa",
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(suggestion);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function generate() {
    const text = prompt.trim();
    if (text.length < 4) return toast.error("Descreva a imagem com mais detalhes.");
    setBusy(true);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-image", {
        body: { prompt: text, folder },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("Sem URL retornada.");
      setPreview(data.url);
    } catch (e: any) {
      const msg = e?.message || "Falha ao gerar imagem.";
      if (msg.includes("429")) toast.error("Muitas requisições. Aguarde alguns segundos.");
      else if (msg.includes("402")) toast.error("Créditos esgotados na sua workspace.");
      else toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  function apply() {
    if (!preview) return;
    onApply(preview);
    toast.success("Imagem aplicada.");
    setPreview(null);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={() => {
          setPrompt(suggestion);
          setOpen(true);
        }}
      >
        <Sparkles className="h-4 w-4" /> Gerar com IA
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" /> Imagem por IA
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setPreview(null);
          }}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <Label className="text-xs">Descreva o produto / cena</Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Ex.: Persiana rolô blackout cinza chumbo instalada em janela moderna, luz suave, ambiente clean."
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Dica: inclua cor, ambiente e estilo. A imagem é gerada com fundo neutro premium.
        </p>
      </div>

      {preview ? (
        <div className="space-y-2">
          <div className="relative rounded-md overflow-hidden border bg-card">
            <img src={preview} alt="Pré-visualização" className="w-full h-auto max-h-[360px] object-contain" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={apply}>
              <Check className="h-4 w-4" /> {applyLabel}
            </Button>
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={generate}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Gerar outra
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" size="sm" disabled={busy} onClick={generate}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy ? "Gerando..." : "Gerar imagem"}
        </Button>
      )}
    </div>
  );
}
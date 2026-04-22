import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadToProductMedia } from "@/lib/upload";
import { toast } from "sonner";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  recommendedSize?: string;
  label?: string;
};

export function ImageUpload({ value, onChange, folder = "covers", recommendedSize = "1200 × 1200 px", label = "Imagem" }: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem maior que 5 MB. Comprima antes de enviar.");
      return;
    }
    setBusy(true);
    try {
      const { url } = await uploadToProductMedia(file, folder);
      onChange(url);
      toast.success("Imagem enviada.");
    } catch (e) {
      toast.error("Falha no upload: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-[11px] text-muted-foreground">Recomendado: <strong>{recommendedSize}</strong> · até 5 MB</span>
      </div>
      {value ? (
        <div className="relative group rounded-lg border bg-muted/30 overflow-hidden aspect-square max-w-[220px]">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            aria-label="Remover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 w-full max-w-[220px] aspect-square rounded-lg border-2 border-dashed bg-muted/30 hover:bg-muted/50 hover:border-primary/40 transition text-muted-foreground"
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-8 w-8" />}
          <span className="text-xs font-medium">{busy ? "Enviando..." : "Clique para enviar"}</span>
          <span className="text-[10px]">{recommendedSize}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {value && (
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" /> Trocar
        </Button>
      )}
    </div>
  );
}

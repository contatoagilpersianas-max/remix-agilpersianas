import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { uploadToProductMedia } from "@/lib/upload";
import { toast } from "sonner";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  accept?: string;
  label?: string;
};

export function FileUpload({ value, onChange, folder = "files", accept = "application/pdf", label = "Arquivo" }: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 15 * 1024 * 1024) return toast.error("Arquivo maior que 15 MB.");
    setBusy(true);
    try {
      const { url } = await uploadToProductMedia(file, folder);
      onChange(url);
      toast.success("Arquivo enviado.");
    } catch (e) {
      toast.error("Falha: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {value ? (
          <div className="flex-1 flex items-center gap-2 rounded-md border px-3 py-2 bg-muted/30 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <a href={value} target="_blank" rel="noreferrer" className="truncate flex-1 text-primary underline-offset-2 hover:underline">
              Ver arquivo enviado
            </a>
            <button onClick={() => onChange(null)} className="text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Selecionar arquivo
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

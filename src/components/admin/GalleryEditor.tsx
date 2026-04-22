import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, X, ArrowUp, ArrowDown, ImagePlus } from "lucide-react";
import { uploadToProductMedia } from "@/lib/upload";
import { toast } from "sonner";

export type GalleryItem = { url: string; caption?: string; color?: string; size_kb?: number };

type Props = {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
};

export function GalleryEditor({ items, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    const next: GalleryItem[] = [...items];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" maior que 5 MB — pulada.`);
        continue;
      }
      try {
        const { url, sizeKb } = await uploadToProductMedia(file, "gallery");
        next.push({ url, caption: "", color: "", size_kb: sizeKb });
      } catch (e) {
        toast.error("Falha em " + file.name);
      }
    }
    onChange(next);
    setBusy(false);
  }

  function update(i: number, patch: Partial<GalleryItem>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h4 className="font-semibold text-sm">Galeria de fotos</h4>
          <p className="text-[11px] text-muted-foreground">
            Recomendado: <strong>1024 × 1024 px</strong> · JPG ou WebP · até 5 MB cada.
            Você pode enviar várias fotos de uma vez.
          </p>
        </div>
        <Button type="button" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Adicionar fotos
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length === 0 ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="w-full py-10 rounded-lg border-2 border-dashed bg-muted/20 hover:bg-muted/40 hover:border-primary/40 text-center text-sm text-muted-foreground"
        >
          <Upload className="h-6 w-6 mx-auto mb-2" />
          Arraste fotos aqui ou clique para selecionar
        </button>
      ) : (
        <div className="grid gap-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-lg border p-3 flex gap-3 items-start bg-card">
              <div className="h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                <img src={it.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground">Legenda</label>
                  <Input
                    value={it.caption ?? ""}
                    onChange={(e) => update(i, { caption: e.target.value })}
                    placeholder="Ex: Vista lateral"
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">Cor associada</label>
                  <Input
                    value={it.color ?? ""}
                    onChange={(e) => update(i, { color: e.target.value })}
                    placeholder="Ex: Bege"
                    className="h-8"
                  />
                </div>
                <div className="sm:col-span-2 text-[11px] text-muted-foreground">
                  Ordem: <strong>{i + 1}</strong> · Tamanho: {it.size_kb ? `${it.size_kb} KB` : "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                  <X className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

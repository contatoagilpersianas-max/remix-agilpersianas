import { useEffect, useState } from "react";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { ModuleCard } from "./_shared/ModuleCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Media = { name: string; url: string };

export function MediaLibraryModule() {
  const [bucket, setBucket] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);

  async function loadMedia() {
    const { data } = await supabase.storage.from("site-images").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      setBucket(
        data
          .filter((f) => !f.name.startsWith("."))
          .map((f) => ({ name: f.name, url: supabase.storage.from("site-images").getPublicUrl(f.name).data.publicUrl })),
      );
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file);
    setUploading(false);
    if (error) return toast.error(error.message);
    toast.success("Imagem enviada");
    e.target.value = "";
    loadMedia();
  }

  async function remove(name: string) {
    if (!confirm(`Excluir ${name}?`)) return;
    await supabase.storage.from("site-images").remove([name]);
    loadMedia();
  }

  return (
    <ModuleCard
      id="mod-media"
      icon={ImageIcon}
      title="Biblioteca de mídia"
      description="Imagens enviadas ficam disponíveis para usar nos módulos."
      headerExtra={
        <label className="inline-flex">
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
          <span className={`inline-flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium cursor-pointer hover:opacity-90 ${uploading ? "opacity-60" : ""}`}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Enviar imagem
          </span>
        </label>
      }
    >
      {bucket.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">Nenhuma imagem ainda.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {bucket.map((m) => (
            <div key={m.name} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => navigator.clipboard.writeText(m.url).then(() => toast.success("URL copiada"))} className="text-white text-xs bg-white/20 px-3 py-1 rounded">Copiar URL</button>
                <button onClick={() => remove(m.name)} className="text-white text-xs bg-destructive/80 px-3 py-1 rounded">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModuleCard>
  );
}
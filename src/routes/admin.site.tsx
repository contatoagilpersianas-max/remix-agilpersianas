import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Globe, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/site")({ component: SiteContent });

function SiteContent() {
  const [hero, setHero] = useState({ title: "", subtitle: "", cta: "", image: "" });
  const [bucket, setBucket] = useState<{ name: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "hero").maybeSingle();
      if (data?.value) setHero(data.value as typeof hero);
      loadMedia();
    })();
  }, []);

  async function loadMedia() {
    const { data } = await supabase.storage.from("site-images").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      setBucket(
        data
          .filter((f) => !f.name.startsWith("."))
          .map((f) => ({ name: f.name, url: supabase.storage.from("site-images").getPublicUrl(f.name).data.publicUrl }))
      );
    }
  }

  async function saveHero() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert([{ key: "hero", value: hero as never }]);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Hero atualizado");
  }

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

  async function removeMedia(name: string) {
    if (!confirm(`Excluir ${name}?`)) return;
    await supabase.storage.from("site-images").remove([name]);
    loadMedia();
  }

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Conteúdo</div>
        <h1 className="font-display text-3xl mt-1">Site / Conteúdo</h1>
        <p className="text-muted-foreground text-sm mt-1">Edite textos da home e gerencie imagens da loja.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Banner principal (Hero)</h2>
        </div>
        <div className="grid gap-3">
          <div><Label>Título</Label><Input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} placeholder="Persianas sob medida..." /></div>
          <div><Label>Subtítulo</Label><Textarea rows={2} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Texto do botão</Label><Input value={hero.cta} onChange={(e) => setHero({ ...hero, cta: e.target.value })} placeholder="Pedir orçamento" /></div>
            <div><Label>URL da imagem</Label><Input value={hero.image} onChange={(e) => setHero({ ...hero, image: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveHero} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar hero</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Biblioteca de mídia</h2>
          </div>
          <label className="inline-flex">
            <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
            <span className={`inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:opacity-90 ${uploading ? "opacity-60" : ""}`}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Enviar imagem
            </span>
          </label>
        </div>
        {bucket.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Nenhuma imagem ainda.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {bucket.map((m) => (
              <div key={m.name} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => navigator.clipboard.writeText(m.url).then(() => toast.success("URL copiada"))} className="text-white text-xs bg-white/20 px-3 py-1 rounded">Copiar URL</button>
                  <button onClick={() => removeMedia(m.name)} className="text-white text-xs bg-destructive/80 px-3 py-1 rounded">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Globe, Image as ImageIcon, Upload, Layers, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/site")({ component: SiteContent });

type HeroBanner = { src: string; title: string; subtitle: string };

const EMPTY_BANNERS: HeroBanner[] = [
  { src: "", title: "", subtitle: "" },
  { src: "", title: "", subtitle: "" },
  { src: "", title: "", subtitle: "" },
];

const MAX_BANNER_BYTES = 3 * 1024 * 1024; // 3 MB
const RECOMMENDED_W = 1920;
const RECOMMENDED_H = 1080;

function SiteContent() {
  const [hero, setHero] = useState({ title: "", subtitle: "", cta: "", image: "" });
  const [banners, setBanners] = useState<HeroBanner[]>(EMPTY_BANNERS);
  const [savingBanners, setSavingBanners] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState<number | null>(null);
  const [bucket, setBucket] = useState<{ name: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "hero").maybeSingle();
      if (data?.value) setHero(data.value as typeof hero);
      const { data: b } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_banners")
        .maybeSingle();
      if (b?.value && Array.isArray(b.value)) {
        const arr = b.value as Partial<HeroBanner>[];
        setBanners(
          EMPTY_BANNERS.map((def, i) => ({
            src: arr[i]?.src ?? def.src,
            title: arr[i]?.title ?? def.title,
            subtitle: arr[i]?.subtitle ?? def.subtitle,
          })),
        );
      }
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

  async function saveBanners() {
    setSavingBanners(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert([{ key: "hero_banners", value: banners as never }]);
    setSavingBanners(false);
    if (error) return toast.error(error.message);
    toast.success("Banners salvos");
  }

  async function uploadBanner(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      toast.error("Arquivo precisa ser uma imagem");
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      toast.error(`Imagem maior que ${(MAX_BANNER_BYTES / 1024 / 1024).toFixed(0)} MB`);
      return;
    }
    setUploadingBanner(index);
    const path = `banners/${index + 1}-${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    setUploadingBanner(null);
    e.target.value = "";
    if (error) {
      toast.error(error.message);
      return;
    }
    const url = supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
    const next = [...banners];
    next[index] = { ...next[index], src: url };
    setBanners(next);
    toast.success(`Banner ${index + 1} carregado — clique em Salvar banners`);
    loadMedia();
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
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Banners do carrossel (Home)</h2>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-[12px] text-foreground/80 mb-5">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong>Dimensão recomendada:</strong> {RECOMMENDED_W}×{RECOMMENDED_H} px (proporção 16:9, paisagem).
            </p>
            <p>
              <strong>Tamanho máximo:</strong> {(MAX_BANNER_BYTES / 1024 / 1024).toFixed(0)} MB &middot; <strong>Formatos:</strong> JPG, PNG ou WebP.
            </p>
            <p>
              <strong>Importante:</strong> envie imagens <em>limpas</em>, sem texto ou botões desenhados na foto — o título, subtítulo e botões já são renderizados em sobreposição automaticamente.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {banners.map((b, i) => (
            <div key={i} className="grid gap-3 rounded-xl border bg-card/50 p-4 sm:grid-cols-[200px_1fr]">
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Banner {i + 1}
                </div>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
                  {b.src ? (
                    <img src={b.src} alt={`Banner ${i + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingBanner === i}
                      onChange={(e) => uploadBanner(i, e)}
                    />
                    <span
                      className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground cursor-pointer hover:opacity-90 ${uploadingBanner === i ? "opacity-60" : ""}`}
                    >
                      {uploadingBanner === i ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      {b.src ? "Trocar imagem" : "Enviar imagem"}
                    </span>
                  </label>
                  {b.src && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        const next = [...banners];
                        next[i] = { ...next[i], src: "" };
                        setBanners(next);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover imagem
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={b.title}
                    onChange={(e) => {
                      const next = [...banners];
                      next[i] = { ...next[i], title: e.target.value };
                      setBanners(next);
                    }}
                    placeholder="Ex.: Noites perfeitas começam com a persiana certa."
                  />
                </div>
                <div>
                  <Label>Subtítulo</Label>
                  <Textarea
                    rows={2}
                    value={b.subtitle}
                    onChange={(e) => {
                      const next = [...banners];
                      next[i] = { ...next[i], subtitle: e.target.value };
                      setBanners(next);
                    }}
                    placeholder="Ex.: Blackout total, conforto térmico, sob medida — entregue na sua porta."
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">URL da imagem (auto-preenchido após upload)</Label>
                  <Input
                    value={b.src}
                    onChange={(e) => {
                      const next = [...banners];
                      next[i] = { ...next[i], src: e.target.value };
                      setBanners(next);
                    }}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5">
          <Button onClick={saveBanners} disabled={savingBanners}>
            {savingBanners && <Loader2 className="h-4 w-4 animate-spin" />} Salvar banners
          </Button>
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

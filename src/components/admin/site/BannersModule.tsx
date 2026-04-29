import { Layers, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ModuleCard } from "./_shared/ModuleCard";
import { SortableList } from "./_shared/SortableList";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Banner = {
  src: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaUrl: string;
  active: boolean;
};

const EMPTY: Banner = { src: "", title: "", subtitle: "", cta: "", ctaUrl: "", active: true };
const DEFAULTS: Banner[] = [
  { ...EMPTY, title: "A arte de iluminar cada ambiente.", subtitle: "Persianas e cortinas sob medida com design premium." },
  { ...EMPTY, title: "Noites perfeitas começam com a persiana certa.", subtitle: "Blackout total, conforto térmico, sob medida." },
  { ...EMPTY, title: "Viva ao ar livre, com sofisticação.", subtitle: "Toldos modernos sob medida — conforto e lifestyle premium." },
];
const MAX = 5;

export function BannersModule() {
  const { value: rawBanners, setValue, save, saving } = useSiteSetting<Banner[]>("hero_banners", DEFAULTS);
  // Garante shape ao migrar de schema antigo
  const banners: Banner[] = (rawBanners as Partial<Banner>[]).map((b) => ({ ...EMPTY, ...b }));
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  function update(idx: number, patch: Partial<Banner>) {
    const next = banners.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    setValue(next);
  }
  function remove(idx: number) {
    if (!confirm("Remover este banner?")) return;
    setValue(banners.filter((_, i) => i !== idx));
  }
  function add() {
    if (banners.length >= MAX) return;
    setValue([...banners, { ...EMPTY }]);
  }

  async function uploadBanner(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Imagem maior que 3MB");
      return;
    }
    setUploadingIdx(idx);
    const path = `banners/${idx + 1}-${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    setUploadingIdx(null);
    e.target.value = "";
    if (error) return toast.error(error.message);
    const url = supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
    update(idx, { src: url });
    toast.success("Imagem carregada — clique em Salvar carrossel");
  }

  return (
    <ModuleCard
      id="mod-banners"
      icon={Layers}
      title="Carrossel de banners"
      description="Banners rotativos no topo da home (até 5). Arraste para reordenar."
      saveLabel="Salvar carrossel"
      onSave={() => save(banners)}
      saving={saving}
      headerExtra={
        <Button variant="outline" size="sm" onClick={add} disabled={banners.length >= MAX}>
          <Plus className="h-4 w-4" /> Adicionar banner
        </Button>
      }
    >
      <SortableList
        items={banners}
        getId={(_, i) => `banner-${i}`}
        onReorder={setValue}
        renderItem={(b, i, dragHandle) => (
          <div className="grid gap-3 rounded-xl border bg-card/50 p-4 sm:grid-cols-[200px_1fr_40px]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Banner {i + 1}</div>
                <Switch checked={b.active} onCheckedChange={(v) => update(i, { active: v })} />
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
                {b.src ? (
                  <img src={b.src} alt={`Banner ${i + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[11px] text-muted-foreground">Sem imagem</div>
                )}
              </div>
              <label className="inline-flex w-full">
                <input type="file" accept="image/*" className="hidden" disabled={uploadingIdx === i} onChange={(e) => uploadBanner(i, e)} />
                <span className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground cursor-pointer hover:opacity-90">
                  {uploadingIdx === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {b.src ? "Trocar" : "Enviar"} imagem
                </span>
              </label>
            </div>
            <div className="grid gap-3">
              <div>
                <Label>Título</Label>
                <Input value={b.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Ex.: Noites perfeitas..." />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <Textarea rows={2} value={b.subtitle} onChange={(e) => update(i, { subtitle: e.target.value })} placeholder="Ex.: Blackout total..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Texto do botão</Label>
                  <Input value={b.cta} onChange={(e) => update(i, { cta: e.target.value })} placeholder="Pedir orçamento" />
                </div>
                <div>
                  <Label>URL do botão</Label>
                  <Input value={b.ctaUrl} onChange={(e) => update(i, { ctaUrl: e.target.value })} placeholder="/catalogo" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">URL da imagem (auto-preenchido)</Label>
                <Input value={b.src} onChange={(e) => update(i, { src: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="flex flex-col items-center justify-between">
              {dragHandle}
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      />
    </ModuleCard>
  );
}
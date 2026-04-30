import { MessageSquareQuote, Plus, Trash2, Upload, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { SortableList } from "./_shared/SortableList";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Testimonial = {
  name: string;
  city: string;
  rating: number;
  photo: string;
  text: string;
};

export type TestimonialsConfig = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  ratingSummary: string;
  items: Testimonial[];
};

export const TESTIMONIALS_DEFAULTS: TestimonialsConfig = {
  enabled: true,
  eyebrow: "Quem comprou, recomenda",
  title: "+20 mil lares com Ágil",
  ratingSummary: "4.9/5 — 3.214 avaliações",
  items: [
    {
      name: "Marina Lopes",
      city: "São Paulo, SP",
      rating: 5,
      photo: "",
      text: "Comprei rolô blackout para o quarto do bebê. Chegou perfeito, montei sozinha e o quarto fica totalmente escuro. Recomendo muito!",
    },
    {
      name: "Rafael Andrade",
      city: "Belo Horizonte, MG",
      rating: 5,
      photo: "",
      text: "Atendimento via WhatsApp foi excelente. Tiraram todas as dúvidas sobre medida. Acabamento de primeira linha.",
    },
    {
      name: "Juliana Castro",
      city: "Curitiba, PR",
      rating: 5,
      photo: "",
      text: "Já é a terceira persiana que compro com a Ágil. Tecido lindo, durável e o preço continua ótimo. Virei fã.",
    },
  ],
};
const MAX = 12;

export function TestimonialsModule() {
  const { value, setValue, save, saving } = useSiteSetting<TestimonialsConfig>(
    "testimonials",
    TESTIMONIALS_DEFAULTS,
  );
  const [uploading, setUploading] = useState<number | null>(null);
  const update = (patch: Partial<TestimonialsConfig>) => setValue({ ...value, ...patch });
  const updateItem = (i: number, patch: Partial<Testimonial>) =>
    update({ items: value.items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) });

  async function uploadPhoto(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Foto maior que 2MB");
    setUploading(idx);
    const path = `testimonials/${idx}-${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    setUploading(null);
    e.target.value = "";
    if (error) return toast.error(error.message);
    const url = supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
    updateItem(idx, { photo: url });
    toast.success("Foto carregada — clique em Salvar");
  }

  return (
    <ModuleCard
      id="mod-testimonials"
      icon={MessageSquareQuote}
      title="Depoimentos"
      description="Avaliações exibidas na seção de prova social."
      saveLabel="Salvar depoimentos"
      onSave={() => save()}
      saving={saving}
      headerExtra={
        <Button
          variant="outline"
          size="sm"
          disabled={value.items.length >= MAX}
          onClick={() => update({ items: [...value.items, { name: "", city: "", rating: 5, photo: "", text: "" }] })}
        >
          <Plus className="h-4 w-4" /> Adicionar depoimento
        </Button>
      }
    >
      <ToggleField label="Mostrar seção" checked={value.enabled} onChange={(v) => update({ enabled: v })} />
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Eyebrow</Label>
          <Input value={value.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </div>
        <div>
          <Label>Título</Label>
          <Input value={value.title} onChange={(e) => update({ title: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Resumo de avaliações</Label>
          <Input value={value.ratingSummary} onChange={(e) => update({ ratingSummary: e.target.value })} placeholder="4.9/5 — 3.214 avaliações" />
        </div>
      </div>

      <SortableList
        items={value.items}
        getId={(_, i) => `t-${i}`}
        onReorder={(next) => update({ items: next })}
        renderItem={(it, i, drag) => (
          <div className="grid gap-3 rounded-xl border bg-card/50 p-4 sm:grid-cols-[120px_1fr_40px]">
            <div className="space-y-2">
              <div className="aspect-square w-full overflow-hidden rounded-full border bg-muted">
                {it.photo ? (
                  <img src={it.photo} alt={it.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">Sem foto</div>
                )}
              </div>
              <label className="inline-flex w-full">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadPhoto(i, e)} />
                <span className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-primary px-2 text-[11px] font-medium text-primary-foreground cursor-pointer hover:opacity-90">
                  {uploading === i ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Foto
                </span>
              </label>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label>Nome</Label>
                  <Input value={it.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
                </div>
                <div>
                  <Label>Estrelas</Label>
                  <select
                    className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                    value={it.rating}
                    onChange={(e) => updateItem(i, { rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} {Array(n).fill("★").join("")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Cidade / UF</Label>
                <Input value={it.city} onChange={(e) => updateItem(i, { city: e.target.value })} placeholder="São Paulo, SP" />
              </div>
              <div>
                <Label>Depoimento</Label>
                <Textarea rows={3} value={it.text} onChange={(e) => updateItem(i, { text: e.target.value })} />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {Array.from({ length: it.rating }).map((_, k) => (
                  <Star key={k} className="h-3 w-3 fill-primary text-primary" />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-between">
              {drag}
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => update({ items: value.items.filter((_, idx) => idx !== i) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      />
    </ModuleCard>
  );
}
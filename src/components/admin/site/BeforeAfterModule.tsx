import { Sparkles, Plus, Trash2, Upload, Loader2 } from "lucide-react";
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

export type BeforeAfterPair = {
  before: string;
  after: string;
  title: string;
  desc: string;
};

export type BeforeAfterConfig = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  pairs: BeforeAfterPair[];
};

export const BEFORE_AFTER_DEFAULTS: BeforeAfterConfig = {
  enabled: true,
  eyebrow: "Transformações reais",
  title: "Veja como uma persiana muda tudo",
  subtitle: "Arraste para comparar. Mesmos ambientes — antes e depois das nossas persianas instaladas.",
  pairs: [
    {
      before: "",
      after: "",
      title: "Sala de estar",
      desc: "Antes: janela nua e luz forte. Depois: persiana rolô em linho premium, luz suave e elegante.",
    },
    {
      before: "",
      after: "",
      title: "Quarto principal",
      desc: "Antes: claridade desconfortável ao acordar. Depois: persiana rolô blackout, escurecimento total e conforto térmico.",
    },
  ],
};
const MAX = 6;

export function BeforeAfterModule() {
  const { value, setValue, save, saving } = useSiteSetting<BeforeAfterConfig>(
    "before_after",
    BEFORE_AFTER_DEFAULTS,
  );
  const [uploading, setUploading] = useState<string | null>(null);
  const update = (patch: Partial<BeforeAfterConfig>) => setValue({ ...value, ...patch });
  const updatePair = (i: number, patch: Partial<BeforeAfterPair>) =>
    update({ pairs: value.pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });

  function add() {
    if (value.pairs.length >= MAX) return;
    update({ pairs: [...value.pairs, { before: "", after: "", title: "", desc: "" }] });
  }
  function remove(i: number) {
    if (!confirm("Remover este par?")) return;
    update({ pairs: value.pairs.filter((_, idx) => idx !== i) });
  }

  async function uploadImg(idx: number, kind: "before" | "after", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return toast.error("Imagem maior que 3MB");
    const tag = `${idx}-${kind}`;
    setUploading(tag);
    const path = `before-after/${idx}-${kind}-${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    setUploading(null);
    e.target.value = "";
    if (error) return toast.error(error.message);
    const url = supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
    updatePair(idx, { [kind]: url } as Partial<BeforeAfterPair>);
    toast.success("Imagem carregada — clique em Salvar");
  }

  return (
    <ModuleCard
      id="mod-beforeafter"
      icon={Sparkles}
      title="Antes & Depois"
      description="Comparador interativo de transformações."
      saveLabel="Salvar antes/depois"
      onSave={() => save()}
      saving={saving}
      headerExtra={
        <Button variant="outline" size="sm" onClick={add} disabled={value.pairs.length >= MAX}>
          <Plus className="h-4 w-4" /> Adicionar par
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
      </div>
      <div>
        <Label>Subtítulo</Label>
        <Textarea rows={2} value={value.subtitle} onChange={(e) => update({ subtitle: e.target.value })} />
      </div>

      <SortableList
        items={value.pairs}
        getId={(_, i) => `pair-${i}`}
        onReorder={(next) => update({ pairs: next })}
        renderItem={(p, i, drag) => (
          <div className="grid gap-3 rounded-xl border bg-card/50 p-4 sm:grid-cols-[1fr_40px]">
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Par {i + 1}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {(["before", "after"] as const).map((kind) => (
                  <div key={kind} className="space-y-2">
                    <Label className="text-xs uppercase">{kind === "before" ? "Antes" : "Depois"}</Label>
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted">
                      {p[kind] ? (
                        <img src={p[kind]} alt={kind} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] text-muted-foreground">Sem imagem</div>
                      )}
                    </div>
                    <label className="inline-flex w-full">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImg(i, kind, e)} />
                      <span className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground cursor-pointer hover:opacity-90">
                        {uploading === `${i}-${kind}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        {p[kind] ? "Trocar" : "Enviar"}
                      </span>
                    </label>
                    <Input value={p[kind]} onChange={(e) => updatePair(i, { [kind]: e.target.value } as Partial<BeforeAfterPair>)} placeholder="https://..." />
                  </div>
                ))}
              </div>
              <div>
                <Label>Título do par</Label>
                <Input value={p.title} onChange={(e) => updatePair(i, { title: e.target.value })} placeholder="Sala de estar" />
              </div>
              <div>
                <Label>Descrição (use "Antes:" e "Depois:" para legendas dinâmicas)</Label>
                <Textarea rows={2} value={p.desc} onChange={(e) => updatePair(i, { desc: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col items-center justify-between">
              {drag}
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      />
    </ModuleCard>
  );
}
import { Bug, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { SortableList } from "./_shared/SortableList";
import { UrlFieldWithPreview } from "./_shared/UrlFieldWithPreview";
import { useSiteSetting } from "@/hooks/use-site-setting";

export type MosquitoType = { t: string; s: string };
export type MosquitoConfig = {
  enabled: boolean;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaLabel: string;
  ctaWhatsappMessage: string;
  image: string;
  types: MosquitoType[];
};

export const MOSQUITO_DEFAULTS: MosquitoConfig = {
  enabled: true,
  eyebrow: "✦ Tela mosquiteira",
  titleLine1: "Janela aberta.",
  titleLine2: "Casa protegida.",
  description:
    "Telas para qualquer tipo de janela ou porta — proteção contra mosquitos, dengue e insetos sem perder a ventilação natural.",
  ctaLabel: "Solicitar orçamento",
  ctaWhatsappMessage: "Olá, gostaria de um orçamento de tela mosquiteira",
  image: "",
  types: [
    { t: "Fixa", s: "Quadro discreto, ideal para janelas que ficam abertas." },
    { t: "Retrátil", s: "Recolhe quando não está em uso, perfeita para portas." },
    { t: "Magnética", s: "Encaixe sem furos, fácil de instalar e remover." },
    { t: "Pet reforçada", s: "Tela mais resistente para casas com cães e gatos." },
  ],
};
const MAX = 8;

export function MosquitoModule() {
  const { value, setValue, save, saving } = useSiteSetting<MosquitoConfig>("mosquito", MOSQUITO_DEFAULTS);
  const update = (patch: Partial<MosquitoConfig>) => setValue({ ...value, ...patch });
  const updateType = (i: number, patch: Partial<MosquitoType>) =>
    update({ types: value.types.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) });

  return (
    <ModuleCard
      id="mod-mosquito"
      icon={Bug}
      title="Tela mosquiteira"
      description="Seção dedicada às telas mosquiteiras."
      saveLabel="Salvar mosquiteira"
      onSave={() => save()}
      saving={saving}
      headerExtra={
        <Button variant="outline" size="sm" onClick={() => value.types.length < MAX && update({ types: [...value.types, { t: "", s: "" }] })} disabled={value.types.length >= MAX}>
          <Plus className="h-4 w-4" /> Adicionar tipo
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
          <Label>Título — linha 1</Label>
          <Input value={value.titleLine1} onChange={(e) => update({ titleLine1: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Título — linha 2 (em destaque)</Label>
          <Input value={value.titleLine2} onChange={(e) => update({ titleLine2: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea rows={3} value={value.description} onChange={(e) => update({ description: e.target.value })} />
      </div>
      <UrlFieldWithPreview
        label="Imagem (deixe vazio para usar a padrão)"
        value={value.image}
        onChange={(v) => update({ image: v })}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Texto do botão</Label>
          <Input value={value.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} />
        </div>
        <div>
          <Label>Mensagem WhatsApp pré-preenchida</Label>
          <Input value={value.ctaWhatsappMessage} onChange={(e) => update({ ctaWhatsappMessage: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Tipos de tela ({value.types.length}/{MAX})
        </div>
        <SortableList
          items={value.types}
          getId={(_, i) => `mosq-${i}`}
          onReorder={(next) => update({ types: next })}
          renderItem={(it, i, drag) => (
            <div className="flex items-start gap-2 rounded-lg border bg-card p-2">
              {drag}
              <div className="flex-1 grid sm:grid-cols-[1fr_2fr] gap-2">
                <Input value={it.t} onChange={(e) => updateType(i, { t: e.target.value })} placeholder="Nome (Fixa)" />
                <Input value={it.s} onChange={(e) => updateType(i, { s: e.target.value })} placeholder="Descrição curta" />
              </div>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => update({ types: value.types.filter((_, idx) => idx !== i) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </div>
    </ModuleCard>
  );
}
import { Cpu, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { SortableList } from "./_shared/SortableList";
import { UrlFieldWithPreview } from "./_shared/UrlFieldWithPreview";
import { useSiteSetting } from "@/hooks/use-site-setting";

export type AutomationFeature = { icon: string; t: string; s: string };
export type AutomationConfig = {
  enabled: boolean;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  image: string;
  features: AutomationFeature[];
};

const ICON_OPTIONS = ["Mic", "Wifi", "Smartphone", "RadioTower", "Zap", "Cpu", "Bot"];

export const AUTOMATION_DEFAULTS: AutomationConfig = {
  enabled: true,
  eyebrow: "✦ Automação residencial",
  titleLine1: "Sua casa inteligente",
  titleLine2: "começa na janela.",
  description:
    "Persianas motorizadas com integração total a Alexa, Google Home e controle pelo celular. Subir, descer e programar cenas com um toque ou um comando de voz.",
  ctaLabel: "Ver linha motorizada",
  ctaUrl: "#categorias",
  image: "",
  features: [
    { icon: "Mic", t: "Alexa", s: "Comando por voz" },
    { icon: "Wifi", t: "Google Home", s: "Integração total" },
    { icon: "Smartphone", t: "App celular", s: "iOS e Android" },
    { icon: "RadioTower", t: "Controle remoto", s: "Sem fios pela parede" },
    { icon: "Zap", t: "Wi-Fi e RF", s: "Múltiplos protocolos" },
  ],
};
const MAX = 8;

export function AutomationModule() {
  const { value, setValue, save, saving } = useSiteSetting<AutomationConfig>("automation", AUTOMATION_DEFAULTS);
  const update = (patch: Partial<AutomationConfig>) => setValue({ ...value, ...patch });
  const updateFeat = (i: number, patch: Partial<AutomationFeature>) =>
    update({ features: value.features.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) });

  return (
    <ModuleCard
      id="mod-automation"
      icon={Cpu}
      title="Automação residencial"
      description="Seção dedicada à motorização e integração com Alexa/Google Home."
      saveLabel="Salvar automação"
      onSave={() => save()}
      saving={saving}
      headerExtra={
        <Button
          variant="outline"
          size="sm"
          onClick={() => value.features.length < MAX && update({ features: [...value.features, { icon: "Cpu", t: "", s: "" }] })}
          disabled={value.features.length >= MAX}
        >
          <Plus className="h-4 w-4" /> Adicionar recurso
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
          <Label>Título — linha 2 (palavra final em destaque)</Label>
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
          <Label>URL do botão</Label>
          <Input value={value.ctaUrl} onChange={(e) => update({ ctaUrl: e.target.value })} placeholder="#categorias ou /catalogo" />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Recursos ({value.features.length}/{MAX})
        </div>
        <SortableList
          items={value.features}
          getId={(_, i) => `auto-${i}`}
          onReorder={(next) => update({ features: next })}
          renderItem={(f, i, drag) => (
            <div className="flex items-start gap-2 rounded-lg border bg-card p-2">
              {drag}
              <div className="flex-1 grid sm:grid-cols-[120px_1fr_2fr] gap-2">
                <select
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                  value={f.icon}
                  onChange={(e) => updateFeat(i, { icon: e.target.value })}
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
                <Input value={f.t} onChange={(e) => updateFeat(i, { t: e.target.value })} placeholder="Alexa" />
                <Input value={f.s} onChange={(e) => updateFeat(i, { s: e.target.value })} placeholder="Comando por voz" />
              </div>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => update({ features: value.features.filter((_, idx) => idx !== i) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </div>
    </ModuleCard>
  );
}
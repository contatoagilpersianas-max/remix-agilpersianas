import { Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { useSiteSetting } from "@/hooks/use-site-setting";

export type FeaturedConfig = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  limit: number;
};

export const FEATURED_DEFAULTS: FeaturedConfig = {
  enabled: true,
  eyebrow: "Destaques",
  title: "Produtos em destaque",
  subtitle: "Persianas e cortinas sob medida ao centímetro com envio para todo o Brasil.",
  ctaLabel: "Ver todos os produtos",
  ctaUrl: "/catalogo",
  limit: 8,
};

export function FeaturedModule() {
  const { value, setValue, save, saving } = useSiteSetting<FeaturedConfig>("featured", FEATURED_DEFAULTS);
  const update = (patch: Partial<FeaturedConfig>) => setValue({ ...value, ...patch });

  return (
    <ModuleCard
      id="mod-featured"
      icon={Flame}
      title="Produtos em destaque"
      description="Vitrine dos produtos marcados como Destaque no catálogo."
      saveLabel="Salvar destaques"
      onSave={() => save()}
      saving={saving}
    >
      <ToggleField label="Mostrar seção" checked={value.enabled} onChange={(v) => update({ enabled: v })} />
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Eyebrow</Label>
          <Input value={value.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </div>
        <div>
          <Label>Quantidade exibida</Label>
          <Input
            type="number"
            min={4}
            max={12}
            value={value.limit}
            onChange={(e) => update({ limit: Math.max(4, Math.min(12, Number(e.target.value) || 8)) })}
          />
        </div>
      </div>
      <div>
        <Label>Título</Label>
        <Input value={value.title} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <div>
        <Label>Subtítulo</Label>
        <Textarea rows={2} value={value.subtitle} onChange={(e) => update({ subtitle: e.target.value })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Texto do botão</Label>
          <Input value={value.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} />
        </div>
        <div>
          <Label>URL do botão</Label>
          <Input value={value.ctaUrl} onChange={(e) => update({ ctaUrl: e.target.value })} />
        </div>
      </div>
    </ModuleCard>
  );
}
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { SortableList } from "./_shared/SortableList";
import { useSiteSetting } from "@/hooks/use-site-setting";

type PromoStrip = { items: string[]; enabled: boolean };

const DEFAULTS: PromoStrip = {
  items: [
    "Cortinas e persianas sob medida",
    "Toldos e telas mosquiteiras",
    "Produção própria",
    "Instalação simples",
    "Envio para todo o Brasil",
    "Parcele em até 6× sem juros",
    "5% de desconto no PIX",
    "Atendimento via WhatsApp",
  ],
  enabled: true,
};
const MAX = 10;

export function PromoStripModule() {
  const { value, setValue, save, saving } = useSiteSetting<PromoStrip>("promo_strip", DEFAULTS);

  function setItems(items: string[]) {
    setValue({ ...value, items });
  }
  function add() {
    if (value.items.length >= MAX) return;
    setItems([...value.items, ""]);
  }
  function remove(i: number) {
    setItems(value.items.filter((_, idx) => idx !== i));
  }

  return (
    <ModuleCard
      id="mod-promo"
      icon={Megaphone}
      title="Faixa de benefícios corridos"
      description="Texto em loop laranja abaixo do hero."
      saveLabel="Salvar faixa"
      onSave={() => save()}
      saving={saving}
      headerExtra={
        <Button variant="outline" size="sm" onClick={add} disabled={value.items.length >= MAX}>
          <Plus className="h-4 w-4" /> Adicionar item
        </Button>
      }
    >
      <ToggleField
        label="Mostrar faixa no site"
        checked={value.enabled}
        onChange={(v) => setValue({ ...value, enabled: v })}
      />
      <SortableList
        items={value.items}
        getId={(_, i) => `promo-${i}`}
        onReorder={setItems}
        renderItem={(item, i, drag) => (
          <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
            {drag}
            <Input
              value={item}
              onChange={(e) => setItems(value.items.map((x, idx) => (idx === i ? e.target.value : x)))}
              placeholder="Sob medida exata · Parcele 6x sem juros"
              className="border-0 focus-visible:ring-0"
            />
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
      <p className="text-xs text-muted-foreground">{value.items.length}/{MAX} itens</p>
    </ModuleCard>
  );
}
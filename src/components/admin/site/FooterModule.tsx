import { LayoutPanelTop, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { SortableList } from "./_shared/SortableList";
import { useSiteSetting } from "@/hooks/use-site-setting";

type FooterLink = { label: string; url: string };
type FooterColumn = { title: string; enabled: boolean; links: FooterLink[] };
type FooterCfg = { intro: string; columns: FooterColumn[]; copyright: string };

const DEFAULTS: FooterCfg = {
  intro: "Transformando ambientes com persianas, cortinas e toldos sob medida — entrega para todo o Brasil.",
  copyright: `© ${new Date().getFullYear()} Ágil Persianas — Todos os direitos reservados.`,
  columns: [
    {
      title: "Produtos",
      enabled: true,
      links: [
        { label: "Persiana Rolô Blackout", url: "/persiana-rolo-blackout" },
        { label: "Persiana Solar Screen", url: "/persiana-solar-screen" },
        { label: "Cortina Romana", url: "/cortina-romana" },
        { label: "Catálogo completo", url: "/catalogo" },
      ],
    },
    {
      title: "Atendimento",
      enabled: true,
      links: [
        { label: "Como medir", url: "/blog/como-medir-janela-persiana" },
        { label: "FAQ", url: "#faq" },
      ],
    },
    {
      title: "Ágil",
      enabled: true,
      links: [
        { label: "Blog", url: "/blog" },
        { label: "Política de privacidade", url: "#privacidade" },
      ],
    },
    { title: "", enabled: false, links: [] },
  ],
};
const MAX_COLS = 4;
const MAX_LINKS = 8;

export function FooterModule() {
  const { value, setValue, save, saving } = useSiteSetting<FooterCfg>("footer", DEFAULTS);

  function setCols(columns: FooterColumn[]) {
    setValue({ ...value, columns });
  }
  function updateCol(idx: number, patch: Partial<FooterColumn>) {
    setCols(value.columns.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }
  function addLink(colIdx: number) {
    const col = value.columns[colIdx];
    if (col.links.length >= MAX_LINKS) return;
    updateCol(colIdx, { links: [...col.links, { label: "", url: "" }] });
  }
  function updateLink(colIdx: number, linkIdx: number, patch: Partial<FooterLink>) {
    const col = value.columns[colIdx];
    updateCol(colIdx, { links: col.links.map((l, i) => (i === linkIdx ? { ...l, ...patch } : l)) });
  }
  function removeLink(colIdx: number, linkIdx: number) {
    const col = value.columns[colIdx];
    updateCol(colIdx, { links: col.links.filter((_, i) => i !== linkIdx) });
  }

  return (
    <ModuleCard
      id="mod-footer"
      icon={LayoutPanelTop}
      title="Footer"
      description="Texto institucional, colunas de links e rodapé final."
      saveLabel="Salvar footer"
      onSave={() => save()}
      saving={saving}
    >
      <div>
        <Label>Texto institucional</Label>
        <Textarea rows={2} value={value.intro} onChange={(e) => setValue({ ...value, intro: e.target.value })} placeholder={DEFAULTS.intro} />
      </div>

      <div className="space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Colunas de links ({value.columns.length}/{MAX_COLS})</div>
        {value.columns.slice(0, MAX_COLS).map((col, ci) => (
          <div key={ci} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <Label>Título da coluna {ci + 1}</Label>
                <Input value={col.title} onChange={(e) => updateCol(ci, { title: e.target.value })} placeholder="Ex.: Produtos" />
              </div>
              <div className="flex items-center gap-2">
                <Label className="mb-0 text-xs">Ativa</Label>
                <input type="checkbox" checked={col.enabled} onChange={(e) => updateCol(ci, { enabled: e.target.checked })} className="h-4 w-4" />
              </div>
            </div>
            <SortableList
              items={col.links}
              getId={(_, i) => `col-${ci}-link-${i}`}
              onReorder={(links) => updateCol(ci, { links })}
              renderItem={(l, li, drag) => (
                <div className="flex items-center gap-2">
                  {drag}
                  <Input value={l.label} onChange={(e) => updateLink(ci, li, { label: e.target.value })} placeholder="Texto do link" className="flex-1" />
                  <Input value={l.url} onChange={(e) => updateLink(ci, li, { url: e.target.value })} placeholder="/rota ou https://..." className="flex-1" />
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeLink(ci, li)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            <Button variant="outline" size="sm" onClick={() => addLink(ci)} disabled={col.links.length >= MAX_LINKS}>
              <Plus className="h-3.5 w-3.5" /> Adicionar link ({col.links.length}/{MAX_LINKS})
            </Button>
          </div>
        ))}
      </div>

      <div>
        <Label>Texto do rodapé final</Label>
        <Input value={value.copyright} onChange={(e) => setValue({ ...value, copyright: e.target.value })} placeholder={DEFAULTS.copyright} />
      </div>
    </ModuleCard>
  );
}
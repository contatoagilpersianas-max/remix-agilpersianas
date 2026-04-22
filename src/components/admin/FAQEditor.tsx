import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export type FAQItem = { q: string; a: string };

type Props = {
  items: FAQItem[];
  onChange: (items: FAQItem[]) => void;
};

export function FAQEditor({ items, onChange }: Props) {
  const list = Array.isArray(items) ? items : [];
  const update = (i: number, patch: Partial<FAQItem>) => {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, { q: "", a: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="rounded-lg border p-4 bg-sand/30 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">Perguntas frequentes (FAQ)</h4>
          <p className="text-[11px] text-muted-foreground">
            Tira-dúvidas que aparece na página do produto. Quanto mais completo, menos perguntas no WhatsApp.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Nova pergunta
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma FAQ cadastrada.</p>
      ) : (
        <div className="space-y-3">
          {list.map((it, i) => (
            <div key={i} className="rounded-md border bg-card p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                <Input
                  value={it.q}
                  onChange={(e) => update(i, { q: e.target.value })}
                  placeholder="Pergunta (ex: Demora quanto para chegar?)"
                  className="h-8 font-medium"
                />
                <div className="flex">
                  <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={it.a}
                onChange={(e) => update(i, { a: e.target.value })}
                placeholder="Resposta clara e objetiva"
                rows={3}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

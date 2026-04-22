import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

type Props = {
  items: string[];
  onChange: (items: string[]) => void;
};

const SUGGESTIONS = [
  "Tecido importado anti-UV",
  "Mecanismo silencioso de alta durabilidade",
  "Reduz a entrada de calor em até 80%",
  "Acabamento premium que valoriza o ambiente",
  "Fácil limpeza com pano úmido",
  "Pronto para motorização Wi-Fi",
];

export function FeaturesEditor({ items, onChange }: Props) {
  const list = Array.isArray(items) ? items : [];
  const update = (i: number, v: string) => {
    const next = [...list];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const add = (v = "") => onChange([...list, v]);
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
          <h4 className="font-semibold text-sm">Características / Diferenciais</h4>
          <p className="text-[11px] text-muted-foreground">
            Frases curtas que aparecem em destaque na página do produto. Ex: "Bloqueia 100% da luz".
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => add()}>
          <Plus className="h-3.5 w-3.5" /> Adicionar
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="text-xs text-muted-foreground">Nenhuma característica ainda.</div>
      ) : (
        <div className="space-y-2">
          {list.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-4 text-right">{i + 1}.</span>
              <Input value={it} onChange={(e) => update(i, e.target.value)} className="h-9" placeholder="Ex: Tecido com proteção UV" />
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
          ))}
        </div>
      )}

      <div className="pt-2 border-t">
        <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Sugestões — clique para adicionar:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.filter((s) => !list.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-[11px] px-2 py-1 rounded-full border bg-card hover:border-primary hover:text-primary transition"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Loader2, ArrowUp, ArrowDown, ChevronRight, ChevronDown, FolderTree } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categorias")({ component: Categories });

type Cat = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  position: number;
  active: boolean;
  parent_id: string | null;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Categories() {
  const [rows, setRows] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("position");
    setRows((data as Cat[]) ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const tree = useMemo(() => {
    const roots = rows.filter((r) => !r.parent_id);
    const childrenOf = (id: string) => rows.filter((r) => r.parent_id === id);
    return { roots, childrenOf };
  }, [rows]);

  async function save() {
    if (!editing?.name) return toast.error("Nome obrigatório");
    setSaving(true);
    const payload: Partial<Cat> = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      parent_id: editing.parent_id || null,
    };
    // prevent self-parent
    if (payload.id && payload.parent_id === payload.id) {
      setSaving(false);
      return toast.error("Categoria não pode ser pai dela mesma");
    }
    const { error } = editing.id
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Categoria salva");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const hasChildren = rows.some((r) => r.parent_id === id);
    if (hasChildren && !confirm("Esta categoria tem subcategorias. Excluir mesmo assim? (subcategorias ficarão sem pai)")) return;
    if (!hasChildren && !confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function move(id: string, dir: -1 | 1) {
    const cat = rows.find((r) => r.id === id);
    if (!cat) return;
    const siblings = rows.filter((r) => r.parent_id === cat.parent_id).sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((r) => r.id === id);
    const swap = siblings[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("categories").update({ position: swap.position }).eq("id", id),
      supabase.from("categories").update({ position: cat.position }).eq("id", swap.id),
    ]);
    load();
  }

  function toggle(id: string) {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  }

  function startNew(parent_id: string | null = null) {
    const siblings = rows.filter((r) => r.parent_id === parent_id);
    setEditing({ active: true, position: siblings.length, parent_id });
  }

  function renderRow(c: Cat, depth: number) {
    const children = tree.childrenOf(c.id);
    const siblings = rows.filter((r) => r.parent_id === c.parent_id).sort((a, b) => a.position - b.position);
    const sIdx = siblings.findIndex((r) => r.id === c.id);
    const isOpen = expanded.has(c.id);
    return (
      <div key={c.id}>
        <Card className="p-3 flex items-center gap-3 hover:shadow-md transition" style={{ marginLeft: depth * 24 }}>
          <button
            onClick={() => children.length && toggle(c.id)}
            className={`h-6 w-6 flex items-center justify-center rounded ${children.length ? "hover:bg-muted text-muted-foreground" : "opacity-30"}`}
            aria-label="Expandir"
          >
            {children.length ? (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
          </button>
          <div className="flex flex-col">
            <button disabled={sIdx === 0} onClick={() => move(c.id, -1)} className="text-muted-foreground hover:text-primary disabled:opacity-30">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button disabled={sIdx === siblings.length - 1} onClick={() => move(c.id, 1)} className="text-muted-foreground hover:text-primary disabled:opacity-30">
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-base ${depth === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {c.icon ?? (depth === 0 ? "▦" : "↳")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold flex items-center gap-2">
              {c.name}
              {!c.active && <span className="text-[10px] uppercase text-muted-foreground">inativa</span>}
            </div>
            <div className="text-xs text-muted-foreground">/{c.slug} · {children.length} subcategoria(s)</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => startNew(c.id)} title="Adicionar subcategoria">
            <Plus className="h-3.5 w-3.5" /> Sub
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setEditing(c)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </Card>
        {isOpen && children.sort((a, b) => a.position - b.position).map((ch) => renderRow(ch, depth + 1))}
      </div>
    );
  }

  // categorias disponíveis para "pai" (exclui a própria + descendentes para evitar loop)
  const parentOptions = useMemo(() => {
    if (!editing?.id) return rows;
    const blocked = new Set<string>([editing.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const r of rows) {
        if (r.parent_id && blocked.has(r.parent_id) && !blocked.has(r.id)) {
          blocked.add(r.id);
          changed = true;
        }
      }
    }
    return rows.filter((r) => !blocked.has(r.id));
  }, [rows, editing?.id]);

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FolderTree className="h-3.5 w-3.5" /> Catálogo
          </div>
          <h1 className="font-display text-3xl mt-1">Categorias & Subcategorias</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Organize seus produtos em coleções e subcoleções (ex: <em>Ambientes › Sala</em>, <em>Horizontal › Alumínio 25mm</em>).
          </p>
        </div>
        <Button size="lg" onClick={() => startNew(null)}>
          <Plus className="h-4 w-4" /> Nova categoria
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : tree.roots.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma categoria ainda. Crie a primeira!</p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {tree.roots.sort((a, b) => a.position - b.position).map((c) => renderRow(c, 0))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editing.name ?? ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <Label>Categoria pai (opcional)</Label>
                <select
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  value={editing.parent_id ?? ""}
                  onChange={(e) => setEditing({ ...editing, parent_id: e.target.value || null })}
                >
                  <option value="">— Nenhuma (categoria raiz) —</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parent_id ? "↳ " : ""}{c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">Use para criar subcategorias (ex: pai = "Ambientes", esta = "Sala").</p>
              </div>
              <div>
                <Label>Ícone (emoji ou texto)</Label>
                <Input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="▦" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                Ativa (visível no site)
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

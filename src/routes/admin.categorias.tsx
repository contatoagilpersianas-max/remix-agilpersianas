import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categorias")({ component: Categories });

type Cat = { id: string; name: string; slug: string; icon: string | null; position: number; active: boolean };

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Categories() {
  const [rows, setRows] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("position");
    setRows((data as Cat[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.name) return toast.error("Nome obrigatório");
    setSaving(true);
    const payload = { ...editing, slug: editing.slug || slugify(editing.name) };
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
    if (!confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = rows.findIndex((r) => r.id === id);
    const swap = rows[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("categories").update({ position: swap.position }).eq("id", id),
      supabase.from("categories").update({ position: rows[idx].position }).eq("id", swap.id),
    ]);
    load();
  }

  return (
    <div className="space-y-6 max-w-[900px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Catálogo</div>
          <h1 className="font-display text-3xl mt-1">Categorias</h1>
          <p className="text-muted-foreground text-sm mt-1">Organize seus produtos em coleções para o cliente navegar.</p>
        </div>
        <Button size="lg" onClick={() => setEditing({ active: true, position: rows.length })}><Plus className="h-4 w-4" /> Nova categoria</Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma categoria ainda. Crie a primeira!</p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {rows.map((c, i) => (
            <Card key={c.id} className="p-4 flex items-center gap-4 hover:shadow-md transition">
              <div className="flex flex-col">
                <button disabled={i === 0} onClick={() => move(c.id, -1)} className="text-muted-foreground hover:text-primary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button disabled={i === rows.length - 1} onClick={() => move(c.id, 1)} className="text-muted-foreground hover:text-primary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              </div>
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">{c.icon ?? "▦"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">/{c.slug} · posição {c.position} {!c.active && "· inativa"}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar categoria" : "Nova categoria"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div><Label>Nome</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
              <div><Label>Slug (URL)</Label><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Ícone (emoji ou texto)</Label><Input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="▦" /></div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                Ativa (visível no site)
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Factory, Loader2, Calendar, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/producao")({ component: Production });

type Job = {
  id: string;
  product_name: string;
  width_cm: number | null;
  height_cm: number | null;
  stage: string;
  due_date: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
};

const STAGES = ["aguardando", "corte", "costura", "montagem", "qualidade", "expedicao", "entregue"] as const;
const LABEL: Record<string, string> = {
  aguardando: "Aguardando",
  corte: "Corte",
  costura: "Costura",
  montagem: "Montagem",
  qualidade: "Qualidade",
  expedicao: "Expedição",
  entregue: "Entregue",
};
const COL_BG: Record<string, string> = {
  aguardando: "bg-slate-500/5",
  corte: "bg-amber-500/5",
  costura: "bg-purple-500/5",
  montagem: "bg-blue-500/5",
  qualidade: "bg-cyan-500/5",
  expedicao: "bg-indigo-500/5",
  entregue: "bg-emerald-500/5",
};
const COLORS: Record<string, string> = {
  aguardando: "bg-slate-500/10 text-slate-700",
  corte: "bg-amber-500/10 text-amber-700",
  costura: "bg-purple-500/10 text-purple-700",
  montagem: "bg-blue-500/10 text-blue-700",
  qualidade: "bg-cyan-500/10 text-cyan-700",
  expedicao: "bg-indigo-500/10 text-indigo-700",
  entregue: "bg-emerald-500/10 text-emerald-700",
};

function Production() {
  const [rows, setRows] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Job> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("production_jobs")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false });
    setRows((data as Job[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.product_name) return toast.error("Produto obrigatório");
    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("production_jobs").update(editing).eq("id", editing.id)
      : await supabase.from("production_jobs").insert(editing as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("OS salva");
    setEditing(null);
    load();
  }

  async function moveTo(id: string, stage: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, stage } : r)));
    const { error } = await supabase.from("production_jobs").update({ stage }).eq("id", id);
    if (error) {
      toast.error(error.message);
      load();
    } else {
      toast.success(`Movido para “${LABEL[stage]}”`);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir ordem de produção?")) return;
    await supabase.from("production_jobs").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6 max-w-[1700px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Operação</div>
          <h1 className="font-display text-3xl mt-1">Produção</h1>
          <p className="text-muted-foreground text-sm mt-1">Kanban da fábrica — arraste cards entre etapas para atualizar.</p>
        </div>
        <Button size="lg" onClick={() => setEditing({ stage: "aguardando" })}>
          <Plus className="h-4 w-4" /> Nova OS
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center">
          <Factory className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma ordem de produção. Crie a primeira!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAGES.map((s) => {
            const items = rows.filter((r) => r.stage === s);
            return (
              <div
                key={s}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) {
                    moveTo(dragId, s);
                    setDragId(null);
                  }
                }}
                className={`rounded-xl border ${COL_BG[s]} p-2 min-h-[320px]`}
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <Badge className={`${COLORS[s]} border-0`}>{LABEL[s]}</Badge>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((j) => (
                    <Card
                      key={j.id}
                      draggable
                      onDragStart={() => setDragId(j.id)}
                      onClick={() => setEditing(j)}
                      className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition bg-card"
                    >
                      <div className="font-medium text-sm leading-tight">{j.product_name}</div>
                      {(j.width_cm || j.height_cm) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {j.width_cm}×{j.height_cm} cm
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5 mt-2 text-[11px]">
                        {j.due_date && (
                          <span className="inline-flex items-center gap-1 text-primary">
                            <Calendar className="h-3 w-3" /> {new Date(j.due_date).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        {j.assigned_to && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <User className="h-3 w-3" /> {j.assigned_to}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                  {items.length === 0 && (
                    <div className="text-[11px] text-muted-foreground/60 text-center py-6 border border-dashed rounded-lg">
                      Solte aqui
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar OS" : "Nova OS"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div><Label>Produto</Label><Input value={editing.product_name ?? ""} onChange={(e) => setEditing({ ...editing, product_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Largura (cm)</Label><Input type="number" value={editing.width_cm ?? ""} onChange={(e) => setEditing({ ...editing, width_cm: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><Label>Altura (cm)</Label><Input type="number" value={editing.height_cm ?? ""} onChange={(e) => setEditing({ ...editing, height_cm: e.target.value ? Number(e.target.value) : null })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Etapa</Label>
                  <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={editing.stage ?? "aguardando"} onChange={(e) => setEditing({ ...editing, stage: e.target.value })}>
                    {STAGES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                  </select>
                </div>
                <div><Label>Prazo</Label><Input type="date" value={editing.due_date ?? ""} onChange={(e) => setEditing({ ...editing, due_date: e.target.value || null })} /></div>
              </div>
              <div><Label>Responsável</Label><Input value={editing.assigned_to ?? ""} onChange={(e) => setEditing({ ...editing, assigned_to: e.target.value })} placeholder="Nome do operador" /></div>
              <div><Label>Notas</Label><Textarea rows={2} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              {editing.id && (
                <div className="pt-1">
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { remove(editing.id!); setEditing(null); }}>
                    <Trash2 className="h-4 w-4" /> Excluir OS
                  </Button>
                </div>
              )}
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

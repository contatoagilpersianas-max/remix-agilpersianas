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
import { Plus, Edit, Trash2, Users, Loader2, MessageCircle, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({ component: Leads });

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  product_interest: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS = ["novo", "contatado", "em_andamento", "ganho", "perdido"] as const;
const COLORS: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-600",
  contatado: "bg-amber-500/10 text-amber-600",
  em_andamento: "bg-purple-500/10 text-purple-600",
  ganho: "bg-emerald-500/10 text-emerald-600",
  perdido: "bg-red-500/10 text-red-600",
};

function Leads() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Lead> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("todos");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setRows((data as Lead[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = filter === "todos" ? rows : rows.filter((r) => r.status === filter);

  async function save() {
    if (!editing?.name) return toast.error("Nome obrigatório");
    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("leads").update(editing).eq("id", editing.id)
      : await supabase.from("leads").insert(editing as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Lead salvo");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  }

  const counts = STATUS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">CRM</div>
          <h1 className="font-display text-3xl mt-1">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Pipeline comercial — capture, qualifique e converta.</p>
        </div>
        <Button size="lg" onClick={() => setEditing({ status: "novo", source: "manual" })}><Plus className="h-4 w-4" /> Novo lead</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUS.map((s) => (
          <button key={s} onClick={() => setFilter(s === filter ? "todos" : s)} className={`text-left p-4 rounded-xl border bg-card hover:border-primary transition ${filter === s ? "border-primary shadow-md" : ""}`}>
            <div className="text-2xl font-display">{counts[s] ?? 0}</div>
            <div className="text-xs text-muted-foreground capitalize">{s.replace("_", " ")}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum lead aqui ainda.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((l) => (
            <Card key={l.id} className="p-4 flex items-start gap-4 hover:shadow-md transition">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold uppercase shrink-0">
                {l.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{l.name}</h3>
                  <Badge className={`${COLORS[l.status] ?? ""} border-0 capitalize`}>{l.status.replace("_", " ")}</Badge>
                  {l.source && <Badge variant="outline">{l.source}</Badge>}
                </div>
                {l.product_interest && <div className="text-xs text-primary mt-0.5">{l.product_interest}</div>}
                {l.message && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{l.message}</p>}
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                  {l.phone && <a href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary"><MessageCircle className="h-3 w-3" /> {l.phone}</a>}
                  {l.email && <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> {l.email}</a>}
                  <span>{new Date(l.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setEditing(l)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar lead" : "Novo lead"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Nome</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div><Label>Telefone</Label><Input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
                <div><Label>E-mail</Label><Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                <div><Label>Interesse</Label><Input value={editing.product_interest ?? ""} onChange={(e) => setEditing({ ...editing, product_interest: e.target.value })} placeholder="Persiana solar..." /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Status</Label>
                  <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={editing.status ?? "novo"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                    {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label>Origem</Label><Input value={editing.source ?? ""} onChange={(e) => setEditing({ ...editing, source: e.target.value })} placeholder="site, instagram, indicação..." /></div>
              </div>
              <div><Label>Mensagem do cliente</Label><Textarea rows={2} value={editing.message ?? ""} onChange={(e) => setEditing({ ...editing, message: e.target.value })} /></div>
              <div><Label>Notas internas</Label><Textarea rows={2} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
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

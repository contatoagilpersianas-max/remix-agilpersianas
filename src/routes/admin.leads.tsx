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
import { Plus, Edit, Users, Loader2, MessageCircle, Mail, LayoutGrid, List as ListIcon, Trash2 } from "lucide-react";
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
const LABEL: Record<string, string> = {
  novo: "Novo",
  contatado: "Contatado",
  em_andamento: "Em negociação",
  ganho: "Ganho",
  perdido: "Perdido",
};
const COLORS: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  contatado: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  em_andamento: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  ganho: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  perdido: "bg-red-500/10 text-red-700 border-red-500/20",
};
const COL_BG: Record<string, string> = {
  novo: "bg-blue-500/5",
  contatado: "bg-amber-500/5",
  em_andamento: "bg-purple-500/5",
  ganho: "bg-emerald-500/5",
  perdido: "bg-red-500/5",
};

function Leads() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Lead> | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filter, setFilter] = useState<string>("todos");
  const [dragId, setDragId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setRows((data as Lead[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

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

  async function moveTo(id: string, status: string) {
    // optimistic
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      load();
    } else {
      toast.success(`Movido para “${LABEL[status]}”`);
    }
  }

  const counts = STATUS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.status === s).length;
    return acc;
  }, {});
  const filtered = filter === "todos" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">CRM</div>
          <h1 className="font-display text-3xl mt-1">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Pipeline comercial — capture, qualifique e converta.</p>
        </div>
        <div className="flex gap-2">
          <div className="inline-flex rounded-full border bg-card p-1">
            <button
              onClick={() => setView("kanban")}
              className={`h-8 px-3 rounded-full text-xs inline-flex items-center gap-1.5 ${view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={`h-8 px-3 rounded-full text-xs inline-flex items-center gap-1.5 ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <ListIcon className="h-3.5 w-3.5" /> Lista
            </button>
          </div>
          <Button size="lg" onClick={() => setEditing({ status: "novo", source: "manual" })}>
            <Plus className="h-4 w-4" /> Novo lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s === filter ? "todos" : s)}
            className={`text-left p-4 rounded-xl border bg-card hover:border-primary transition ${
              filter === s ? "border-primary shadow-md" : ""
            }`}
          >
            <div className="text-2xl font-display">{counts[s] ?? 0}</div>
            <div className="text-xs text-muted-foreground">{LABEL[s]}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum lead ainda. O formulário público do site começa a alimentar este CRM automaticamente.</p>
        </Card>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STATUS.map((s) => {
            const items = rows.filter((r) => r.status === s);
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
                className={`rounded-xl border ${COL_BG[s]} p-2 min-h-[300px]`}
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="text-xs font-semibold uppercase tracking-wider">{LABEL[s]}</div>
                  <Badge variant="outline" className="text-[10px] h-5">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((l) => (
                    <Card
                      key={l.id}
                      draggable
                      onDragStart={() => setDragId(l.id)}
                      onClick={() => setEditing(l)}
                      className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition bg-card"
                    >
                      <div className="font-medium text-sm leading-tight truncate">{l.name}</div>
                      {l.product_interest && (
                        <div className="text-[11px] text-primary mt-1 truncate">{l.product_interest}</div>
                      )}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(l.created_at).toLocaleDateString("pt-BR")}
                        </span>
                        {l.phone && (
                          <a
                            href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-whatsapp hover:text-whatsapp/80"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
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
                  <Badge className={`${COLORS[l.status] ?? ""} border capitalize`}>{LABEL[l.status]}</Badge>
                  {l.source && <Badge variant="outline">{l.source}</Badge>}
                </div>
                {l.product_interest && <div className="text-xs text-primary mt-0.5">{l.product_interest}</div>}
                {l.message && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{l.message}</p>}
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                  {l.phone && (
                    <a href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                      <MessageCircle className="h-3 w-3" /> {l.phone}
                    </a>
                  )}
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                      <Mail className="h-3 w-3" /> {l.email}
                    </a>
                  )}
                  <span>{new Date(l.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setEditing(l)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(l.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
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
                    {STATUS.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                  </select>
                </div>
                <div><Label>Origem</Label><Input value={editing.source ?? ""} onChange={(e) => setEditing({ ...editing, source: e.target.value })} placeholder="site, instagram, indicação..." /></div>
              </div>
              <div><Label>Mensagem do cliente</Label><Textarea rows={2} value={editing.message ?? ""} onChange={(e) => setEditing({ ...editing, message: e.target.value })} /></div>
              <div><Label>Notas internas</Label><Textarea rows={2} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              {editing.id && (
                <div className="pt-1">
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { remove(editing.id!); setEditing(null); }}>
                    <Trash2 className="h-4 w-4" /> Excluir lead
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

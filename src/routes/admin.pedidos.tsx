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
import { Plus, Edit, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pedidos")({ component: Orders });

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string | null;
  payment_status: string;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS = ["novo", "confirmado", "em_producao", "enviado", "entregue", "cancelado"] as const;
const PAYMENT = ["pendente", "pago", "estornado"] as const;
const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusColor: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-600",
  confirmado: "bg-amber-500/10 text-amber-600",
  em_producao: "bg-purple-500/10 text-purple-600",
  enviado: "bg-indigo-500/10 text-indigo-600",
  entregue: "bg-emerald-500/10 text-emerald-600",
  cancelado: "bg-red-500/10 text-red-600",
};

function Orders() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Order> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setRows((data as Order[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.customer_name) return toast.error("Nome do cliente obrigatório");
    setSaving(true);
    const total = (Number(editing.subtotal) || 0) - (Number(editing.discount) || 0);
    const payload = { ...editing, total };
    const { error } = editing.id
      ? await supabase.from("orders").update(payload).eq("id", editing.id)
      : await supabase.from("orders").insert(payload as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Pedido salvo");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir pedido?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Vendas</div>
          <h1 className="font-display text-3xl mt-1">Pedidos</h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe e gerencie todos os pedidos da loja.</p>
        </div>
        <Button size="lg" onClick={() => setEditing({ status: "novo", payment_status: "pendente", subtotal: 0, discount: 0 })}>
          <Plus className="h-4 w-4" /> Novo pedido
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum pedido ainda.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Pedido</th>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Pagto</th>
                <th className="text-right p-3">Total</th>
                <th className="text-left p-3">Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{o.order_number}</td>
                  <td className="p-3">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_phone ?? o.customer_email ?? ""}</div>
                  </td>
                  <td className="p-3"><Badge className={`${statusColor[o.status] ?? ""} border-0`}>{o.status}</Badge></td>
                  <td className="p-3"><Badge variant="outline">{o.payment_status}</Badge></td>
                  <td className="p-3 text-right font-medium">{fmt(o.total)}</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(o)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar pedido" : "Novo pedido"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Nome do cliente</Label><Input value={editing.customer_name ?? ""} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} /></div>
                <div><Label>Telefone</Label><Input value={editing.customer_phone ?? ""} onChange={(e) => setEditing({ ...editing, customer_phone: e.target.value })} /></div>
                <div><Label>E-mail</Label><Input type="email" value={editing.customer_email ?? ""} onChange={(e) => setEditing({ ...editing, customer_email: e.target.value })} /></div>
                <div><Label>Endereço</Label><Input value={editing.customer_address ?? ""} onChange={(e) => setEditing({ ...editing, customer_address: e.target.value })} /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><Label>Subtotal</Label><Input type="number" step="0.01" value={editing.subtotal ?? 0} onChange={(e) => setEditing({ ...editing, subtotal: Number(e.target.value) })} /></div>
                <div><Label>Desconto</Label><Input type="number" step="0.01" value={editing.discount ?? 0} onChange={(e) => setEditing({ ...editing, discount: Number(e.target.value) })} /></div>
                <div><Label>Pgto</Label><Input value={editing.payment_method ?? ""} onChange={(e) => setEditing({ ...editing, payment_method: e.target.value })} placeholder="PIX, Cartão..." /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Status</Label>
                  <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={editing.status ?? "novo"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                    {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label>Pagamento</Label>
                  <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={editing.payment_status ?? "pendente"} onChange={(e) => setEditing({ ...editing, payment_status: e.target.value })}>
                    {PAYMENT.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Observações</Label><Textarea rows={3} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
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

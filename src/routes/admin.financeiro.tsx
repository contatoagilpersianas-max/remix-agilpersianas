import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, CircleDollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/financeiro")({ component: Finance });

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Finance() {
  const [data, setData] = useState({ revenue: 0, pending: 0, paid: 0, count: 0, byMonth: [] as { month: string; total: number }[] });

  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from("orders").select("total,payment_status,created_at");
      if (!orders) return;
      const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
      const paid = orders.filter((o) => o.payment_status === "pago").reduce((s, o) => s + Number(o.total), 0);
      const pending = orders.filter((o) => o.payment_status === "pendente").reduce((s, o) => s + Number(o.total), 0);
      const map = new Map<string, number>();
      orders.forEach((o) => {
        const m = new Date(o.created_at).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        map.set(m, (map.get(m) ?? 0) + Number(o.total));
      });
      setData({ revenue, paid, pending, count: orders.length, byMonth: Array.from(map.entries()).map(([month, total]) => ({ month, total })).slice(-6) });
    })();
  }, []);

  const max = Math.max(...data.byMonth.map((m) => m.total), 1);

  const cards = [
    { label: "Receita total", value: fmt(data.revenue), icon: CircleDollarSign, hue: "text-primary" },
    { label: "Recebido", value: fmt(data.paid), icon: TrendingUp, hue: "text-success" },
    { label: "A receber", value: fmt(data.pending), icon: TrendingDown, hue: "text-amber-600" },
    { label: "Pedidos", value: String(data.count), icon: Wallet, hue: "text-primary" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Gestão</div>
        <h1 className="font-display text-3xl mt-1">Financeiro</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão consolidada de receita, recebimentos e pendências.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className={`h-10 w-10 rounded-xl bg-primary/10 ${c.hue} flex items-center justify-center mb-3`}><c.icon className="h-5 w-5" /></div>
            <div className="text-2xl font-display">{c.value}</div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Receita por mês (últimos 6)</h3>
        {data.byMonth.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Sem dados ainda — registre pedidos para ver o gráfico.</div>
        ) : (
          <div className="flex items-end gap-3 h-56">
            {data.byMonth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-medium">{fmt(m.total)}</div>
                <div className="w-full bg-gradient-to-t from-primary to-primary/40 rounded-t-lg" style={{ height: `${(m.total / max) * 100}%` }} />
                <div className="text-xs text-muted-foreground capitalize">{m.month}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

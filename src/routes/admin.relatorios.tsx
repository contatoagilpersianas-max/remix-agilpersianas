import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart3, Package, Users, ShoppingCart, Award } from "lucide-react";

export const Route = createFileRoute("/admin/relatorios")({ component: Reports });

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Reports() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalLeads: 0,
    totalOrders: 0,
    avgTicket: 0,
    topProducts: [] as { name: string; count: number }[],
    leadsBySource: [] as { source: string; count: number }[],
  });

  useEffect(() => {
    (async () => {
      const [{ data: prods }, { data: leads }, { data: orders }] = await Promise.all([
        supabase.from("products").select("name"),
        supabase.from("leads").select("source,product_interest"),
        supabase.from("orders").select("total,items"),
      ]);
      const totalRev = (orders ?? []).reduce((s, o) => s + Number(o.total), 0);
      const avgTicket = orders?.length ? totalRev / orders.length : 0;

      const sourceMap = new Map<string, number>();
      leads?.forEach((l) => sourceMap.set(l.source ?? "—", (sourceMap.get(l.source ?? "—") ?? 0) + 1));

      const interestMap = new Map<string, number>();
      leads?.forEach((l) => l.product_interest && interestMap.set(l.product_interest, (interestMap.get(l.product_interest) ?? 0) + 1));

      setStats({
        totalProducts: prods?.length ?? 0,
        totalLeads: leads?.length ?? 0,
        totalOrders: orders?.length ?? 0,
        avgTicket,
        topProducts: Array.from(interestMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
        leadsBySource: Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count })),
      });
    })();
  }, []);

  const kpi = [
    { label: "Produtos ativos", value: String(stats.totalProducts), icon: Package },
    { label: "Total de leads", value: String(stats.totalLeads), icon: Users },
    { label: "Pedidos totais", value: String(stats.totalOrders), icon: ShoppingCart },
    { label: "Ticket médio", value: fmt(stats.avgTicket), icon: Award },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Inteligência</div>
        <h1 className="font-display text-3xl mt-1">Relatórios</h1>
        <p className="text-muted-foreground text-sm mt-1">KPIs de catálogo, comercial e operação.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpi.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3"><k.icon className="h-5 w-5" /></div>
            <div className="text-2xl font-display">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Produtos mais procurados (leads)</h3>
          {stats.topProducts.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">Sem dados ainda.</div>
          ) : (
            <ul className="space-y-3">
              {stats.topProducts.map((p) => (
                <li key={p.name}>
                  <div className="flex justify-between text-sm mb-1"><span>{p.name}</span><span className="text-muted-foreground">{p.count}</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(p.count / stats.topProducts[0].count) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Leads por origem</h3>
          {stats.leadsBySource.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">Sem dados ainda.</div>
          ) : (
            <ul className="space-y-3">
              {stats.leadsBySource.map((s) => (
                <li key={s.source}>
                  <div className="flex justify-between text-sm mb-1"><span className="capitalize">{s.source}</span><span className="text-muted-foreground">{s.count}</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(s.count / Math.max(...stats.leadsBySource.map((x) => x.count))) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

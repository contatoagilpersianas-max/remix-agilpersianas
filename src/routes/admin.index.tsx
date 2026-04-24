import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Factory,
  MessageCircle,
  ExternalLink,
  Trophy,
  Receipt,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Counters = {
  products: number;
  categories: number;
  leadsTotal: number;
  leadsNew: number;
  ordersMonth: number;
  revenueMonth: number;
  revenueToday: number;
  jobsActive: number;
  avgTicket: number;
  topProduct: string | null;
  topProductCount: number;
};

function Dashboard() {
  const [c, setC] = useState<Counters>({
    products: 0,
    categories: 0,
    leadsTotal: 0,
    leadsNew: 0,
    ordersMonth: 0,
    revenueMonth: 0,
    revenueToday: 0,
    jobsActive: 0,
    avgTicket: 0,
    topProduct: null,
    topProductCount: 0,
  });
  const [recentLeads, setRecentLeads] = useState<
    Array<{ id: string; name: string; product_interest: string | null; phone: string | null; created_at: string; status: string }>
  >([]);
  const [recentJobs, setRecentJobs] = useState<
    Array<{ id: string; product_name: string; stage: string; due_date: string | null }>
  >([]);
  const [series, setSeries] = useState<Array<{ d: string; leads: number; orders: number }>>([]);

  useEffect(() => {
    (async () => {
      const startMonth = new Date();
      startMonth.setDate(1);
      startMonth.setHours(0, 0, 0, 0);
      const startDay = new Date();
      startDay.setHours(0, 0, 0, 0);
      const start30 = new Date();
      start30.setDate(start30.getDate() - 29);
      start30.setHours(0, 0, 0, 0);

      const [prods, cats, leadsAll, leadsNew, ordersMonth, ordersToday, jobs, leadsRecent, jobsRecent, leadsSeries, ordersSeries] =
        await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "novo"),
          supabase.from("orders").select("total").gte("created_at", startMonth.toISOString()),
          supabase.from("orders").select("total").gte("created_at", startDay.toISOString()),
          supabase
            .from("production_jobs")
            .select("*", { count: "exact", head: true })
            .not("stage", "in", "(entregue,cancelado)"),
          supabase
            .from("leads")
            .select("id,name,product_interest,phone,created_at,status")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("production_jobs")
            .select("id,product_name,stage,due_date")
            .not("stage", "in", "(entregue)")
            .order("due_date", { ascending: true, nullsFirst: false })
            .limit(5),
          supabase.from("leads").select("created_at").gte("created_at", start30.toISOString()),
          supabase.from("orders").select("created_at,total").gte("created_at", start30.toISOString()),
        ]);

      const sumMonth = (ordersMonth.data ?? []).reduce((a, o) => a + Number(o.total ?? 0), 0);
      const sumToday = (ordersToday.data ?? []).reduce((a, o) => a + Number(o.total ?? 0), 0);

      // build daily series for last 30 days
      const days: Record<string, { leads: number; orders: number }> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date(start30);
        d.setDate(d.getDate() + i);
        days[d.toISOString().slice(0, 10)] = { leads: 0, orders: 0 };
      }
      (leadsSeries.data ?? []).forEach((r) => {
        const k = String(r.created_at).slice(0, 10);
        if (days[k]) days[k].leads += 1;
      });
      (ordersSeries.data ?? []).forEach((r) => {
        const k = String(r.created_at).slice(0, 10);
        if (days[k]) days[k].orders += Number(r.total ?? 0);
      });

      setC({
        products: prods.count ?? 0,
        categories: cats.count ?? 0,
        leadsTotal: leadsAll.count ?? 0,
        leadsNew: leadsNew.count ?? 0,
        ordersMonth: ordersMonth.data?.length ?? 0,
        revenueMonth: sumMonth,
        revenueToday: sumToday,
        jobsActive: jobs.count ?? 0,
      });
      setRecentLeads(leadsRecent.data ?? []);
      setRecentJobs(jobsRecent.data ?? []);
      setSeries(Object.entries(days).map(([d, v]) => ({ d, ...v })));
    })();
  }, []);

  const cards = [
    { label: "Vendas hoje", value: fmt(c.revenueToday), trend: `${c.ordersMonth} pedidos no mês`, icon: TrendingUp },
    { label: "Receita no mês", value: fmt(c.revenueMonth), trend: "Últimos 30 dias", icon: ShoppingBag },
    { label: "Leads novos", value: c.leadsNew.toString(), trend: `${c.leadsTotal} total`, icon: Users },
    { label: "Em produção", value: c.jobsActive.toString(), trend: `${c.products} produtos · ${c.categories} cat.`, icon: Factory },
  ];

  // chart bounds
  const maxLeads = Math.max(1, ...series.map((s) => s.leads));
  const maxOrders = Math.max(1, ...series.map((s) => s.orders));

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Painel executivo</div>
          <h1 className="font-display text-3xl mt-1">Bom te ver de volta 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral da operação em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="text-sm rounded-full border px-4 h-10 inline-flex items-center gap-2 hover:border-primary hover:text-primary transition">
            <ExternalLink className="h-4 w-4" /> Ver loja
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[11px] inline-flex items-center gap-0.5 text-muted-foreground">
                <ArrowUpRight className="h-3 w-3" />
                {card.trend}
              </span>
            </div>
            <div className="mt-4 text-2xl font-display">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Leads & receita — últimos 30 dias</h3>
            <div className="flex gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Receita</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground/40" /> Leads</span>
            </div>
          </div>
          <div className="h-56 flex items-end gap-[3px]">
            {series.map((s) => {
              const hOrders = (s.orders / maxOrders) * 100;
              const hLeads = (s.leads / maxLeads) * 100;
              return (
                <div key={s.d} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                  <div className="w-full flex items-end gap-[1px] h-full">
                    <div className="flex-1 bg-primary/80 rounded-t" style={{ height: `${hOrders}%` }} />
                    <div className="flex-1 bg-foreground/30 rounded-t" style={{ height: `${hLeads}%` }} />
                  </div>
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-foreground text-background text-[10px] rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                    {new Date(s.d).toLocaleDateString("pt-BR")} — {fmt(s.orders)} · {s.leads} leads
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            <span>{series[0] && new Date(series[0].d).toLocaleDateString("pt-BR")}</span>
            <span>Hoje</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Alertas operacionais</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${c.leadsNew > 0 ? "text-primary" : "text-muted-foreground"}`} />
              <span>
                {c.leadsNew > 0 ? (
                  <Link to="/admin/leads" className="hover:text-primary">
                    {c.leadsNew} {c.leadsNew === 1 ? "lead novo" : "leads novos"} aguardando contato
                  </Link>
                ) : (
                  "Nenhum lead aguardando"
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className={`h-4 w-4 shrink-0 mt-0.5 ${c.jobsActive > 0 ? "text-primary" : "text-muted-foreground"}`} />
              <span>
                {c.jobsActive > 0 ? (
                  <Link to="/admin/producao" className="hover:text-primary">
                    {c.jobsActive} {c.jobsActive === 1 ? "OS ativa" : "OS ativas"} na fábrica
                  </Link>
                ) : (
                  "Nenhuma OS aberta"
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span>{c.products} produtos publicados em {c.categories} categorias</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Últimos leads</h3>
            <Link to="/admin/leads" className="text-xs text-primary hover:underline">Ver todos →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">Nenhum lead ainda. Captura ativa no site.</div>
          ) : (
            <ul className="divide-y">
              {recentLeads.map((l) => (
                <li key={l.id} className="py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold uppercase">
                    {l.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{l.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {l.product_interest ?? "Sem interesse declarado"} · {new Date(l.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {l.phone && (
                    <a
                      href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-8 w-8 rounded-full bg-whatsapp/10 text-whatsapp flex items-center justify-center hover:bg-whatsapp hover:text-whatsapp-foreground transition"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Produção em andamento</h3>
            <Link to="/admin/producao" className="text-xs text-primary hover:underline">Abrir kanban →</Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">Nenhuma OS aberta.</div>
          ) : (
            <ul className="divide-y">
              {recentJobs.map((j) => (
                <li key={j.id} className="py-3 flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{j.product_name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {j.stage.replace("_", " ")}
                      {j.due_date && ` · prazo ${new Date(j.due_date).toLocaleDateString("pt-BR")}`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  Sparkles,
  Eye,
  MessagesSquare,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Period = "today" | "7d" | "30d" | "90d";

function startOfPeriod(p: Period): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (p === "today") return d;
  if (p === "7d") d.setDate(d.getDate() - 6);
  else if (p === "30d") d.setDate(d.getDate() - 29);
  else if (p === "90d") d.setDate(d.getDate() - 89);
  return d;
}

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

type OrionInsights = {
  visits: number;
  conversations: number;
  capturedLeads: number;
  newLeads: number;
  avgTicket: number;
  conversionRate: number;
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
  const [staleLeads, setStaleLeads] = useState<
    Array<{ id: string; name: string; phone: string | null; product_interest: string | null; created_at: string; assigned_to: string | null }>
  >([]);
  const [recentJobs, setRecentJobs] = useState<
    Array<{ id: string; product_name: string; stage: string; due_date: string | null }>
  >([]);
  const [series, setSeries] = useState<Array<{ d: string; leads: number; orders: number }>>([]);

  // ORION
  const [period, setPeriod] = useState<Period>("7d");
  const [orion, setOrion] = useState<OrionInsights>({
    visits: 0,
    conversations: 0,
    capturedLeads: 0,
    newLeads: 0,
    avgTicket: 0,
    conversionRate: 0,
  });
  const [orionLoading, setOrionLoading] = useState(true);

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

      const [prods, cats, leadsAll, leadsNew, ordersMonth, ordersToday, jobs, leadsRecent, jobsRecent, leadsSeries, ordersSeries, ordersItems] =
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
          supabase.from("orders").select("items").gte("created_at", start30.toISOString()),
        ]);

      const sumMonth = (ordersMonth.data ?? []).reduce((a, o) => a + Number(o.total ?? 0), 0);
      const sumToday = (ordersToday.data ?? []).reduce((a, o) => a + Number(o.total ?? 0), 0);
      const ordersMonthCount = ordersMonth.data?.length ?? 0;
      const avgTicket = ordersMonthCount > 0 ? sumMonth / ordersMonthCount : 0;

      const productCounter: Record<string, number> = {};
      (ordersItems.data ?? []).forEach((row) => {
        const items = Array.isArray(row.items) ? (row.items as unknown as Array<Record<string, unknown>>) : [];
        items.forEach((it) => {
          const name = (it?.name as string | undefined) ?? (it?.productName as string | undefined);
          if (name) productCounter[name] = (productCounter[name] ?? 0) + 1;
        });
      });
      const topEntry = Object.entries(productCounter).sort((a, b) => b[1] - a[1])[0];
      const topProduct = topEntry?.[0] ?? null;
      const topProductCount = topEntry?.[1] ?? 0;

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
        ordersMonth: ordersMonthCount,
        revenueMonth: sumMonth,
        revenueToday: sumToday,
        jobsActive: jobs.count ?? 0,
        avgTicket,
        topProduct,
        topProductCount,
      });
      setRecentLeads(leadsRecent.data ?? []);
      setRecentJobs(jobsRecent.data ?? []);
      setSeries(Object.entries(days).map(([d, v]) => ({ d, ...v })));

      // Leads parados há 2h+ sem follow-up (status = novo)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const { data: stale } = await supabase
        .from("leads")
        .select("id,name,phone,product_interest,created_at,assigned_to")
        .eq("status", "novo")
        .lte("created_at", twoHoursAgo)
        .order("created_at", { ascending: true })
        .limit(8);
      setStaleLeads(stale ?? []);
    })();
  }, []);

  // ORION — recalcula quando período muda
  useEffect(() => {
    (async () => {
      setOrionLoading(true);
      const start = startOfPeriod(period);
      const startIso = start.toISOString();

      const [convos, leadsInPeriod, ordersInPeriod] = await Promise.all([
        supabase
          .from("lumi_conversations")
          .select("id,visitor_id,lead_status,created_at")
          .gte("created_at", startIso),
        supabase
          .from("leads")
          .select("id,source,created_at")
          .gte("created_at", startIso),
        supabase.from("orders").select("total").gte("created_at", startIso),
      ]);

      const convoRows = convos.data ?? [];
      const visitorSet = new Set(convoRows.map((c) => c.visitor_id));
      const captured = convoRows.filter((c) => c.lead_status === "captured").length;
      const newLeads = (leadsInPeriod.data ?? []).length;
      const orderTotals = (ordersInPeriod.data ?? []).map((o) => Number(o.total ?? 0));
      const ticket = orderTotals.length ? orderTotals.reduce((a, b) => a + b, 0) / orderTotals.length : 0;
      const conversion = visitorSet.size > 0 ? (captured / visitorSet.size) * 100 : 0;

      setOrion({
        visits: visitorSet.size,
        conversations: convoRows.length,
        capturedLeads: captured,
        newLeads,
        avgTicket: ticket,
        conversionRate: conversion,
      });
      setOrionLoading(false);
    })();
  }, [period]);

  const cards = [
    { label: "Vendas hoje", value: fmt(c.revenueToday), trend: `${c.ordersMonth} pedidos no mês`, icon: TrendingUp },
    { label: "Receita no mês", value: fmt(c.revenueMonth), trend: "Últimos 30 dias", icon: ShoppingBag },
    { label: "Ticket médio", value: fmt(c.avgTicket), trend: `${c.ordersMonth} pedidos`, icon: Receipt },
    { label: "Leads novos", value: c.leadsNew.toString(), trend: `${c.leadsTotal} total`, icon: Users },
    { label: "Em produção", value: c.jobsActive.toString(), trend: `${c.products} produtos · ${c.categories} cat.`, icon: Factory },
    { label: "Produto campeão", value: c.topProduct ?? "—", trend: c.topProductCount > 0 ? `${c.topProductCount} vendas (30d)` : "Sem vendas ainda", icon: Trophy },
  ];

  const maxLeads = Math.max(1, ...series.map((s) => s.leads));
  const maxOrders = Math.max(1, ...series.map((s) => s.orders));

  const orionMetrics = useMemo(
    () => [
      { label: "Visitantes únicos (Lumi)", value: orion.visits.toString(), icon: Eye },
      { label: "Conversas", value: orion.conversations.toString(), icon: MessagesSquare },
      { label: "Leads novos", value: orion.newLeads.toString(), icon: Users },
      { label: "Leads captados pela Lumi", value: orion.capturedLeads.toString(), icon: Sparkles },
      { label: "Ticket médio", value: fmt(orion.avgTicket), icon: Receipt },
      { label: "Conversão Lumi", value: `${orion.conversionRate.toFixed(1)}%`, icon: TrendingUp },
    ],
    [orion],
  );

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

      {/* ORION — IA executiva */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-primary font-semibold">ORION · IA executiva</div>
              <h2 className="font-display text-xl">Insights diários</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comportamento dos visitantes e desempenho da Lumi no período selecionado.
              </p>
            </div>
          </div>
          <div className="flex gap-1 rounded-full bg-muted p-1">
            {(["today", "7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 h-8 text-xs rounded-full transition ${
                  period === p ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "today" ? "Hoje" : p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "90 dias"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {orionMetrics.map((m) => (
            <div key={m.label} className="rounded-xl border bg-background p-4">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <m.icon className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{m.label}</span>
              </div>
              <div className="font-display text-2xl mt-2 truncate" title={m.value}>
                {orionLoading ? "…" : m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            ORION monitorando · atualização ao trocar período
          </div>
          <Link to="/admin/lumi" className="text-primary inline-flex items-center gap-1 hover:underline">
            Ver conversas da Lumi <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            <div className="mt-4 text-2xl font-display truncate" title={card.value}>{card.value}</div>
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

      {/* ORION — Alertas de follow-up de leads parados (2h+) */}
      {staleLeads.length > 0 && (
        <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">ORION · Follow-up urgente</div>
                <h3 className="font-display text-lg">{staleLeads.length} lead(s) sem resposta há 2h+</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Sugestão: enviar mensagem agora pelo WhatsApp.</p>
              </div>
            </div>
            <Link to="/admin/leads" className="text-xs text-primary hover:underline">Ver todos →</Link>
          </div>
          <ul className="divide-y">
            {staleLeads.map((l) => {
              const hours = Math.floor((Date.now() - new Date(l.created_at).getTime()) / 3_600_000);
              const suggested = `Olá ${l.name.split(" ")[0]}, aqui é da Ágil Persianas. Recebemos seu interesse em ${l.product_interest ?? "persianas sob medida"} e queremos te ajudar a escolher a melhor opção. Posso te enviar um orçamento personalizado?`;
              const wa = l.phone ? `https://wa.me/55${l.phone.replace(/\D/g, "")}?text=${encodeURIComponent(suggested)}` : null;
              return (
                <li key={l.id} className="py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-500/15 text-amber-700 flex items-center justify-center text-xs font-semibold uppercase">
                    {l.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{l.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {l.product_interest ?? "Sem interesse declarado"} · há {hours}h
                      {l.assigned_to ? ` · resp. ${l.assigned_to.slice(0, 8)}` : " · sem responsável"}
                    </div>
                  </div>
                  {wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-amber-500 text-white px-3 h-8 inline-flex items-center hover:bg-amber-600 transition"
                    >
                      Enviar WhatsApp
                    </a>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">sem telefone</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

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

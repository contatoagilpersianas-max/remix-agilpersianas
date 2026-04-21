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
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]).then(([p, c]) => {
      setStats({ products: p.count ?? 0, categories: c.count ?? 0 });
    });
  }, []);

  const cards = [
    { label: "Vendas hoje", value: fmt(0), trend: "+0%", up: true, icon: TrendingUp, hue: "primary" },
    { label: "Vendas no mês", value: fmt(0), trend: "+0%", up: true, icon: ShoppingBag, hue: "primary" },
    { label: "Leads novos", value: "0", trend: "+0%", up: true, icon: Users, hue: "primary" },
    { label: "Produtos cadastrados", value: stats.products.toString(), trend: `${stats.categories} categorias`, up: true, icon: Package, hue: "primary" },
  ];

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Painel executivo</div>
          <h1 className="font-display text-3xl mt-1">Bom te ver de volta 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral da operação em tempo real.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-xs inline-flex items-center gap-0.5 ${c.up ? "text-success" : "text-destructive"}`}>
                {c.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {c.trend}
              </span>
            </div>
            <div className="mt-4 text-2xl font-display">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Vendas dos últimos 30 dias</h3>
            <span className="text-xs text-muted-foreground">em breve</span>
          </div>
          <div className="h-56 rounded-lg bg-gradient-to-br from-primary/5 to-primary/0 border border-dashed flex items-center justify-center text-sm text-muted-foreground">
            Gráfico de vendas aparecerá aqui assim que o módulo de pedidos estiver ativo.
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Alertas</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Nenhum pedido pendente</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>Sem leads sem atendimento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span>Estoque/cadastro saudável</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Atalhos rápidos</h3>
            <p className="text-xs text-muted-foreground">Acesso direto aos módulos disponíveis.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/catalogo" className="rounded-xl border p-4 hover:border-primary hover:shadow-md transition">
            <Package className="h-5 w-5 text-primary mb-2" />
            <div className="font-medium text-sm">Gerenciar catálogo</div>
            <div className="text-xs text-muted-foreground">Produtos, preços e calculadora m²</div>
          </Link>
          <Link to="/" className="rounded-xl border p-4 hover:border-primary hover:shadow-md transition">
            <ShoppingBag className="h-5 w-5 text-primary mb-2" />
            <div className="font-medium text-sm">Ver loja pública</div>
            <div className="text-xs text-muted-foreground">Como o cliente vê o site</div>
          </Link>
        </div>
      </Card>
    </div>
  );
}

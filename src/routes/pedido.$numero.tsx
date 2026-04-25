import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Factory, Ruler, Truck, Package, Sparkles } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/pedido/$numero")({
  head: ({ params }) => ({
    meta: [{ title: `Pedido ${params.numero} — Ágil Persianas` }],
  }),
  component: OrderTracking,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">Erro: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p>Pedido não encontrado.</p>
    </div>
  ),
});

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items: unknown;
};

const STAGES = [
  { key: "novo", label: "Pedido recebido", icon: Package },
  { key: "medicao", label: "Em medição", icon: Ruler },
  { key: "producao", label: "Em produção", icon: Factory },
  { key: "agendado", label: "Entrega agendada", icon: Truck },
  { key: "concluido", label: "Concluído", icon: CheckCircle2 },
];

function stageIndex(status: string): number {
  const map: Record<string, number> = {
    novo: 0,
    pago: 0,
    medicao: 1,
    producao: 2,
    pronto: 2,
    agendado: 3,
    enviado: 3,
    instalado: 4,
    concluido: 4,
    entregue: 4,
  };
  return map[status] ?? 0;
}

function OrderTracking() {
  const { numero } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,order_number,customer_name,status,payment_status,total,created_at,items")
        .eq("order_number", numero)
        .maybeSingle();
      setOrder(data as Order | null);
      setLoading(false);
    })();
  }, [numero]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Clock className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <h1 className="font-display text-2xl">Pedido não encontrado</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Verifique o número informado ou fale conosco.
          </p>
          <a
            href={whatsappLink(`Olá! Não encontrei o pedido ${numero}.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            Falar no WhatsApp
          </a>
          <Link to="/" className="block mt-3 text-sm text-muted-foreground hover:text-primary">
            Voltar à loja
          </Link>
        </Card>
      </div>
    );
  }

  const idx = stageIndex(order.status);
  const items = Array.isArray(order.items) ? (order.items as Array<{ name?: string; qty?: number }>) : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container-premium h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl">Ágil Persianas</Link>
          <a
            href={whatsappLink(`Olá! Pedido ${order.order_number}`)}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <main className="container-premium py-10 max-w-3xl">
        <div className="mb-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Acompanhamento de pedido
          </div>
          <h1 className="font-display text-3xl mt-1">#{order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Olá {order.customer_name.split(" ")[0]}, abaixo o status atualizado em tempo real.
          </p>
        </div>

        {/* Timeline */}
        <Card className="p-6 md:p-8">
          <ol className="space-y-5">
            {STAGES.map((s, i) => {
              const done = i <= idx;
              const current = i === idx;
              return (
                <li key={s.key} className="flex gap-4 items-start">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition ${
                      done
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                      {current && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Em andamento
                        </span>
                      )}
                    </div>
                    {current && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Você receberá atualizações por WhatsApp, SMS e e-mail.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Itens */}
        <Card className="p-6 mt-6">
          <h2 className="font-semibold mb-4">Itens do pedido</h2>
          <ul className="divide-y">
            {items.length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">Sem itens detalhados.</li>
            ) : (
              items.map((it, i) => (
                <li key={i} className="py-3 flex justify-between text-sm">
                  <span>{it.name ?? "Item"}</span>
                  <span className="text-muted-foreground">×{it.qty ?? 1}</span>
                </li>
              ))
            )}
          </ul>
          <div className="mt-4 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{Number(order.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Status do pagamento: <strong className="capitalize">{order.payment_status}</strong>
          </div>
        </Card>

        {/* Ajuda Lumi */}
        <Card className="p-6 mt-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-semibold text-sm">Precisa de ajuda?</div>
              <div className="text-xs text-muted-foreground">
                Fale com a Lumi ou pelo WhatsApp — respondemos rápido.
              </div>
            </div>
            <a
              href={whatsappLink(`Olá! Sobre o pedido ${order.order_number}…`)}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
            >
              WhatsApp →
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
}

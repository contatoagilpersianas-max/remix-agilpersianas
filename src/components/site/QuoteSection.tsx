// CTA "Compre com a Lumi" — substitui o antigo formulário de orçamento.
// A Lumi conduz toda a jornada (recomendação → medidas → valor → WhatsApp).
import { Sparkles, MessageCircle, Calculator, ShoppingBag } from "lucide-react";
import { openLumiWith } from "./LumiWidget";

const STEPS = [
  {
    icon: MessageCircle,
    title: "Conte o ambiente",
    desc: "Sala, quarto, escritório — em segundos a Lumi entende sua necessidade.",
  },
  {
    icon: Calculator,
    title: "Receba o valor na hora",
    desc: "Ela calcula a estimativa em tempo real, com parcelamento.",
  },
  {
    icon: ShoppingBag,
    title: "Compre direto",
    desc: "Finalize pelo site ou continue no WhatsApp com prioridade.",
  },
];

export function QuoteSection() {
  return (
    <section id="orcamento" className="py-20 sm:py-24 bg-graphite text-graphite-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          {/* Coluna esquerda — pitch */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" />
              Compra assistida por IA
            </div>
            <h2
              className="mt-4 font-semibold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em" }}
            >
              Compre sua persiana
              <br />
              <span className="text-primary">com a Lumi do seu lado.</span>
            </h2>
            <p className="mt-4 text-graphite-foreground/75 max-w-md leading-relaxed">
              A Lumi é a nossa consultora virtual: ajuda você a escolher o modelo ideal,
              calcula a estimativa na hora e te leva até o fechamento — sem formulário,
              sem espera.
            </p>

            <button
              type="button"
              onClick={() =>
                openLumiWith({
                  pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
                })
              }
              className="mt-7 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              Comprar com a Lumi
            </button>

            <p className="mt-3 text-[12px] text-graphite-foreground/55">
              Atendimento em segundos · sem compromisso · 100% online.
            </p>
          </div>

          {/* Coluna direita — passos */}
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="flex items-start gap-4 rounded-2xl bg-background/5 backdrop-blur border border-background/10 p-5 transition hover:bg-background/10"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
                    Passo {i + 1}
                  </div>
                  <div className="font-semibold text-graphite-foreground">{s.title}</div>
                  <div className="text-sm text-graphite-foreground/70 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

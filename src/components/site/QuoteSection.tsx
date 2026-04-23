import { QuoteForm } from "./QuoteForm";
import { Clock, Wrench, Truck, Factory, BadgePercent, Ruler } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Factory,
    title: "Produção própria",
    desc: "Fábrica e showroom técnico — sem atravessadores.",
  },
  {
    icon: Ruler,
    title: "Sob medida exata",
    desc: "Cortado ao centímetro para a sua janela.",
  },
  {
    icon: BadgePercent,
    title: "Até 6× sem juros",
    desc: "Parcele no cartão ou ganhe 5% de desconto à vista no Pix.",
  },
  {
    icon: Wrench,
    title: "Instalação simples",
    desc: "Vídeo passo a passo no app — fácil de montar em casa.",
  },
];

export function QuoteSection() {
  return (
    <section id="orcamento" className="py-16 sm:py-20 bg-graphite text-graphite-foreground">
      <div className="container mx-auto px-4">
        {/* Bloco superior — diferenciais */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-14">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Por que comprar com a Ágil
            </div>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">
              Tranquilidade do começo
              <br />
              <span className="text-primary">ao fim do projeto.</span>
            </h2>
            <p className="text-graphite-foreground/70 mt-3 max-w-md">
              Tecidos premium, fabricação sob medida e suporte de verdade — para a sua
              janela ficar perfeita e durar muito tempo.
            </p>
            <ul className="grid gap-3 mt-6 text-sm">
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </span>
                Resposta em até 1 hora útil
              </li>
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Factory className="h-4 w-4" />
                </span>
                Produção própria e sob medida exata
              </li>
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </span>
                Entregamos para todo o Brasil
              </li>
            </ul>
          </div>

          {/* Cards de destaque — substitui a calculadora (já existe na página do produto) */}
          <div className="grid sm:grid-cols-2 gap-3">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <h.icon className="h-6 w-6 text-primary" />
                <div className="mt-3 font-display text-base font-semibold text-white">
                  {h.title}
                </div>
                <div className="mt-1 text-sm text-white/70">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Orçamento gratuito
            </div>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">
              Conte sobre sua janela.
              <br />
              <span className="text-primary">A gente cuida do resto.</span>
            </h2>
            <p className="text-graphite-foreground/70 mt-3 max-w-md">
              Receba um orçamento personalizado em até 1 hora útil — sem compromisso, sem cobrança de visita.
            </p>
          </div>
          <div className="bg-background rounded-3xl p-2 shadow-2xl">
            <QuoteForm source="home_form" />
          </div>
        </div>
      </div>
    </section>
  );
}

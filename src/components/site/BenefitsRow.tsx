import { Ruler, CreditCard, Package, Wrench } from "lucide-react";

const ITEMS = [
  {
    icon: Ruler,
    title: "Sob medida exata",
    desc: "Cada produto é cortado ao centímetro para a sua janela.",
  },
  {
    icon: CreditCard,
    title: "Parcele em até 6× sem juros ou 5% off no PIX",
    desc: "Aceitamos todos os cartões ou desconto especial à vista.",
  },
  {
    icon: Package,
    title: "Produção própria",
    desc: "Fábrica e showroom técnico — sem atravessadores.",
  },
  {
    icon: Wrench,
    title: "Instalação simples",
    desc: "Vídeo passo a passo no app — fácil de montar em casa.",
  },
];

export function BenefitsRow() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="container-premium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ITEMS.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
            className="group rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-premium hover:border-primary/40 hover:shadow-card hover:-translate-y-1"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-500 ease-premium group-hover:scale-110"
              style={{ backgroundColor: "rgba(226,118,58,0.1)" }}
            >
              <Icon className="h-5 w-5" style={{ color: "#E2763A" }} />
            </div>
            <h3 className="mt-5 text-sm font-bold leading-snug text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

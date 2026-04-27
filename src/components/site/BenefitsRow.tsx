import { Ruler, CreditCard, Truck, Wrench } from "lucide-react";

const ITEMS = [
  { icon: Ruler, title: "Sob medida exata", desc: "Cortado ao centímetro" },
  { icon: CreditCard, title: "Até 6× sem juros", desc: "ou 5% off no PIX" },
  { icon: Truck, title: "Entrega Brasil", desc: "Frete para todo o país" },
  { icon: Wrench, title: "Instalação simples", desc: "Vídeo passo a passo" },
];

export function BenefitsRow() {
  return (
    <section className="bg-background py-6 md:py-8">
      <div className="container-premium">
        <div
          className="rounded-2xl border border-border/60 bg-[#FAF7F2] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
          data-reveal
        >
          <ul className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-border/50 lg:divide-y-0 lg:divide-x">
            {ITEMS.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 group"
              >
                <div
                  className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-premium group-hover:scale-110"
                  style={{ backgroundColor: "rgba(226,118,58,0.10)" }}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#E2763A" }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] sm:text-base leading-tight text-foreground tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-xs sm:text-[13px] leading-snug text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

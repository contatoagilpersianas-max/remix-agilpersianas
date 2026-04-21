import { Truck, CreditCard, ShieldCheck, Ruler } from "lucide-react";

const ITEMS = [
  { icon: Truck, t: "Frete grátis", s: "Acima de R$ 1.500" },
  { icon: CreditCard, t: "12× sem juros", s: "Ou 5% off no PIX" },
  { icon: Ruler, t: "Sob medida", s: "Largura e altura ao cm" },
  { icon: ShieldCheck, t: "Garantia 5 anos", s: "Suporte especializado" },
];

export function PromoStrip() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-premium grid grid-cols-2 divide-y divide-x divide-border md:grid-cols-4 md:divide-y-0">
        {ITEMS.map(({ icon: Icon, t, s }) => (
          <div key={t} className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold leading-tight md:text-base">
                {t}
              </div>
              <div className="truncate text-[11px] text-muted-foreground md:text-xs">
                {s}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

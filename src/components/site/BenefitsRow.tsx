import { Ruler, CreditCard, Package, ShieldCheck } from "lucide-react";

const ITEMS = [
  {
    icon: Ruler,
    title: "Sob medida ao cm",
    desc: "Cada produto é fabricado exatamente para sua janela.",
  },
  {
    icon: CreditCard,
    title: "12× sem juros ou 5% off no PIX",
    desc: "Parcele em todos os cartões ou ganhe desconto à vista.",
  },
  {
    icon: Package,
    title: "Envio para todo o Brasil",
    desc: "Embalagem reforçada e rastreio até a sua porta.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia 5 anos",
    desc: "Pós-venda dedicado e troca facilitada de peças.",
  },
];

export function BenefitsRow() {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container-premium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-card"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(226,118,58,0.1)" }}
            >
              <Icon className="h-5 w-5" style={{ color: "#E2763A" }} />
            </div>
            <h3 className="mt-4 text-sm font-bold leading-snug text-foreground">
              {title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

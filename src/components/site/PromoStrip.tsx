const ITEMS = [
  "FRETE GRÁTIS para todo o Brasil",
  "12× SEM JUROS no cartão",
  "GARANTIA de 5 anos",
  "ENTREGA expressa em SP",
  "INSTALAÇÃO profissional",
];

export function PromoStrip() {
  // Marquee infinito como na referência
  const loop = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <section className="border-y border-border bg-foreground text-background overflow-hidden">
      <div className="flex whitespace-nowrap py-3 animate-marquee will-change-transform">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
          >
            {t}
            <span className="text-primary">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

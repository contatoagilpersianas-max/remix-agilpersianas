const ITEMS = [
  "Instalação profissional",
  "Garantia de 5 anos",
  "Frete grátis para todo o Brasil",
  "12× sem juros no cartão",
  "Entrega expressa em SP",
  "Sob medida ao cm",
];

export function PromoStrip() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "#E2763A" }}
    >
      <div className="flex whitespace-nowrap py-3 animate-marquee will-change-transform">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-7 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white"
          >
            {t}
            <span className="text-white/60">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

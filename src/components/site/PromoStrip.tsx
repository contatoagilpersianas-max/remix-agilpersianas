const ITEMS = [
  "Sob medida exata",
  "Produção própria",
  "Instalação simples",
  "Envio para todo o Brasil",
  "Parcele em até 12×",
  "5% de desconto no PIX",
  "Catálogo com mais de 200 modelos",
  "Atendimento via WhatsApp",
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

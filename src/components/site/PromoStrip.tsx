const ITEMS = [
  "Cortinas e persianas sob medida",
  "Toldos e telas mosquiteiras",
  "Produção própria",
  "Instalação simples",
  "Envio para todo o Brasil",
  "Parcele em até 6× sem juros",
  "5% de desconto no PIX",
  "Atendimento via WhatsApp",
];

export function PromoStrip() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "#E2763A" }}
    >
      <div className="flex whitespace-nowrap py-3.5 sm:py-4 animate-marquee will-change-transform">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-6 sm:mx-8 inline-flex items-center gap-3 text-[14px] sm:text-[15px] md:text-[16px] font-bold uppercase tracking-[0.18em] text-white"
          >
            {t}
            <span className="text-white/70 text-[18px] leading-none">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

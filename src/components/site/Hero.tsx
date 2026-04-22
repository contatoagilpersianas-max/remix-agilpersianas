// Hero cinematográfico premium 2026 — fade entre cenas com texto rotativo
import { useEffect, useState } from "react";
import heroLiving from "@/assets/hero-2026-living.jpg";
import heroBedroom from "@/assets/hero-2026-bedroom.jpg";
import { ArrowRight, Shield, Ruler, Star } from "lucide-react";

const SLIDES = [
  {
    img: heroLiving,
    badge: "✦ Coleção 2026 — Sob medida",
    titleTop: "A luz certa.",
    titleBottom: "Para cada ambiente.",
    subtitle:
      "Persianas, cortinas e toldos sob medida com acabamento premium e entrega para todo o Brasil.",
  },
  {
    img: heroBedroom,
    badge: "✦ Linha Premium — Conforto e privacidade",
    titleTop: "Privacidade.",
    titleBottom: "Conforto. Design.",
    subtitle:
      "Persianas blackout sob medida com instalação simples e garantia real de 5 anos.",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Slides — fade cinematográfico com leve zoom */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt={s.titleTop}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
              i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        ))}
        {/* Overlay cinematográfico */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(15,10,5,0.82) 0%, rgba(15,10,5,0.55) 42%, rgba(15,10,5,0.18) 100%)",
          }}
        />
        {/* Vinheta inferior para texto */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to top, rgba(15,10,5,0.55), transparent)",
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="relative container-premium py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`transition-opacity duration-700 ${
                i === active ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
              }`}
              aria-hidden={i !== active}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{
                  borderColor: "rgba(245,124,0,0.6)",
                  color: "#FFB877",
                  backgroundColor: "rgba(15,10,5,0.55)",
                }}
              >
                {s.badge}
              </div>

              <h1
                className="font-display mt-7 leading-[1.0] tracking-tight"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(44px, 6.5vw, 76px)",
                  color: "#fbf6ec",
                  textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                }}
              >
                {s.titleTop}
                <br />
                <span style={{ color: "#F57C00" }}>{s.titleBottom}</span>
              </h1>

              <p
                className="mt-6 max-w-xl text-base md:text-[17px] leading-relaxed"
                style={{ color: "rgba(251,246,236,0.92)" }}
              >
                {s.subtitle}
              </p>
            </div>
          ))}

          {/* Selos rápidos */}
          <div
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-medium"
            style={{ color: "rgba(251,246,236,0.85)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" style={{ color: "#FFB877" }} />
              Sob medida
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" style={{ color: "#FFB877" }} />
              Garantia 5 anos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#FFB877" }} />
              4.9 (2.300+ avaliações)
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#categorias"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] transition hover:opacity-90 shadow-2xl"
              style={{ backgroundColor: "#F57C00", color: "#fff" }}
            >
              Ver coleção 2026 <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#calculadora"
              className="inline-flex h-13 items-center justify-center rounded-full border-2 px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] transition hover:bg-white/10"
              style={{
                borderColor: "rgba(251,246,236,0.55)",
                color: "#fbf6ec",
              }}
            >
              Calcular minha medida
            </a>
          </div>

          {/* Métricas */}
          <div
            className="mt-10 border-t pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl"
            style={{ borderColor: "rgba(251,246,236,0.2)" }}
          >
            {[
              { v: "+20 mil", l: "Clientes" },
              { v: "4.9 ★", l: "Avaliação" },
              { v: "5 anos", l: "Garantia" },
              { v: "12×", l: "Parcelado" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  className="font-display text-2xl md:text-3xl"
                  style={{ color: "#fbf6ec", fontWeight: 500 }}
                >
                  {m.v}
                </div>
                <div
                  className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: "rgba(251,246,236,0.85)" }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores */}
          <div className="mt-8 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === active ? 36 : 14,
                  backgroundColor:
                    i === active ? "#F57C00" : "rgba(251,246,236,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

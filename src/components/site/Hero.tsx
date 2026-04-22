// Hero comercial — carrossel de imagens imersivas + textos rotativos
import { useEffect, useState } from "react";
import heroLiving from "@/assets/hero-living-room.jpg";
import heroBedroom from "@/assets/hero-bedroom.jpg";
import { ArrowRight, Shield, Ruler, Star } from "lucide-react";

const SLIDES = [
  {
    img: heroLiving,
    badge: "✦ Coleção 2026 — Sob medida",
    titleTop: "A luz certa.",
    titleBottom: "Para cada ambiente.",
    subtitle:
      "Persianas, cortinas e toldos sob medida com acabamento premium e parcelamento em até 12×.",
  },
  {
    img: heroBedroom,
    badge: "✦ Linha Premium — Acabamento exclusivo",
    titleTop: "Privacidade.",
    titleBottom: "Conforto. Design.",
    subtitle:
      "Persianas blackout sob medida com acabamento premium e fácil instalação.",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Slides — fade entre imagens */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt={s.titleTop}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Overlay para contraste */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,12,4,0.78) 0%, rgba(20,12,4,0.55) 45%, rgba(20,12,4,0.15) 100%)",
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="relative container-premium py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`transition-opacity duration-700 ${
                i === active ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
              }`}
              aria-hidden={i !== active}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{
                  borderColor: "rgba(226,118,58,0.55)",
                  color: "#E2763A",
                  backgroundColor: "rgba(20,12,4,0.5)",
                }}
              >
                {s.badge}
              </div>

              {/* Headline */}
              <h1
                className="font-display mt-6 leading-[1.02] tracking-tight"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(40px, 6vw, 68px)",
                  color: "#f5ede0",
                  textShadow: "0 2px 30px rgba(0,0,0,0.4)",
                }}
              >
                {s.titleTop}
                <br />
                <span style={{ color: "#E2763A" }}>{s.titleBottom}</span>
              </h1>

              {/* Subtítulo */}
              <p
                className="mt-5 max-w-xl text-base md:text-lg leading-relaxed"
                style={{ color: "rgba(245,237,224,0.85)" }}
              >
                {s.subtitle}
              </p>
            </div>
          ))}

          {/* Selos rápidos (fixos) */}
          <div
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium"
            style={{ color: "rgba(245,237,224,0.75)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" style={{ color: "#E2763A" }} />
              Sob medida ao cm
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" style={{ color: "#E2763A" }} />
              Garantia 5 anos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star
                className="h-3.5 w-3.5 fill-current"
                style={{ color: "#E2763A" }}
              />
              4.9 (2.300+ avaliações)
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "#E2763A", color: "#fff" }}
            >
              Ver coleção completa <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#medida"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 px-6 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:bg-white/10"
              style={{
                borderColor: "rgba(245,237,224,0.5)",
                color: "#f5ede0",
              }}
            >
              Calcular minha medida
            </a>
          </div>

          {/* Métricas */}
          <div
            className="mt-8 border-t pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl"
            style={{ borderColor: "rgba(245,237,224,0.18)" }}
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
                  style={{ color: "#f5ede0", fontWeight: 500 }}
                >
                  {m.v}
                </div>
                <div
                  className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,237,224,0.65)" }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores do carrossel */}
          <div className="mt-8 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === active ? 32 : 12,
                  backgroundColor:
                    i === active ? "#E2763A" : "rgba(245,237,224,0.35)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

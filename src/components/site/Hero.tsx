// Hero estilo Blinds.com — split clean: texto + CTAs à esquerda, visual à direita
import { useEffect, useState } from "react";
import heroLiving from "@/assets/hero-2026-living.jpg";
import heroBedroom from "@/assets/hero-2026-bedroom.jpg";
import { ArrowRight, Sparkles, Star, Ruler, Truck } from "lucide-react";
import { openLumiWith } from "@/components/site/LumiWidget";

const SCENES = [heroLiving, heroBedroom];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SCENES.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative bg-background border-b border-border/60">
      <div className="container-premium py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Coluna esquerda — texto premium */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              ✦ Coleção 2026
            </div>

            <h1
              className="mt-5 leading-[1.05] tracking-tight text-foreground font-semibold"
              style={{ fontSize: "clamp(36px, 4.8vw, 56px)", letterSpacing: "-0.02em" }}
            >
              Persianas sob medida
              <br />
              <span className="text-primary">com tecnologia e design.</span>
            </h1>

            <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground max-w-lg">
              Elegância, conforto e tecnologia para transformar seu ambiente.
              Tecidos premium, produção própria e entrega para todo o Brasil.
            </p>

            {/* Diferencial: compra assistida pela Lumi */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
                <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
              </span>
              <p className="text-sm leading-snug text-foreground">
                <span className="font-semibold">Novo:</span> compre com auxílio da{" "}
                <span className="font-semibold text-primary">Lumi</span>, nossa consultora IA.
                Ela escolhe o modelo ideal, calcula o valor e fecha pelo WhatsApp.
              </p>
            </div>

            {/* CTA único — Lumi */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  openLumiWith({
                    pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
                  })
                }
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                Falar com a Lumi
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Selos rápidos */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[13px] font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-primary" />
                Sob medida exata
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" />
                Entrega Brasil
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                4.9 · 2.300+ avaliações
              </span>
            </div>

          </div>

          {/* Coluna direita — visual premium com fade */}
          <div className="relative">
            <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-3xl overflow-hidden shadow-2xl bg-sand">
              {SCENES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Ambiente com persianas sob medida"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  // @ts-expect-error fetchpriority valid HTML
                  fetchpriority={i === 0 ? "high" : "low"}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Indicadores */}
            <div className="absolute right-5 bottom-5 flex items-center gap-1.5">
              {SCENES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Cena ${i + 1}`}
                  className="h-1.5 rounded-full bg-white/80 transition-all"
                  style={{ width: i === active ? 28 : 10 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hero premium — inspiração Apple/Shopify: respiração, tipografia display, microinterações sutis
import { useEffect, useState } from "react";
import heroLiving from "@/assets/hero-2026-living.jpg";
import heroBedroom from "@/assets/hero-2026-bedroom.jpg";
import { ArrowRight, Sparkles, Star, Ruler, Truck, ShieldCheck } from "lucide-react";
import { openLumiWith } from "@/components/site/LumiWidget";

const SCENES = [heroLiving, heroBedroom];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SCENES.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative bg-background border-b border-border/60 overflow-hidden">
      {/* Halo sutil de fundo (aurora) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.78 0.17 55 / 0.35), transparent)" }}
      />
      <div className="container-premium py-10 md:py-14 lg:py-24">
        <div className="grid lg:grid-cols-[1.02fr_1fr] gap-8 md:gap-10 lg:gap-16 items-center">
          {/* Coluna esquerda — texto premium */}
          <div className="is-visible max-w-[34rem]" data-reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Coleção 2026
            </div>

            <h1
              className="mt-5 text-display text-foreground break-words hyphens-auto leading-[1.05] sm:leading-[1.06]"
              style={{ fontSize: "clamp(1.65rem, 4.6vw, 2.85rem)" }}
            >
              Seu ambiente merece a{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                perfeição feita sob medida.
              </span>
            </h1>

            <p className="mt-5 text-sm md:text-base leading-relaxed text-muted-foreground max-w-lg">
              Design inteligente, conforto térmico e acabamento premium. Unimos
              sofisticação e tecnologia de ponta para entregar a persiana ideal
              em qualquer lugar do Brasil.
            </p>

            {/* Card Lumi — destaque com glow laranja #f57c00 */}
            <div
              className="relative mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 backdrop-blur-sm"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(245,124,0,0.15), 0 18px 50px -18px rgba(245,124,0,0.55), 0 0 60px -12px rgba(245,124,0,0.35)",
              }}
            >
              {/* Glow interno */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(245,124,0,0.55), transparent)" }}
              />
              <div className="relative flex items-start gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                </span>
                <div className="text-[13px] leading-snug text-foreground">
                  <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Lumi · Consultora IA
                  </div>
                  <p>
                    Ela entende seu ambiente, indica o produto ideal, calcula
                    seu projeto em minutos e conduz você à melhor escolha.
                  </p>
                </div>
              </div>
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
                className="group inline-flex h-12 md:h-13 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-primary-glow px-7 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-glow transition-all duration-300 ease-premium hover:shadow-2xl hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" />
                Falar com a Lumi
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Selos rápidos */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[12px] font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-primary" />
                Sob medida exata
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" />
                Entrega Brasil
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Compra protegida
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                4.9 · 2.300+ avaliações
              </span>
            </div>
          </div>

          {/* Coluna direita — visual premium com fade */}
          <div className="is-visible relative" data-reveal>
            <div className="relative aspect-[10/12] sm:aspect-[4/5] lg:aspect-[4/5] max-h-[520px] sm:max-h-[620px] lg:max-h-[640px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl bg-sand ring-1 ring-black/5">
              {SCENES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Ambiente com persianas sob medida"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  // @ts-expect-error fetchpriority valid HTML
                  fetchpriority={i === 0 ? "high" : "low"}
                  className={`absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center transition-all duration-[1400ms] ease-premium ${
                    i === active ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
                  }`}
                />
              ))}
              {/* Vinheta sutil pra dar profundidade */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Indicadores */}
            <div className="absolute right-6 bottom-6 flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-md">
              {SCENES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Cena ${i + 1}`}
                  className="h-1.5 rounded-full bg-white transition-all duration-500 ease-premium"
                  style={{ width: i === active ? 28 : 8, opacity: i === active ? 1 : 0.55 }}
                />
              ))}
            </div>

            {/* Card flutuante de prova social */}
            <div className="absolute -left-3 bottom-10 hidden md:flex items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur-md px-4 py-3 shadow-card">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full ring-2 ring-card"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.78 0.13 ${30 + i * 30}), oklch(0.62 0.18 ${20 + i * 30}))`,
                    }}
                  />
                ))}
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-semibold text-foreground">+12.000 lares atendidos</p>
                <p className="text-muted-foreground">Persianas sob medida</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hero premium — inspiração Apple/Shopify: respiração, tipografia display, microinterações sutis
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroLiving from "@/assets/hero-2026-living.jpg";
import heroBedroom from "@/assets/hero-2026-bedroom.jpg";
import heroLivingLumi from "@/assets/hero-2026-living-lumi.jpg";
import { ArrowRight, Sparkles, Star, Ruler, Truck, ShieldCheck, CalendarCheck, BookOpen } from "lucide-react";
import { openLumiWith } from "@/components/site/LumiWidget";
import { supabase } from "@/integrations/supabase/client";

type Scene = {
  src: string;
  title: string;
  subtitle: string;
};

const DEFAULT_SCENES: Scene[] = [
  {
    src: heroLiving,
    title: "A arte de iluminar cada ambiente.",
    subtitle: "Persianas e cortinas sob medida com design premium e acabamento impecável.",
  },
  {
    src: heroBedroom,
    title: "Noites perfeitas começam com a persiana certa.",
    subtitle: "Blackout total, conforto térmico, sob medida — entregue na sua porta.",
  },
  {
    src: heroLivingLumi,
    title: "Viva ao ar livre, com sofisticação.",
    subtitle: "Toldos modernos sob medida — conforto térmico e lifestyle premium para sua casa.",
  },
];

/**
 * HeroBanner — apenas o banner visual (imagens em fade) com indicadores e prova social flutuante.
 * Renderizado logo abaixo das categorias, como a primeira coisa visual de impacto.
 */
export function HeroBanner() {
  const [active, setActive] = useState(0);
  const [scenes, setScenes] = useState<Scene[]>(DEFAULT_SCENES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_banners")
        .maybeSingle();
      if (cancelled || !data?.value) return;
      const incoming = data.value as Array<Partial<Scene>> | null;
      if (!Array.isArray(incoming)) return;
      // Mescla com defaults (mantém banner padrão se admin não definiu imagem)
      const merged = DEFAULT_SCENES.map((def, i) => ({
        src: incoming[i]?.src?.trim() ? incoming[i]!.src! : def.src,
        title: incoming[i]?.title?.trim() ? incoming[i]!.title! : def.title,
        subtitle: incoming[i]?.subtitle?.trim() ? incoming[i]!.subtitle! : def.subtitle,
      }));
      setScenes(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % scenes.length), 8000);
    return () => clearInterval(id);
  }, [scenes.length]);

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="container-premium pt-4 pb-2 md:pt-6 md:pb-3">
        <div className="is-visible relative" data-reveal>
          <div className="relative min-h-[560px] sm:min-h-[460px] lg:min-h-[560px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl bg-foreground ring-1 ring-black/5">
            {/* Camada 1 — Imagens de fundo */}
            <div className="absolute inset-0 z-0">
              {scenes.map((scene, i) => (
                <img
                  key={i}
                  src={scene.src}
                  alt="Ambiente com cortinas e persianas sob medida"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  // @ts-expect-error fetchpriority valid HTML
                  fetchpriority={i === 0 ? "high" : "low"}
                  className={`absolute inset-0 h-full w-full object-cover object-[60%_40%] sm:object-[center_40%] lg:object-center transition-all duration-[1400ms] ease-premium ${
                    i === active ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
                  }`}
                />
              ))}
            </div>

            {/* Camada 2 — Overlay padronizado: escurece base e dá leve vinheta para legibilidade do texto branco */}
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/20 to-black/65" />

            {/* Camada 3 — Conteúdo: título + subtítulo + CTAs, centralizado vertical e horizontalmente */}
            <div className="relative z-10 flex min-h-[560px] sm:min-h-[460px] lg:min-h-[560px] flex-col items-center justify-center gap-7 px-5 py-10 text-center sm:gap-8 sm:px-10 sm:py-12">
              <div className="mx-auto w-full max-w-2xl px-2 sm:max-w-3xl">
                <h2
                  className="text-display text-white text-balance leading-[1.1] break-words"
                  style={{
                    fontSize: "clamp(1.5rem, 4.6vw, 3rem)",
                    textShadow: "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {scenes[active].title}
                </h2>
                <p
                  className="mx-auto mt-3 max-w-xl text-[13px] leading-[1.55] text-white/95 sm:mt-4 sm:max-w-2xl sm:text-[15px] sm:leading-[1.6] md:text-base"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}
                >
                  {scenes[active].subtitle}
                </p>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    openLumiWith({
                      pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
                    })
                  }
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-glow transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-2xl sm:w-auto sm:px-7"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Agendar consultoria
                </button>
                <Link
                  to="/catalogo"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto sm:px-7"
                >
                  <BookOpen className="h-4 w-4" />
                  Ver catálogo
                </Link>
              </div>
            </div>

            {/* Indicadores — canto inferior direito, sem cobrir o texto central */}
            <div className="absolute right-4 bottom-4 z-20 sm:right-6 sm:bottom-6 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
              {scenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Cena ${i + 1}`}
                  className="h-1.5 rounded-full bg-white transition-all duration-500 ease-premium"
                  style={{ width: i === active ? 28 : 8, opacity: i === active ? 1 : 0.55 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * HeroIntro — bloco editorial com headline, descrição, card da Lumi, CTA e selos.
 * Renderizado logo após o banner.
 */
export function HeroIntro() {
  return (
    <section className="relative bg-background border-b border-border/60 overflow-hidden">
      {/* Halo sutil de fundo (aurora) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.78 0.17 55 / 0.35), transparent)" }}
      />
      <div className="container-premium py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[24px] sm:rounded-[28px] border border-border/70 bg-card/70 px-4 py-7 text-center shadow-card backdrop-blur-sm sm:px-8 sm:py-10 md:px-10 md:py-12">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:px-3.5 sm:tracking-[0.22em]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Coleção 2026
          </div>

          <h1
            className="mt-4 text-display text-foreground text-pretty leading-[1.08] sm:mt-5 sm:leading-[1.04]"
            style={{ fontSize: "clamp(1.45rem, 5.4vw, 3.2rem)" }}
          >
            <span className="block">Seu ambiente merece a</span>
            <span className="mt-1 block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              perfeição feita sob medida.
            </span>
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-[13.5px] leading-[1.65] text-muted-foreground sm:mt-5 sm:text-[15px] sm:leading-7 md:text-base md:leading-8">
            Cortinas, persianas, toldos e telas mosquiteiras com design
            inteligente, conforto térmico e acabamento premium. Unimos
            sofisticação e tecnologia de ponta para entregar a solução ideal
            em qualquer lugar do Brasil.
          </p>

          {/* Card Lumi — destaque com glow laranja #f57c00 */}
          <div
            className="relative mt-6 mx-auto max-w-xl overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3.5 sm:p-5 backdrop-blur-sm text-left"
            style={{
              boxShadow:
                "0 0 0 1px rgba(245,124,0,0.15), 0 18px 50px -18px rgba(245,124,0,0.55), 0 0 60px -12px rgba(245,124,0,0.35)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(245,124,0,0.55), transparent)" }}
            />
            <div className="relative flex items-start gap-2.5 sm:gap-3">
              <span className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
                <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
              </span>
              <div className="min-w-0 text-[12.5px] sm:text-[13px] leading-snug text-foreground">
                <div className="mb-1 inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-primary">
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
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                openLumiWith({
                  pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
                })
              }
              className="group inline-flex h-12 md:h-13 max-w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 sm:px-7 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-primary-foreground shadow-glow transition-all duration-300 ease-premium hover:shadow-2xl hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Falar com a Lumi
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Selos rápidos */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11.5px] sm:text-[12px] font-medium text-muted-foreground sm:mt-8 sm:gap-x-7">
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
      </div>
    </section>
  );
}

/**
 * Hero — wrapper de compatibilidade. Renderiza banner + intro juntos.
 * Mantido para que outras páginas que importam <Hero /> continuem funcionando.
 */
export function Hero() {
  return (
    <>
      <HeroBanner />
      <HeroIntro />
    </>
  );
}


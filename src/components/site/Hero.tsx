// Hero estilo Blinds.com — split clean: texto + CTAs à esquerda, visual à direita
import { useEffect, useState } from "react";
import heroLiving from "@/assets/hero-2026-living.jpg";
import heroBedroom from "@/assets/hero-2026-bedroom.jpg";
import { ArrowRight, MessageCircle, Star, Ruler, Truck } from "lucide-react";

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
              className="font-display mt-5 leading-[1.02] tracking-tight text-foreground"
              style={{ fontWeight: 500, fontSize: "clamp(40px, 5.5vw, 64px)" }}
            >
              Persianas Sob Medida
              <br />
              <span className="text-primary">com Instalação Profissional.</span>
            </h1>

            <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground">
              Elegância, conforto e tecnologia para transformar seu ambiente.
              Tecidos premium, produção própria e entrega para todo o Brasil.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#orcamento"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Calcular Valor <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/5532351202810?text=Ol%C3%A1!%20Quero%20um%20or%C3%A7amento%20de%20persianas%20sob%20medida."
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-foreground/15 px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-foreground transition hover:bg-foreground/5"
              >
                <MessageCircle className="h-4 w-4 text-whatsapp" />
                Falar no WhatsApp
              </a>
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

            {/* Card flutuante — preço */}
            <div className="hidden md:block absolute -left-6 bottom-8 bg-white rounded-2xl shadow-2xl border border-border/60 p-5 max-w-[240px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                A partir de
              </div>
              <div className="font-display text-3xl text-foreground mt-1" style={{ fontWeight: 500 }}>
                R$ 199<span className="text-base text-muted-foreground">/m²</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Em até <strong className="text-foreground">6× sem juros</strong>
              </div>
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

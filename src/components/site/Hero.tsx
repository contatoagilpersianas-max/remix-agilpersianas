import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-living-room.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[640px] w-full md:h-[720px]">
        <img
          src={heroImg}
          alt="Sala de estar premium com persianas rolô"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero-overlay)" }}
        />

        <div className="container-premium relative flex h-full items-center">
          <div className="max-w-2xl text-graphite-foreground animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
              Coleção 2026 — sob medida
            </span>

            <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold md:text-7xl">
              A luz certa.
              <br />
              <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
                Para cada ambiente.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              Persianas, cortinas e toldos sob medida com tecidos premium,
              instalação profissional e até 36× sem juros.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <a
                href="#categorias"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
              >
                Ver coleção completa
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#calculadora"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 text-base font-medium text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Calcular minha medida
              </a>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-white/80">
              <div>
                <dt className="text-xs uppercase tracking-wider opacity-70">+ de</dt>
                <dd className="font-display text-2xl font-semibold text-white">
                  20 mil clientes
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider opacity-70">Avaliação</dt>
                <dd className="font-display text-2xl font-semibold text-white">
                  4.9 ★
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider opacity-70">Garantia</dt>
                <dd className="font-display text-2xl font-semibold text-white">
                  5 anos
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-y border-border bg-card">
        <div className="container-premium grid grid-cols-2 divide-x divide-border md:grid-cols-4">
          {[
            { t: "Frete grátis", s: "Acima de R$ 1.500" },
            { t: "12× sem juros", s: "No cartão de crédito" },
            { t: "5% no PIX", s: "Desconto à vista" },
            { t: "Sob medida", s: "Largura e altura ao cm" },
          ].map((b) => (
            <div key={b.t} className="px-4 py-5 text-center md:px-6 md:py-6">
              <div className="font-display text-sm font-semibold md:text-base">
                {b.t}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground md:text-sm">
                {b.s}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

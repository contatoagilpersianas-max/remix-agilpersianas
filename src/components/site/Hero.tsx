import { ArrowRight, Shield, Sparkles, Wind } from "lucide-react";
import heroMosquiteira from "@/assets/hero-mosquiteira-premium.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-graphite">
      <div className="absolute inset-0">
        <img
          src={heroMosquiteira}
          alt="Janela moderna com tela mosquiteira e luz natural"
          loading="eager"
          decoding="async"
          width={1264}
          height={848}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero-overlay)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-graphite/50 to-transparent" />
      </div>

      <div className="relative container-premium py-18 md:py-24 lg:py-30">
        <div className="max-w-2xl text-primary-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Linha premium para ventilação e proteção
          </div>

          <h1 className="mt-6 max-w-xl font-display text-4xl leading-[0.98] text-primary-foreground md:text-6xl lg:text-[4.6rem]">
            TELA MOSQUITEIRA
            <br />
            <span className="text-primary">SOB MEDIDA</span>
          </h1>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground/88 md:text-base">
            PROTEÇÃO SEM FECHAR A CASA
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/86 md:text-[17px]">
            Impeça a entrada de insetos e aproveite ventilação natural com acabamento discreto e moderno.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Saiba mais <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 border-t border-primary-foreground/20 pt-6 sm:grid-cols-3">
            {[
              { icon: Wind, label: "Ventilação natural" },
              { icon: Shield, label: "Barreira contra insetos" },
              { icon: Sparkles, label: "Acabamento discreto" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-primary-foreground/82">
                <Icon className="h-4 w-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
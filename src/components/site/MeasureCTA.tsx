import { Ruler, Scissors, Package, PlayCircle } from "lucide-react";

const STEPS = [
  { icon: Ruler, t: "1. Meça sua janela", s: "Largura e altura em cm — temos guia ilustrado." },
  { icon: Scissors, t: "2. Escolha o tecido", s: "Blackout, tela solar, double vision e mais." },
  { icon: Package, t: "3. Produzimos sob medida", s: "Fabricação exclusiva para a sua janela." },
  { icon: PlayCircle, t: "4. Instalação fácil", s: "Vídeo passo a passo e suporte no WhatsApp." },
];

export function MeasureCTA() {
  return (
    <section id="calculadora" className="py-20 md:py-28">
      <div className="container-premium">
        <div className="overflow-hidden rounded-3xl bg-gradient-dark text-graphite-foreground shadow-lg">
          <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:gap-16 md:p-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow">
                Sob medida
              </span>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
                Do orçamento à <br />
                instalação,{" "}
                <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
                  sem complicação
                </span>
                .
              </h2>
              <p className="mt-5 max-w-md text-white/75 md:text-lg">
                Calcule o preço pelo tamanho exato da sua janela e receba pronta
                para instalar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
                >
                  Calcular agora
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  Falar com consultor
                </a>
              </div>
            </div>

            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STEPS.map((s) => (
                <li
                  key={s.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                >
                  <s.icon className="h-6 w-6 text-primary-glow" />
                  <div className="mt-3 font-display text-base font-semibold text-white">
                    {s.t}
                  </div>
                  <div className="mt-1 text-sm text-white/70">{s.s}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

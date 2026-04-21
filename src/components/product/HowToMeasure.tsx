import { Ruler, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Meça a largura",
    desc: "Use uma trena metálica e meça em 3 pontos (topo, meio, base). Use a menor medida.",
  },
  {
    n: "02",
    title: "Meça a altura",
    desc: "Meça do topo até o ponto onde a persiana terminará. Considere 5 a 10 cm extras se for fora do vão.",
  },
  {
    n: "03",
    title: "Informe no site",
    desc: "Digite as medidas no configurador. O preço final aparece em tempo real.",
  },
];

export function HowToMeasure() {
  return (
    <section id="como-medir" className="container-premium py-20">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Guia rápido</span>
          <h2 className="font-display text-3xl lg:text-4xl mt-2">Como medir sua janela</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Em 3 passos você garante a medida perfeita. Se ficar em dúvida, nosso time mede por você via vídeo-chamada — gratuito.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all cursor-pointer">
            <Ruler className="h-4 w-4" /> Solicitar medição gratuita <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border bg-card p-6 shadow-card flex gap-5">
              <div className="font-display text-4xl text-primary/30 leading-none shrink-0">{s.n}</div>
              <div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

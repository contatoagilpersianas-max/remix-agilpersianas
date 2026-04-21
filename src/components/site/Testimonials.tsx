import { Star, Quote } from "lucide-react";

const ITEMS = [
  {
    name: "Marina Lopes",
    city: "São Paulo, SP",
    rating: 5,
    text: "Comprei rolô blackout para o quarto do bebê. Chegou perfeito, montei sozinha e o quarto fica totalmente escuro. Recomendo muito!",
  },
  {
    name: "Rafael Andrade",
    city: "Belo Horizonte, MG",
    rating: 5,
    text: "Atendimento via WhatsApp foi excelente. Tiraram todas as dúvidas sobre medida. Acabamento de primeira linha.",
  },
  {
    name: "Juliana Castro",
    city: "Curitiba, PR",
    rating: 5,
    text: "Já é a terceira persiana que compro com a Ágil. Tecido lindo, durável e o preço continua ótimo. Virei fã.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Quem comprou, recomenda
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            +20 mil lares com Ágil
          </h2>
          <div className="mt-3 inline-flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-sm font-semibold">
              4.9/5 — 3.214 avaliações
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ITEMS.map((it) => (
            <figure
              key={it.name}
              className="relative rounded-2xl bg-card p-7 shadow-card"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex gap-1">
                {[...Array(it.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <blockquote className="mt-4 leading-relaxed text-foreground/90">
                "{it.text}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-muted-foreground">{it.city}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

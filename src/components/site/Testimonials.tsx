import { Star, Quote } from "lucide-react";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { TESTIMONIALS_DEFAULTS, type TestimonialsConfig } from "@/components/admin/site/TestimonialsModule";

const FALLBACK_PHOTOS = [t1, t2, t3];
const ITEMS = [
  {
    name: "Marina Lopes",
    city: "São Paulo, SP",
    rating: 5,
    photo: t1,
    text: "Comprei rolô blackout para o quarto do bebê. Chegou perfeito, montei sozinha e o quarto fica totalmente escuro. Recomendo muito!",
  },
  {
    name: "Rafael Andrade",
    city: "Belo Horizonte, MG",
    rating: 5,
    photo: t2,
    text: "Atendimento via WhatsApp foi excelente. Tiraram todas as dúvidas sobre medida. Acabamento de primeira linha.",
  },
  {
    name: "Juliana Castro",
    city: "Curitiba, PR",
    rating: 5,
    photo: t3,
    text: "Já é a terceira persiana que compro com a Ágil. Tecido lindo, durável e o preço continua ótimo. Virei fã.",
  },
];

export function Testimonials() {
  const { value: cfg } = useSiteSetting<TestimonialsConfig>("testimonials", TESTIMONIALS_DEFAULTS);
  if (!cfg.enabled) return null;
  const items = cfg.items?.length ? cfg.items : ITEMS;
  return (
    <section className="bg-sand py-12 md:py-16">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {cfg.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            {cfg.title}
          </h2>
          <div className="mt-3 inline-flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-sm font-semibold">
              {cfg.ratingSummary}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, idx) => (
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
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={it.photo || FALLBACK_PHOTOS[idx % FALLBACK_PHOTOS.length]}
                  alt={it.name}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-muted-foreground">{it.city}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import rolo from "@/assets/cat-rolo.jpg";
import romana from "@/assets/cat-romana.jpg";
import horizontal from "@/assets/cat-horizontal.jpg";
import vertical from "@/assets/cat-vertical.jpg";

const PRODUCTS = [
  {
    name: "Persiana Rolô Blackout Premium",
    cat: "Rolô",
    price: 393,
    old: 549,
    rating: 4.9,
    reviews: 1284,
    img: rolo,
    badge: "Mais vendida",
    slug: "persiana-rolo-blackout-premium",
  },
  {
    name: "Persiana Romana Linho Cru",
    cat: "Romana",
    price: 689,
    old: 899,
    rating: 4.8,
    reviews: 412,
    img: romana,
    badge: "Premium",
  },
  {
    name: "Persiana Horizontal Madeira 50mm",
    cat: "Horizontal",
    price: 459,
    old: 599,
    rating: 4.7,
    reviews: 738,
    img: horizontal,
  },
  {
    name: "Persiana Vertical Tecido Light",
    cat: "Vertical",
    price: 379,
    old: 489,
    rating: 4.8,
    reviews: 524,
    img: vertical,
    badge: "Frete grátis",
  },
];

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FeaturedProducts() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Mais procuradas
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Best-sellers da temporada
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
            Os modelos preferidos de quem quer praticidade, conforto e estilo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const off = Math.round(((p.old - p.price) / p.old) * 100);
            return (
              <article
                key={p.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-graphite px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-graphite-foreground">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-glow">
                    -{off}%
                  </span>
                  <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {p.cat}
                  </div>
                  <h3 className="mt-1 line-clamp-2 font-display text-lg font-semibold">
                    {p.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="font-semibold text-foreground">
                      {p.rating}
                    </span>
                    <span>({p.reviews})</span>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="text-xs text-muted-foreground line-through">
                      {fmt(p.old)}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold text-foreground">
                        {fmt(p.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">/m²</span>
                    </div>
                    <div className="mt-1 text-xs text-success">
                      ou 12× de {fmt(p.price / 12)} sem juros
                    </div>

                    <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition hover:bg-primary">
                      <ShoppingBag className="h-4 w-4" />
                      Comprar agora
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

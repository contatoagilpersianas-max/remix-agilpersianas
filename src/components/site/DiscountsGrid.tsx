import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  name: string;
  slug: string;
  badge: string | null;
  price_per_sqm: number;
  rating: number;
  reviews_count: number;
  cover_image: string | null;
};

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function DiscountsGrid() {
  const { data: products = [] } = useQuery({
    queryKey: ["discount-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, badge, price_per_sqm, rating, reviews_count, cover_image")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  if (products.length === 0) return null;

  return (
    <section className="bg-sand py-12 md:py-16">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-medium md:text-5xl">
            Conheça os principais Descontos
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {products.map((p) => (
            <Link
              to="/produto/$slug"
              params={{ slug: p.slug }}
              key={p.id}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                {p.cover_image && (
                  <img
                    src={p.cover_image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                  />
                )}
                {p.badge && (
                  <span className="absolute left-3 top-3 inline-flex items-center justify-center bg-foreground px-2 py-1 text-[11px] font-bold text-background">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 text-center">
                <h3 className="line-clamp-2 text-[13px] font-medium tracking-wide text-foreground transition group-hover:text-primary">
                  {p.name}
                </h3>
                <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="font-medium text-foreground/80">{p.rating.toFixed(1)}</span>
                  <span>({p.reviews_count})</span>
                </div>
                <div className="mt-2.5 font-display text-lg font-semibold">
                  {fmt(p.price_per_sqm)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  6× de {fmt(p.price_per_sqm / 6)} sem juros
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

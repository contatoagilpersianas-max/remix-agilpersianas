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

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, badge, price_per_sqm, rating, reviews_count, cover_image")
        .eq("active", true)
        .eq("featured", true)
        .order("bestseller", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  return (
    <section id="catalogo" className="bg-background py-20 md:py-24">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-medium md:text-5xl">
            Destaques no Mês do Consumidor
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
            Persianas com tecidos exclusivos. Até 70% de desconto!
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-md bg-secondary"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { name, slug, badge, price_per_sqm, rating, reviews_count, cover_image } = product;
  const installment = price_per_sqm / 12;

  return (
    <Link
      to="/produto/$slug"
      params={{ slug }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {cover_image && (
          <img
            src={cover_image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
          />
        )}
        {badge && (
          <span className="absolute left-3 top-3 inline-flex items-center justify-center bg-foreground px-2 py-1 text-[11px] font-bold text-background">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col text-center">
        <h3 className="line-clamp-2 text-[13px] font-medium tracking-wide text-foreground transition group-hover:text-primary">
          {name}
        </h3>

        <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-medium text-foreground/80">{rating.toFixed(1)}</span>
          <span>({reviews_count})</span>
        </div>

        <div className="mt-2.5 font-display text-lg font-semibold text-foreground">
          {fmt(price_per_sqm)}
        </div>
        <div className="text-[11px] text-muted-foreground">
          12× de {fmt(installment)}
        </div>
      </div>
    </Link>
  );
}

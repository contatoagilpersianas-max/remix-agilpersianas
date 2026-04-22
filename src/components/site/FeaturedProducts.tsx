import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star, Flame } from "lucide-react";
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
  bestseller: boolean;
};

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, badge, price_per_sqm, rating, reviews_count, cover_image, bestseller")
        .eq("active", true)
        .eq("featured", true)
        .order("bestseller", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  return (
    <section id="catalogo" className="bg-background py-16 md:py-20">
      <div className="container-premium">
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ backgroundColor: "rgba(184,84,28,0.10)", color: "#B8541C" }}
          >
            <Flame className="h-3.5 w-3.5" /> Mês do Consumidor
          </span>
          <h2 className="mt-4 font-display text-3xl font-medium md:text-5xl">
            Os mais vendidos da semana
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Persianas com tecidos exclusivos e até{" "}
            <strong style={{ color: "#B8541C" }}>70% OFF</strong> — sob medida ao
            cm com envio para todo o Brasil.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-md bg-secondary"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-10 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-background transition hover:bg-primary"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { name, slug, badge, price_per_sqm, rating, reviews_count, cover_image, bestseller } = product;
  // Simula preço cheio quando há desconto no badge
  const discountMatch = badge?.match(/-?(\d+)%/);
  const discountPct = discountMatch ? Number(discountMatch[1]) : 0;
  const fullPrice = discountPct > 0 ? price_per_sqm / (1 - discountPct / 100) : 0;
  const pixPrice = price_per_sqm * 0.95;
  const installment = price_per_sqm / 12;

  return (
    <Link
      to="/produto/$slug"
      params={{ slug }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-secondary">
        {cover_image && (
          <img
            src={cover_image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
          />
        )}
        {/* Badge desconto laranja */}
        {badge && (
          <span
            className="absolute left-3 top-3 inline-flex items-center justify-center rounded-md px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ backgroundColor: "#E2763A" }}
          >
            {badge}
          </span>
        )}
        {/* Badge bestseller */}
        {bestseller && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-bold uppercase text-background">
            <Flame className="h-3 w-3" /> Top
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col text-left">
        <h3 className="line-clamp-2 text-[13px] font-medium text-foreground transition group-hover:text-primary">
          {name}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-medium text-foreground/80">{rating.toFixed(1)}</span>
          <span>({reviews_count})</span>
        </div>

        <div className="mt-2 flex flex-col">
          {fullPrice > 0 && (
            <span className="text-[11px] text-muted-foreground line-through">
              de {fmt(fullPrice)}
            </span>
          )}
          <span className="font-display text-xl font-bold text-foreground">
            {fmt(price_per_sqm)}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: "#B8541C" }}>
            ou {fmt(pixPrice)} no PIX (-5%)
          </span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            em até 12× de {fmt(installment)}
          </span>
        </div>
      </div>
    </Link>
  );
}

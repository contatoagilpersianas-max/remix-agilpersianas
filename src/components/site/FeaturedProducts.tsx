import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star, Flame, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatBRL } from "@/lib/cart";

type Product = {
  id: string;
  name: string;
  slug: string;
  badge: string | null;
  price: number;
  sale_price: number | null;
  price_per_sqm: number;
  product_type: string;
  rating: number;
  reviews_count: number;
  cover_image: string | null;
  bestseller: boolean;
};

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, badge, price, sale_price, price_per_sqm, product_type, rating, reviews_count, cover_image, bestseller",
        )
        .eq("active", true)
        .eq("featured", true)
        .order("bestseller", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return (
    <section id="catalogo" className="bg-background py-16 md:py-20">
      <div className="container-premium">
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ backgroundColor: "rgba(184,84,28,0.10)", color: "#B8541C" }}
          >
            <Flame className="h-3.5 w-3.5" /> Mais vendidos
          </span>
          <h2 className="mt-4 font-display text-3xl font-medium md:text-5xl">
            Os mais vendidos da semana
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Persianas e cortinas sob medida ao centímetro com envio para todo o Brasil.
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
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="font-medium">Em breve, mais vendidos da semana.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Marque produtos como “Destaque” no painel admin para aparecerem aqui.
            </p>
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
            to="/catalogo"
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
  const { addItem } = useCart();
  const isM2 = product.product_type === "metro_quadrado";
  const finalPrice = isM2
    ? product.price_per_sqm
    : product.sale_price && product.sale_price > 0
      ? product.sale_price
      : product.price;
  const fullPrice =
    !isM2 && product.sale_price && product.sale_price > 0 && product.sale_price < product.price
      ? product.price
      : null;
  const pixPrice = finalPrice * 0.95;
  const installment = finalPrice / 12;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isM2) {
      // Para sob medida, leva para a página do produto para configurar
      window.location.assign(`/produto/${product.slug}`);
      return;
    }
    addItem({
      id: product.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: product.cover_image,
      unitPrice: finalPrice,
      fullPrice: fullPrice ?? undefined,
    });
  }

  return (
    <Link to="/produto/$slug" params={{ slug: product.slug }} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-secondary">
        {product.cover_image && (
          <img
            src={product.cover_image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
          />
        )}
        {product.badge && (
          <span
            className="absolute left-3 top-3 inline-flex items-center justify-center rounded-md px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ backgroundColor: "#E2763A" }}
          >
            {product.badge}
          </span>
        )}
        {product.bestseller && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-bold uppercase text-background">
            <Flame className="h-3 w-3" /> Top
          </span>
        )}
        {/* Quick add */}
        <button
          onClick={quickAdd}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isM2 ? "Configurar" : "Adicionar"}
        </button>
      </div>

      <div className="mt-4 flex flex-col text-left">
        <h3 className="line-clamp-2 text-[13px] font-medium text-foreground transition group-hover:text-primary">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-medium text-foreground/80">{product.rating.toFixed(1)}</span>
          <span>({product.reviews_count})</span>
        </div>

        <div className="mt-2 flex flex-col">
          {fullPrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              de {formatBRL(fullPrice)}
            </span>
          )}
          <span className="font-display text-xl font-bold text-foreground">
            {isM2 ? `a partir de ${formatBRL(finalPrice)}/m²` : formatBRL(finalPrice)}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: "#B8541C" }}>
            ou {formatBRL(pixPrice)} no PIX (-5%)
          </span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            em até 12× de {formatBRL(installment)}
          </span>
        </div>
      </div>
    </Link>
  );
}

import { Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { CartDrawer } from "@/components/site/CartDrawer";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/cart";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  price_per_sqm: number;
  product_type: string;
  rating: number;
  reviews_count: number;
  cover_image: string | null;
  badge: string | null;
};

type Props = {
  /** Slug da categoria (ex.: "rolo-blackout-pinpoint"). */
  categorySlug: string;
  /** Slug do route — usado para tipar o useSearch. */
  routeId: "/rolo-blackout-pinpoint" | "/rolo-blackout-texturizado";
  eyebrow: string;
  title: string;
  subtitle: string;
  parentSlug?: string;
  parentLabel?: string;
};

export function SubcategoryPage({
  categorySlug,
  routeId,
  eyebrow,
  title,
  subtitle,
  parentSlug,
  parentLabel,
}: Props) {
  const search = useSearch({ from: routeId });
  const sort = (search as { sort?: string }).sort ?? "destaque";
  const q = (search as { q?: string }).q ?? "";

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["subcat", categorySlug, sort, q],
    queryFn: async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (!cat) return [];
      let query = supabase
        .from("products")
        .select(
          "id,name,slug,price,sale_price,price_per_sqm,product_type,rating,reviews_count,cover_image,badge,featured,bestseller,created_at",
        )
        .eq("active", true)
        .eq("category_id", cat.id);
      if (q) query = query.ilike("name", `%${q}%`);
      const orderMap: Record<string, { col: string; asc: boolean }> = {
        destaque: { col: "featured", asc: false },
        "menor-preco": { col: "price", asc: true },
        "maior-preco": { col: "price", asc: false },
        novidades: { col: "created_at", asc: false },
      };
      const o = orderMap[sort] ?? orderMap.destaque;
      const { data } = await query.order(o.col, { ascending: o.asc }).limit(120);
      return (data ?? []) as ProductRow[];
    },
    staleTime: 60_000,
  });

  const sortOptions = [
    { v: "destaque", l: "Destaque" },
    { v: "menor-preco", l: "Menor preço" },
    { v: "maior-preco", l: "Maior preço" },
    { v: "novidades", l: "Novidades" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container-premium py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          {parentSlug && parentLabel && (
            <>
              <span className="mx-2">/</span>
              <Link to="/catalogo" search={{ categoria: parentSlug }} className="hover:text-primary">
                {parentLabel}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </header>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {sortOptions.map((s) => {
              const active = sort === s.v;
              return (
                <Link
                  key={s.v}
                  to={routeId}
                  search={{ ...(search as object), sort: s.v }}
                  className={`inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {s.l}
                </Link>
              );
            })}
          </div>
          <input
            type="search"
            defaultValue={q}
            placeholder="Buscar nesta categoria..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const url = new URL(window.location.href);
                url.searchParams.set("q", (e.target as HTMLInputElement).value);
                window.location.href = url.toString();
              }
            }}
            className="ml-auto h-9 min-w-[220px] flex-1 max-w-xs rounded-full border bg-card px-4 text-xs"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="font-medium">Nenhum produto disponível nesta categoria ainda.</p>
            <Link
              to="/catalogo"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              Ver catálogo completo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
            {products.map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFAB />
      <CartDrawer />
    </div>
  );
}

function Card({ p }: { p: ProductRow }) {
  const isM2 = p.product_type === "metro_quadrado";
  const finalPrice = isM2
    ? p.price_per_sqm
    : p.sale_price && p.sale_price > 0
      ? p.sale_price
      : p.price;
  const showFrom = isM2 || (p.sale_price && p.sale_price > 0 && p.sale_price < p.price);
  const fullPrice = isM2 ? null : p.price;
  return (
    <Link to="/produto/$slug" params={{ slug: p.slug }} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-secondary">
        {p.cover_image && (
          <img
            src={p.cover_image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
        {p.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center justify-center rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
            {p.badge}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col text-left">
        <h3 className="line-clamp-2 text-[13px] font-medium text-foreground transition group-hover:text-primary">
          {p.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-medium text-foreground/80">{p.rating.toFixed(1)}</span>
          <span>({p.reviews_count})</span>
        </div>
        <div className="mt-2 flex flex-col">
          {showFrom && fullPrice && fullPrice > finalPrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              de {formatBRL(fullPrice)}
            </span>
          )}
          <span className="font-display text-xl font-bold text-foreground">
            {isM2 ? `a partir de ${formatBRL(finalPrice)}/m²` : formatBRL(finalPrice)}
          </span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">ou em até 6× sem juros</span>
        </div>
      </div>
    </Link>
  );
}
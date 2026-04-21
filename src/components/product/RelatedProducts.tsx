import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const BRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Mini = {
  id: string;
  name: string;
  slug: string;
  cover_image: string | null;
  price_per_sqm: number;
  short_description: string | null;
};

export function RelatedProducts({ categoryId, excludeId }: { categoryId: string | null; excludeId: string }) {
  const [items, setItems] = useState<Mini[]>([]);

  useEffect(() => {
    let mounted = true;
    let q = supabase
      .from("products")
      .select("id,name,slug,cover_image,price_per_sqm,short_description")
      .eq("active", true)
      .neq("id", excludeId)
      .limit(4);
    if (categoryId) q = q.eq("category_id", categoryId);
    q.then(({ data }) => {
      if (mounted && data) setItems(data as Mini[]);
    });
    return () => {
      mounted = false;
    };
  }, [categoryId, excludeId]);

  if (!items.length) return null;

  return (
    <section className="container-premium py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Você também pode gostar</span>
          <h2 className="font-display text-3xl lg:text-4xl mt-2">Produtos relacionados</h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((p) => (
          <Link
            key={p.id}
            to="/produto/$slug"
            params={{ slug: p.slug }}
            className="group rounded-2xl overflow-hidden bg-card border shadow-card hover:shadow-lg transition"
          >
            <div className="aspect-square overflow-hidden bg-sand">
              <img
                src={p.cover_image ?? "/placeholder.svg"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-premium"
              />
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg leading-tight group-hover:text-primary transition">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.short_description}</p>
              <div className="mt-3 text-sm">
                <span className="text-muted-foreground">a partir de </span>
                <strong>{BRL(p.price_per_sqm)}</strong>
                <span className="text-muted-foreground"> /m²</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

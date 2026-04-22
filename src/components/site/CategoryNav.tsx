// Mega Menu dinâmico — usa categorias do banco com show_in_menu=true.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Cat = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  show_in_menu: boolean | null;
  position: number;
};

export function CategoryNav() {
  const { data: cats = [] } = useQuery({
    queryKey: ["nav-cats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,parent_id,icon,show_in_menu,position")
        .eq("active", true)
        .order("position");
      return (data ?? []) as Cat[];
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const roots = cats.filter((c) => !c.parent_id && c.show_in_menu !== false);
  const childrenOf = (id: string) =>
    cats.filter((c) => c.parent_id === id && c.show_in_menu !== false);

  if (roots.length === 0) return null;

  return (
    <nav className="hidden border-t border-border/60 bg-background lg:block">
      <div className="container-premium">
        <ul className="flex h-14 items-center gap-1 overflow-x-auto">
          {roots.map((cat) => {
            const subs = childrenOf(cat.id);
            return (
              <li key={cat.id} className="group relative shrink-0">
                <Link
                  to="/catalogo"
                  search={{ categoria: cat.slug }}
                  className="inline-flex h-14 items-center gap-1.5 px-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:text-primary"
                >
                  {cat.icon && <span className="text-base">{cat.icon}</span>}
                  {cat.name}
                  {subs.length > 0 && (
                    <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:rotate-180" />
                  )}
                </Link>
                {subs.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-0 opacity-0 transition-all duration-200 ease-premium group-hover:visible group-hover:opacity-100">
                    <div
                      className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
                      style={{ minWidth: 260 }}
                    >
                      <div className="p-4">
                        {/* Categoria pai destacada */}
                        <Link
                          to="/catalogo"
                          search={{ categoria: cat.slug }}
                          className="block rounded-md px-3 py-2 mb-2 bg-primary/10 text-primary font-bold text-[13px] uppercase tracking-wider hover:bg-primary/15 transition"
                        >
                          Ver tudo de {cat.name}
                        </Link>
                        <ul className="space-y-0.5">
                          {subs.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to="/catalogo"
                                search={{ categoria: sub.slug }}
                                className="block rounded-md px-3 py-1.5 text-sm text-foreground/85 transition hover:bg-secondary hover:text-foreground"
                              >
                                {sub.icon && <span className="mr-2">{sub.icon}</span>}
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          <li className="ml-auto">
            <Link
              to="/catalogo"
              className="inline-flex h-14 items-center gap-1.5 px-3 text-[12px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#B8541C" }}
            >
              Ofertas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

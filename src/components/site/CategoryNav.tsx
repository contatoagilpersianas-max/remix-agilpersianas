// Mega Menu dinâmico — usa categorias do banco com show_in_menu=true.
// Suporta hover (desktop) E clique (mobile/touch) para abrir submenus.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!openId) return;
    function onDoc(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openId]);

  if (roots.length === 0) return null;

  return (
    <nav ref={navRef} className="hidden border-t border-border/60 bg-background lg:block">
      <div className="container-premium">
        <ul className="flex h-14 items-center gap-1 overflow-x-auto">
          {roots.map((cat) => {
            const subs = childrenOf(cat.id);
            const isOpen = openId === cat.id;
            const hasSubs = subs.length > 0;
            return (
              <li
                key={cat.id}
                className="group relative shrink-0"
                onMouseEnter={() => hasSubs && setOpenId(cat.id)}
                onMouseLeave={() => setOpenId((cur) => (cur === cat.id ? null : cur))}
              >
                {hasSubs ? (
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : cat.id)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className="inline-flex h-14 items-center gap-1.5 px-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:text-primary"
                  >
                    {cat.icon && <span className="text-base">{cat.icon}</span>}
                    {cat.name}
                    <ChevronDown
                      className={`h-3 w-3 opacity-60 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    to="/catalogo"
                    search={{ categoria: cat.slug }}
                    className="inline-flex h-14 items-center gap-1.5 px-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:text-primary"
                  >
                    {cat.icon && <span className="text-base">{cat.icon}</span>}
                    {cat.name}
                  </Link>
                )}

                {hasSubs && (
                  <div
                    className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-0 transition-all duration-200 ease-premium ${
                      isOpen ? "visible opacity-100" : "invisible opacity-0"
                    }`}
                  >
                    <div
                      className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
                      style={{ minWidth: 260 }}
                    >
                      <div className="p-4">
                        {/* Categoria pai destacada */}
                        <Link
                          to="/catalogo"
                          search={{ categoria: cat.slug }}
                          onClick={() => setOpenId(null)}
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
                                onClick={() => setOpenId(null)}
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

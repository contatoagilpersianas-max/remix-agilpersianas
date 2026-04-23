// Mega Menu dinâmico — usa categorias do banco com show_in_menu=true.
// Suporta hover (desktop) E clique (mobile/touch) para abrir submenus.
// Usa delay no fechamento para evitar flicker ao mover o mouse para o submenu.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Cat = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  show_in_menu: boolean | null;
  position: number;
  bestseller?: boolean | null;
};

export function CategoryNav() {
  const { data: cats = [] } = useQuery({
    queryKey: ["nav-cats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,parent_id,icon,show_in_menu,position,active,bestseller")
        .eq("active", true)
        .order("position");
      return (data ?? []) as Cat[];
    },
    staleTime: 30_000,
    refetchOnMount: "always",
  });

  const visibleCats = useMemo(() => cats.filter((c) => c.show_in_menu !== false), [cats]);
  const roots = useMemo(() => visibleCats.filter((c) => !c.parent_id), [visibleCats]);
  const childrenOf = (id: string) => visibleCats.filter((c) => c.parent_id === id);

  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), 180);
  };
  const openNow = (id: string) => {
    cancelClose();
    setOpenId(id);
  };

  // Fecha ao clicar fora / ESC
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

  useEffect(() => () => cancelClose(), []);

  if (roots.length === 0) return null;

  return (
    <nav ref={navRef} className="hidden border-t border-border/60 bg-background lg:block">
      <div className="container-premium">
        <ul className="flex min-h-14 items-center gap-1 overflow-x-auto no-scrollbar">
          {roots.map((cat) => {
            const subs = childrenOf(cat.id);
            const isOpen = openId === cat.id;
            const hasSubs = subs.length > 0;
            return (
              <li
                key={cat.id}
                className="relative shrink-0"
                onMouseEnter={() => hasSubs && openNow(cat.id)}
                onMouseLeave={() => hasSubs && scheduleClose()}
              >
                {hasSubs ? (
                  <button
                    type="button"
                    onClick={() => (isOpen ? setOpenId(null) : openNow(cat.id))}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className={`inline-flex h-14 items-center gap-1.5 rounded-t-md px-4 text-[12px] font-semibold uppercase tracking-[0.12em] transition hover:text-primary ${
                      isOpen ? "bg-secondary text-primary" : "text-foreground"
                    }`}
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
                    className="inline-flex h-14 items-center gap-1.5 px-4 text-[12px] font-semibold uppercase tracking-[0.12em] transition hover:text-primary"
                  >
                    {cat.icon && <span className="text-base">{cat.icon}</span>}
                    {cat.name}
                  </Link>
                )}

                {hasSubs && isOpen && (
                  <div
                    className="absolute left-0 top-full z-50 w-[360px]"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div
                      className="overflow-hidden rounded-b-xl rounded-tr-xl border border-border bg-popover shadow-2xl animate-in fade-in slide-in-from-top-1"
                    >
                      <div className="p-3">
                        <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                          {subs.map((sub) => {
                            const grand = childrenOf(sub.id);
                            return (
                              <li key={sub.id} className="rounded-lg bg-secondary/45 px-3 py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <Link
                                    to="/catalogo"
                                    search={{ categoria: sub.slug }}
                                    onClick={() => setOpenId(null)}
                                    className="min-w-0 text-base font-medium text-foreground transition hover:text-primary"
                                  >
                                    {sub.icon && <span className="mr-2">{sub.icon}</span>}
                                    {sub.name}
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => setOpenId(isOpen ? null : cat.id)}
                                    aria-label={`Abrir ${sub.name}`}
                                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-primary shadow-sm"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                </div>
                                {grand.length > 0 && (
                                  <ul className="mt-3 space-y-1 border-l border-border/60 pl-3">
                                    {grand.map((g) => (
                                      <li key={g.id}>
                                        <Link
                                          to="/catalogo"
                                          search={{ categoria: g.slug }}
                                          onClick={() => setOpenId(null)}
                                          className="block rounded-md px-2 py-1.5 text-sm text-foreground/80 transition hover:bg-background hover:text-foreground"
                                        >
                                          {g.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                          <li>
                            <Link
                              to="/catalogo"
                              search={{ categoria: cat.slug }}
                              onClick={() => setOpenId(null)}
                              className="block rounded-lg border border-dashed border-primary/30 px-3 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
                            >
                              Ver todos de {cat.name}
                            </Link>
                          </li>
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
              search={{ destaque: "mais-vendidos" }}
              className="inline-flex h-14 items-center gap-1.5 px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-primary"
            >
              Mais vendidos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

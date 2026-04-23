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
};

export function CategoryNav() {
  const { data: cats = [] } = useQuery({
    queryKey: ["nav-cats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,parent_id,icon,show_in_menu,position,active")
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
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
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

  const openCat = useMemo(() => roots.find((cat) => cat.id === openId) ?? null, [roots, openId]);
  const openSubs = openCat ? childrenOf(openCat.id) : [];

  useEffect(() => {
    if (!openCat) {
      setExpandedSubId(null);
      return;
    }

    const withChildren = openSubs.find((sub) => childrenOf(sub.id).length > 0);
    setExpandedSubId((prev) => {
      if (prev && openSubs.some((sub) => sub.id === prev)) return prev;
      return withChildren?.id ?? null;
    });
  }, [openCat, openSubs]);

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
    <nav
      ref={navRef}
      className="hidden border-t border-border/60 bg-background lg:block"
      onMouseEnter={cancelClose}
      onMouseLeave={() => openId && scheduleClose()}
    >
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

              </li>
            );
          })}
          <li className="ml-auto">
            <Link
              to="/catalogo"
              search={{ q: "" }}
              className="inline-flex h-14 items-center gap-1.5 px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-primary"
            >
              Mais vendidos
            </Link>
          </li>
        </ul>
      </div>

      {openCat && (
        <div
          className="border-t border-border/60 bg-secondary/25"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="container-premium py-4">
            <div className="max-w-2xl space-y-2 animate-in fade-in slide-in-from-top-1">
              {openSubs.map((sub) => {
                const grand = childrenOf(sub.id);
                const isExpanded = expandedSubId === sub.id;

                return (
                  <div key={sub.id} className="rounded-xl bg-background p-2 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        to="/catalogo"
                        search={{ categoria: sub.slug }}
                        onClick={() => setOpenId(null)}
                        className="min-w-0 flex-1 rounded-lg px-4 py-3 text-left text-[15px] font-medium text-foreground transition hover:bg-secondary hover:text-primary"
                      >
                        {sub.icon && <span className="mr-2">{sub.icon}</span>}
                        {sub.name}
                      </Link>

                      {grand.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setExpandedSubId((prev) => (prev === sub.id ? null : sub.id))}
                          aria-expanded={isExpanded}
                          aria-label={`Abrir submenu de ${sub.name}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition hover:bg-primary/10"
                        >
                          <ChevronDown className={`h-4 w-4 transition ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      ) : (
                        <Link
                          to="/catalogo"
                          search={{ categoria: sub.slug }}
                          onClick={() => setOpenId(null)}
                          aria-label={`Ver ${sub.name}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition hover:bg-primary/10"
                        >
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Link>
                      )}
                    </div>

                    {grand.length > 0 && isExpanded && (
                      <div className="border-t border-border/60 px-2 pb-2 pt-3">
                        <ul className="space-y-1">
                          {grand.map((g) => (
                            <li key={g.id}>
                              <Link
                                to="/catalogo"
                                search={{ categoria: g.slug }}
                                onClick={() => setOpenId(null)}
                                className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition hover:bg-secondary hover:text-foreground"
                              >
                                {g.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                to="/catalogo"
                search={{ categoria: openCat.slug }}
                onClick={() => setOpenId(null)}
                className="inline-flex rounded-lg px-2 py-1 text-sm font-semibold text-primary transition hover:underline"
              >
                Ver tudo de {openCat.name}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Mega Menu profissional — estilo Hunter Douglas / Amazon.
// - Dropdown flutuante, posicionado abaixo do item ativo (não ocupa a página inteira).
// - Largura compacta com colunas (sub + grand-children visíveis lado a lado).
// - Hover (desktop) com delay anti-flicker + clique (mobile).
// - Não empurra o conteúdo da página: usa `absolute` sobre overlay.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  const [hoverSubId, setHoverSubId] = useState<string | null>(null);
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
    closeTimer.current = setTimeout(() => setOpenId(null), 160);
  };
  const openNow = (id: string) => {
    cancelClose();
    setOpenId(id);
    setHoverSubId(null);
  };

  const openCat = useMemo(() => roots.find((cat) => cat.id === openId) ?? null, [roots, openId]);
  const openSubs = openCat ? childrenOf(openCat.id) : [];
  const activeSub = hoverSubId
    ? openSubs.find((s) => s.id === hoverSubId)
    : openSubs.find((s) => childrenOf(s.id).length > 0) ?? null;
  const grand = activeSub ? childrenOf(activeSub.id) : [];

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
      className="relative border-t border-border/60 bg-background"
      onMouseLeave={() => openId && scheduleClose()}
      onMouseEnter={cancelClose}
    >
      <div className="container-premium">
        <ul className="flex min-h-12 items-center gap-0.5 overflow-x-auto no-scrollbar">
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
                    className={`relative inline-flex h-12 items-center gap-1.5 px-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition hover:text-primary ${
                      isOpen ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {cat.icon && <span className="text-base">{cat.icon}</span>}
                    {cat.name}
                    <ChevronDown
                      className={`h-3 w-3 opacity-60 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                    {isOpen && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />
                    )}
                  </button>
                ) : (
                  <Link
                    to="/catalogo"
                    search={{ categoria: cat.slug }}
                    className="inline-flex h-12 items-center gap-1.5 px-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition hover:text-primary"
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
              className="inline-flex h-12 items-center gap-1.5 px-3.5 text-[12px] font-bold uppercase tracking-[0.1em] text-primary"
            >
              Mais vendidos
            </Link>
          </li>
        </ul>
      </div>

      {/* Mega menu flutuante — não empurra a página */}
      {openCat && openSubs.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 border-t border-border/60 bg-background shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="container-premium py-6">
            <div className={`grid gap-8 ${grand.length > 0 ? "grid-cols-[260px_1fr]" : "grid-cols-1"}`}>
              {/* Coluna 1 — subcategorias */}
              <div>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {openCat.name}
                </div>
                <ul className="space-y-0.5">
                  {openSubs.map((sub) => {
                    const subGrand = childrenOf(sub.id);
                    const isActive = activeSub?.id === sub.id;
                    return (
                      <li key={sub.id}>
                        <Link
                          to="/catalogo"
                          search={{ categoria: sub.slug }}
                          onClick={() => setOpenId(null)}
                          onMouseEnter={() => subGrand.length > 0 && setHoverSubId(sub.id)}
                          className={`group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition ${
                            isActive
                              ? "bg-secondary text-primary"
                              : "text-foreground hover:bg-secondary hover:text-primary"
                          }`}
                        >
                          <span className="truncate">
                            {sub.icon && <span className="mr-1.5">{sub.icon}</span>}
                            {sub.name}
                          </span>
                          {subGrand.length > 0 && (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to="/catalogo"
                  search={{ categoria: openCat.slug }}
                  onClick={() => setOpenId(null)}
                  className="mt-3 inline-flex items-center gap-1 px-3 text-xs font-semibold text-primary hover:underline"
                >
                  Ver tudo de {openCat.name}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Coluna 2 — modelos do submenu ativo */}
              {grand.length > 0 && activeSub && (
                <div className="border-l border-border/60 pl-8">
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {activeSub.name}
                  </div>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {grand.map((g) => (
                      <li key={g.id}>
                        <Link
                          to="/catalogo"
                          search={{ categoria: g.slug }}
                          onClick={() => setOpenId(null)}
                          className="block rounded-md px-2 py-1.5 text-sm text-foreground/80 transition hover:bg-secondary hover:text-primary"
                        >
                          {g.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Mega Menu profissional — estilo Hunter Douglas / Amazon.
// - Dropdown flutuante alinhado à coluna ativa.
// - Hover (desktop) com delay anti-flicker; clique (mobile) abre/fecha.
// - Altura limitada (max-h) com scroll interno para telas pequenas.
// - Navegação por teclado: Tab, Enter, Esc, Setas (← →) entre raízes.
// - aria-expanded e aria-haspopup corretos.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();
  const visibleCats = useMemo(() => cats.filter((c) => c.show_in_menu !== false), [cats]);
  const roots = useMemo(() => visibleCats.filter((c) => !c.parent_id), [visibleCats]);
  const childrenOf = (id: string) => visibleCats.filter((c) => c.parent_id === id);

  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverSubId, setHoverSubId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
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
    setHoverSubId(null);
  };
  const closeAll = () => {
    cancelClose();
    setOpenId(null);
    setHoverSubId(null);
  };

  const openCat = useMemo(() => roots.find((c) => c.id === openId) ?? null, [roots, openId]);
  const openSubs = openCat ? childrenOf(openCat.id) : [];
  const activeSub = hoverSubId
    ? openSubs.find((s) => s.id === hoverSubId)
    : openSubs.find((s) => childrenOf(s.id).length > 0) ?? null;
  const grand = activeSub ? childrenOf(activeSub.id) : [];

  // Fecha ao clicar fora / ESC
  useEffect(() => {
    if (!openId) return;
    function onDoc(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) closeAll();
    }
    function onEsc(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        closeAll();
        triggerRefs.current.get(openId!)?.focus();
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openId]);

  // Bloqueia scroll do body quando o mega menu está aberto no mobile
  useEffect(() => {
    if (openId && isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openId, isMobile]);

  useEffect(() => () => cancelClose(), []);

  if (roots.length === 0) return null;

  // Setas para navegar entre triggers raiz
  const handleRootKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number, hasSubs: boolean) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = roots[(idx + dir + roots.length) % roots.length];
      triggerRefs.current.get(next.id)?.focus();
    } else if (e.key === "ArrowDown" && hasSubs) {
      e.preventDefault();
      openNow(roots[idx].id);
      // Move foco para o primeiro link do submenu logo após render
      setTimeout(() => {
        const first = navRef.current?.querySelector<HTMLAnchorElement>("[data-mega-link]");
        first?.focus();
      }, 30);
    }
  };

  return (
    <nav
      ref={navRef}
      className="relative border-t border-border/60 bg-background"
      onMouseLeave={() => openId && !isMobile && scheduleClose()}
      onMouseEnter={cancelClose}
      aria-label="Categorias"
    >
      <div className="container-premium">
        <ul className="flex min-h-12 items-center gap-0.5 overflow-x-auto no-scrollbar">
          {roots.map((cat, idx) => {
            const subs = childrenOf(cat.id);
            const isOpen = openId === cat.id;
            const hasSubs = subs.length > 0;
            return (
              <li
                key={cat.id}
                className="relative shrink-0"
                onMouseEnter={() => !isMobile && hasSubs && openNow(cat.id)}
              >
                {hasSubs ? (
                  <button
                    ref={(el) => {
                      if (el) triggerRefs.current.set(cat.id, el);
                      else triggerRefs.current.delete(cat.id);
                    }}
                    type="button"
                    onClick={() => (isOpen ? closeAll() : openNow(cat.id))}
                    onKeyDown={(e) => handleRootKey(e, idx, hasSubs)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-controls={isOpen ? `megamenu-${cat.id}` : undefined}
                    className={`relative inline-flex h-12 items-center gap-1.5 px-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition hover:text-primary focus-visible:text-primary focus-visible:outline-none ${
                      isOpen ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {cat.icon && <span className="text-base" aria-hidden>{cat.icon}</span>}
                    {cat.name}
                    <ChevronDown
                      className={`h-3 w-3 opacity-60 transition ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                    {isOpen && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" aria-hidden />
                    )}
                  </button>
                ) : (
                  <Link
                    to="/catalogo"
                    search={{ categoria: cat.slug }}
                    className="inline-flex h-12 items-center gap-1.5 px-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                  >
                    {cat.icon && <span className="text-base" aria-hidden>{cat.icon}</span>}
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

      {/* Mega menu flutuante — não empurra a página, com altura controlada */}
      {openCat && openSubs.length > 0 && (
        <>
          {/* backdrop sutil para destacar do conteúdo */}
          <div
            className="fixed inset-x-0 bottom-0 top-[calc(var(--header-h,140px))] z-40 bg-foreground/10 backdrop-blur-[2px] animate-in fade-in duration-150"
            aria-hidden
            onClick={closeAll}
          />
          <div
            id={`megamenu-${openCat.id}`}
            role="region"
            aria-label={`Submenu ${openCat.name}`}
            className="absolute left-0 right-0 top-full z-50 border-t border-border/60 bg-background shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150"
            onMouseEnter={cancelClose}
            onMouseLeave={() => !isMobile && scheduleClose()}
          >
            <div className="container-premium">
              <div
                className={`grid gap-8 py-6 ${
                  grand.length > 0 ? "md:grid-cols-[260px_1fr]" : "grid-cols-1"
                } max-h-[min(70vh,560px)] overflow-y-auto`}
              >
                {/* Coluna 1 — subcategorias */}
                <div>
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {openCat.name}
                  </div>
                  <ul className="space-y-0.5" role="menu">
                    {openSubs.map((sub) => {
                      const subGrand = childrenOf(sub.id);
                      const isActive = activeSub?.id === sub.id;
                      return (
                        <li key={sub.id} role="none">
                          <Link
                            data-mega-link
                            to="/catalogo"
                            search={{ categoria: sub.slug }}
                            onClick={closeAll}
                            onMouseEnter={() => !isMobile && subGrand.length > 0 && setHoverSubId(sub.id)}
                            onFocus={() => subGrand.length > 0 && setHoverSubId(sub.id)}
                            role="menuitem"
                            className={`group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                              isActive
                                ? "bg-secondary text-primary"
                                : "text-foreground hover:bg-secondary hover:text-primary"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-1.5 truncate">
                              {sub.icon && <span aria-hidden>{sub.icon}</span>}
                              <span className="truncate">{sub.name}</span>
                            </span>
                            {subGrand.length > 0 && (
                              <ChevronRight
                                className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100"
                                aria-hidden
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to="/catalogo"
                    search={{ categoria: openCat.slug }}
                    onClick={closeAll}
                    className="mt-3 inline-flex items-center gap-1 px-3 text-xs font-semibold text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    Ver tudo de {openCat.name}
                    <ChevronRight className="h-3 w-3" aria-hidden />
                  </Link>
                </div>

                {/* Coluna 2 — modelos do submenu ativo */}
                {grand.length > 0 && activeSub && (
                  <div className="md:border-l md:border-border/60 md:pl-8">
                    <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {activeSub.name}
                    </div>
                    <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                      {grand.map((g) => (
                        <li key={g.id}>
                          <Link
                            to="/catalogo"
                            search={{ categoria: g.slug }}
                            onClick={closeAll}
                            className="block truncate rounded-md px-2 py-1.5 text-sm text-foreground/80 transition hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none"
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
        </>
      )}
    </nav>
  );
}

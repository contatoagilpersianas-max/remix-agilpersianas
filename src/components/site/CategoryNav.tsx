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
      className="relative bg-background"
      onMouseLeave={() => openId && !isMobile && scheduleClose()}
      onMouseEnter={cancelClose}
      aria-label="Categorias"
    >
      <div className="container-premium">
        <ul className="flex min-h-12 items-center justify-between gap-1 overflow-x-auto no-scrollbar">
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
                    className={`relative inline-flex h-12 items-center gap-1.5 px-4 text-[12px] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none ${
                      isOpen ? "text-primary" : "text-foreground/85 hover:text-primary"
                    }`}
                  >
                    {cat.name}
                    <ChevronDown
                      className={`h-3 w-3 opacity-50 transition ${isOpen ? "rotate-180 opacity-100" : ""}`}
                      aria-hidden
                    />
                    {isOpen && (
                      <span className="absolute inset-x-3 -bottom-px h-[2px] bg-primary" aria-hidden />
                    )}
                  </button>
                ) : (
                  <Link
                    to="/catalogo"
                    search={{ categoria: cat.slug }}
                    className="inline-flex h-12 items-center gap-1.5 px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground/85 transition hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                  >
                    {cat.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mega menu clean — painel branco simples, sem backdrop pesado */}
      {openCat && openSubs.length > 0 && (
        <div
          id={`megamenu-${openCat.id}`}
          role="region"
          aria-label={`Submenu ${openCat.name}`}
          className="absolute left-0 right-0 top-full z-50 border-t border-border/60 bg-background shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={cancelClose}
          onMouseLeave={() => !isMobile && scheduleClose()}
        >
          <div className="container-premium">
            <div className="grid gap-x-10 gap-y-6 py-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-h-[min(70vh,520px)] overflow-y-auto">
              {openSubs.map((sub) => {
                const subGrand = childrenOf(sub.id);
                return (
                  <div key={sub.id} className="min-w-0">
                    {/* Header laranja em maiúsculas — estilo imagem de referência */}
                    <Link
                      data-mega-link
                      to="/catalogo"
                      search={{ categoria: sub.slug }}
                      onClick={closeAll}
                      className="block text-[11px] font-bold uppercase tracking-[0.16em] text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {sub.name}
                    </Link>
                    <ul className="mt-3 space-y-1.5">
                      {subGrand.length > 0 ? (
                        subGrand.map((g) => (
                          <li key={g.id}>
                            <Link
                              to="/catalogo"
                              search={{ categoria: g.slug }}
                              onClick={closeAll}
                              className="block truncate text-[14px] text-foreground/85 transition hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                            >
                              {g.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link
                            to="/catalogo"
                            search={{ categoria: sub.slug }}
                            onClick={closeAll}
                            className="block truncate text-[14px] text-foreground/85 transition hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border/60 py-3 text-right">
              <Link
                to="/catalogo"
                search={{ categoria: openCat.slug }}
                onClick={closeAll}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary hover:underline"
              >
                Ver tudo de {openCat.name}
                <ChevronRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

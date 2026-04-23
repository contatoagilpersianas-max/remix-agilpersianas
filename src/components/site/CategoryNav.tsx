// Mega Menu dinâmico — usa categorias do banco com show_in_menu=true.
// Suporta hover (desktop) E clique (mobile/touch) para abrir submenus.
// Usa delay no fechamento para evitar flicker ao mover o mouse para o submenu.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_CATALOG_SETTINGS,
  getCatalogOrderColumns,
  normalizeCatalogSettings,
} from "@/lib/catalog";

type Cat = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  show_in_menu: boolean | null;
  position: number;
  bestseller: boolean;
};

export function CategoryNav() {
  const { data } = useQuery({
    queryKey: ["nav-cats"],
    queryFn: async () => {
      const [{ data: categoryRows }, { data: catalogSettingsRow }] = await Promise.all([
        supabase
          .from("categories")
          .select("id,name,slug,parent_id,icon,show_in_menu,position,active,bestseller")
          .eq("active", true)
          .order("position"),
        supabase.from("site_settings").select("value").eq("key", "catalog_settings").maybeSingle(),
      ]);

      return {
        cats: (categoryRows ?? []) as Cat[],
        catalogSettings: normalizeCatalogSettings(catalogSettingsRow?.value),
      };
    },
    staleTime: 30_000,
    refetchOnMount: "always",
  });

  const cats = data?.cats ?? [];
  const catalogSettings = data?.catalogSettings ?? DEFAULT_CATALOG_SETTINGS;

  const visibleCats = useMemo(() => cats.filter((c) => c.show_in_menu !== false), [cats]);
  const roots = useMemo(() => visibleCats.filter((c) => !c.parent_id), [visibleCats]);
  const childrenOf = (id: string) => visibleCats.filter((c) => c.parent_id === id);

  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerType = useRef<"mouse" | "touch">("mouse");

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenId(null);
      setExpandedSubId(null);
    }, 220);
  };
  const openNow = (id: string) => {
    cancelClose();
    setOpenId(id);
  };
  const closeAll = () => {
    cancelClose();
    setOpenId(null);
    setMobileOpenId(null);
    setExpandedSubId(null);
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
    if (!openId && !mobileOpenId) return;
    function onDoc(e: Event) {
      if (!navRef.current?.contains(e.target as Node)) closeAll();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openId, mobileOpenId]);

  useEffect(() => () => cancelClose(), []);

  if (roots.length === 0) return null;

  return (
    <nav
      ref={navRef}
      className="hidden border-t border-border/60 bg-background lg:block"
      onPointerDown={(e) => {
        pointerType.current = e.pointerType === "touch" ? "touch" : "mouse";
      }}
      onMouseEnter={cancelClose}
      onMouseLeave={() => pointerType.current === "mouse" && openId && scheduleClose()}
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
                onMouseEnter={() => hasSubs && pointerType.current === "mouse" && openNow(cat.id)}
                onMouseLeave={() => hasSubs && pointerType.current === "mouse" && scheduleClose()}
              >
                {hasSubs ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (isOpen) {
                        closeAll();
                        return;
                      }
                      openNow(cat.id);
                      setMobileOpenId(cat.id);
                    }}
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
                    onClick={closeAll}
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
              search={{ q: "", bestseller: "1" }}
              className="inline-flex h-14 items-center gap-1.5 px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-primary"
              title={`Ordenação: ${getCatalogOrderColumns(catalogSettings).join(" → ")}`}
            >
              Mais vendidos
            </Link>
          </li>
        </ul>
      </div>

      {openCat && (
        <div
          ref={panelRef}
          className="border-t border-border/60 bg-secondary/25"
          onMouseEnter={cancelClose}
          onMouseLeave={() => pointerType.current === "mouse" && scheduleClose()}
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
                          onClick={closeAll}
                        className="min-w-0 flex-1 rounded-lg px-4 py-3 text-left text-[15px] font-medium text-foreground transition hover:bg-secondary hover:text-primary"
                      >
                        {sub.icon && <span className="mr-2">{sub.icon}</span>}
                        {sub.name}
                      </Link>

                      {grand.length > 0 ? (
                        <button
                          type="button"
                            onClick={() => setExpandedSubId((prev) => (prev === sub.id ? null : sub.id))}
                            onMouseEnter={() => pointerType.current === "mouse" && setExpandedSubId(sub.id)}
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
                          onClick={closeAll}
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
                                onClick={closeAll}
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
                onClick={closeAll}
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

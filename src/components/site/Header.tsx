import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, User, ShoppingCart, Menu, X, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import logoAgil from "@/assets/agil-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/site-config";

type Cat = { id: string; name: string; slug: string; parent_id: string | null; show_in_menu: boolean | null };

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen, hydrated } = useCart();

  const { data: cats = [] } = useQuery({
    queryKey: ["mobile-cats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,parent_id,show_in_menu")
        .eq("active", true)
        .order("position");
      return (data ?? []) as Cat[];
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const mobileLinks = cats.filter((c) => c.show_in_menu !== false);

  return (
    <header className="bg-background/95 backdrop-blur-lg border-b border-border/60">
      <div className="container-premium grid h-[72px] md:h-[84px] grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
        {/* Logo premium com tagline */}
        <Link to="/" className="group flex items-center gap-3 shrink-0" aria-label="Ágil Persianas — Persianas sob medida">
          <span className="relative flex items-center">
            <span
              aria-hidden
              className="absolute -inset-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(closest-side, oklch(0.78 0.17 55 / 0.18), transparent)" }}
            />
            <img
              src={logoAgil}
              alt="Ágil Persianas"
              className="relative h-10 md:h-12 w-auto select-none transition-transform duration-300 group-hover:scale-[1.03]"
              draggable={false}
            />
          </span>
          <span className="hidden xl:flex flex-col leading-[1.05]">
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary">Desde 1998</span>
            <span className="text-[10px] font-medium text-muted-foreground">Persianas sob medida</span>
          </span>
        </Link>

        {/* Busca central */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.querySelector('input[type="search"]') as HTMLInputElement)?.value;
            if (q) window.location.assign(`/catalogo?q=${encodeURIComponent(q)}`);
          }}
          className="hidden md:flex items-center h-12 w-full max-w-2xl mx-auto rounded-full border border-border bg-secondary/30 pl-5 pr-1.5 transition-all duration-300 focus-within:border-primary focus-within:bg-background focus-within:shadow-[0_0_0_4px_oklch(0.68_0.19_45/0.08)]"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="search"
            placeholder="O que você procura? Ex: persiana rolô blackout"
            className="flex-1 bg-transparent px-3 text-[13.5px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="hidden md:inline-flex h-9 items-center rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-glow transition hover:-translate-y-px"
          >
            Buscar
          </button>
        </form>

        {/* Ações */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* CTA WhatsApp pequeno (lg+) */}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex h-10 items-center gap-1.5 rounded-full border border-whatsapp/30 bg-whatsapp/5 px-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-whatsapp transition hover:bg-whatsapp hover:text-whatsapp-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Orçamento
          </a>
          <button
            aria-label="Favoritos"
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-secondary/60 hover:text-primary"
          >
            <Heart className="h-5 w-5" />
          </button>
          <Link
            to="/auth"
            aria-label="Minha conta"
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-secondary/60 hover:text-primary"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Carrinho — estilo "Ver Carrinho" com badge vermelha */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Ver carrinho"
            className="group inline-flex items-center gap-2.5 rounded-full px-2 py-1.5 transition hover:bg-secondary/60"
          >
            <span className="relative inline-flex">
              <ShoppingCart className="h-7 w-7 text-foreground" strokeWidth={1.75} />
              <span
                className={`absolute -top-1.5 -right-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E11D2E] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-background transition-opacity ${
                  hydrated ? "opacity-100" : "opacity-60 animate-pulse"
                }`}
                aria-live="polite"
                title={hydrated ? `${count} item(s) no carrinho` : "Carregando carrinho…"}
              >
                {hydrated ? count : "·"}
              </span>
            </span>
            <span className="hidden sm:flex flex-col items-start leading-[1.05] text-foreground">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Ver</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Carrinho</span>
            </span>
          </button>

          <button
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Busca mobile */}
      <div className="md:hidden border-t border-border/60 bg-background px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.querySelector('input[type="search"]') as HTMLInputElement)?.value;
            if (q) window.location.assign(`/catalogo?q=${encodeURIComponent(q)}`);
          }}
          className="flex items-center h-11 rounded-full border border-border bg-secondary/40 px-4"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="search"
            placeholder="O que você procura?"
            className="flex-1 bg-transparent px-3 text-sm outline-none"
          />
        </form>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-premium space-y-1 py-3 max-h-[70vh] overflow-y-auto">
            {mobileLinks.map((item) => (
              <Link
                key={item.id}
                to="/catalogo"
                search={{ categoria: item.slug }}
                className={`block rounded-md px-3 py-2.5 text-sm hover:bg-secondary ${
                  !item.parent_id
                    ? "font-bold text-primary uppercase tracking-wider"
                    : "font-medium text-foreground/85 pl-6"
                }`}
                onClick={() => setOpen(false)}
              >
                {!item.parent_id ? item.name : `↳ ${item.name}`}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex h-11 items-center justify-center rounded-full px-6 text-[12px] font-bold uppercase tracking-[0.14em] text-white shadow-lg"
              style={{ backgroundColor: "#F57C00" }}
            >
              Solicitar orçamento
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

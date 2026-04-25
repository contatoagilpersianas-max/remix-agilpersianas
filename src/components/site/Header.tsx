import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, User, ShoppingCart, Menu, X, Heart } from "lucide-react";
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
      <div className="container-premium grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" aria-label="Ágil Persianas">
          <img
            src={logoAgil}
            alt="Ágil Persianas"
            className="h-9 md:h-11 w-auto select-none"
            draggable={false}
          />
        </Link>

        {/* Busca central */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.querySelector('input[type="search"]') as HTMLInputElement)?.value;
            if (q) window.location.assign(`/catalogo?q=${encodeURIComponent(q)}`);
          }}
          className="hidden md:flex items-center h-12 w-full max-w-2xl mx-auto rounded-full border border-border bg-secondary/40 px-5 transition focus-within:border-primary focus-within:bg-background"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="search"
            placeholder="O que você procura? Ex: persiana rolô blackout"
            className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="hidden md:inline-flex h-9 items-center rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ backgroundColor: "#F57C00" }}
          >
            Buscar
          </button>
        </form>

        {/* Ações */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            aria-label="Favoritos"
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:text-primary transition"
          >
            <Heart className="h-5 w-5" />
          </button>
          <Link
            to="/auth"
            aria-label="Minha conta"
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:text-primary transition"
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

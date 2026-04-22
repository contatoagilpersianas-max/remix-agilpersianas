import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState } from "react";

const MOBILE_LINKS = [
  "Rolô", "Romana", "Double Vision", "Painel", "Horizontal", "Vertical",
  "Tela Mosquiteira", "Toldos", "Automação", "Ambientes", "Ofertas",
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/60">
      <div className="container-premium grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-md font-display text-xl font-bold shadow-md"
            style={{ backgroundColor: "#F57C00", color: "#fff" }}
          >
            Á
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
              ágil <span style={{ color: "#F57C00" }}>Persianas</span>
            </span>
            <span className="mt-0.5 text-[9px] md:text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Conforto sob medida
            </span>
          </div>
        </Link>

        {/* Busca central */}
        <form
          onSubmit={(e) => e.preventDefault()}
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
        <div className="flex items-center gap-1 md:gap-2">
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
          <button
            aria-label="Carrinho"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-4 md:px-5 text-[12px] font-bold uppercase tracking-[0.14em] text-background transition hover:bg-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            <span
              className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{ backgroundColor: "#F57C00", color: "#fff" }}
            >
              0
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
          onSubmit={(e) => e.preventDefault()}
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
          <div className="container-premium space-y-1 py-3">
            {MOBILE_LINKS.map((item) => (
              <Link
                key={item}
                to="/"
                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-foreground/85 hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            ))}
            <a
              href="https://wa.me/5511999999999"
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

import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { CategoryNav } from "./CategoryNav";

const NAV = [
  { label: "Romana", href: "/" },
  { label: "Double Vision", href: "/" },
  { label: "Painel", href: "/" },
  { label: "Horizontal", href: "/" },
  { label: "Vertical", href: "/" },
  { label: "Tela Mosquiteira", href: "/" },
  { label: "Toldos", href: "/" },
  { label: "Ambientes", href: "/" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/85 border-b border-border/60">
      <div className="container-premium grid h-20 grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10">
        {/* Logo — estilo Á ágil PERSIANAS */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-4xl font-bold leading-none text-primary">Á</span>
          <div className="leading-none">
            <div className="font-display text-2xl font-bold tracking-tight">
              ágil
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/70 mt-0.5">
              Persianas
            </div>
          </div>
        </Link>

        {/* Search central */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="O que você procura?"
            className="h-11 w-full rounded-full border border-border bg-secondary/50 pl-12 pr-12 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
          />
          <button
            aria-label="Buscar"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background transition hover:bg-primary"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            to="/auth"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-secondary hover:text-foreground md:flex"
            aria-label="Conta"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            aria-label="Carrinho"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-secondary hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
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

      {/* Categories nav */}
      <CategoryNav />

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-premium space-y-1 py-3">
            <div className="relative pb-2 md:hidden">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar produtos…"
                className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-3 text-sm outline-none"
              />
            </div>
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground/80 hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

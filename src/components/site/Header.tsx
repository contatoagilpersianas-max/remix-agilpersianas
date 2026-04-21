import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { TopBar } from "./TopBar";

const NAV = [
  { label: "Persianas Rolô", href: "/" },
  { label: "Romana", href: "/" },
  { label: "Double Vision", href: "/" },
  { label: "Painel", href: "/" },
  { label: "Horizontais", href: "/" },
  { label: "Verticais", href: "/" },
  { label: "Toldos", href: "/" },
  { label: "Ambientes", href: "/" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 border-b border-border/60">
      <TopBar />
      <div className="container-premium flex h-20 items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <span className="font-display text-xl font-bold">Á</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold tracking-tight">
              Ágil <span className="text-primary">Persianas</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Conforto sob medida
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="relative hidden flex-1 lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="O que você procura? Ex: persiana rolô blackout"
            className="h-11 w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <button className="hidden h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground md:flex">
            <User className="h-5 w-5" />
          </button>
          <button className="relative flex h-10 items-center gap-2 rounded-full bg-graphite px-4 text-graphite-foreground transition hover:bg-graphite/90">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden text-sm font-medium md:inline">Carrinho</span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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
      <nav className="hidden border-t border-border/60 lg:block">
        <div className="container-premium">
          <ul className="flex h-12 items-center gap-1 overflow-x-auto no-scrollbar">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-foreground/70 transition hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                to="/"
                className="inline-flex h-9 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 text-xs font-semibold uppercase tracking-wider text-primary"
              >
                ⚡ Ofertas da semana
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-premium space-y-1 py-3">
            <div className="relative pb-2">
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
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
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

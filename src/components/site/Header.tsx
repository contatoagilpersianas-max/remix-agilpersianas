import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Rolô", href: "/" },
  { label: "Romana", href: "/" },
  { label: "Double Vision", href: "/" },
  { label: "Horizontal", href: "/" },
  { label: "Toldos", href: "/" },
  { label: "Ambientes", href: "/" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/60">
      <div className="container-premium grid h-20 grid-cols-[auto_1fr_auto] items-center gap-6">
        {/* Logo + tagline */}
        <Link to="/" className="flex flex-col leading-none shrink-0">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            Ágil <span className="text-primary">Persianas</span>
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Conforto sob medida
          </span>
        </Link>

        {/* Menu central */}
        <nav className="hidden lg:flex items-center justify-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-[13px] font-medium text-foreground/80 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA laranja */}
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/5511999999999?text=Olá!%20Quero%20um%20orçamento."
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground transition hover:opacity-90"
          >
            Solicitar orçamento
          </a>
          <button
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-premium space-y-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Solicitar orçamento
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

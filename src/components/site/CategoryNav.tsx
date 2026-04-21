import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

type SubItem = { label: string; href: string };
type Category = { label: string; href: string; columns?: { title: string; items: SubItem[] }[] };

const CATEGORIES: Category[] = [
  {
    label: "Rolô",
    href: "/",
    columns: [
      {
        title: "Por tecido",
        items: [
          { label: "Blackout 100%", href: "/" },
          { label: "Translúcida", href: "/" },
          { label: "Tela Solar", href: "/" },
          { label: "Voil / Linho", href: "/" },
        ],
      },
      {
        title: "Por acionamento",
        items: [
          { label: "Manual (Cordinha)", href: "/" },
          { label: "Motorizada FR", href: "/" },
          { label: "Motorizada Wi-Fi", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Romana",
    href: "/",
    columns: [
      {
        title: "Estilos",
        items: [
          { label: "Linho Cru", href: "/" },
          { label: "Algodão", href: "/" },
          { label: "Blackout Romana", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Double Vision",
    href: "/",
    columns: [
      {
        title: "Coleções",
        items: [
          { label: "Clássica", href: "/" },
          { label: "Premium", href: "/" },
          { label: "Blackout DV", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Painel",
    href: "/",
    columns: [
      {
        title: "Painel Japonês",
        items: [
          { label: "Tela Solar", href: "/" },
          { label: "Translúcido", href: "/" },
          { label: "Blackout", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Horizontal",
    href: "/",
    columns: [
      {
        title: "Material",
        items: [
          { label: "Madeira 50mm", href: "/" },
          { label: "Alumínio 25mm", href: "/" },
          { label: "PVC", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Vertical",
    href: "/",
    columns: [
      {
        title: "Modelos",
        items: [
          { label: "Tecido 89mm", href: "/" },
          { label: "PVC 89mm", href: "/" },
          { label: "Blackout Vertical", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Tela Mosquiteira",
    href: "/",
    columns: [
      {
        title: "Instalação",
        items: [
          { label: "Fixa", href: "/" },
          { label: "Retrátil", href: "/" },
          { label: "Magnética", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Toldos",
    href: "/",
    columns: [
      {
        title: "Tipos",
        items: [
          { label: "Articulado", href: "/" },
          { label: "Cortina", href: "/" },
          { label: "Retrátil", href: "/" },
        ],
      },
    ],
  },
  {
    label: "Ambientes",
    href: "/",
    columns: [
      {
        title: "Por cômodo",
        items: [
          { label: "Sala de Estar", href: "/" },
          { label: "Quarto", href: "/" },
          { label: "Escritório", href: "/" },
          { label: "Área Externa", href: "/" },
        ],
      },
    ],
  },
];

export function CategoryNav() {
  return (
    <nav className="hidden border-t border-border/60 bg-background lg:block">
      <div className="container-premium">
        <ul className="flex h-12 items-center justify-between gap-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.label} className="group relative">
              <Link
                to={cat.href}
                className="inline-flex h-12 items-center gap-1 px-3 text-[13px] font-bold uppercase tracking-[0.08em] text-foreground/85 transition hover:text-primary"
              >
                {cat.label}
                {cat.columns && (
                  <ChevronDown className="h-3.5 w-3.5 text-primary transition group-hover:rotate-180" />
                )}
              </Link>

              {/* Underline indicator */}
              <span className="pointer-events-none absolute inset-x-3 bottom-0 h-[3px] origin-left scale-x-0 rounded-t bg-primary transition-transform duration-300 ease-premium group-hover:scale-x-100" />

              {/* Dropdown */}
              {cat.columns && (
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 ease-premium group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[280px] overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                    <div className="grid grid-cols-1 gap-6 p-5">
                      {cat.columns.map((col) => (
                        <div key={col.title}>
                          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                            {col.title}
                          </div>
                          <ul className="space-y-1">
                            {col.items.map((it) => (
                              <li key={it.label}>
                                <Link
                                  to={it.href}
                                  className="block rounded-md px-2 py-1.5 text-sm text-foreground/80 transition hover:bg-secondary hover:text-primary"
                                >
                                  {it.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border bg-secondary/40 px-5 py-2.5 text-[11px] font-semibold text-muted-foreground">
                      Frete grátis acima de R$ 1.500 · 12× sem juros
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Orange underline like reference */}
      <div className="h-[2px] w-full bg-primary/80" />
    </nav>
  );
}

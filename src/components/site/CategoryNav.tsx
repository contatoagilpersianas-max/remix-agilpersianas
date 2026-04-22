// Mega Menu rico — categorias com colunas de subprodutos
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

type SubItem = { label: string };
type Category = {
  label: string;
  columns?: { title: string; items: SubItem[] }[];
  highlight?: boolean;
};

const CATEGORIES: Category[] = [
  {
    label: "Rolô",
    columns: [
      {
        title: "Por tecido",
        items: [
          { label: "Blackout 100%" },
          { label: "Translúcida" },
          { label: "Tela Solar 1%" },
          { label: "Tela Solar 3%" },
          { label: "Tela Solar 5%" },
          { label: "Rústica" },
        ],
      },
      {
        title: "Acabamento",
        items: [
          { label: "Kit Box (vedação total)" },
          { label: "Guia lateral" },
          { label: "Bandô" },
        ],
      },
      {
        title: "Acionamento",
        items: [
          { label: "Manual (cordinha)" },
          { label: "Motorizada RF" },
          { label: "Motorizada Wi-Fi" },
        ],
      },
    ],
  },
  {
    label: "Romana",
    columns: [
      {
        title: "Estilos",
        items: [
          { label: "Linho cru" },
          { label: "Algodão" },
          { label: "Translúcida" },
          { label: "Blackout Romana" },
          { label: "Screen" },
        ],
      },
    ],
  },
  {
    label: "Double Vision",
    columns: [
      {
        title: "Coleções",
        items: [
          { label: "Branco" },
          { label: "Bege" },
          { label: "Preto" },
          { label: "Semi blackout" },
          { label: "Motorizada" },
        ],
      },
    ],
  },
  {
    label: "Horizontal",
    columns: [
      {
        title: "Material",
        items: [
          { label: "Alumínio 16mm" },
          { label: "Alumínio 25mm" },
          { label: "Alumínio 50mm" },
          { label: "Madeira" },
          { label: "PVC" },
          { label: "Privacy" },
        ],
      },
    ],
  },
  {
    label: "Vertical",
    columns: [
      {
        title: "Modelos",
        items: [
          { label: "PVC" },
          { label: "Translúcida" },
          { label: "Blackout vertical" },
          { label: "Alumínio" },
          { label: "Galeria premium" },
        ],
      },
    ],
  },
  {
    label: "Painel",
    columns: [
      {
        title: "Painel Japonês",
        items: [
          { label: "Clássico" },
          { label: "Varetado" },
          { label: "Madeirado" },
          { label: "Tela Solar" },
          { label: "Translúcido" },
          { label: "Blackout" },
        ],
      },
    ],
  },
  {
    label: "Tela",
    columns: [
      {
        title: "Tela Mosquiteira",
        items: [
          { label: "Fixa" },
          { label: "Retrátil" },
          { label: "Motorizada" },
          { label: "Porta de correr" },
          { label: "Magnética" },
          { label: "Pet reforçada" },
        ],
      },
    ],
  },
  {
    label: "Toldos",
    columns: [
      {
        title: "Tipos",
        items: [
          { label: "Articulado" },
          { label: "Cortina" },
          { label: "Retrátil" },
          { label: "Vertical" },
          { label: "Lona / Screen" },
        ],
      },
    ],
  },
  {
    label: "Automação",
    highlight: true,
    columns: [
      {
        title: "Conectividade",
        items: [
          { label: "RF (rádio frequência)" },
          { label: "Wi-Fi" },
          { label: "Alexa" },
          { label: "Google Home" },
          { label: "Bateria recarregável" },
          { label: "Trilhos motorizados" },
        ],
      },
    ],
  },
  {
    label: "Ambientes",
    columns: [
      {
        title: "Por cômodo",
        items: [
          { label: "Sala de estar" },
          { label: "Quarto" },
          { label: "Escritório" },
          { label: "Cozinha" },
          { label: "Sacada" },
          { label: "Corporativo" },
        ],
      },
    ],
  },
];

export function CategoryNav() {
  return (
    <nav className="hidden border-t border-border/60 bg-background lg:block">
      <div className="container-premium">
        <ul className="flex h-14 items-center justify-between gap-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.label} className="group relative">
              <button
                className="inline-flex h-14 items-center gap-1.5 px-2 text-[12px] font-semibold uppercase tracking-[0.18em] transition"
                style={{ color: cat.highlight ? "#F57C00" : undefined }}
              >
                {cat.label}
                {cat.columns && (
                  <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:rotate-180" />
                )}
              </button>

              {cat.columns && (
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-0 opacity-0 transition-all duration-200 ease-premium group-hover:visible group-hover:opacity-100">
                  <div
                    className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
                    style={{
                      minWidth: cat.columns.length > 1 ? 560 : 280,
                    }}
                  >
                    <div
                      className="grid gap-6 p-6"
                      style={{
                        gridTemplateColumns: `repeat(${cat.columns.length}, minmax(0,1fr))`,
                      }}
                    >
                      {cat.columns.map((col) => (
                        <div key={col.title}>
                          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {col.title}
                          </div>
                          <ul className="space-y-1">
                            {col.items.map((it) => (
                              <li key={it.label}>
                                <Link
                                  to="/"
                                  className="block rounded-md px-2 py-1.5 text-sm text-foreground/85 transition hover:bg-secondary hover:text-foreground"
                                >
                                  {it.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
          <li>
            <Link
              to="/"
              className="inline-flex h-14 items-center gap-1.5 px-2 text-[12px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#B8541C" }}
            >
              Ofertas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

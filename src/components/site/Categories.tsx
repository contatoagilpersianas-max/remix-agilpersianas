// Categories — "Encontre seu modelo ideal"
// 8 categorias alinhadas com a referência (sem "mais vendida")
// Contraste reforçado nos textos laranja
import { ArrowUpRight } from "lucide-react";
import rolo from "@/assets/cat-rolo.jpg";
import romana from "@/assets/cat-romana.jpg";
import doubleVision from "@/assets/cat-double-vision.jpg";
import horizontal from "@/assets/cat-horizontal.jpg";
import vertical from "@/assets/cat-vertical.jpg";
import painel from "@/assets/cat-painel.jpg";
import tela from "@/assets/cat-tela.jpg";
import toldo from "@/assets/cat-toldo.jpg";

// Laranja mais escuro/saturado para melhor contraste em fundo claro (AA)
const ORANGE_DEEP = "#B8541C";
const ORANGE_BRAND = "#E2763A";

const CATS = [
  { name: "Rolô", desc: "Tela solar, blackout e translúcida", img: rolo, slug: "rolo" },
  { name: "Romana", desc: "Tecidos e blackout", img: romana, slug: "romana" },
  { name: "Double Vision", desc: "Translúcida e semi blackout", img: doubleVision, slug: "double-vision" },
  { name: "Painel", desc: "Blackout, translúcida e tela solar", img: painel, slug: "painel" },
  { name: "Horizontal", desc: "Alumínio e PVC", img: horizontal, slug: "horizontal" },
  { name: "Vertical", desc: "Tecido, PVC e alumínio", img: vertical, slug: "vertical" },
  { name: "Tela Mosquiteira", desc: "Fixa e retrátil", img: tela, slug: "tela-mosquiteira" },
  { name: "Toldos", desc: "Articulado, cortina e retrátil", img: toldo, slug: "toldos" },
];

export function Categories() {
  return (
    <section id="categorias" className="bg-background py-20 md:py-28">
      <div className="container-premium">
        {/* Header da seção */}
        <div className="mb-14 flex flex-col items-center text-center">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: ORANGE_DEEP }}
          >
            ✦ Categorias
          </span>
          <h2
            className="font-display mt-4 leading-[1.05] tracking-tight"
            style={{
              fontWeight: 400,
              fontSize: "clamp(34px, 4.2vw, 52px)",
              color: "#1a1208",
            }}
          >
            Encontre seu modelo{" "}
            <em className="italic" style={{ color: ORANGE_DEEP }}>
              ideal
            </em>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Cada ambiente pede um tipo de luz. Explore nossa curadoria de
            persianas, cortinas e toldos sob medida.
          </p>
        </div>

        {/* Grid de categorias — 4 cols desktop, 2 cols mobile */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:gap-6">
          {CATS.map((c) => (
            <a
              key={c.name}
              href="#catalogo"
              className="group flex flex-col text-center"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-white transition-all duration-500"
                style={{
                  border: "1px solid rgba(184,84,28,0.14)",
                  boxShadow:
                    "0 1px 2px rgba(20,12,4,0.04), 0 8px 28px -12px rgba(20,12,4,0.12)",
                }}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Overlay no hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 60%, rgba(20,12,4,0.45) 100%)",
                  }}
                />
                {/* Botão circular no hover */}
                <span
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100"
                  style={{ backgroundColor: ORANGE_BRAND, color: "#fff" }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              {/* Texto abaixo */}
              <div className="mt-4">
                <h3
                  className="font-display text-base font-semibold tracking-tight transition-colors md:text-lg"
                  style={{ color: "#1a1208" }}
                >
                  {c.name}
                </h3>
                <p
                  className="mt-1 text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "rgba(26,18,8,0.62)" }}
                >
                  {c.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-12 text-center">
          <a
            href="#catalogo"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] transition hover:gap-3"
            style={{ color: ORANGE_DEEP }}
          >
            Ver catálogo completo
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

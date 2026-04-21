// Categories — "Encontre seu modelo ideal" no estilo premium da referência
// Cards limpos com fundo branco, imagem grande, label preto embaixo
import { ArrowUpRight } from "lucide-react";
import rolo from "@/assets/cat-rolo.jpg";
import romana from "@/assets/cat-romana.jpg";
import horizontal from "@/assets/cat-horizontal.jpg";
import vertical from "@/assets/cat-vertical.jpg";
import painel from "@/assets/cat-painel.jpg";
import toldo from "@/assets/cat-toldo.jpg";

const CATS = [
  { name: "Rolô", desc: "A mais vendida", img: rolo },
  { name: "Romana", desc: "Sofisticação clássica", img: romana },
  { name: "Horizontais", desc: "Madeira e alumínio", img: horizontal },
  { name: "Verticais", desc: "Para grandes vãos", img: vertical },
  { name: "Painel", desc: "Linhas minimalistas", img: painel },
  { name: "Toldos", desc: "Áreas externas", img: toldo },
];

export function Categories() {
  return (
    <section id="categorias" className="bg-background py-20 md:py-28">
      <div className="container-premium">
        {/* Header da seção — estilo editorial premium */}
        <div className="mb-14 flex flex-col items-center text-center">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "#E2763A" }}
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
            Encontre seu modelo <em className="italic" style={{ color: "#E2763A" }}>ideal</em>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Cada ambiente pede um tipo de luz. Explore nossa curadoria de
            persianas, cortinas e toldos sob medida.
          </p>
        </div>

        {/* Grid de categorias — cards limpos premium */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {CATS.map((c) => (
            <a
              key={c.name}
              href="#catalogo"
              className="group flex flex-col text-center"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-white transition-all duration-500"
                style={{
                  border: "1px solid rgba(226,118,58,0.12)",
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
                {/* Overlay sutil no hover */}
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
                  style={{ backgroundColor: "#E2763A", color: "#fff" }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              {/* Texto abaixo do card */}
              <div className="mt-4">
                <h3
                  className="font-display text-base font-semibold tracking-tight transition-colors group-hover:text-primary md:text-lg"
                  style={{ color: "#1a1208" }}
                >
                  {c.name}
                </h3>
                <p
                  className="mt-0.5 text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "rgba(26,18,8,0.55)" }}
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
            style={{ color: "#E2763A" }}
          >
            Ver catálogo completo
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

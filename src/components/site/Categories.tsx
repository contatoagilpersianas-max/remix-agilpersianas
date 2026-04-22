// Categorias premium 9 itens (incluindo Automação) — grid editorial
import { ArrowUpRight } from "lucide-react";
import rolo from "@/assets/cat-rolo.jpg";
import romana from "@/assets/cat-romana.jpg";
import doubleVision from "@/assets/cat-double-vision.jpg";
import horizontal from "@/assets/cat-horizontal.jpg";
import vertical from "@/assets/cat-vertical.jpg";
import painel from "@/assets/cat-painel.jpg";
import tela from "@/assets/cat-tela.jpg";
import toldo from "@/assets/cat-toldo.jpg";
import automacao from "@/assets/section-automacao.jpg";

const ORANGE_DEEP = "#B8541C";
const ORANGE_BRAND = "#F57C00";

const CATS = [
  { name: "Rolô", desc: "Tela solar, blackout e translúcida", img: rolo },
  { name: "Romana", desc: "Linho, algodão e blackout", img: romana },
  { name: "Double Vision", desc: "Translúcida e semi blackout", img: doubleVision },
  { name: "Painel", desc: "Japonês, varetado e madeirado", img: painel },
  { name: "Horizontal", desc: "Alumínio, madeira e PVC", img: horizontal },
  { name: "Vertical", desc: "Tecido, PVC e alumínio", img: vertical },
  { name: "Tela Mosquiteira", desc: "Fixa, retrátil e magnética", img: tela },
  { name: "Toldos", desc: "Articulado, cortina e retrátil", img: toldo },
  { name: "Automação", desc: "Wi-Fi, Alexa e Google Home", img: automacao, highlight: true },
];

export function Categories() {
  return (
    <section id="categorias" className="bg-background py-20 md:py-28">
      <div className="container-premium">
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
              fontWeight: 500,
              fontSize: "clamp(34px, 4.4vw, 54px)",
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
            persianas, cortinas, toldos e automação sob medida.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
          {CATS.map((c) => (
            <a
              key={c.name}
              href="#produtos"
              className="group relative flex flex-col text-left"
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white transition-all duration-500"
                style={{
                  border: "1px solid rgba(184,84,28,0.14)",
                  boxShadow:
                    "0 1px 2px rgba(20,12,4,0.04), 0 12px 36px -16px rgba(20,12,4,0.16)",
                }}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(15,10,5,0.78) 100%)",
                  }}
                />
                {c.highlight && (
                  <span
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-lg"
                    style={{ backgroundColor: ORANGE_BRAND, color: "#fff" }}
                  >
                    Novo
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] opacity-80">
                        {c.desc}
                      </p>
                    </div>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform group-hover:rotate-45"
                      style={{ backgroundColor: ORANGE_BRAND, color: "#fff" }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#produtos"
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

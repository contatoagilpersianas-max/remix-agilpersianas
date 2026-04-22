// Categorias premium — grid editorial. Mostra as categorias raiz do banco.
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

// Mapa slug → imagem fallback
const IMG_MAP: Record<string, string> = {
  rolo,
  romana,
  "double-vision": doubleVision,
  horizontal,
  vertical,
  painel,
  "tela-mosquiteira": tela,
  toldos: toldo,
  automacao,
};

const FALLBACK_DESC: Record<string, string> = {
  rolo: "Tela solar, blackout e translúcida",
  romana: "Linho, algodão e blackout",
  "double-vision": "Translúcida e semi blackout",
  painel: "Japonês, varetado e madeirado",
  horizontal: "Alumínio, madeira e PVC",
  vertical: "Tecido, PVC e alumínio",
  "tela-mosquiteira": "Fixa, retrátil e magnética",
  toldos: "Articulado, cortina e retrátil",
  automacao: "Wi-Fi, Alexa e Google Home",
};

type Cat = { id: string; name: string; slug: string; icon: string | null; show_in_menu: boolean | null };

export function Categories() {
  const { data: cats = [] } = useQuery({
    queryKey: ["home-cats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,icon,show_in_menu")
        .is("parent_id", null)
        .eq("active", true)
        .order("position");
      return (data ?? []) as Cat[];
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Filtra só categorias visíveis no menu, exclui "Ambientes" (já tem seção própria)
  const visible = cats
    .filter((c) => c.show_in_menu !== false && c.slug !== "ambientes")
    .slice(0, 9);

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
          {visible.map((c) => {
            const img = IMG_MAP[c.slug] ?? rolo;
            const desc = FALLBACK_DESC[c.slug] ?? "Sob medida ao centímetro";
            return (
              <Link
                key={c.id}
                to="/catalogo"
                search={{ categoria: c.slug }}
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
                    src={img}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Overlay mais forte para garantir contraste do título em mobile */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 30%, rgba(15,10,5,0.55) 65%, rgba(15,10,5,0.92) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          className="font-display text-xl font-semibold tracking-tight md:text-2xl text-white"
                          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
                        >
                          {c.name}
                        </h3>
                        <p
                          className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/95"
                          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
                        >
                          {desc}
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
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] transition hover:gap-3"
            style={{ color: ORANGE_DEEP }}
          >
            Ver catálogo completo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import rolo from "@/assets/cat-rolo.jpg";
import romana from "@/assets/cat-romana.jpg";
import horizontal from "@/assets/cat-horizontal.jpg";
import vertical from "@/assets/cat-vertical.jpg";
import painel from "@/assets/cat-painel.jpg";
import toldo from "@/assets/cat-toldo.jpg";

const CATS = [
  { name: "Rolô", desc: "A mais vendida", img: rolo, span: "md:col-span-2 md:row-span-2" },
  { name: "Romana", desc: "Sofisticação clássica", img: romana, span: "md:col-span-1" },
  { name: "Horizontais", desc: "Madeira e alumínio", img: horizontal, span: "md:col-span-1" },
  { name: "Verticais", desc: "Para grandes vãos", img: vertical, span: "md:col-span-1" },
  { name: "Painel", desc: "Linhas minimalistas", img: painel, span: "md:col-span-1" },
  { name: "Toldos", desc: "Áreas externas", img: toldo, span: "md:col-span-2" },
];

export function Categories() {
  return (
    <section id="categorias" className="py-20 md:py-28">
      <div className="container-premium">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Categorias
            </span>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
              Encontre seu modelo ideal
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground md:text-lg">
              Cada ambiente pede um tipo de luz. Explore nossa curadoria de
              persianas e toldos sob medida.
            </p>
          </div>
          <a
            href="/"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline md:inline-flex"
          >
            Ver todas
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {CATS.map((c, i) => (
            <a
              key={c.name}
              href="/"
              className={`group relative overflow-hidden rounded-2xl bg-secondary shadow-card transition hover:shadow-lg ${c.span ?? ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                  {c.desc}
                </div>
                <div className="mt-1 flex items-end justify-between">
                  <h3 className="font-display text-2xl font-semibold md:text-3xl">
                    {c.name}
                  </h3>
                  <span className="flex h-9 w-9 shrink-0 translate-y-1 items-center justify-center rounded-full bg-white/95 text-foreground opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

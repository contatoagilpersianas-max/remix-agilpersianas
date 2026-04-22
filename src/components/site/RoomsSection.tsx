// Projetos / Ambientes — quarto, sala, escritório, sacada
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import quarto from "@/assets/ambiente-quarto.jpg";
import sala from "@/assets/ambiente-sala.jpg";
import escritorio from "@/assets/ambiente-escritorio.jpg";
import sacada from "@/assets/ambiente-sacada.jpg";

const ROOMS = [
  { name: "Quarto", desc: "Blackout para escurecer 100%", img: quarto, slug: "quarto" },
  { name: "Sala", desc: "Double Vision e screen", img: sala, slug: "sala" },
  { name: "Escritório", desc: "Tela solar antirreflexo", img: escritorio, slug: "escritorio" },
  { name: "Sacada", desc: "Toldo retrátil e tela", img: sacada, slug: "sacada" },
];

export function RoomsSection() {
  return (
    <section id="ambientes" className="bg-background py-20 md:py-28">
      <div className="container-premium">
        <div className="mb-12 flex flex-col items-center text-center">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "#B8541C" }}
          >
            ✦ Projetos
          </span>
          <h2
            className="font-display mt-4 leading-[1.05] tracking-tight text-foreground"
            style={{ fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Inspire-se por <em className="italic" style={{ color: "#F57C00" }}>ambiente</em>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Veja como cada cômodo ganha vida com a luz e o conforto certos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {ROOMS.map((r) => (
            <Link
              key={r.slug}
              to="/catalogo"
              search={{ ambiente: r.slug }}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-foreground shadow-md"
            >
              <img
                src={r.img}
                alt={r.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 35%, rgba(15,10,5,0.92) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <h3
                      className="font-display text-xl font-semibold drop-shadow-lg"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
                    >
                      {r.name}
                    </h3>
                    <p
                      className="mt-1 text-[12px] uppercase tracking-[0.16em] opacity-90"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                    >
                      {r.desc}
                    </p>
                  </div>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:rotate-45"
                    style={{ backgroundColor: "#F57C00" }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

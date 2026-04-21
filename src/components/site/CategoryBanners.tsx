import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-living-room.jpg";

const BANNERS = [
  {
    title: "PERSIANA ROLÔ BLACKOUT",
    cta: "Explorar Detalhes",
    img: heroImg,
    href: "/",
  },
  {
    title: "KITBOX PARA UM QUARTO 100% ESCURO",
    description:
      "Proporciona maior vedação de luz, com guias de alumínio que transformam a janela em uma moldura.",
    cta: "Saiba Mais",
    img: heroImg,
    href: "/",
  },
];

export function CategoryBanners() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container-premium grid gap-6 md:grid-cols-2">
        {BANNERS.map((b) => (
          <a
            key={b.title}
            href={b.href}
            className="group relative block aspect-[16/10] overflow-hidden bg-foreground"
          >
            <img
              src={b.img}
              alt={b.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 ease-premium group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-10">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                {b.title}
              </h3>
              {b.description && (
                <p className="mt-2 max-w-md text-sm text-white/85 md:text-base">
                  {b.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] transition group-hover:gap-4">
                {b.cta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

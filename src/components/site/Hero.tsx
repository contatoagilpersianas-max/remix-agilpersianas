// Hero — estilo editorial, tipografia serif centralizada
import heroImg from "@/assets/hero-living-room.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[560px] w-full md:h-[88vh]">
        <img
          src={heroImg}
          alt="Sala de estar contemporânea com persianas rolô translúcidas"
          className="absolute inset-0 h-full w-full object-cover"
          width={2400}
          height={1600}
        />
        {/* Vinheta sutil para garantir contraste do título central */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.45)_100%)]" />

        <div className="container-premium relative flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight drop-shadow-lg md:text-7xl lg:text-8xl">
            Luz, Forma e Função.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Coleção 2026: Soluções arquitetônicas sob medida para transformar
            sua visão em realidade.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#consultoria"
              className="inline-flex h-12 items-center justify-center rounded-none bg-white px-8 text-[12px] font-bold uppercase tracking-[0.22em] text-foreground transition hover:bg-primary hover:text-primary-foreground"
            >
              Agendar Consultoria
            </a>
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center rounded-none border border-white/80 bg-transparent px-8 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-foreground"
            >
              Ver Catálogo
            </a>
          </div>
        </div>

        {/* Indicador de slides (estático) */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          <span className="h-1.5 w-6 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}

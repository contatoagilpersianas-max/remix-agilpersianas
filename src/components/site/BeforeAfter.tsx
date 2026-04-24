// Seção "Antes & Depois" — comparador interativo (slider)
import { useRef, useState, useCallback } from "react";
import beforeImg from "@/assets/ambiente-sala.jpg";
import afterImg from "@/assets/hero-2026-living.jpg";
import beforeImg2 from "@/assets/ambiente-quarto.jpg";
import afterImg2 from "@/assets/hero-2026-bedroom.jpg";
import { Sparkles } from "lucide-react";

type Pair = { before: string; after: string; title: string; desc: string };

const PAIRS: Pair[] = [
  {
    before: beforeImg,
    after: afterImg,
    title: "Sala de estar",
    desc: "Cortina romana em linho premium — luz suave e elegante.",
  },
  {
    before: beforeImg2,
    after: afterImg2,
    title: "Quarto principal",
    desc: "Persiana rolô blackout — escurecimento total e conforto térmico.",
  },
];

function CompareSlider({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <figure
      ref={ref}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card cursor-ew-resize select-none group"
      onMouseDown={(e) => {
        dragging.current = true;
        move(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => {
        dragging.current = true;
        move(e.touches[0].clientX);
      }}
      onTouchMove={(e) => dragging.current && move(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
    >
      {/* Depois (fundo) */}
      <img
        src={pair.after}
        alt={`${pair.title} — depois`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Antes (clipado) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={pair.before}
          alt={`${pair.title} — antes`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }}
        />
      </div>

      {/* Labels */}
      <span className="absolute left-4 top-4 rounded-full bg-foreground/80 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-background">
        Antes
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
        Depois
      </span>

      {/* Linha + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${pos}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-11 w-11 rounded-full bg-white shadow-2xl flex items-center justify-center pointer-events-none ring-2 ring-primary"
        style={{ left: `${pos}%` }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
        </svg>
      </div>

      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-5 pointer-events-none">
        <div className="font-display text-lg text-background" style={{ fontWeight: 500 }}>
          {pair.title}
        </div>
        <div className="text-xs text-background/80">{pair.desc}</div>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container-premium">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Transformações reais
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
            Veja como uma persiana muda tudo
          </h2>
          <p className="mt-4 text-muted-foreground">
            Arraste para comparar. Mesmos ambientes — antes e depois das nossas
            persianas instaladas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PAIRS.map((p) => (
            <CompareSlider key={p.title} pair={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

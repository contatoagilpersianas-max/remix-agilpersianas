import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export type GalleryImage = string | { url: string; caption?: string; color?: string };

function normalize(images: GalleryImage[]): { url: string; caption?: string; color?: string }[] {
  return images.map((i) =>
    typeof i === "string" ? { url: i } : { url: i.url, caption: i.caption, color: i.color },
  );
}

export function ProductGallery({
  images,
  alt,
  badge,
  activeColor,
}: {
  images: GalleryImage[];
  alt: string;
  badge?: string | null;
  /** Quando muda, troca a imagem principal para a 1ª que tenha esta cor. */
  activeColor?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const list = normalize(images);
  const safe = list.length ? list : [{ url: "/placeholder.svg" }];
  const current = safe[active];

  useEffect(() => {
    if (!activeColor) return;
    const idx = safe.findIndex(
      (img) => img.color && img.color.toLowerCase() === activeColor.toLowerCase(),
    );
    if (idx >= 0) setActive(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeColor]);

  return (
    <div className="space-y-4">
      {/* Layout estilo Blinds.com — thumbs verticais à esquerda + imagem grande */}
      <div className="flex gap-3 md:gap-4">
        {/* Thumbs verticais (desktop apenas) */}
        {safe.length > 1 && (
          <div className="hidden lg:flex flex-col gap-3 w-[92px] flex-shrink-0">
            {safe.slice(0, 6).map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`group relative aspect-square w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-premium ${
                  i === active
                    ? "border-primary shadow-glow ring-2 ring-primary/10"
                    : "border-border/70 opacity-80 hover:opacity-100 hover:-translate-y-0.5 hover:border-foreground/20"
                }`}
                title={img.caption}
                aria-label={`Imagem ${i + 1}`}
                aria-pressed={i === active}
              >
                <img
                  src={img.url}
                  alt={img.caption || ""}
                  className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.06]"
                />
                <span
                  className={`pointer-events-none absolute inset-x-2 bottom-2 h-0.5 rounded-full transition-all duration-300 ${
                    i === active ? "bg-primary opacity-100" : "bg-card/80 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            ))}
            {safe.length > 6 && (
              <div className="text-[10px] text-muted-foreground text-center font-medium">
                +{safe.length - 6}
              </div>
            )}
          </div>
        )}

        {/* Imagem principal */}
        <div className="relative flex-1 overflow-hidden rounded-[24px] md:rounded-[28px] bg-sand shadow-card ring-1 ring-black/5">
          {badge && (
            <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground uppercase text-[10px] tracking-widest px-3 py-1.5">
              {badge}
            </Badge>
          )}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card/95 backdrop-blur shadow-md transition-transform duration-300 ease-premium hover:scale-105"
            aria-label="Ampliar"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="group aspect-[10/12] sm:aspect-[5/6] lg:aspect-[4/5] w-full overflow-hidden">
            <img
              src={current.url}
              alt={current.caption || alt}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
          </div>
          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm px-5 py-3">
              {current.caption}
            </div>
          )}
          {safe.length > 1 && (
            <>
              <button
                onClick={() => setActive((a) => (a - 1 + safe.length) % safe.length)}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 shadow transition-transform duration-300 ease-premium hover:scale-105"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActive((a) => (a + 1) % safe.length)}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 shadow transition-transform duration-300 ease-premium hover:scale-105"
                aria-label="Próxima"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbs horizontais (mobile/tablet) */}
      {safe.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 lg:hidden">
          {safe.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 ease-premium ${
                i === active
                  ? "border-primary shadow-glow ring-2 ring-primary/10"
                  : "border-border/70 opacity-80 hover:-translate-y-0.5 hover:opacity-100"
              }`}
              title={img.caption}
              aria-label={`Miniatura ${i + 1}`}
              aria-pressed={i === active}
            >
              <img
                src={img.url}
                alt={img.caption || ""}
                className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.06]"
              />
              <span
                className={`pointer-events-none absolute inset-x-3 bottom-2 h-0.5 rounded-full transition-all duration-300 ${
                  i === active ? "bg-primary opacity-100" : "bg-card/80 opacity-0 group-hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-up"
        >
          <img src={current.url} alt={alt} className="max-h-[90vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const safe = images.length ? images : ["/placeholder.svg"];

  return (
    <div>
      <div className="relative group rounded-2xl overflow-hidden bg-sand shadow-card">
        {badge && (
          <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground uppercase text-[10px] tracking-widest px-3 py-1.5">
            {badge}
          </Badge>
        )}
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition"
          aria-label="Ampliar"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="aspect-[4/5] sm:aspect-square w-full overflow-hidden">
          <img
            src={safe[active]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
          />
        </div>
        {safe.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + safe.length) % safe.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 shadow flex items-center justify-center hover:scale-105 transition"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % safe.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 shadow flex items-center justify-center hover:scale-105 transition"
              aria-label="Próxima"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {safe.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {safe.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                i === active ? "border-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-up"
        >
          <img src={safe[active]} alt={alt} className="max-h-[90vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

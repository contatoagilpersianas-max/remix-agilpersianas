// Botão flutuante "Falar com a Lumi" (canto inferior direito)
// Substitui o antigo FAB do WhatsApp.
import { Sparkles } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { openLumiWith } from "./LumiWidget";

export function WhatsAppFAB() {
  const location = useLocation();
  const slugMatch = location.pathname.match(/\/produto\/([^/?#]+)/);
  const slug = slugMatch?.[1];

  return (
    <button
      type="button"
      onClick={() =>
        openLumiWith({
          productSlug: slug,
          productName: slug ? decodeURIComponent(slug).replace(/-/g, " ") : undefined,
          pageUrl: location.pathname,
        })
      }
      aria-label="Falar com a Lumi"
      className="fixed bottom-6 right-6 z-40 group inline-flex h-14 items-center gap-2.5 rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-2xl transition hover:scale-105"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary">
        <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </span>
      <span className="hidden sm:inline">Falar com a Lumi</span>
    </button>
  );
}

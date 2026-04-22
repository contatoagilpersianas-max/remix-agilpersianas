import { useEffect, useState } from "react";
import { MessageCircle, ChevronUp } from "lucide-react";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Barra fixa mobile: aparece após scroll do hero.
 * Mostra preço-base (m²) e CTA para voltar ao configurador / WhatsApp.
 */
export function StickyBuyBar({
  name,
  pricePerSqm,
}: {
  name: string;
  pricePerSqm: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const wppMsg = encodeURIComponent(`Olá! Tenho interesse na ${name}. Pode me ajudar?`);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg shadow-[0_-8px_24px_rgba(0,0,0,0.08)] animate-fade-up">
      <div className="container-premium py-3 flex items-center gap-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0"
          aria-label="Voltar ao topo"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-muted-foreground truncate">{name}</div>
          <div className="font-display text-base leading-none">
            a partir de <span className="text-primary">{BRL(pricePerSqm)}</span>
            <span className="text-xs text-muted-foreground"> /m²</span>
          </div>
        </div>
        <a
          href={`https://wa.me/5500000000000?text=${wppMsg}`}
          target="_blank"
          rel="noreferrer"
          className="h-11 px-4 rounded-full bg-whatsapp text-whatsapp-foreground flex items-center gap-2 text-sm font-semibold shrink-0"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-11 px-5 rounded-full bg-primary text-primary-foreground font-bold text-sm"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

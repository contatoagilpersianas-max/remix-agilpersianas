import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronUp } from "lucide-react";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Barra fixa mobile com preço + CTA. Aparece quando o usuário rola além do hero.
 */
export function StickyBuyBar({
  name,
  price,
  onBuy,
  whatsappMsg,
}: {
  name: string;
  price: number;
  onBuy: () => void;
  whatsappMsg: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

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
          <div className="font-display text-lg leading-none">{BRL(price)}</div>
        </div>
        <a
          href={`https://wa.me/5500000000000?text=${whatsappMsg}`}
          target="_blank"
          rel="noreferrer"
          className="h-11 w-11 rounded-full bg-whatsapp text-whatsapp-foreground flex items-center justify-center shrink-0"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <Button
          onClick={onBuy}
          className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
        >
          Comprar
        </Button>
      </div>
    </div>
  );
}

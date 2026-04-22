import { MessageCircle } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

const PHONE = "5511999999999";

export function WhatsAppFAB() {
  const location = useLocation();
  // Tenta extrair o slug se estiver numa página de produto
  const slugMatch = location.pathname.match(/\/produto\/([^/?#]+)/);
  const slug = slugMatch?.[1];
  const text = slug
    ? `Olá! Vim do site e quero um orçamento para: ${decodeURIComponent(slug).replace(/-/g, " ")}.`
    : "Olá! Vim do site da Ágil Persianas e quero um orçamento.";
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com Especialista pelo WhatsApp"
      className="fixed bottom-6 right-6 z-40 group inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-whatsapp-foreground shadow-2xl transition hover:scale-105 hover:bg-whatsapp/90"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        <MessageCircle className="h-5 w-5" />
      </span>
      <span className="hidden sm:inline">Fale com um especialista</span>
    </a>
  );
}

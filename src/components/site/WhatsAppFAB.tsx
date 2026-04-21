import { MessageCircle } from "lucide-react";

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40" />
    </a>
  );
}

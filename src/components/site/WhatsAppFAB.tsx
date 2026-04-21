import { ArrowRight } from "lucide-react";

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com Especialista"
      className="fixed bottom-6 right-6 z-40 group inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-5 text-[11px] font-bold uppercase tracking-[0.22em] text-background shadow-lg transition hover:bg-primary"
    >
      Falar com Especialista
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

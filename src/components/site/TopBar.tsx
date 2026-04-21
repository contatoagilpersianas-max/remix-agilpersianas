import { Phone, MessageCircle, MapPin, Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-graphite text-graphite-foreground text-xs">
      <div className="container-premium flex h-9 items-center justify-between gap-4">
        <div className="hidden items-center gap-5 md:flex">
          <a
            href="tel:+551140028922"
            className="flex items-center gap-1.5 opacity-80 transition hover:opacity-100"
          >
            <Phone className="h-3.5 w-3.5" />
            (11) 4002-8922
          </a>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 opacity-80 transition hover:opacity-100"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <span className="flex items-center gap-1.5 opacity-70">
            <MapPin className="h-3.5 w-3.5" />
            Atendemos todo o Brasil
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 md:flex-none md:justify-end">
          <Truck className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">
            Frete grátis acima de R$ 1.500 — instalação inclusa em SP
          </span>
        </div>
      </div>
    </div>
  );
}

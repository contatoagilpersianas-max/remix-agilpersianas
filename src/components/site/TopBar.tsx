import { Phone, MessageCircle, Truck, CreditCard } from "lucide-react";
import { SITE_CONFIG, whatsappLink } from "@/lib/site-config";

export function TopBar() {
  return (
    <div className="bg-foreground text-background text-xs">
      <div className="container-premium flex h-9 items-center justify-between gap-4">
        <div className="hidden items-center gap-5 md:flex">
          <a
            href={`tel:+${SITE_CONFIG.whatsappNumber}`}
            className="flex items-center gap-1.5 opacity-85 transition hover:opacity-100"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE_CONFIG.phoneDisplay}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 opacity-85 transition hover:opacity-100"
            style={{ color: "#FFB877" }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp {SITE_CONFIG.whatsappDisplay}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center gap-4 md:flex-none md:justify-end">
          <span className="hidden sm:flex items-center gap-1.5 opacity-85">
            <Truck className="h-3.5 w-3.5" style={{ color: "#F57C00" }} />
            Entregamos para todo o Brasil
          </span>
          <span className="flex items-center gap-1.5 opacity-85">
            <CreditCard className="h-3.5 w-3.5" style={{ color: "#F57C00" }} />
            Até 6× sem juros
          </span>
        </div>
      </div>
    </div>
  );
}

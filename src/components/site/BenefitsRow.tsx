import { Scissors, CreditCard, PackageCheck, ScrollText, MessageCircle } from "lucide-react";

const ITEMS = [
  { icon: Scissors, title: "Sob medida", desc: "Produção ao centímetro" },
  { icon: CreditCard, title: "Parcelamento", desc: "Em até 6× sem juros" },
  { icon: PackageCheck, title: "Entrega nacional", desc: "Envio para todo o Brasil" },
  { icon: ScrollText, title: "Instalação guiada", desc: "Manual e vídeo passo a passo" },
];

const WHATSAPP_URL =
  "https://wa.me/5532351202810?text=Ol%C3%A1%21%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20persianas.";

export function BenefitsRow() {
  return (
    <section
      className="bg-background py-5 md:py-7"
      aria-labelledby="benefits-heading"
    >
      <div className="container-premium">
        <h2 id="benefits-heading" className="sr-only">
          Benefícios Ágil Persianas
        </h2>

        <div
          className="rounded-2xl border border-border/70 bg-[#FAF7F2] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row lg:items-stretch"
          data-reveal
        >
          <ul
            role="list"
            className="flex-1 grid grid-cols-2 lg:grid-cols-4 divide-y divide-border/60 lg:divide-y-0 lg:divide-x [&>li:nth-child(2)]:border-l [&>li:nth-child(2)]:border-border/60 lg:[&>li:nth-child(2)]:border-l-0 [&>li:nth-child(4)]:border-l [&>li:nth-child(4)]:border-border/60 lg:[&>li:nth-child(4)]:border-l-0"
          >
            {ITEMS.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="group flex items-center gap-3 sm:gap-4 px-3.5 sm:px-6 py-4 sm:py-5 min-w-0 focus-within:bg-white/60 hover:bg-white/50 transition-colors duration-300 ease-premium"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-[rgba(226,118,58,0.18)] bg-[rgba(226,118,58,0.10)] transition-all duration-500 ease-premium group-hover:scale-[1.06] group-hover:bg-[rgba(226,118,58,0.16)] group-hover:ring-[rgba(226,118,58,0.32)]"
                >
                  <Icon
                    strokeWidth={1.6}
                    className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                    style={{ color: "#C75A1F" }}
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[14px] sm:text-[15px] md:text-base leading-tight text-foreground tracking-tight truncate">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-[11.5px] sm:text-[13px] leading-snug text-muted-foreground truncate">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t lg:border-t-0 lg:border-l border-border/60 flex items-center justify-center px-4 sm:px-5 py-3 lg:py-0 bg-white/40">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-4 py-2 text-[13px] font-medium text-foreground shadow-sm transition-all duration-300 ease-premium hover:border-[rgba(226,118,58,0.5)] hover:text-[#C75A1F] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2763A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
              aria-label="Falar com um especialista pelo WhatsApp"
            >
              <MessageCircle className="h-4 w-4" style={{ color: "#C75A1F" }} strokeWidth={1.8} />
              <span className="hidden sm:inline">Tirar dúvidas</span>
              <span className="sm:hidden">Falar agora</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

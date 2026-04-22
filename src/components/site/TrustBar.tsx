// TrustBar — faixa premium de diferenciais (sem duplicar métricas do Hero)
import { Scissors, Truck, Headphones, BadgeCheck } from "lucide-react";

const ITEMS = [
  {
    icon: Scissors,
    title: "Fabricação sob medida",
    desc: "Cada peça produzida exatamente no tamanho da sua janela",
  },
  {
    icon: Truck,
    title: "Envio para todo o Brasil",
    desc: "Embalagem reforçada com rastreio porta a porta",
  },
  {
    icon: BadgeCheck,
    title: "Acabamento premium",
    desc: "Tecidos selecionados e mecanismos de alta durabilidade",
  },
  {
    icon: Headphones,
    title: "Atendimento especializado",
    desc: "Consultoria via WhatsApp antes e após a compra",
  },
];

export function TrustBar() {
  return (
    <section
      className="relative overflow-hidden border-y"
      style={{
        backgroundColor: "#faf6f0",
        borderColor: "rgba(226,118,58,0.18)",
      }}
    >
      {/* Detalhe sutil de luxo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(226,118,58,0.4), transparent)",
        }}
      />
      <div className="container-premium py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group flex items-start gap-4 lg:flex-col lg:items-center lg:text-center"
            >
              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: "#fff",
                  boxShadow:
                    "0 1px 2px rgba(20,12,4,0.04), 0 8px 24px -8px rgba(226,118,58,0.25)",
                  border: "1px solid rgba(226,118,58,0.18)",
                }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: "#E2763A" }}
                  strokeWidth={1.6}
                />
              </div>
              <div className="leading-tight">
                <div
                  className="font-display text-[15px] font-semibold tracking-tight md:text-base"
                  style={{ color: "#1a1208" }}
                >
                  {title}
                </div>
                <div
                  className="mt-1 text-[12px] leading-relaxed md:text-[13px]"
                  style={{ color: "rgba(26,18,8,0.6)" }}
                >
                  {desc}
                </div>
              </div>
              {/* Separador vertical entre itens em desktop */}
              {i < ITEMS.length - 1 && (
                <div
                  className="hidden lg:absolute lg:right-0 lg:top-1/2 lg:h-12 lg:w-px lg:-translate-y-1/2"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

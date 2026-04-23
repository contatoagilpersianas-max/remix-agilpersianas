import { Factory, Ruler, Wrench, Headset } from "lucide-react";

// Gatilhos atualizados — substitui "Garantia 5 anos" por diferenciais de produção e instalação
const items = [
  { icon: Factory, title: "Produção própria", sub: "Fábrica + showroom técnico" },
  { icon: Ruler, title: "Sob medida exata", sub: "Cortado ao centímetro" },
  { icon: Wrench, title: "Instalação simples", sub: "Vídeo passo a passo" },
  { icon: Headset, title: "Atendimento humano", sub: "Especialistas no WhatsApp" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-sand/40">
      <div className="container-premium grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
        {items.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">{title}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// TrustBar — selos de confiança logo após o Hero
import { ShieldCheck, Award, Users, Truck } from "lucide-react";

const ITEMS = [
  { icon: Users, value: "+20.000", label: "Clientes atendidos" },
  { icon: Award, value: "4.9 ★", label: "2.300+ avaliações" },
  { icon: ShieldCheck, value: "5 anos", label: "Garantia total" },
  { icon: Truck, value: "Brasil", label: "Frete grátis acima R$ 1.500" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card py-6 md:py-8">
      <div className="container-premium grid grid-cols-2 gap-6 md:grid-cols-4">
        {ITEMS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(226,118,58,0.1)" }}
            >
              <Icon className="h-5 w-5" style={{ color: "#E2763A" }} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold text-foreground md:text-lg">
                {value}
              </div>
              <div className="text-[11px] text-muted-foreground md:text-xs">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

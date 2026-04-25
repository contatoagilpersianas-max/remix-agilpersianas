import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-foreground text-background text-xs">
      <div className="container-premium flex h-9 items-center justify-center gap-6">
        <span className="hidden sm:flex items-center gap-1.5 opacity-85">
          <Truck className="h-3.5 w-3.5" style={{ color: "#F57C00" }} />
          Entregamos para todo o Brasil
        </span>
        <span className="flex items-center gap-1.5 opacity-85">
          <CreditCard className="h-3.5 w-3.5" style={{ color: "#F57C00" }} />
          Até 6× sem juros
        </span>
        <span className="hidden md:flex items-center gap-1.5 opacity-85">
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: "#F57C00" }} />
          Compra protegida
        </span>
      </div>
    </div>
  );
}

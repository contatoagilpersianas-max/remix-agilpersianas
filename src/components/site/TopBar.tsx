import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-foreground text-background text-[11px]">
      <div className="container-premium flex h-8 items-center justify-center gap-8 tracking-wide">
        <span className="hidden sm:flex items-center gap-2 opacity-90">
          <Truck className="h-3.5 w-3.5 text-primary" />
          Entrega para todo o Brasil
        </span>
        <span className="flex items-center gap-2 opacity-90">
          <CreditCard className="h-3.5 w-3.5 text-primary" />
          Até 6× sem juros
        </span>
        <span className="hidden md:flex items-center gap-2 opacity-90">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Compra 100% protegida
        </span>
      </div>
    </div>
  );
}

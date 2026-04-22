import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { quoteShipping, type ShippingQuote } from "@/lib/frenet.functions";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const maskCep = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

type Props = {
  productId: string;
  invoiceValue: number;
  quantity?: number;
  selectedCode?: string | null;
  onSelect?: (q: ShippingQuote) => void;
  onCepChange?: (cep: string) => void;
  compact?: boolean;
};

export function ShippingCalculator({
  productId,
  invoiceValue,
  quantity = 1,
  selectedCode = null,
  onSelect,
  onCepChange,
  compact = false,
}: Props) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ShippingQuote[] | null>(null);
  const quote = useServerFn(quoteShipping);

  function updateCep(v: string) {
    const next = maskCep(v);
    setCep(next);
    onCepChange?.(next);
  }

  async function handleQuote(e?: React.FormEvent) {
    e?.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      toast.error("Informe um CEP válido");
      return;
    }
    setLoading(true);
    setServices(null);
    try {
      const res = await quote({
        data: {
          destinationCep: digits,
          productId,
          quantity,
          invoiceValue: Math.max(invoiceValue, 1),
        },
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setServices(res.services);
      // Auto-seleciona o mais barato se ainda não houver seleção
      if (onSelect && !selectedCode && res.services[0]) {
        onSelect(res.services[0]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao calcular frete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={compact ? "space-y-2" : "rounded-2xl border bg-card p-4 space-y-3"}>
      {!compact && (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">Calcular frete e prazo</h4>
        </div>
      )}
      <form onSubmit={handleQuote} className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor={`cep-${productId}`} className="text-xs text-muted-foreground">
            CEP de entrega
          </Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={`cep-${productId}`}
              value={cep}
              onChange={(e) => setCep(maskCep(e.target.value))}
              placeholder="00000-000"
              inputMode="numeric"
              className="pl-9 h-10"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="h-10">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
        </Button>
      </form>

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener"
        className="text-[11px] text-muted-foreground hover:text-primary inline-block"
      >
        Não sei meu CEP
      </a>

      {services && services.length > 0 && (
        <div className="grid gap-2 pt-1">
          {services.map((s) => {
            const active = selectedCode === s.serviceCode;
            return (
              <button
                key={`${s.carrier}-${s.serviceCode}`}
                type="button"
                onClick={() => onSelect?.(s)}
                className={`text-left p-3 rounded-xl border-2 transition flex items-center justify-between gap-3 ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {s.carrier} <span className="text-muted-foreground font-normal">· {s.serviceDescription}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entrega em até {s.deliveryDays} dia{s.deliveryDays > 1 ? "s" : ""} úteis
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-base">{BRL(s.price)}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

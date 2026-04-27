import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { Calculator, ShieldCheck, Truck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type ProductOption = {
  id: string;
  label: string;
  // Preço estimado por m² (faixa indicativa, em BRL)
  pricePerM2: number;
  minPrice: number;
};

const PRODUCTS: ProductOption[] = [
  { id: "rolo-blackout", label: "Persiana Rolô Blackout", pricePerM2: 289, minPrice: 249 },
  { id: "rolo-solar", label: "Persiana Solar Screen", pricePerM2: 269, minPrice: 229 },
  { id: "double-vision", label: "Persiana Double Vision", pricePerM2: 359, minPrice: 299 },
  { id: "romana", label: "Cortina Romana", pricePerM2: 449, minPrice: 379 },
  { id: "horizontal-aluminio", label: "Persiana Horizontal Alumínio", pricePerM2: 219, minPrice: 189 },
  { id: "tela-mosquiteira", label: "Tela Mosquiteira", pricePerM2: 199, minPrice: 169 },
];

type Props = {
  defaultProductId?: string;
  className?: string;
  compact?: boolean;
};

const fmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function PriceCalculator({ defaultProductId, className, compact }: Props) {
  const [productId, setProductId] = useState(defaultProductId ?? PRODUCTS[0].id);
  const [width, setWidth] = useState<number>(120);
  const [height, setHeight] = useState<number>(140);
  const [motorized, setMotorized] = useState(false);

  // Pré-preenchimento via query string (vindo do Quiz, por exemplo)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const produto = params.get("produto");
    const largura = params.get("largura");
    const altura = params.get("altura");
    const motor = params.get("motor");
    if (produto && PRODUCTS.some((p) => p.id === produto)) setProductId(produto);
    if (largura && !Number.isNaN(Number(largura))) setWidth(Number(largura));
    if (altura && !Number.isNaN(Number(altura))) setHeight(Number(altura));
    if (motor === "1" || motor === "true") setMotorized(true);
  }, []);

  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];

  const result = useMemo(() => {
    const m2 = Math.max((width / 100) * (height / 100), 0.5);
    const base = Math.max(m2 * product.pricePerM2, product.minPrice);
    const total = motorized ? base + 690 : base;
    const min = Math.round(total * 0.92);
    const max = Math.round(total * 1.12);
    const installment = Math.round(total / 6);
    return { m2: m2.toFixed(2), min, max, installment };
  }, [width, height, product, motorized]);

  function scrollToQuote() {
    trackEvent("price_calculator_cta", {
      product: product.label,
      width,
      height,
      motorized,
      estimate_min: result.min,
      estimate_max: result.max,
    });
    const el = document.getElementById("orcamento");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={`rounded-3xl border bg-card p-5 sm:p-7 shadow-md ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 text-primary">
        <Calculator className="h-5 w-5" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
          Calculadora rápida
        </span>
      </div>
      <h3 className="font-display text-2xl sm:text-3xl mt-2 leading-tight">
        Estimativa de preço por m²
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Faixa indicativa para planejamento. O orçamento final considera tecido, acionamento e instalação.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        <div className="sm:col-span-2">
          <Label>Produto</Label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Largura (cm)</Label>
          <NumericInput min={40} max={600} value={width} onValueChange={(value) => setWidth(value ?? 0)} />
        </div>
        <div>
          <Label>Altura (cm)</Label>
          <NumericInput min={40} max={400} value={height} onValueChange={(value) => setHeight(value ?? 0)} />
        </div>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={motorized}
            onChange={(e) => setMotorized(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          Adicionar motorização (+ {fmt.format(690)})
        </label>
      </div>

      <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Estimativa para {result.m2} m²
        </div>
        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-3xl text-foreground">
            {fmt.format(result.min)}
          </span>
          <span className="text-muted-foreground">a</span>
          <span className="font-display text-3xl text-primary">
            {fmt.format(result.max)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          ou em até 6× de {fmt.format(result.installment)} sem juros
        </div>
      </div>

      <Button onClick={scrollToQuote} size="lg" className="w-full mt-4">
        Quero orçamento exato sem compromisso
      </Button>

      {!compact && (
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Compra segura
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            Entrega Brasil
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground mt-3">
        * Valores indicativos. Saiba mais nas{" "}
        <Link to="/blog" className="underline hover:text-foreground">
          dicas de medição
        </Link>
        .
      </p>
    </div>
  );
}

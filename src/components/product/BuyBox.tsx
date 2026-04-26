import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Truck, Ruler, MessageCircle, ChevronRight, Info, Wrench, Sparkles } from "lucide-react";
import type { Product } from "@/routes/produto.$slug";
import { toast } from "sonner";
import { CheckoutDialog } from "./CheckoutDialog";
import { ShippingCalculator } from "./ShippingCalculator";
import type { ShippingQuote } from "@/lib/frenet.functions";
import { loadSelection, saveSelection } from "@/lib/product-selection";
import { openLumiWith } from "@/components/site/LumiWidget";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Gera lista de opções em cm, com label "0,30 (30 cm)"
function buildMeasureOptions(minCm: number, maxCm: number) {
  const opts: { cm: number; label: string }[] = [];
  for (let cm = minCm; cm <= maxCm; cm++) {
    const meters = (cm / 100).toFixed(2).replace(".", ",");
    opts.push({ cm, label: `${meters} (${cm} cm)` });
  }
  return opts;
}

type Motor = "manual" | "rf" | "wifi";
type Mount = "inside" | "outside";
type Side = "left" | "right";

export function BuyBox({
  product,
  onColorChange,
}: {
  product: Product;
  onColorChange?: (color: string) => void;
}) {
  // Restaurar seleção persistida (sessionStorage por slug)
  const initial = useMemo(() => loadSelection(product.slug), [product.slug]);

  const [width, setWidth] = useState(initial.widthCm ?? product.min_width_cm);
  const [height, setHeight] = useState(initial.heightCm ?? product.min_height_cm);
  const [mount, setMount] = useState<Mount>("inside");
  const [side, setSide] = useState<Side>("right");
  const [motor, setMotor] = useState<Motor>("manual");
  const [bando, setBando] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shipping, setShipping] = useState<ShippingQuote | null>(null);
  // Garante cores padrão caso o produto não tenha cores cadastradas
  const productColors = useMemo(() => {
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.filter((c) => c && c.name && c.hex);
    }
    return [
      { name: "Branco", hex: "#FFFFFF" },
      { name: "Bege", hex: "#D7C4A3" },
      { name: "Cinza", hex: "#7E8794" },
      { name: "Grafite", hex: "#3A3A3A" },
    ];
  }, [product.colors]);
  const [color, setColor] = useState(
    initial.color && productColors.some((c) => c.name === initial.color)
      ? initial.color
      : (productColors[0]?.name ?? "Branco"),
  );

  // Notifica o pai (página do produto) para sincronizar a galeria + persiste.
  useEffect(() => {
    onColorChange?.(color);
    saveSelection(product.slug, { color });
  }, [color, onColorChange, product.slug]);

  // Persiste medidas
  useEffect(() => {
    saveSelection(product.slug, { widthCm: width, heightCm: height });
  }, [width, height, product.slug]);

  const widthOptions = useMemo(
    () => buildMeasureOptions(product.min_width_cm, product.max_width_cm),
    [product.min_width_cm, product.max_width_cm],
  );
  const heightOptions = useMemo(
    () => buildMeasureOptions(product.min_height_cm, product.max_height_cm),
    [product.min_height_cm, product.max_height_cm],
  );

  const validation = useMemo(() => {
    const errors: string[] = [];
    const fmt = (cm: number) => `${(cm / 100).toFixed(2)} m`;
    if (width < product.min_width_cm) errors.push(`Largura mínima ${fmt(product.min_width_cm)}`);
    if (width > product.max_width_cm) errors.push(`Largura máxima ${fmt(product.max_width_cm)}`);
    if (height < product.min_height_cm) errors.push(`Altura mínima ${fmt(product.min_height_cm)}`);
    if (height > product.max_height_cm) errors.push(`Altura máxima ${fmt(product.max_height_cm)}`);
    return errors;
  }, [width, height, product]);

  const motorPrice =
    motor === "manual"
      ? product.motor_manual_price
      : motor === "rf"
        ? product.motor_rf_price
        : product.motor_wifi_price;

  const subtotal = useMemo(() => {
    const area = Math.max((width * height) / 10000, product.min_area);
    return area * product.price_per_sqm + motorPrice + (bando ? product.bando_price : 0);
  }, [width, height, motor, bando, product, motorPrice]);

  const shippingCost = shipping?.price ?? 0;
  const total = subtotal + shippingCost;
  const pix = total * 0.95;
  const installment = total / 6;
  const suggestMotor = width >= 220 && motor === "manual";

  function handleBuy() {
    if (validation.length) {
      toast.error(validation[0]);
      return;
    }
    setCheckoutOpen(true);
  }

  function handleWhats() {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse na *${product.name}*\n\n` +
        `📐 Medidas: ${(width / 100).toFixed(2)} m × ${(height / 100).toFixed(2)} m\n` +
        `🔧 Acionamento: ${motor === "manual" ? "Manual" : motor === "rf" ? "Motor RF" : "Motor Wi-Fi"}\n` +
        `🎨 Cor: ${color}\n` +
        `${bando ? "✨ Com bandô\n" : ""}` +
        `💰 Total estimado: ${BRL(total)}\n` +
        `💳 Em até 6× de ${BRL(installment)} sem juros (ou ${BRL(pix)} no PIX – 5% off)`,
    );
    window.open(`https://wa.me/5500000000000?text=${msg}`, "_blank");
  }

  return (
    <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-sand text-graphite uppercase text-[10px] tracking-widest">
            Sob medida
          </Badge>
          {product.badge && (
            <Badge className="bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
              {product.badge}
            </Badge>
          )}
        </div>
        <h1 className="font-display text-3xl lg:text-4xl leading-tight">{product.name}</h1>
        <p className="text-muted-foreground mt-2 text-base leading-relaxed">{product.short_description}</p>

        <div className="flex items-center gap-2 mt-3 text-sm">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">· {product.reviews_count.toLocaleString("pt-BR")} avaliações</span>
        </div>
      </div>

      {/* Price block */}
      <div className="rounded-2xl border bg-gradient-to-br from-card via-card to-sand/40 p-5 shadow-card ring-1 ring-border/50">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Sua persiana por</div>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="font-display text-4xl lg:text-[44px] leading-none bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{BRL(total)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">
            ou em até <strong className="text-foreground">6× de {BRL(installment)} sem juros</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 text-success font-medium">
            <span className="h-2 w-2 rounded-full bg-success" />
            PIX {BRL(pix)} <span className="text-xs text-muted-foreground">(-5%)</span>
          </span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Preço por m²: <strong className="text-foreground">{BRL(product.price_per_sqm)}</strong> · área mínima cobrada {product.min_area} m²
        </div>
      </div>

      {/* Configurador estilo Blinds.com — etapas numeradas */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <h3 className="font-display text-lg">Medidas</h3>
            </div>
            <a href="#como-medir" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
              <Info className="h-3.5 w-3.5" /> Como medir
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Largura da Persiana
              </Label>
              <Select
                value={String(width)}
                onValueChange={(v) => setWidth(Number(v))}
              >
                <SelectTrigger className="h-12 text-base font-medium mt-1">
                  <SelectValue placeholder="Selecione a opção" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {widthOptions.map((o) => (
                    <SelectItem key={o.cm} value={String(o.cm)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Altura da Persiana
              </Label>
              <Select
                value={String(height)}
                onValueChange={(v) => setHeight(Number(v))}
              >
                <SelectTrigger className="h-12 text-base font-medium mt-1">
                  <SelectValue placeholder="Selecione a opção" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {heightOptions.map((o) => (
                    <SelectItem key={o.cm} value={String(o.cm)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {validation.map((err) => (
            <p key={err} className="text-xs text-destructive mt-2">⚠ {err}</p>
          ))}
          {suggestMotor && (
            <div className="mt-2 text-xs bg-primary/5 text-primary rounded-md px-3 py-2 border border-primary/20">
              💡 Para essa largura, recomendamos motorização para uso confortável.
            </div>
          )}
        </div>

        <OptionGroup
          step={2}
          label="Tipo de instalação"
          value={mount}
          onChange={(v) => setMount(v as Mount)}
          options={[
            { v: "inside", l: "Dentro do vão" },
            { v: "outside", l: "Fora do vão" },
          ]}
        />

        <OptionGroup
          step={3}
          label="Lado do comando"
          value={side}
          onChange={(v) => setSide(v as Side)}
          options={[
            { v: "left", l: "Esquerda" },
            { v: "right", l: "Direita" },
          ]}
        />

        <OptionGroup
          step={4}
          label="Acionamento"
          value={motor}
          onChange={(v) => setMotor(v as Motor)}
          options={[
            { v: "manual", l: "Manual", price: product.motor_manual_price },
            { v: "rf", l: "Motor RF", price: product.motor_rf_price },
            { v: "wifi", l: "Motor Wi-Fi", price: product.motor_wifi_price },
          ]}
        />

        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              5
            </span>
            <h3 className="font-display text-lg">
              Cor: <span className="text-muted-foreground text-base font-normal">{color}</span>
            </h3>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {productColors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={`h-11 w-11 rounded-full border-2 transition ${
                  color === c.name ? "border-primary scale-110 shadow-md" : "border-border hover:border-foreground/40"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              6
            </span>
            <h3 className="font-display text-lg">Acabamento</h3>
          </div>
          <button
            type="button"
            onClick={() => setBando(!bando)}
            className={`w-full text-left p-4 rounded-xl border-2 transition ${
              bando ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{bando ? "✓ Com bandô" : "Adicionar bandô"}</span>
              <span className="text-sm text-muted-foreground">+ {BRL(product.bando_price)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Acabamento elegante que esconde o mecanismo.</p>
          </button>
        </div>
      </div>

      {/* Frete */}
      <ShippingCalculator
        productId={product.id}
        invoiceValue={subtotal}
        selectedCode={shipping?.serviceCode ?? null}
        onSelect={setShipping}
      />

      {shipping && (
        <div className="rounded-xl bg-sand/40 p-3 text-sm flex justify-between">
          <span className="text-muted-foreground">Frete ({shipping.carrier})</span>
          <span className="font-semibold">{BRL(shipping.price)}</span>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        <Button
          size="lg"
          className="w-full h-14 text-base bg-primary hover:bg-primary/90 shadow-glow"
          onClick={handleBuy}
        >
          COMPRAR AGORA <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleWhats}
          className="w-full h-12 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-whatsapp-foreground"
        >
          <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() =>
            openLumiWith({
              productName: product.name,
              productSlug: product.slug,
              widthCm: width,
              heightCm: height,
              motor,
              color,
              bando,
              estimatedTotal: total,
            })
          }
          className="w-full h-12 bg-foreground/[0.03] hover:bg-foreground/[0.06] text-foreground"
        >
          <Sparkles className="h-4 w-4 text-primary" /> Perguntar à Lumi
        </Button>
      </div>

      {/* Mini trust */}
      <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
        <div>
          <Ruler className="h-5 w-5 mx-auto text-primary mb-1" />
          Sob medida
        </div>
        <div>
          <Truck className="h-5 w-5 mx-auto text-primary mb-1" />
          Entrega Brasil
        </div>
        <div>
          <Wrench className="h-5 w-5 mx-auto text-primary mb-1" />
          Instalação simples
        </div>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={total}
        subtotal={subtotal}
        shipping={shipping}
        item={{
          productId: product.id,
          productName: product.name,
          widthCm: width,
          heightCm: height,
          motor,
          color,
          bando,
          unitPrice: product.price_per_sqm,
        }}
      />
    </div>
  );
}

function OptionGroup({
  step,
  label,
  value,
  onChange,
  options,
}: {
  step?: number;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string; price?: number }[];
}) {
  return (
    <div>
      {step ? (
        <div className="flex items-center gap-2.5 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {step}
          </span>
          <h3 className="font-display text-lg">{label}</h3>
        </div>
      ) : (
        <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">{label}</Label>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition text-left ${
              value === o.v ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
            }`}
          >
            <div>{o.l}</div>
            {typeof o.price === "number" && o.price > 0 && (
              <div className="text-[10px] text-muted-foreground mt-0.5">+ {BRL(o.price)}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

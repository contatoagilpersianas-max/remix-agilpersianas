import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Truck, Ruler, MessageCircle, ChevronRight, Info } from "lucide-react";
import type { Product } from "@/routes/produto.$slug";
import { toast } from "sonner";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Motor = "manual" | "rf" | "wifi";
type Mount = "inside" | "outside";
type Side = "left" | "right";

export function BuyBox({ product }: { product: Product }) {
  const [width, setWidth] = useState(180);
  const [height, setHeight] = useState(160);
  const [mount, setMount] = useState<Mount>("inside");
  const [side, setSide] = useState<Side>("right");
  const [motor, setMotor] = useState<Motor>("manual");
  const [bando, setBando] = useState(false);
  const [color, setColor] = useState(product.colors?.[0]?.name ?? "");

  const validation = useMemo(() => {
    const errors: string[] = [];
    if (width < product.min_width_cm) errors.push(`Largura mínima ${product.min_width_cm} cm`);
    if (width > product.max_width_cm) errors.push(`Largura máxima ${product.max_width_cm} cm`);
    if (height < product.min_height_cm) errors.push(`Altura mínima ${product.min_height_cm} cm`);
    if (height > product.max_height_cm) errors.push(`Altura máxima ${product.max_height_cm} cm`);
    return errors;
  }, [width, height, product]);

  const motorPrice =
    motor === "manual"
      ? product.motor_manual_price
      : motor === "rf"
        ? product.motor_rf_price
        : product.motor_wifi_price;

  const total = useMemo(() => {
    const area = Math.max((width * height) / 10000, product.min_area);
    return area * product.price_per_sqm + motorPrice + (bando ? product.bando_price : 0);
  }, [width, height, motor, bando, product, motorPrice]);

  const pix = total * 0.95;
  const installment = total / 12;
  const suggestMotor = width >= 220 && motor === "manual";

  function handleBuy() {
    if (validation.length) {
      toast.error(validation[0]);
      return;
    }
    toast.success("Adicionado ao carrinho!", {
      description: `${product.name} — ${width}×${height} cm — ${BRL(total)}`,
    });
  }

  function handleWhats() {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse na *${product.name}*\n\n` +
        `📐 Medidas: ${width} × ${height} cm\n` +
        `🔧 Acionamento: ${motor === "manual" ? "Manual" : motor === "rf" ? "Motor RF" : "Motor Wi-Fi"}\n` +
        `🎨 Cor: ${color}\n` +
        `${bando ? "✨ Com bandô\n" : ""}` +
        `💰 Total estimado: ${BRL(total)}`,
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
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Sua persiana por</div>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="font-display text-4xl lg:text-5xl text-foreground">{BRL(total)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">
            ou em até <strong className="text-foreground">12× de {BRL(installment)}</strong>
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

      {/* Configurador */}
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg">Personalize sua persiana</h3>
            <a href="#como-medir" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
              <Info className="h-3.5 w-3.5" /> Como medir
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Largura (cm)</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                className="h-12 text-lg font-medium"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{product.min_width_cm} – {product.max_width_cm} cm</p>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Altura (cm)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
                className="h-12 text-lg font-medium"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{product.min_height_cm} – {product.max_height_cm} cm</p>
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
          label="Tipo de instalação"
          value={mount}
          onChange={(v) => setMount(v as Mount)}
          options={[
            { v: "inside", l: "Dentro do vão" },
            { v: "outside", l: "Fora do vão" },
          ]}
        />

        <OptionGroup
          label="Lado do comando"
          value={side}
          onChange={(v) => setSide(v as Side)}
          options={[
            { v: "left", l: "Esquerda" },
            { v: "right", l: "Direita" },
          ]}
        />

        <OptionGroup
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
          <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Acabamento</Label>
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

        {product.colors?.length > 0 && (
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
              Cor: <span className="text-foreground font-medium">{color}</span>
            </Label>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    color === c.name ? "border-primary scale-110 shadow-md" : "border-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

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
          <ShieldCheck className="h-5 w-5 mx-auto text-primary mb-1" />
          Garantia 5 anos
        </div>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string; price?: number }[];
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">{label}</Label>
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

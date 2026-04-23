import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createAsaasCharge } from "@/lib/asaas.functions";
import { ShippingCalculator } from "./ShippingCalculator";
import type { ShippingQuote } from "@/lib/frenet.functions";
import { applyWelcomeCoupon, registerCouponUsage, WELCOME_COUPON } from "@/lib/coupon";
import { Tag } from "lucide-react";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD";

export type CheckoutItem = {
  productId: string;
  productName: string;
  widthCm: number;
  heightCm: number;
  motor: string;
  color: string;
  bando: boolean;
  unitPrice: number;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  total: number;
  subtotal?: number;
  shipping?: ShippingQuote | null;
  item: CheckoutItem;
};

type ChargeResult = {
  paymentId: string;
  invoiceUrl: string;
  pixQrCode: string | null;
  pixPayload: string | null;
  billingType: BillingType;
};

export function CheckoutDialog({
  open,
  onOpenChange,
  total,
  subtotal,
  shipping: initialShipping,
  item,
}: Props) {
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [billingType, setBillingType] = useState<BillingType>("PIX");
  const [name, setName] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<ShippingQuote | null>(initialShipping ?? null);
  const [result, setResult] = useState<ChargeResult | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const baseSubtotal = subtotal ?? total;
  const shippingCost = shipping?.price ?? 0;
  const finalTotal = Math.max(0, baseSubtotal + shippingCost - couponDiscount);

  async function handleApplyCoupon() {
    if (!email) {
      setCouponMsg({ ok: false, text: "Informe seu e-mail acima para validar o cupom." });
      return;
    }
    if (couponCode.trim().toUpperCase() !== WELCOME_COUPON.code) {
      setCouponMsg({ ok: false, text: "Cupom não reconhecido." });
      setCouponDiscount(0);
      return;
    }
    setCouponLoading(true);
    const r = await applyWelcomeCoupon(email, baseSubtotal);
    setCouponLoading(false);
    if (!r.ok) {
      setCouponDiscount(0);
      setCouponMsg({ ok: false, text: r.reason ?? "Cupom inválido." });
      return;
    }
    setCouponDiscount(r.discount);
    setCouponMsg({ ok: true, text: `Cupom aplicado: -${BRL(r.discount)}` });
  }

  const createCharge = useServerFn(createAsaasCharge);

  function reset() {
    setStep("form");
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) return toast.error("Informe seu nome completo");
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14)
      return toast.error("CPF ou CNPJ inválido");
    if (!shipping) return toast.error("Calcule e selecione o frete antes de continuar");

    setStep("loading");
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: name,
          customer_email: email || null,
          customer_phone: phone || null,
          items: [
            {
              productId: item.productId,
              name: item.productName,
              width_cm: item.widthCm,
              height_cm: item.heightCm,
              motor: item.motor,
              color: item.color,
              bando: item.bando,
              unit_price: item.unitPrice,
            },
          ],
          subtotal: baseSubtotal,
          discount: couponDiscount,
          total: finalTotal,
          notes: [
            shipping
              ? `Frete: ${shipping.carrier} (${shipping.serviceDescription}) - ${shipping.deliveryDays}d - R$ ${shipping.price.toFixed(2)} | CEP ${cep || "-"}`
              : null,
            couponDiscount > 0 ? `Cupom ${WELCOME_COUPON.code}: -${BRL(couponDiscount)}` : null,
          ].filter(Boolean).join(" | "),
        })
        .select("id")
        .single();

      if (orderErr || !order) {
        throw new Error(
          orderErr?.message ?? "Não foi possível criar o pedido. Tente novamente.",
        );
      }

      // 2. Gera cobrança no Asaas
      const charge = await createCharge({
        data: {
          orderId: order.id,
          billingType,
          customer: {
            name,
            cpfCnpj: digits,
            email: email || undefined,
            phone: phone || undefined,
            postalCode: cep.replace(/\D/g, "") || undefined,
          },
        },
      });

      if (!charge.success) {
        throw new Error(charge.error ?? "Falha ao gerar a cobrança");
      }

      setResult({
        paymentId: charge.paymentId,
        invoiceUrl: charge.invoiceUrl,
        pixQrCode: charge.pixQrCode,
        pixPayload: charge.pixPayload,
        billingType,
      });
      if (couponDiscount > 0 && email) {
        registerCouponUsage(email, order.id).catch(() => {});
      }
      setStep("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro inesperado";
      toast.error(msg);
      setStep("form");
    }
  }

  function copyPix() {
    if (!result?.pixPayload) return;
    navigator.clipboard.writeText(result.pixPayload);
    toast.success("Código PIX copiado!");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Finalizar compra</DialogTitle>
              <DialogDescription>
                {item.productName} ·{" "}
                <strong className="text-foreground">{BRL(finalTotal)}</strong>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                  Forma de pagamento
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "PIX", l: "PIX", sub: "5% off" },
                      { v: "BOLETO", l: "Boleto", sub: "3 dias" },
                      { v: "CREDIT_CARD", l: "Cartão", sub: "12×" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setBillingType(o.v)}
                      className={`px-3 py-3 rounded-xl border-2 text-sm font-medium transition ${
                        billingType === o.v
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <div>{o.l}</div>
                      <div className="text-[10px] text-muted-foreground">{o.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="ck-name">Nome completo*</Label>
                  <Input
                    id="ck-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ck-doc">CPF ou CNPJ*</Label>
                  <Input
                    id="ck-doc"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="ck-email">E-mail</Label>
                    <Input
                      id="ck-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ck-phone">Telefone</Label>
                    <Input
                      id="ck-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(31) 9..."
                    />
                  </div>
                </div>
              </div>

              {/* Frete */}
              <div className="rounded-xl border p-3 bg-sand/30 space-y-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Entrega
                </div>
                <ShippingCalculator
                  productId={item.productId}
                  invoiceValue={baseSubtotal}
                  selectedCode={shipping?.serviceCode ?? null}
                  onSelect={(s) => setShipping(s)}
                  onCepChange={setCep}
                  compact
                />
              </div>

              {/* Cupom de boas-vindas */}
              <div className="rounded-xl border border-dashed border-primary/40 p-3 bg-primary/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Tag className="h-3.5 w-3.5" /> Cupom de desconto
                </div>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex.: BEMVINDO10"
                    className="h-9 uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                  >
                    {couponLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Aplicar"}
                  </Button>
                </div>
                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.ok ? "text-success" : "text-destructive"}`}>
                    {couponMsg.text}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  💡 {WELCOME_COUPON.label} — válido apenas na 1ª compra (validamos pelo seu e-mail).
                </p>
              </div>

              {/* Resumo */}
              <div className="rounded-xl bg-muted/40 p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{BRL(baseSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{shipping ? BRL(shippingCost) : "—"}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Cupom {WELCOME_COUPON.code}</span>
                    <span>-{BRL(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-base pt-1 border-t">
                  <span>Total</span>
                  <span>{BRL(finalTotal)}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-12" disabled={!shipping}>
                Gerar cobrança · {BRL(finalTotal)}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Pagamento processado com segurança via Asaas. Seus dados não são
                armazenados em cartão.
              </p>
            </form>
          </>
        )}

        {step === "loading" && (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Gerando sua cobrança…</p>
          </div>
        )}

        {step === "success" && result && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-success" />
                Cobrança gerada
              </DialogTitle>
              <DialogDescription>
                Pedido criado. Conclua o pagamento abaixo — confirmamos
                automaticamente assim que cair.
              </DialogDescription>
            </DialogHeader>

            {result.billingType === "PIX" && result.pixQrCode && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <img
                    src={result.pixQrCode}
                    alt="QR Code PIX"
                    className="h-56 w-56 rounded-lg border bg-white p-2"
                  />
                </div>
                {result.pixPayload && (
                  <div>
                    <Label className="text-xs">Pix Copia e Cola</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        readOnly
                        value={result.pixPayload}
                        className="text-xs font-mono"
                      />
                      <Button type="button" variant="outline" onClick={copyPix}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button asChild size="lg" className="w-full">
              <a href={result.invoiceUrl} target="_blank" rel="noopener">
                <ExternalLink className="h-4 w-4" />
                {result.billingType === "BOLETO"
                  ? "Visualizar boleto"
                  : result.billingType === "CREDIT_CARD"
                    ? "Pagar com cartão"
                    : "Ver fatura completa"}
              </a>
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

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

  const baseSubtotal = subtotal ?? total;
  const shippingCost = shipping?.price ?? 0;
  const finalTotal = baseSubtotal + shippingCost;

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
          total: finalTotal,
          notes: shipping
            ? `Frete: ${shipping.carrier} (${shipping.serviceDescription}) - ${shipping.deliveryDays}d - R$ ${shipping.price.toFixed(2)} | CEP ${cep || "-"}`
            : null,
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
      <DialogContent className="max-w-md">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Finalizar compra</DialogTitle>
              <DialogDescription>
                Total <strong className="text-foreground">{BRL(total)}</strong> ·{" "}
                {item.productName}
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

              <Button type="submit" size="lg" className="w-full h-12">
                Gerar cobrança · {BRL(total)}
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

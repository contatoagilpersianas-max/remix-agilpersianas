import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FRENET_URL = "https://api.frenet.com.br/shipping/quote";

const QuoteSchema = z.object({
  destinationCep: z
    .string()
    .min(8)
    .max(9)
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20).default(1),
  invoiceValue: z.number().min(0).max(1_000_000),
});

export type ShippingQuote = {
  carrier: string;
  serviceCode: string;
  serviceDescription: string;
  price: number;
  deliveryDays: number;
};

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const quoteShipping = createServerFn({ method: "POST" })
  .inputValidator((input: z.infer<typeof QuoteSchema>) => QuoteSchema.parse(input))
  .handler(async ({ data }) => {
    const token = process.env.FRENET_TOKEN;
    if (!token) {
      console.error("Frenet: FRENET_TOKEN não configurado");
      return { success: false as const, error: "Frete indisponível no momento" };
    }

    // Carrega o produto (cubagem)
    const { data: product, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("weight_kg, package_length_cm, package_width_cm, package_height_cm")
      .eq("id", data.productId)
      .maybeSingle();
    if (prodErr || !product) {
      return { success: false as const, error: "Produto não encontrado" };
    }

    // CEP de origem (site_settings.shipping.origin_cep)
    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "shipping")
      .maybeSingle();
    const originCep = onlyDigits(
      ((setting?.value as { origin_cep?: string } | null)?.origin_cep) ?? "36080220",
    );

    const body = {
      SellerCEP: originCep,
      RecipientCEP: onlyDigits(data.destinationCep),
      ShipmentInvoiceValue: Number(data.invoiceValue.toFixed(2)),
      ShippingServiceCode: null,
      ShippingItemArray: [
        {
          Height: product.package_height_cm,
          Length: product.package_length_cm,
          Width: product.package_width_cm,
          Weight: Number(product.weight_kg),
          Quantity: data.quantity,
          SKU: data.productId,
          Category: "Persianas",
        },
      ],
      RecipientCountry: "BR",
    };

    try {
      const res = await fetch(FRENET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token,
        },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ShippingSevicesArray?: Array<{
          Carrier: string;
          ServiceCode: string;
          ServiceDescription: string;
          ShippingPrice: string;
          DeliveryTime: string;
          Error?: boolean;
          Msg?: string;
        }>;
        Msg?: string;
      };

      if (!res.ok) {
        return { success: false as const, error: json?.Msg ?? `Frenet ${res.status}` };
      }

      const services = (json.ShippingSevicesArray ?? [])
        .filter((s) => !s.Error && Number(s.ShippingPrice) > 0)
        // Apenas Jadlog — Correios (PAC/SEDEX) desativados a pedido
        .filter((s) => /jadlog/i.test(s.Carrier))
        .map<ShippingQuote>((s) => ({
          carrier: s.Carrier,
          serviceCode: s.ServiceCode,
          serviceDescription: s.ServiceDescription,
          price: Number(String(s.ShippingPrice).replace(",", ".")),
          deliveryDays: Number(s.DeliveryTime) || 0,
        }))
        .sort((a, b) => a.price - b.price);

      if (services.length === 0) {
        return { success: false as const, error: "Nenhum serviço disponível para este CEP" };
      }

      return { success: true as const, services };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao consultar frete";
      console.error("Frenet error:", msg);
      return { success: false as const, error: msg };
    }
  });

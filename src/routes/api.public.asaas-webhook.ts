import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Webhook público do Asaas.
 * URL pública: https://agil2.lovable.app/api/public/asaas-webhook
 *
 * Configure essa URL em: Asaas → Integrações → Webhooks (eventos de cobrança).
 *
 * Segurança: o Asaas envia um header `asaas-access-token` (configurado pelo
 * usuário no painel do Asaas). Recomendamos definir esse token igual ao
 * conteúdo de `ASAAS_WEBHOOK_TOKEN` (secret separado). Enquanto não houver
 * token configurado, o webhook aceita qualquer chamada — útil só em sandbox.
 */
export const Route = createFileRoute("/api/public/asaas-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
        if (expectedToken) {
          const sent = request.headers.get("asaas-access-token");
          if (sent !== expectedToken) {
            return new Response("Unauthorized", { status: 401 });
          }
        }

        let payload: {
          event?: string;
          payment?: {
            id: string;
            status: string;
            externalReference?: string;
          };
        };
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const ev = payload.event;
        const pay = payload.payment;
        if (!ev || !pay?.id) {
          return new Response("ok", { status: 200 });
        }

        // Mapeia o status
        const status = (() => {
          switch (ev) {
            case "PAYMENT_CONFIRMED":
            case "PAYMENT_RECEIVED":
              return "pago";
            case "PAYMENT_OVERDUE":
              return "vencido";
            case "PAYMENT_REFUNDED":
            case "PAYMENT_DELETED":
              return "estornado";
            case "PAYMENT_CHARGEBACK_REQUESTED":
            case "PAYMENT_CHARGEBACK_DISPUTE":
              return "contestado";
            default:
              return null;
          }
        })();

        if (status) {
          const { error } = await supabaseAdmin
            .from("orders")
            .update({
              payment_status: status,
              ...(status === "pago" ? { status: "pago" } : {}),
            })
            .eq("asaas_payment_id", pay.id);

          if (error) console.error("Asaas webhook update error:", error);
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

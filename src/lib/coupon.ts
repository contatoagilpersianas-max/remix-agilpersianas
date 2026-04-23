/**
 * Cupom de boas-vindas (10% na 1ª compra).
 * Validação por e-mail: consulta orders + coupon_redemptions via RPC pública.
 */
import { supabase } from "@/integrations/supabase/client";

export const WELCOME_COUPON = {
  code: "BEMVINDO10",
  discount: 0.1, // 10%
  label: "10% OFF na primeira compra",
};

export async function isFirstPurchase(email: string): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  // RPC: is_first_purchase(_email text) -> boolean
  const { data, error } = await supabase.rpc("is_first_purchase" as never, {
    _email: normalized,
  } as never);
  if (error) {
    if (import.meta.env.DEV) console.warn("[coupon] rpc error", error.message);
    return false;
  }
  return Boolean(data);
}

export async function applyWelcomeCoupon(
  email: string,
  subtotal: number,
): Promise<{ ok: boolean; discount: number; reason?: string }> {
  const eligible = await isFirstPurchase(email);
  if (!eligible) {
    return { ok: false, discount: 0, reason: "Cupom válido apenas na 1ª compra." };
  }
  return { ok: true, discount: subtotal * WELCOME_COUPON.discount };
}

export async function registerCouponUsage(email: string, orderId?: string) {
  const normalized = email.trim().toLowerCase();
  await supabase.from("coupon_redemptions").insert({
    email: normalized,
    code: WELCOME_COUPON.code,
    order_id: orderId ?? null,
  } as never);
}

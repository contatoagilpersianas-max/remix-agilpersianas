// Analytics helpers — Meta Pixel + GA4
// IDs públicos (publishable). Substitua pelos da empresa quando disponíveis.
export const META_PIXEL_ID = "0000000000000000"; // TODO: trocar pelo ID real
export const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"; // TODO: trocar pelo ID real

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type LeadPayload = {
  value?: number;
  currency?: string;
  content_name?: string;
  source?: string;
};

export function trackLead(payload: LeadPayload = {}) {
  const value = payload.value ?? 0;
  const currency = payload.currency ?? "BRL";
  try {
    window.fbq?.("track", "Lead", {
      value,
      currency,
      content_name: payload.content_name,
    });
  } catch {
    /* noop */
  }
  try {
    window.gtag?.("event", "generate_lead", {
      value,
      currency,
      content_name: payload.content_name,
      source: payload.source,
    });
  } catch {
    /* noop */
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  try {
    window.fbq?.("trackCustom", name, params);
  } catch {
    /* noop */
  }
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* noop */
  }
}

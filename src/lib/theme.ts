/**
 * Aplica o tema básico salvo em site_settings (key='theme') ao :root.
 * Usado no admin (preview ao vivo) e no Footer/__root para consistência.
 */
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ThemeColors = {
  primary?: string; // hex
  secondary?: string;
  background?: string;
};

const VARS = {
  primary: "--primary",
  secondary: "--secondary",
  background: "--background",
} as const;

/** Converte hex (#rrggbb) → string oklch aproximado para tokens do design system. */
function hexToOklch(hex: string): string | null {
  const m = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  // Aproximação simples: luminância sRGB → L em oklch + chroma estimada via saturação
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const c = d * 0.25; // chroma aprox
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h})`;
}

export function applyTheme(theme: ThemeColors | null | undefined) {
  if (!theme || typeof document === "undefined") return;
  const root = document.documentElement;
  (Object.keys(VARS) as (keyof typeof VARS)[]).forEach((k) => {
    const value = theme[k];
    if (!value) return;
    const oklch = hexToOklch(value);
    if (oklch) root.style.setProperty(VARS[k], oklch);
  });
}

/** Hook que carrega o tema do banco e aplica no :root. */
export function useSiteTheme() {
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "theme")
        .maybeSingle();
      if (!alive) return;
      applyTheme(data?.value as ThemeColors | null);
    })();
    return () => {
      alive = false;
    };
  }, []);
}

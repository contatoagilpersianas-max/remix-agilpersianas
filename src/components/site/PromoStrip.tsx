import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_ITEMS = [
  "Cortinas e persianas sob medida",
  "Toldos e telas mosquiteiras",
  "Produção própria",
  "Instalação simples",
  "Envio para todo o Brasil",
  "Parcele em até 6× sem juros",
  "5% de desconto no PIX",
  "Atendimento via WhatsApp",
];

export function PromoStrip() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "promo_strip")
        .maybeSingle();
      if (cancelled || !data?.value) return;
      const v = data.value as { items?: string[]; enabled?: boolean };
      if (Array.isArray(v.items) && v.items.length) setItems(v.items.filter(Boolean));
      if (typeof v.enabled === "boolean") setEnabled(v.enabled);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled || !items.length) return null;
  const loop = [...items, ...items, ...items];
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "#E2763A" }}
    >
      <div className="flex whitespace-nowrap py-1.5 sm:py-2 animate-marquee will-change-transform">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-6 sm:mx-8 inline-flex items-center gap-3 text-[12px] sm:text-[13px] md:text-[14px] font-bold uppercase tracking-[0.18em] text-white"
          >
            {t}
            <span className="text-white/70 text-[18px] leading-none">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

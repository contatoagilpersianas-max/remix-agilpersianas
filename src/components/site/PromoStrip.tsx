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
  // Duplicar exatamente uma vez — combina com keyframe translateX(-50%) para loop seamless
  const loop = [...items, ...items];
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "#E2763A" }}
    >
      <div className="flex w-max whitespace-nowrap py-1.5 sm:py-2 animate-marquee will-change-transform">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-3 sm:mx-6 md:mx-8 inline-flex items-center gap-2 sm:gap-3 text-[10.5px] sm:text-[12px] md:text-[14px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white"
          >
            {t}
            <span className="text-white/70 text-[16px] sm:text-[18px] leading-none">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

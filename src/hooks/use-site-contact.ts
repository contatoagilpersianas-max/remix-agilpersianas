import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG, whatsappLink as legacyWaLink } from "@/lib/site-config";

export type SiteContact = {
  whatsapp: string;
  whatsappDisplay: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

export const DEFAULT_CONTACT: SiteContact = {
  whatsapp: SITE_CONFIG.whatsappNumber,
  whatsappDisplay: SITE_CONFIG.whatsappDisplay,
  phone: SITE_CONFIG.phoneDisplay,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  hours: SITE_CONFIG.hours,
  instagram: "https://instagram.com/agilpersianas",
  facebook: "https://facebook.com/agilpersianas",
  youtube: "",
  tiktok: "",
};

export function useSiteContact() {
  const [contact, setContact] = useState<SiteContact>(DEFAULT_CONTACT);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "contact")
        .maybeSingle();
      if (cancelled || !data?.value) return;
      setContact({ ...DEFAULT_CONTACT, ...(data.value as Partial<SiteContact>) });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return contact;
}

export function whatsappLink(number: string, text?: string) {
  const clean = (number || "").replace(/\D/g, "");
  if (!clean) return legacyWaLink(text);
  const base = `https://wa.me/${clean}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
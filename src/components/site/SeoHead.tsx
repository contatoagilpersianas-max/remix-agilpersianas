import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Sincroniza meta tags editáveis pelo admin (site_settings.seo) com o <head>
 * em runtime. Os defaults SSR vivem em __root.tsx.
 */
export function SeoHead() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "seo")
        .maybeSingle();
      if (cancelled || !data?.value || typeof document === "undefined") return;
      const seo = data.value as {
        title?: string;
        description?: string;
        keywords?: string[];
        canonical?: string;
        ogImage?: string;
      };
      if (seo.title) {
        document.title = seo.title;
        upsertMeta("property", "og:title", seo.title);
        upsertMeta("name", "twitter:title", seo.title);
      }
      if (seo.description) {
        upsertMeta("name", "description", seo.description);
        upsertMeta("property", "og:description", seo.description);
        upsertMeta("name", "twitter:description", seo.description);
      }
      if (seo.keywords?.length) {
        upsertMeta("name", "keywords", seo.keywords.join(", "));
      }
      if (seo.canonical) {
        upsertLink("canonical", seo.canonical);
      }
      if (seo.ogImage) {
        upsertMeta("property", "og:image", seo.ogImage);
        upsertMeta("name", "twitter:image", seo.ogImage);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
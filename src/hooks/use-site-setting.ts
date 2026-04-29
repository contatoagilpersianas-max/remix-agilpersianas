import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook para load/save de uma chave em site_settings.
 * Faz merge raso com defaults para sobreviver a mudanças de schema.
 */
export function useSiteSetting<T extends Record<string, unknown> | unknown[]>(
  key: string,
  defaults: T,
) {
  const [value, setValue] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (cancelled) return;
      if (data?.value) {
        if (Array.isArray(defaults)) {
          setValue(Array.isArray(data.value) ? (data.value as T) : defaults);
        } else {
          setValue({ ...(defaults as object), ...(data.value as object) } as T);
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  const save = useCallback(
    async (next?: T) => {
      const payload = next ?? value;
      setSaving(true);
      const { error } = await supabase
        .from("site_settings")
        .upsert([{ key, value: payload as never }]);
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("✓ Salvo com sucesso", {
        style: { background: "hsl(142 71% 45%)", color: "white", border: "none" },
        duration: 3000,
      });
      return true;
    },
    [key, value],
  );

  return { value, setValue, save, loading, saving };
}
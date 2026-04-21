import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Megaphone, Tag, Bell } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/marketing")({ component: Marketing });

function Marketing() {
  const [promo, setPromo] = useState({ enabled: true, text: "Frete grátis para SP em compras acima de R$ 1.500", cta_label: "Saiba mais", cta_url: "/promocoes" });
  const [coupon, setCoupon] = useState({ code: "AGIL10", discount_percent: 10, active: true });
  const [popup, setPopup] = useState({ enabled: false, title: "", message: "", cta: "" });
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key,value").in("key", ["promo_bar", "coupon_default", "popup_welcome"]);
      data?.forEach((row) => {
        if (row.key === "promo_bar") setPromo(row.value as typeof promo);
        if (row.key === "coupon_default") setCoupon(row.value as typeof coupon);
        if (row.key === "popup_welcome") setPopup(row.value as typeof popup);
      });
    })();
  }, []);

  async function save(key: string, value: object) {
    setSaving(key);
    const { error } = await supabase.from("site_settings").upsert([{ key, value: value as never }]);
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Salvo");
  }

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Aquisição</div>
        <h1 className="font-display text-3xl mt-1">Marketing</h1>
        <p className="text-muted-foreground text-sm mt-1">Barra promocional, cupons e popups.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Megaphone className="h-5 w-5 text-primary" /><h2 className="font-semibold">Barra promocional (topo do site)</h2></div>
        <div className="grid gap-3">
          <label className="flex items-center gap-2 text-sm"><Switch checked={promo.enabled} onCheckedChange={(v) => setPromo({ ...promo, enabled: v })} /> Ativada</label>
          <div><Label>Mensagem</Label><Input value={promo.text} onChange={(e) => setPromo({ ...promo, text: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Texto do link</Label><Input value={promo.cta_label} onChange={(e) => setPromo({ ...promo, cta_label: e.target.value })} /></div>
            <div><Label>URL do link</Label><Input value={promo.cta_url} onChange={(e) => setPromo({ ...promo, cta_url: e.target.value })} /></div>
          </div>
          <div className="flex justify-end"><Button onClick={() => save("promo_bar", promo)} disabled={saving === "promo_bar"}>{saving === "promo_bar" && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Tag className="h-5 w-5 text-primary" /><h2 className="font-semibold">Cupom em destaque</h2></div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>Código</Label><Input value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} /></div>
          <div><Label>Desconto (%)</Label><Input type="number" value={coupon.discount_percent} onChange={(e) => setCoupon({ ...coupon, discount_percent: Number(e.target.value) })} /></div>
          <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><Switch checked={coupon.active} onCheckedChange={(v) => setCoupon({ ...coupon, active: v })} /> Ativo</label></div>
        </div>
        <div className="flex justify-end mt-4"><Button onClick={() => save("coupon_default", coupon)} disabled={saving === "coupon_default"}>{saving === "coupon_default" && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button></div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Bell className="h-5 w-5 text-primary" /><h2 className="font-semibold">Popup de boas-vindas</h2></div>
        <div className="grid gap-3">
          <label className="flex items-center gap-2 text-sm"><Switch checked={popup.enabled} onCheckedChange={(v) => setPopup({ ...popup, enabled: v })} /> Mostrar popup</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Título</Label><Input value={popup.title} onChange={(e) => setPopup({ ...popup, title: e.target.value })} /></div>
            <div><Label>CTA</Label><Input value={popup.cta} onChange={(e) => setPopup({ ...popup, cta: e.target.value })} /></div>
          </div>
          <div><Label>Mensagem</Label><Input value={popup.message} onChange={(e) => setPopup({ ...popup, message: e.target.value })} /></div>
          <div className="flex justify-end"><Button onClick={() => save("popup_welcome", popup)} disabled={saving === "popup_welcome"}>{saving === "popup_welcome" && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button></div>
        </div>
      </Card>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Store, Phone, Share2, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({ component: Settings });

function Settings() {
  const { user } = useAuth();
  const [store, setStore] = useState({ name: "", tagline: "", pix_discount: 5, installments: 12 });
  const [contact, setContact] = useState({ phone: "", whatsapp: "", email: "", address: "" });
  const [social, setSocial] = useState({ instagram: "", facebook: "", youtube: "" });
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key,value").in("key", ["store", "contact", "social"]);
      data?.forEach((row) => {
        if (row.key === "store") setStore(row.value as typeof store);
        if (row.key === "contact") setContact(row.value as typeof contact);
        if (row.key === "social") setSocial(row.value as typeof social);
      });
    })();
  }, []);

  async function save(key: string, value: object) {
    setSaving(key);
    const { error } = await supabase.from("site_settings").upsert({ key, value });
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Salvo");
  }

  async function changePassword() {
    if (pwd.length < 8) return toast.error("Mínimo 8 caracteres");
    setSaving("pwd");
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada");
    setPwd("");
  }

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Configurações</div>
        <h1 className="font-display text-3xl mt-1">Ajustes da loja</h1>
        <p className="text-muted-foreground text-sm mt-1">Dados da empresa, contatos, redes sociais e segurança.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Store className="h-5 w-5 text-primary" /><h2 className="font-semibold">Loja</h2></div>
        <div className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Nome da loja</Label><Input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} /></div>
            <div><Label>Slogan</Label><Input value={store.tagline} onChange={(e) => setStore({ ...store, tagline: e.target.value })} /></div>
            <div><Label>Desconto PIX (%)</Label><Input type="number" value={store.pix_discount} onChange={(e) => setStore({ ...store, pix_discount: Number(e.target.value) })} /></div>
            <div><Label>Parcelas máximas</Label><Input type="number" value={store.installments} onChange={(e) => setStore({ ...store, installments: Number(e.target.value) })} /></div>
          </div>
          <div className="flex justify-end"><Button onClick={() => save("store", store)} disabled={saving === "store"}>{saving === "store" && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Phone className="h-5 w-5 text-primary" /><h2 className="font-semibold">Contato</h2></div>
        <div className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Telefone</Label><Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
            <div><Label>WhatsApp (com DDI 55)</Label><Input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="5511999999999" /></div>
            <div><Label>E-mail</Label><Input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
            <div><Label>Endereço</Label><Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} /></div>
          </div>
          <div className="flex justify-end"><Button onClick={() => save("contact", contact)} disabled={saving === "contact"}>{saving === "contact" && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Share2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Redes sociais</h2></div>
        <div className="grid gap-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Instagram</Label><Input value={social.instagram} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} /></div>
            <div><Label>Facebook</Label><Input value={social.facebook} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} /></div>
            <div><Label>YouTube</Label><Input value={social.youtube} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} /></div>
          </div>
          <div className="flex justify-end"><Button onClick={() => save("social", social)} disabled={saving === "social"}>{saving === "social" && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</Button></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-primary" /><h2 className="font-semibold">Segurança</h2></div>
        <p className="text-xs text-muted-foreground mb-3">Logado como <span className="font-medium">{user?.email}</span></p>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <div><Label>Nova senha (mín. 8 caracteres)</Label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></div>
          <div className="flex items-end"><Button onClick={changePassword} disabled={saving === "pwd"}>{saving === "pwd" && <Loader2 className="h-4 w-4 animate-spin" />} Trocar senha</Button></div>
        </div>
      </Card>
    </div>
  );
}

import { Phone, Instagram, Facebook, Youtube, Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModuleCard, RequiredLabel } from "./_shared/ModuleCard";
import { WhatsAppField } from "./_shared/WhatsAppField";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { DEFAULT_CONTACT, type SiteContact } from "@/hooks/use-site-contact";

export function ContactModule() {
  const { value: c, setValue, save, saving } = useSiteSetting<SiteContact>("contact", DEFAULT_CONTACT);
  const u = (patch: Partial<SiteContact>) => setValue({ ...c, ...patch });

  return (
    <ModuleCard
      id="mod-contact"
      icon={Phone}
      title="Informações globais de contato"
      description="Aplicado automaticamente em todos os botões e no footer do site."
      saveLabel="Salvar contato"
      onSave={() => save()}
      saving={saving}
    >
      <WhatsAppField
        label={<RequiredLabel>WhatsApp principal</RequiredLabel>}
        value={c.whatsapp}
        onChange={(v) => u({ whatsapp: v })}
        hint="Formato internacional, só números (ex: 5532351202810)"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>WhatsApp formatado (exibição)</Label>
          <Input value={c.whatsappDisplay} onChange={(e) => u({ whatsappDisplay: e.target.value })} placeholder="(32) 3512-0281" />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input value={c.phone} onChange={(e) => u({ phone: e.target.value })} placeholder="(32) 3512-0281" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label><RequiredLabel>E-mail</RequiredLabel></Label>
          <Input value={c.email} onChange={(e) => u({ email: e.target.value })} placeholder="contato@agilpersianas.com.br" />
        </div>
        <div>
          <Label>Horário de atendimento</Label>
          <Input value={c.hours} onChange={(e) => u({ hours: e.target.value })} placeholder="seg a sáb, 8h–20h" />
        </div>
      </div>
      <div>
        <Label>Endereço</Label>
        <Input value={c.address} onChange={(e) => u({ address: e.target.value })} placeholder="Rua, número — cidade/UF" />
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Redes sociais</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="flex items-center gap-1.5"><Instagram className="h-3.5 w-3.5" /> Instagram</Label>
            <Input value={c.instagram} onChange={(e) => u({ instagram: e.target.value })} placeholder="https://instagram.com/agilpersianas" />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Facebook className="h-3.5 w-3.5" /> Facebook</Label>
            <Input value={c.facebook} onChange={(e) => u({ facebook: e.target.value })} placeholder="https://facebook.com/agilpersianas" />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Youtube className="h-3.5 w-3.5" /> YouTube</Label>
            <Input value={c.youtube} onChange={(e) => u({ youtube: e.target.value })} placeholder="https://youtube.com/@agilpersianas" />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Music2 className="h-3.5 w-3.5" /> TikTok</Label>
            <Input value={c.tiktok} onChange={(e) => u({ tiktok: e.target.value })} placeholder="https://tiktok.com/@agilpersianas" />
          </div>
        </div>
      </div>
    </ModuleCard>
  );
}
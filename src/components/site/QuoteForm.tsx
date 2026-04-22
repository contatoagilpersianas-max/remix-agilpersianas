import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { trackLead } from "@/lib/analytics";

type Props = {
  defaultInterest?: string;
  source?: string;
  compact?: boolean;
};

export function QuoteForm({ defaultInterest, source = "site", compact = false }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState(defaultInterest ?? "");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Preencha nome e WhatsApp");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      email: email || null,
      message: message || null,
      product_interest: interest || null,
      source,
      status: "novo",
    });
    setSending(false);
    if (error) {
      toast.error("Erro ao enviar. Tente o WhatsApp.");
      return;
    }
    trackLead({
      content_name: interest || "orcamento_geral",
      source,
      value: 1,
      currency: "BRL",
    });
    setDone(true);
    toast.success("Recebemos! Entraremos em contato em breve.");
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <div className="h-14 w-14 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center mb-3">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-display text-xl">Pedido recebido!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Em breve um especialista entrará em contato pelo WhatsApp informado.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>
          Enviar outro pedido
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`grid gap-3 ${compact ? "" : "rounded-2xl border bg-card p-5 sm:p-6"}`}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Nome*</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>WhatsApp*</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>E-mail</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Produto de interesse</Label>
          <Input value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Persiana rolô blackout..." />
        </div>
      </div>
      <div>
        <Label>Como podemos ajudar?</Label>
        <Textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Medidas aproximadas, ambiente, dúvidas..."
        />
      </div>
      <Button type="submit" size="lg" disabled={sending} className="mt-1">
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Solicitar orçamento sem compromisso
      </Button>
      <p className="text-[11px] text-muted-foreground text-center">
        Resposta em até 1 hora útil. Atendimento humano.
      </p>
    </form>
  );
}

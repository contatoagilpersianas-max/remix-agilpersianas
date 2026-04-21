import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageCircle, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/admin/orcamentos")({ component: Quotes });

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  product_interest: string | null;
  status: string;
  created_at: string;
  source: string | null;
};

function Quotes() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("*")
      .or("source.eq.orcamento,product_interest.not.is.null")
      .order("created_at", { ascending: false });
    setRows((data as Lead[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    load();
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Funil comercial</div>
        <h1 className="font-display text-3xl mt-1">Orçamentos</h1>
        <p className="text-muted-foreground text-sm mt-1">Solicitações de orçamento recebidas pelo site e WhatsApp.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-1">Nenhum orçamento ainda.</p>
          <p className="text-xs text-muted-foreground">Eles aparecerão aqui assim que clientes solicitarem orçamento no site.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((l) => (
            <Card key={l.id} className="p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{l.name}</h3>
                    <Badge variant="outline">{l.status}</Badge>
                    {l.source && <Badge variant="secondary">{l.source}</Badge>}
                  </div>
                  {l.product_interest && <div className="text-sm text-primary mt-1">Interesse: {l.product_interest}</div>}
                  {l.message && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{l.message}</p>}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                    {l.phone && (
                      <a href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                        <MessageCircle className="h-3.5 w-3.5" /> {l.phone}
                      </a>
                    )}
                    {l.email && (
                      <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3.5 w-3.5" /> {l.email}
                      </a>
                    )}
                    <span>{new Date(l.created_at).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setStatus(l.id, "em_andamento")}>Em andamento</Button>
                  <Button size="sm" onClick={() => setStatus(l.id, "ganho")}>Ganho</Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(l.id, "perdido")}>Perdido</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

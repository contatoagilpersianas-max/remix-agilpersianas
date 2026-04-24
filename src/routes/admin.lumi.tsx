import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, MessageCircle, User, Phone, Clock, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/lumi")({
  component: LumiAdmin,
});

type Conversation = {
  id: string;
  visitor_id: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  context: Record<string, unknown>;
  lead_name: string | null;
  lead_phone: string | null;
  lead_status: string;
  product_interest: string | null;
  message_count: number;
  last_user_message: string | null;
  page_url: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  browsing: { label: "Em conversa", cls: "bg-muted text-muted-foreground" },
  captured: { label: "Lead captado", cls: "bg-success/15 text-success" },
};

function LumiAdmin() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "captured" | "browsing">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lumi_conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) console.error(error);
      setConvos((data ?? []) as unknown as Conversation[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return convos.filter((c) => {
      if (statusFilter !== "all" && c.lead_status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        c.visitor_id.toLowerCase().includes(q) ||
        (c.lead_name ?? "").toLowerCase().includes(q) ||
        (c.lead_phone ?? "").includes(q) ||
        (c.product_interest ?? "").toLowerCase().includes(q) ||
        (c.last_user_message ?? "").toLowerCase().includes(q)
      );
    });
  }, [convos, query, statusFilter]);

  const selected = convos.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Conversas Lumi</div>
          <h1 className="font-display text-3xl mt-1 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-primary" />
            Atendimentos da Lumi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Histórico completo de conversas, contexto do visitante e status do lead.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Stat label="Conversas" value={convos.length} />
          <Stat label="Leads captados" value={convos.filter((c) => c.lead_status === "captured").length} highlight />
        </div>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por visitante, nome, telefone, produto ou mensagem"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {(["all", "captured", "browsing"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 h-8 text-xs rounded-full transition ${
                statusFilter === s ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              {s === "all" ? "Todas" : s === "captured" ? "Com lead" : "Sem lead"}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-[420px_1fr] gap-4">
        <Card className="p-0 overflow-hidden max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Carregando…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma conversa encontrada.</div>
          ) : (
            <ul className="divide-y">
              {filtered.map((c) => {
                const st = STATUS_LABEL[c.lead_status] ?? STATUS_LABEL.browsing;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition ${
                        selectedId === c.id ? "bg-muted/60" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {(c.lead_name?.[0] ?? "?").toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {c.lead_name ?? `Visitante ${c.visitor_id.slice(2, 8)}`}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {c.product_interest ?? "Sem produto definido"}
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-[10px] ${st.cls}`} variant="secondary">{st.label}</Badge>
                      </div>
                      {c.last_user_message && (
                        <p className="text-xs text-muted-foreground line-clamp-2 pl-10">
                          “{c.last_user_message}”
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pl-10 text-[10px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> {c.message_count} msgs
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(c.updated_at).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-0 overflow-hidden max-h-[70vh] flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-8">
              Selecione uma conversa à esquerda para ver os detalhes.
            </div>
          ) : (
            <>
              <div className="border-b p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Visitante</div>
                    <div className="font-display text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {selected.lead_name ?? `Anônimo · ${selected.visitor_id.slice(2, 10)}`}
                    </div>
                    {selected.lead_phone && (
                      <a
                        href={`https://wa.me/55${selected.lead_phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-whatsapp hover:underline mt-1"
                      >
                        <Phone className="h-3.5 w-3.5" /> {selected.lead_phone}
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    {(() => {
                      const st = STATUS_LABEL[selected.lead_status] ?? STATUS_LABEL.browsing;
                      return <Badge className={st.cls} variant="secondary">{st.label}</Badge>;
                    })()}
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {new Date(selected.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>
                {selected.context && Object.keys(selected.context).length > 0 && (
                  <div className="rounded-xl bg-muted/50 p-3 text-xs grid grid-cols-2 gap-2">
                    {Object.entries(selected.context).slice(0, 8).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-muted-foreground">{k}:</span>{" "}
                        <span className="font-medium">{String(typeof v === "object" ? JSON.stringify(v) : v).slice(0, 60)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selected.page_url && (
                  <a
                    href={selected.page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> {selected.page_url}
                  </a>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-muted/20">
                {selected.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-background border border-border/60"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {selected.lead_phone && (
                <div className="border-t p-4 bg-background flex justify-end">
                  <Button asChild className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground">
                    <a
                      href={`https://wa.me/55${selected.lead_phone}?text=${encodeURIComponent(`Olá ${selected.lead_name ?? ""}, sou da Ágil Persianas. Vi sua conversa com a Lumi e tenho uma proposta para você.`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> Continuar no WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-xl ${highlight ? "bg-primary/10 text-primary" : "bg-muted"}`}>
      <div className="text-xs">{label}</div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}

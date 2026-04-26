import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Search,
  MessageCircle,
  User,
  Phone,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Video,
  Upload,
  Eye,
  EyeOff,
  Brain,
} from "lucide-react";
import { toast } from "sonner";

type LumiSearch = { tab?: "conversas" | "cerebro" };

export const Route = createFileRoute("/admin/lumi")({
  validateSearch: (search: Record<string, unknown>): LumiSearch => ({
    tab: search.tab === "cerebro" ? "cerebro" : "conversas",
  }),
  component: LumiAdmin,
});

function LumiAdmin() {
  const search = useSearch({ from: "/admin/lumi" });
  const tab = search.tab ?? "conversas";

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary font-semibold inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Inteligência Artificial
        </div>
        <h1 className="font-display text-3xl mt-1 flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          Lumi · Central de IA
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tudo sobre a Lumi em um só lugar — atendimentos em tempo real e o cérebro
          que alimenta as respostas.
        </p>
      </div>

      <div className="flex gap-1 rounded-full bg-muted p-1 w-fit">
        <TabLink
          to="/admin/lumi"
          search={{ tab: "conversas" }}
          active={tab === "conversas"}
          icon={<MessageCircle className="h-3.5 w-3.5" />}
        >
          Conversas
        </TabLink>
        <TabLink
          to="/admin/lumi"
          search={{ tab: "cerebro" }}
          active={tab === "cerebro"}
          icon={<Brain className="h-3.5 w-3.5" />}
        >
          Cérebro da Lumi
        </TabLink>
      </div>

      {tab === "conversas" ? <ConversationsPanel /> : <KnowledgePanel />}
    </div>
  );
}

function TabLink({
  to,
  search,
  active,
  icon,
  children,
}: {
  to: string;
  search: LumiSearch;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  // Use plain anchor with TanStack-friendly query string to avoid type narrowing churn
  const href = `${to}?tab=${search.tab}`;
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1.5 px-4 h-9 text-xs rounded-full transition ${
        active ? "bg-background shadow-sm font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </a>
  );
}

/* ============================================================
   PAINEL: CONVERSAS
   ============================================================ */
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

function ConversationsPanel() {
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
    <div className="space-y-4">
      <div className="flex items-end justify-end gap-3 text-sm">
        <Stat label="Conversas" value={convos.length} />
        <Stat label="Leads captados" value={convos.filter((c) => c.lead_status === "captured").length} highlight />
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

/* ============================================================
   PAINEL: CÉREBRO DA LUMI (base de conhecimento)
   ============================================================ */
type Knowledge = {
  id: string;
  title: string;
  kind: string;
  content: string | null;
  url: string | null;
  file_path: string | null;
  tags: string[];
  active: boolean;
  position: number;
  created_at: string;
};

const KIND_META: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  text: { label: "Texto", icon: FileText, color: "bg-foreground/10 text-foreground" },
  faq: { label: "FAQ", icon: Sparkles, color: "bg-primary/10 text-primary" },
  link: { label: "Link", icon: LinkIcon, color: "bg-blue-500/10 text-blue-600" },
  file: { label: "Arquivo", icon: Upload, color: "bg-amber-500/10 text-amber-700" },
  image: { label: "Imagem", icon: ImageIcon, color: "bg-emerald-500/10 text-emerald-700" },
  video: { label: "Vídeo", icon: Video, color: "bg-purple-500/10 text-purple-700" },
};

function KnowledgePanel() {
  const [items, setItems] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    kind: "text",
    content: "",
    url: "",
    tags: "",
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("lumi_knowledge")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Knowledge[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => setForm({ title: "", kind: "text", content: "", url: "", tags: "" });

  const submit = async () => {
    if (!form.title.trim()) {
      toast.error("Informe um título.");
      return;
    }
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("lumi_knowledge").insert({
      title: form.title.trim(),
      kind: form.kind,
      content: form.content.trim() || null,
      url: form.url.trim() || null,
      tags,
    });
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Conhecimento adicionado à Lumi.");
    reset();
    load();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Máximo 20MB por arquivo.");
      return;
    }
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("lumi-files").upload(path, file);
      if (upErr) throw upErr;
      const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
      await supabase.from("lumi_knowledge").insert({
        title: file.name,
        kind,
        file_path: path,
        content: `Arquivo: ${file.name} (${Math.round(file.size / 1024)} KB)`,
        tags: ["arquivo"],
      });
      toast.success("Arquivo enviado.");
      load();
    } catch (err: unknown) {
      toast.error("Erro: " + (err instanceof Error ? err.message : "desconhecido"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("lumi_knowledge").update({ active: !active }).eq("id", id);
    load();
  };

  const remove = async (it: Knowledge) => {
    if (!confirm("Remover este conhecimento?")) return;
    if (it.file_path) await supabase.storage.from("lumi-files").remove([it.file_path]);
    await supabase.from("lumi_knowledge").delete().eq("id", it.id);
    load();
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground -mt-2">
        Tudo que adicionar aqui passa a fazer parte das respostas da Lumi no site.
        Use textos, FAQs, links de referência, fotos, vídeos ou arquivos.
      </p>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        {/* Form */}
        <Card className="p-5 space-y-3 h-fit sticky top-20">
          <div className="font-semibold text-sm">Adicionar conhecimento</div>

          <div className="grid grid-cols-3 gap-2">
            {(["text", "faq", "link"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setForm((f) => ({ ...f, kind: k }))}
                className={`h-9 text-xs rounded-lg border transition ${
                  form.kind === k ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {KIND_META[k].label}
              </button>
            ))}
          </div>

          <Input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {form.kind === "link" ? (
            <Input
              placeholder="https://…"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          ) : (
            <Textarea
              placeholder={form.kind === "faq" ? "Resposta da FAQ" : "Conteúdo / contexto"}
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          )}
          <Input
            placeholder="Tags (separar por vírgula)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <Button onClick={submit} className="w-full">
            <Plus className="h-4 w-4" /> Adicionar
          </Button>

          <div className="border-t pt-3 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ou envie arquivos
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
              onChange={handleFile}
              disabled={uploading}
              className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-background hover:file:bg-foreground/90"
            />
            <p className="text-[10px] text-muted-foreground">PDF, imagens, vídeos. Máx. 20MB.</p>
          </div>
        </Card>

        {/* Lista */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading ? "Carregando…" : `${items.length} item(ns) na base`}
            </div>
          </div>

          {items.length === 0 && !loading && (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              Nenhum conhecimento ainda. Comece adicionando informações sobre seus produtos.
            </Card>
          )}

          {items.map((it) => {
            const meta = KIND_META[it.kind] ?? KIND_META.text;
            const Icon = meta.icon;
            return (
              <Card key={it.id} className={`p-4 ${!it.active ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg ${meta.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-sm">{it.title}</div>
                      <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
                      {it.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                    {it.content && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.content}</p>
                    )}
                    {it.url && (
                      <a href={it.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block break-all">
                        {it.url}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggle(it.id, it.active)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted"
                      title={it.active ? "Desativar" : "Ativar"}
                    >
                      {it.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => remove(it)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

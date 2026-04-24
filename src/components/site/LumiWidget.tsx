// LUMI — widget de chat IA premium (estilo Apple)
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "agil_lumi_chat_v1";
const LEAD_FLAG_KEY = "agil_lumi_lead_saved";

const INITIAL_GREETING: Msg = {
  role: "assistant",
  content:
    "Olá. Sou a Lumi, da Ágil Persianas. Posso ajudar você a escolher a persiana ideal. Para qual ambiente?",
};

function parseLeadMarker(text: string): {
  cleaned: string;
  lead: { name: string; phone: string; interest: string } | null;
} {
  const match = text.match(/\[LEAD_CAPTURED:([^|]+)\|([^|]+)\|([^\]]*)\]/);
  if (!match) return { cleaned: text, lead: null };
  return {
    cleaned: text.replace(match[0], "").trim(),
    lead: {
      name: match[1].trim(),
      phone: match[2].trim(),
      interest: match[3].trim() || "Persiana sob medida",
    },
  };
}

export function LumiWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restaurar conversa
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
  }, []);

  // Persistir
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Para de pulsar quando abrir
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  const saveLead = async (lead: {
    name: string;
    phone: string;
    interest: string;
  }) => {
    if (localStorage.getItem(LEAD_FLAG_KEY)) return;
    try {
      const { error } = await supabase.from("leads").insert({
        name: lead.name,
        phone: lead.phone,
        product_interest: lead.interest,
        source: "lumi_chat",
        status: "novo",
        message: "Lead capturado via LUMI (chat IA)",
      });
      if (error) throw error;
      localStorage.setItem(LEAD_FLAG_KEY, "1");
      toast.success("Tudo certo! Um especialista entrará em contato.");
    } catch (e) {
      console.error("[LUMI] saveLead error", e);
    }
  };

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lumi-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast.error("Muitas mensagens. Aguarde alguns segundos.");
        } else if (resp.status === 402) {
          toast.error("IA temporariamente indisponível.");
        } else {
          toast.error("Não consegui responder agora. Tente novamente.");
        }
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let assistantStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            buffer = "";
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as
              | string
              | undefined;
            if (delta) {
              assistantText += delta;
              const { cleaned } = parseLeadMarker(assistantText);
              if (!assistantStarted) {
                assistantStarted = true;
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: cleaned },
                ]);
              } else {
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1
                      ? { ...m, content: cleaned }
                      : m,
                  ),
                );
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final: checa marcador e salva lead
      const { lead } = parseLeadMarker(assistantText);
      if (lead) await saveLead(lead);
    } catch (err) {
      console.error("[LUMI] stream error", err);
      toast.error("Conexão instável. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chat com a Lumi"
          className="fixed bottom-6 left-6 z-40 group inline-flex h-14 items-center gap-2.5 rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-2xl transition hover:scale-105"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            {pulse && (
              <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
            )}
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="hidden sm:inline">Falar com a Lumi</span>
        </button>
      )}

      {/* Janela do chat */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 sm:inset-auto sm:bottom-6 sm:left-6 sm:w-[380px]"
          role="dialog"
          aria-label="Chat com a Lumi"
        >
          <div className="flex flex-col h-[100dvh] sm:h-[560px] bg-background border border-border/60 sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
                <div>
                  <div className="font-display text-base text-foreground" style={{ fontWeight: 500 }}>
                    Lumi
                  </div>
                  <div className="text-[11px] text-muted-foreground -mt-0.5">
                    Consultora · online agora
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-muted transition"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-background text-foreground border border-border/60 rounded-bl-md"
                    }`}
                  >
                    {m.content || (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
              {loading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="bg-background border border-border/60 rounded-2xl rounded-bl-md px-4 py-3">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}
            </div>

            {/* Input */}
            <form
              onSubmit={send}
              className="border-t border-border/60 px-3 py-3 bg-background"
            >
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escreva sua mensagem…"
                  disabled={loading}
                  className="flex-1 h-11 px-4 rounded-full bg-muted text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar"
                  className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition hover:opacity-90"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground/70 text-center">
                Ao enviar, você concorda em ser contatado pela Ágil Persianas.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

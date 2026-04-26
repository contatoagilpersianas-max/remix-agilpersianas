// LUMI — widget de chat IA premium (estilo Apple)
// Suporta: contexto de produto/carrinho, persistência de conversa,
// captura de lead com validação de telefone BR.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };
export type LumiContext = {
  productName?: string;
  productSlug?: string;
  widthCm?: number;
  heightCm?: number;
  motor?: "manual" | "rf" | "wifi";
  color?: string;
  bando?: boolean;
  estimatedTotal?: number;
  cartItems?: Array<{ name: string; qty: number }>;
  pageUrl?: string;
  /** Quando true, dispara fluxo de demonstração guiada com perguntas pré-definidas */
  demoMode?: boolean;
};

const STORAGE_KEY = "agil_lumi_chat_v2";
const VISITOR_KEY = "agil_lumi_visitor_v1";
const CONVO_KEY = "agil_lumi_convo_v1";

const INITIAL_GREETING: Msg = {
  role: "assistant",
  content:
    "Olá. Sou a Lumi, da Ágil Persianas. Posso ajudar você a escolher a persiana ideal. Para qual ambiente?",
};

// Mensagens do fluxo de demonstração ao vivo (modo demo)
const DEMO_INTRO: Msg = {
  role: "assistant",
  content:
    "👋 Bem-vindo à demonstração ao vivo da Lumi.\n\nVou te mostrar em 30 segundos como eu ajudo um cliente real a escolher a persiana ideal e receber uma estimativa personalizada — sem compromisso.\n\nVamos começar: para qual ambiente você gostaria de uma persiana?\n• Sala\n• Quarto\n• Escritório\n• Cozinha\n• Área externa",
};

function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "ssr";
  let v = localStorage.getItem(VISITOR_KEY);
  if (!v) {
    v = "v_" + crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, v);
  }
  return v;
}

function buildContextGreeting(ctx: LumiContext): Msg {
  // Modo demonstração: substitui a mensagem contextual padrão
  if (ctx.demoMode) return DEMO_INTRO;
  const parts: string[] = [];
  if (ctx.productName) parts.push(ctx.productName);
  if (ctx.widthCm && ctx.heightCm)
    parts.push(`${(ctx.widthCm / 100).toFixed(2)} m × ${(ctx.heightCm / 100).toFixed(2)} m`);
  if (ctx.motor) {
    const m = ctx.motor === "manual" ? "manual" : ctx.motor === "rf" ? "motor RF" : "motor Wi-Fi";
    parts.push(m);
  }
  if (ctx.color) parts.push(`cor ${ctx.color}`);
  if (ctx.bando) parts.push("com bandô");
  const summary = parts.length ? `\n\nVejo aqui: ${parts.join(" · ")}.` : "";
  return {
    role: "assistant",
    content: `Posso te ajudar com a configuração desse produto.${summary}\n\nQuer que eu calcule uma estimativa e prepare um orçamento?`,
  };
}

export function LumiWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [context, setContext] = useState<LumiContext>({});
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [thinkingHint, setThinkingHint] = useState<string | null>(null);
  const thinkingCleanupRef = useRef<(() => void) | null>(null);
  const visitorIdRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicialização: visitor + restaurar
  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
      const cid = localStorage.getItem(CONVO_KEY);
      if (cid) setConversationId(cid);
    } catch { /* noop */ }
  }, []);

  // Persistir conversa local
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* noop */ }
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      try { localStorage.setItem(CONVO_KEY, conversationId); } catch { /* noop */ }
    }
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => { if (open) setPulse(false); }, [open]);

  // Listener global para abrir com contexto (botão "Perguntar à Lumi")
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<LumiContext>).detail ?? {};
      setContext(detail);
      setOpen(true);
      // Adiciona mensagem contextual sem chamar API ainda
      setMessages((prev) => {
        // Evita duplicar se a última já é contextual idêntica
        const ctxMsg = buildContextGreeting(detail);
        if (prev[prev.length - 1]?.content === ctxMsg.content) return prev;
        return [...prev, ctxMsg];
      });
    }
    window.addEventListener("lumi:open", handler as EventListener);
    return () => window.removeEventListener("lumi:open", handler as EventListener);
  }, []);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Efeito de "consultoria pensando" — sequência de status enquanto a IA não responde
    const thinkingPhrases = [
      "Analisando seu ambiente…",
      "Cruzando privacidade e luminosidade…",
      "Selecionando o modelo ideal no nosso catálogo…",
    ];
    let thinkingIndex = 0;
    const thinkingInterval = setInterval(() => {
      thinkingIndex = (thinkingIndex + 1) % thinkingPhrases.length;
    }, 1400);
    // Primeira frase aparece imediatamente como bolha "fantasma"
    const thinkingTimer = setTimeout(() => {
      setThinkingHint(thinkingPhrases[0]);
      const rotator = setInterval(() => {
        setThinkingHint(thinkingPhrases[thinkingIndex]);
      }, 1400);
      // limpa quando o stream começar (assistantStarted) ou ao final
      thinkingCleanupRef.current = () => {
        clearInterval(rotator);
        clearInterval(thinkingInterval);
        setThinkingHint(null);
      };
    }, 350);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lumi-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          context: { ...context, pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined },
          conversationId,
          visitorId: visitorIdRef.current,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Muitas mensagens. Aguarde alguns segundos.");
        else if (resp.status === 402) toast.error("IA temporariamente indisponível.");
        else toast.error("Não consegui responder agora. Tente novamente.");
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
          if (line.trim() === "") continue;
          // Captura meta da Lumi (conversationId)
          if (line.startsWith(": lumi-meta ")) {
            try {
              const meta = JSON.parse(line.slice(12));
              if (meta.conversationId && !conversationId) setConversationId(meta.conversationId);
            } catch { /* noop */ }
            continue;
          }
          if (line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { buffer = ""; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantText += delta;
              const cleaned = assistantText.replace(/\[LEAD_CAPTURED:[^\]]*\]/, "").trim();
              if (!assistantStarted) {
                assistantStarted = true;
                // Limpa o "thinking" assim que o primeiro token chega
                clearTimeout(thinkingTimer);
                thinkingCleanupRef.current?.();
                thinkingCleanupRef.current = null;
                setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
              } else {
                setMessages((prev) =>
                  prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: cleaned } : m)),
                );
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Toast se lead foi capturado
      if (/\[LEAD_CAPTURED:/.test(assistantText)) {
        toast.success("Recebemos seu contato. Um especialista falará com você em breve.");
      }
    } catch (err) {
      console.error("[LUMI] stream error", err);
      toast.error("Conexão instável. Tente novamente.");
    } finally {
      clearTimeout(thinkingTimer);
      thinkingCleanupRef.current?.();
      thinkingCleanupRef.current = null;
      setLoading(false);
    }
  };

  // Suprime aviso de variável não usada — pulse é setado mas controla apenas
  // a animação inicial do antigo botão. Mantemos para compatibilidade.
  void pulse;

  return (
    <>
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px]"
          role="dialog"
          aria-label="Chat com a Lumi"
        >
          <div className="flex flex-col h-[100dvh] sm:h-[560px] bg-background border border-border/60 sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
                <div>
                  <div className="font-display text-base text-foreground" style={{ fontWeight: 500 }}>Lumi</div>
                  <div className="text-[11px] text-muted-foreground -mt-0.5">
                    {context.productName ? `Configurando: ${context.productName}` : "Consultora · online agora"}
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

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-background text-foreground border border-border/60 rounded-bl-md"
                    }`}
                  >
                    {m.content || <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border/60 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                    {thinkingHint && (
                      <span className="text-[12px] text-muted-foreground italic transition-opacity duration-300">
                        {thinkingHint}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={send} className="border-t border-border/60 px-3 py-3 bg-background">
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
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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

/** Helper para outros componentes abrirem a Lumi com contexto. */
export function openLumiWith(context: LumiContext) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lumi:open", { detail: context }));
}

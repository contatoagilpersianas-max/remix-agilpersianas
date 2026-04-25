// LUMI — Assistente premium da Ágil Persianas
// Streaming via Lovable AI Gateway (google/gemini-3-flash-preview)
// Persiste conversas em public.lumi_conversations e captura leads.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é LUMI, consultora de persianas premium da Ágil Persianas.

PERSONA (estilo Apple — minimalista, elegante, discreta):
- Frases curtas. No máximo 2 ou 3 por resposta.
- Sem emojis. Sem exclamações em excesso.
- Tom: especialista calma, sofisticada, direta.
- Pergunte UMA coisa de cada vez (exceto a captura de contato — ver abaixo).

OBJETIVO: ajudar o visitante a escolher a persiana ideal, simular preço quando possível e captar nome + WhatsApp para envio do orçamento.

FLUXO IDEAL (siga, mas seja flexível):
1. Cumprimente brevemente. Pergunte o ambiente (sala, quarto, escritório, comercial).
2. Pergunte a necessidade principal (privacidade, blackout, controle de luz, decoração).
3. Sugira 1 ou 2 modelos da Ágil. Modelos disponíveis:
   - Persiana Rolo (versátil, controle de luz)
   - Rolo Blackout (escurecimento total — quartos)
   - Double Vision (luz e privacidade alternados)
   - Romana (sofisticada, em tecido)
   - Painel/Wave (vãos largos, salas amplas)
   - Persiana Solar (filtra UV, mantém vista)
   - Horizontal/Vertical (clássicas)
   - Cortinas sob medida
4. Quando o visitante demonstrar interesse OU já tiver contexto de produto/medidas, ofereça orçamento. Peça nome E WhatsApp na MESMA mensagem, em uma frase só. Exemplo:
   "Para enviar seu orçamento, me passa seu nome e WhatsApp? (ex: Maria 31 99999-9999)"
5. Quando receber nome + WhatsApp, agradeça e confirme o próximo passo.

VALIDAÇÃO DO TELEFONE:
- O telefone deve ter 10 ou 11 dígitos numéricos brasileiros (DDD + número).
- Se vier algo inválido (poucos dígitos, e-mail, etc.), peça com gentileza para reenviar no formato (DDD) 9XXXX-XXXX.

SIMULAÇÃO DE PREÇO:
- Quando tiver largura E altura (em metros ou cm), calcule a área (m²) e estime: área × R$ 199/m² (preço base mínimo).
- Diga sempre "estimativa" — o valor final depende do tecido, motorização e acabamento.
- Sugira passar para um orçamento personalizado no WhatsApp.

CONHECIMENTO:
- Tudo sob medida, produção própria.
- A partir de R$ 199/m².
- Até 6× sem juros. PIX com 5% de desconto.
- Entrega para todo o Brasil.
- Motorização opcional (manual, RF, Wi-Fi).

NUNCA:
- Invente preços exatos. Sempre diga "a partir de" ou "estimativa".
- Prometa prazo de entrega específico.
- Use linguagem informal demais ou gírias.
- Mencione marcas concorrentes ou nomes de outras lojas — você é da Ágil Persianas.

Quando o usuário fornecer nome E telefone/WhatsApp válidos, sua resposta DEVE conter exatamente o marcador [LEAD_CAPTURED:nome|telefone|interesse] no início (interesse pode ser o produto/ambiente discutido). Depois do marcador, escreva normalmente sua resposta de agradecimento.`;

function buildContextHint(context: Record<string, unknown> | null | undefined): string {
  if (!context || typeof context !== "object") return "";
  const parts: string[] = [];
  const c = context as Record<string, unknown>;
  if (c.productName) parts.push(`Produto em foco: ${String(c.productName)}`);
  if (c.widthCm && c.heightCm) {
    const w = Number(c.widthCm) / 100;
    const h = Number(c.heightCm) / 100;
    const area = (w * h).toFixed(2);
    parts.push(`Medidas selecionadas: ${w.toFixed(2)} m × ${h.toFixed(2)} m (≈ ${area} m²)`);
  }
  if (c.motor) {
    const motorLabel = c.motor === "manual" ? "Manual" : c.motor === "rf" ? "Motor RF" : "Motor Wi-Fi";
    parts.push(`Acionamento: ${motorLabel}`);
  }
  if (c.color) parts.push(`Cor: ${String(c.color)}`);
  if (c.bando) parts.push(`Acabamento: com bandô`);
  if (c.estimatedTotal) parts.push(`Estimativa atual: R$ ${Number(c.estimatedTotal).toFixed(2).replace(".", ",")}`);
  if (c.cartItems && Array.isArray(c.cartItems) && c.cartItems.length) {
    parts.push(`Itens no carrinho: ${(c.cartItems as unknown[]).length}`);
  }
  if (c.pageUrl) parts.push(`Página: ${String(c.pageUrl)}`);
  if (!parts.length) return "";
  return `\n\nCONTEXTO ATUAL DO VISITANTE:\n- ${parts.join("\n- ")}\n\nUse esse contexto para responder. Se o visitante já configurou um produto, vá direto ao ponto: confirme medidas, simule preço aproximado e ofereça orçamento personalizado.`;
}

function parseLeadMarker(text: string) {
  const match = text.match(/\[LEAD_CAPTURED:([^|]+)\|([^|]+)\|([^\]]*)\]/);
  if (!match) return null;
  return {
    name: match[1].trim(),
    phone: match[2].trim(),
    interest: match[3].trim() || "Persiana sob medida",
  };
}

function validatePhoneBR(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return digits;
  if (digits.length === 12 || digits.length === 13) {
    // pode vir com 55 (código país)
    const trimmed = digits.startsWith("55") ? digits.slice(2) : digits;
    if (trimmed.length === 10 || trimmed.length === 11) return trimmed;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      messages,
      context,
      conversationId,
      visitorId,
      pageUrl,
    }: {
      messages: { role: "user" | "assistant"; content: string }[];
      context?: Record<string, unknown>;
      conversationId?: string | null;
      visitorId?: string;
      pageUrl?: string;
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ausente");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Garante / cria conversa
    let convoId = conversationId ?? null;
    const userAgent = req.headers.get("user-agent") ?? null;
    if (!convoId && visitorId) {
      const { data: created, error: insErr } = await admin
        .from("lumi_conversations")
        .insert({
          visitor_id: visitorId,
          messages: messages,
          context: context ?? {},
          page_url: pageUrl ?? null,
          user_agent: userAgent,
          message_count: messages.length,
          last_user_message: messages[messages.length - 1]?.content?.slice(0, 500) ?? null,
          product_interest: (context?.productName as string | undefined) ?? null,
        })
        .select("id")
        .single();
      if (insErr) console.error("[lumi-chat] insert conversation error:", insErr);
      convoId = created?.id ?? null;
    } else if (convoId) {
      await admin
        .from("lumi_conversations")
        .update({
          messages,
          context: context ?? {},
          message_count: messages.length,
          last_user_message: messages[messages.length - 1]?.content?.slice(0, 500) ?? null,
          page_url: pageUrl ?? null,
        })
        .eq("id", convoId);
    }

    // Carrega knowledge base ativa (limit 40 itens recentes)
    let kbHint = "";
    try {
      const { data: kb } = await admin
        .from("lumi_knowledge")
        .select("title,kind,content,url,tags")
        .eq("active", true)
        .order("position", { ascending: true })
        .limit(40);
      if (kb && kb.length) {
        const lines = kb.map((k) => {
          const tag = k.tags?.length ? ` [${k.tags.join(", ")}]` : "";
          if (k.kind === "link") return `• ${k.title}${tag}: ${k.url ?? ""}`;
          if (k.kind === "faq") return `• FAQ — ${k.title}${tag}: ${k.content ?? ""}`;
          return `• ${k.title}${tag}: ${(k.content ?? "").slice(0, 600)}`;
        });
        kbHint = `\n\nBASE DE CONHECIMENTO INTERNA (use como referência, nunca cite "fonte"):\n${lines.join("\n")}`;
      }
    } catch (e) {
      console.error("[lumi-chat] kb load error:", e);
    }

    const systemWithContext = SYSTEM_PROMPT + buildContextHint(context) + kbHint;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemWithContext },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas mensagens. Aguarde um instante." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos da IA esgotados. Avise o administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream + intercepta texto pra capturar lead e atualizar conversa ao fim
    const upstream = response.body!;
    const reader = upstream.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let assistantText = "";

    const stream = new ReadableStream({
      async start(controller) {
        // Envia primeiro um cabeçalho com convoId para o cliente armazenar
        controller.enqueue(
          encoder.encode(`: lumi-meta ${JSON.stringify({ conversationId: convoId })}\n\n`),
        );
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            const chunk = decoder.decode(value, { stream: true });
            // extrai os deltas só para reconstruir o assistantText
            for (const line of chunk.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const json = line.slice(6).trim();
              if (json === "[DONE]" || !json) continue;
              try {
                const parsed = JSON.parse(json);
                const delta = parsed?.choices?.[0]?.delta?.content;
                if (typeof delta === "string") assistantText += delta;
              } catch { /* ignore */ }
            }
          }
        } catch (e) {
          console.error("[lumi-chat] stream pump error:", e);
        } finally {
          controller.close();
          // Pós-processamento: salva mensagem final do assistente e captura lead
          try {
            const lead = parseLeadMarker(assistantText);
            const cleaned = assistantText.replace(/\[LEAD_CAPTURED:[^\]]*\]/, "").trim();
            const allMessages = [
              ...messages,
              { role: "assistant" as const, content: cleaned },
            ];

            const updates: Record<string, unknown> = {
              messages: allMessages,
              message_count: allMessages.length,
            };

            if (lead && convoId) {
              const validPhone = validatePhoneBR(lead.phone);
              if (validPhone) {
                // Cria lead na tabela leads
                const { data: leadRow } = await admin
                  .from("leads")
                  .insert({
                    name: lead.name,
                    phone: validPhone,
                    product_interest: lead.interest,
                    source: "lumi_chat",
                    status: "novo",
                    message: `Lead capturado via LUMI. Última mensagem: "${(messages[messages.length - 1]?.content ?? "").slice(0, 240)}"`,
                  })
                  .select("id")
                  .single();
                updates.lead_id = leadRow?.id ?? null;
                updates.lead_name = lead.name;
                updates.lead_phone = validPhone;
                updates.lead_status = "captured";
                updates.product_interest = lead.interest;
              }
            }

            if (convoId) {
              await admin.from("lumi_conversations").update(updates).eq("id", convoId);
            }
          } catch (e) {
            console.error("[lumi-chat] post-process error:", e);
          }
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lumi-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

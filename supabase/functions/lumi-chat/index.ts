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

const SYSTEM_PROMPT = `Você é LUMI, consultora virtual premium e vendedora profissional da Ágil Persianas.

MISSÃO: converter o visitante em cliente. Recomendar o produto certo, calcular valor estimado, capturar nome + WhatsApp e levar ao fechamento — como uma consultora arquitetônica que entende o ambiente, não como um formulário.

PERSONA:
- Sofisticada, simpática, consultiva, segura. Estilo Apple — minimalista e elegante.
- Frases curtas, no máximo 2–3 por resposta. Sem emojis em excesso (no máximo 1 por mensagem).
- UMA pergunta por vez (exceto a captura de nome+WhatsApp que vai junto).
- Nunca robotizada. Use tom humano de vendedora premium.

REGRAS DE MARCA (CRÍTICO):
- Você representa EXCLUSIVAMENTE a Ágil Persianas. Tudo é "nosso catálogo", "nossas persianas", "nossa equipe".
- NUNCA cite outras empresas, concorrentes, fontes externas, sites ou marcas.
- NUNCA fale sobre instalação, garantia ou prazos específicos de entrega.
- Não invente preços exatos — sempre "a partir de" ou "estimativa".

FLUXO GUIADO (siga, mas adapte ao contexto do visitante):

ETAPA 1 — Abertura
Cumprimente brevemente. Pergunte o ambiente: Sala, Quarto, Escritório, Cozinha, Loja, Área Externa (varanda/sacada) ou Outro.

ETAPA 2 — Prioridade
"O que é mais importante para você?" — Bloquear luz / Privacidade / Visual moderno / Controle de claridade / Sofisticação / Automação / Custo-benefício.

ETAPA 3 — Recomendação (com efeito de "consultoria pensando")
Antes de revelar o produto recomendado, escreva 1 linha curta de processamento que faça parecer uma análise real, ex.:
"Analisando incidência solar para [ambiente]…"
"Cruzando com suas opções de privacidade…"
Em seguida, sugira 1 ou 2 produtos do CATÁLOGO ATIVO (lista abaixo) explicando POR QUÊ aquele modelo encaixa no ambiente e prioridade do cliente. Use o slug exato para montar o link: https://agil2.lovable.app/produto/SLUG
Exemplos de raciocínio:
- Quarto + bloquear luz → Persiana Rolô Blackout.
- Sala + visual moderno → Double Vision ou Romana.
- Escritório → Rolô Tela Solar ou Double Vision.
- Área externa / sacada → Toldo ou Tela Solar reforçada (sempre projeto sob consulta).

TRIGGER DE COMPLEXIDADE (CRÍTICO — evita venda errada):
Se o visitante indicar QUALQUER um destes cenários, NÃO ofereça botão de "Comprar agora" e NÃO finalize a venda online. Recomende OBRIGATORIAMENTE atendimento humano via WhatsApp:
- Ambiente "Área Externa", varanda, sacada, fachada ou comercial de grande porte.
- Combinação de "Automação" + ambiente "Grande" (acima de 2,5 m em qualquer dimensão).
- Mais de 3 janelas no mesmo projeto.
- Pé-direito alto / vão de vidro extenso.
Nesses casos diga: "Esse projeto pede uma conferência manual da nossa equipe técnica. Vou te conectar direto com um consultor pelo WhatsApp para garantir o orçamento certo." e siga direto para a captura de lead (nome + WhatsApp). Não exiba link de produto para compra direta.

ETAPA 4 — Medidas
"Para estimar o valor preciso de medidas aproximadas. Qual a largura e altura da janela? (ex: 180 × 220 cm)"

FALLBACK SE O CLIENTE NÃO SOUBER MEDIDAS:
Ofereça opções rápidas antes de calcular:
- "Sem problema. Posso adiantar uma faixa estimada."
- "Tamanho aproximado? Pequena (até 1,2 × 1,5 m) / Média (1,5 × 2,0 m) / Grande (2,0 × 2,5 m)"
- "Ou prefere seguir agora e ajustamos depois?"

ETAPA 5 — Cálculo do valor (com captura de lead ANTES de revelar o preço)
Quando tiver largura E altura (ou tamanho aproximado), calcule a área e o valor estimado INTERNAMENTE, mas NÃO revele o número ainda. Em vez disso:
1) Confirme o produto ideal: "Encontrei a persiana perfeita para sua [Sala/Quarto]: [Modelo]."
2) Faça a captura de lead ANTES de liberar o preço: "Para eu te liberar o orçamento e o link de desconto, como te chamo no WhatsApp? (ex: Maria 31 99999-9999)"
3) SOMENTE depois de receber nome + WhatsApp válidos, revele a estimativa: "Para 1,80 × 2,20 m em [Modelo], fica a partir de R$ X. Pode parcelar em até 6× sem juros (≈ R$ Y/mês) ou pagar no PIX com 5% de desconto."
Sempre diga "estimativa" e ofereça orçamento personalizado.

ETAPA 6 — Upgrade Inteligente (em vez de upsell de lista)
Após revelar o preço, ofereça UM upgrade contextual e social-proof. Modelo:
- Quarto: "Para este modelo de Quarto, 80% dos nossos clientes adicionam a Motorização Silenciosa para maior conforto ao acordar. Deseja incluir na simulação?"
- Sala: "A maioria dos clientes de Sala adiciona o bandô decorativo para um acabamento ainda mais elegante. Quer ver com bandô?"
- Escritório: "Clientes de home office costumam preferir o tecido premium anti-glare. Quer essa versão?"
Ofereça apenas UMA sugestão por vez. Se aceito, recalcule a estimativa.

ETAPA 7 — Fechamento
Sempre conduza para uma das ações:
1) "Posso te atender com prioridade no WhatsApp e separar as melhores opções." (sempre disponível)
2) Linkar a página do produto recomendado para o cliente comprar direto — APENAS se NÃO houver trigger de complexidade ativo.

CAPTURA DE LEAD (regras):
- Peça nome E WhatsApp na MESMA mensagem.
- Momento ideal: depois de mostrar o modelo ideal, antes de revelar o preço exato (ETAPA 5).
- Se trigger de complexidade ativo, peça já após a Etapa 3.
- Frase modelo: "Encontrei a persiana perfeita para sua [ambiente]! Para eu te liberar o orçamento e o link de desconto, como te chamo no WhatsApp? (ex: Maria 31 99999-9999)"

VALIDAÇÃO DO TELEFONE:
- 10 ou 11 dígitos numéricos (DDD + número). Se inválido, peça reenvio gentil.

OBJEÇÕES:
- Preço alto: "Posso te mostrar opções dentro do seu orçamento."
- Só pesquisando: "Perfeito. Posso adiantar valores e modelos para facilitar a decisão."
- Indeciso: "Me diga ambiente e prioridade que indico as melhores opções."

CONHECIMENTO BASE:
- Tudo sob medida, produção própria.
- A partir de R$ 199/m².
- Até 6× sem juros. PIX com 5% de desconto.
- Entrega para todo o Brasil.
- Motorização opcional (manual, RF, Wi-Fi).

QUANDO O USUÁRIO FORNECER NOME + TELEFONE/WHATSAPP VÁLIDOS:
Sua resposta DEVE conter exatamente o marcador [LEAD_CAPTURED:nome|telefone|interesse] no INÍCIO da mensagem (interesse = produto/ambiente discutido). Depois do marcador, escreva normalmente: agradeça pelo nome, libere a estimativa de preço (se ainda não liberada), apresente o upgrade inteligente e ofereça o WhatsApp prioritário.`;

async function loadCatalog(admin: ReturnType<typeof createClient<any>>): Promise<string> {
  try {
    const { data } = await admin
      .from("products")
      .select("slug,name,short_description,price_per_sqm")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("bestseller", { ascending: false })
      .limit(40);
    if (!data || !data.length) return "";
    const lines = data.map((p) => {
      const price = p.price_per_sqm ? ` — R$ ${Number(p.price_per_sqm).toFixed(2).replace(".", ",")}/m²` : "";
      const desc = p.short_description ? ` — ${p.short_description}` : "";
      return `• ${p.name} (slug: ${p.slug})${price}${desc}`;
    });
    return `\n\nCATÁLOGO ATIVO ÁGIL PERSIANAS (use para recomendar e calcular preços; link do produto = https://agil2.lovable.app/produto/SLUG):\n${lines.join("\n")}`;
  } catch (e) {
    console.error("[lumi-chat] catalog load error:", e);
    return "";
  }
}

function buildContextHint(context: Record<string, unknown> | null | undefined): string {
  if (!context || typeof context !== "object") return "";
  const parts: string[] = [];
  const c = context as Record<string, unknown>;
  const isDemo = Boolean(c.demoMode);
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
  if (!parts.length && !isDemo) return "";
  if (isDemo) {
    return `\n\nMODO DEMONSTRAÇÃO AO VIVO ATIVO:
- O visitante clicou em "Ver demo ao vivo" para experimentar como você atende.
- Faça uma demonstração CURTA (3 a 4 trocas, no máximo).
- Pergunta 1: ambiente (sala/quarto/escritório/cozinha/área externa).
- Pergunta 2: prioridade (bloquear luz / privacidade / visual moderno / automação).
- Recomendação: sugira 1 modelo do catálogo com mini-justificativa (1-2 linhas).
- Encerramento OBRIGATÓRIO: termine com a frase pronta:
  "Pronto! Essa é uma amostra do meu atendimento. Se quiser receber um orçamento real e personalizado para o seu ambiente, é só me dizer seu nome e WhatsApp que envio na hora — sem compromisso."
- Não calcule preço nem peça medidas no modo demo. Foco em mostrar o fluxo.`;
  }
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

    const catalogHint = await loadCatalog(admin);
    const systemWithContext = SYSTEM_PROMPT + catalogHint + buildContextHint(context) + kbHint;

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

// LUMI — Assistente premium da Ágil Persianas
// Streaming via Lovable AI Gateway (google/gemini-3-flash-preview)
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
- Pergunte UMA coisa de cada vez.

OBJETIVO: ajudar o visitante a escolher a persiana ideal e captar nome + WhatsApp para envio do orçamento.

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
4. Pergunte se quer um orçamento. Se sim, peça nome E WhatsApp na MESMA mensagem.
5. Quando receber nome + WhatsApp, agradeça e confirme que um especialista entrará em contato.

CONHECIMENTO:
- Tudo sob medida, produção própria.
- A partir de R$ 199/m².
- Até 6× sem juros. PIX com 5% de desconto.
- Entrega para todo o Brasil.
- Instalação profissional disponível.
- Motorização opcional (manual, RF, Wi-Fi).

NUNCA:
- Invente preços exatos. Sempre diga "a partir de" ou "depende das medidas".
- Prometa prazo de entrega específico.
- Use linguagem informal demais ou gírias.

Quando o usuário fornecer nome E telefone/WhatsApp, sua resposta DEVE conter exatamente o marcador [LEAD_CAPTURED:nome|telefone|interesse] no início (interesse pode ser o produto/ambiente discutido). Depois do marcador, escreva normalmente sua resposta de agradecimento.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ausente");

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
            { role: "system", content: SYSTEM_PROMPT },
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
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Créditos da IA esgotados. Avise o administrador.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lumi-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

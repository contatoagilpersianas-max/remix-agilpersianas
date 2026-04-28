## Objetivo
Reestruturar o QuizMatch para ser uma **seção full-bleed escura** — o quiz É a seção, sem container branco flutuante. Visual unificado em `#1A1208` do topo ao rodapé.

## Escopo
Apenas `src/components/site/QuizMatch.tsx`. Sem mudanças em lógica, recomendação, dados ou rotas.

---

## Mudanças

### 1. Paleta `dark` — voltar para esquema escuro real
Hoje o objeto `dark` foi reaproveitado como light. Restaurar como dark coerente com o pedido:

```ts
const dark = {
  bg: "#1A1208",
  surface: "#150F08",        // card do bot, chips inativos
  surface2: "#150F08",       // (não mais usado como container, fica de fallback)
  border: "rgba(255,107,53,0.12)",
  borderSoft: "rgba(245,240,232,0.06)",
  borderHard: "rgba(245,240,232,0.18)",
  text: "#F5F0E8",
  textSoft: "#C9BFB2",
  textMuted: "#8A8078",
  textDim: "#6B6157",
  coral: "#FF6B35",
  coralWash: "rgba(255,107,53,0.12)",
  coralBorder: "rgba(255,107,53,0.35)",
};
```

### 2. Wrapper da seção (full-bleed)
Substituir o `container mx-auto max-w-4xl ... py-20` por um wrapper que:
- Ocupa largura total da seção.
- `padding: 100px 20px` no mobile, `100px 40px` no desktop.
- `max-width: 1280px` central — limita a largura para não esticar demais em telas muito largas, mas mantém sensação full-width (vs. 4xl/56rem que parece "caixa").

Glow ambiente atual (radial coral + champagne off-white) será adaptado para tons escuros sutis: `radial-gradient(900px 500px at 50% -10%, rgba(255,107,53,0.08), transparent 60%)` apenas.

### 3. Cabeçalho
- **Largura máxima do bloco do título**: `max-width: 700px`, centralizado.
- **Linha de credencial** mantém estrutura atual, ajustando a cor para `rgba(255,107,53,0.7)` (sobre fundo escuro).
- **Título principal**:
  - Linha 1 "Descubra a persiana" — Playfair Display **weight 300**, `clamp(2.25rem, 5vw, 3.5rem)`, cor `#F5F0E8`.
  - Linha 2 "ideal para sua casa." — Playfair Display **weight 700 itálico**, `clamp(2.25rem, 5vw, 3.5rem)`, cor `#FF6B35`.
- **Separador decorativo** em `rgba(255,107,53,0.4)`.
- **Subtítulo**: `#A8A096` peso 300.
- **Badge "Assistente Inteligente"**: fundo `rgba(255,107,53,0.10)`, borda `rgba(255,107,53,0.30)`, texto `#FF6B35`.
- **Link skip**: `#5A5048` com hover `#8A8078`.

### 4. Remover container branco
Excluir o `<div className="w-full mx-auto rounded-[28px] ... bg #FFFFFF ...">` que envolve o quiz. O conteúdo (stepper, bot, pergunta, cards, botões) fica diretamente dentro do wrapper da seção. Sem padding interno extra, sem borda, sem sombra, sem fundo.

Ajustar margin-top entre cabeçalho e stepper para `mt-12 sm:mt-16` (mantém respiro sem o card como referência visual).

### 5. Stepper
- Bolinhas **inativas**: fundo `transparent`, borda `rgba(245,240,232,0.18)`, texto `#8A8078`.
- Bolinhas **ativas/concluídas**: fundo `#FF6B35`, borda `#FF6B35`, texto branco — mantém.
- Linha conectora inativa: `rgba(245,240,232,0.12)`. Concluída: `#FF6B35`.

### 6. Card do assistente (bot de feedback)
Conforme pedido:
- `background: #150F08`
- `border-left: 3px solid #FF6B35`
- Borda restante: `1px solid rgba(255,107,53,0.12)` (sutil, harmoniza)
- Texto do feedback: `#C9BFB2`
- Avatar continua com gradiente coral (já correto).

### 7. Pergunta (h3)
Cor `#F5F0E8`, mesma fonte serif e peso atuais.

### 8. Cards de opções (grid)
- Grid: `grid-cols-2 lg:grid-cols-4` (remove `sm:grid-cols-3` para garantir exatamente 4 no desktop ≥ lg). Mantém `gap-3 sm:gap-4`.
- Aspect ratio atual `aspect-[3/4]` produz cards verticais; o pedido pede **min-height 200px** com foto cobrindo 100%. Trocar para `aspect-[4/5]` com `min-h-[200px]` para ocupar bem a largura disponível em 4 colunas.
- Borda padrão: `1px solid rgba(245,240,232,0.10)`. Selecionado: `2px solid #FF6B35` + sombra coral.
- Sombra padrão: nenhuma (visual editorial limpo sobre fundo escuro). Mantém apenas a sombra coral quando selecionado.
- Overlay continua reforçado para legibilidade do texto branco.

### 9. Botão "Próxima etapa"
- `width: 100%` (ocupa toda a largura do conteúdo da seção, não só de uma "caixinha").
- `height: 52px`, `border-radius: 12px`.
- Habilitado: `background: #FF6B35`, texto branco bold.
- Desabilitado: fundo `rgba(245,240,232,0.06)`, texto `#6B6157`.
- Sombra habilitada: `0 14px 32px -10px rgba(255,107,53,0.55)`.

### 10. Botão "Voltar" e link "Refazer quiz"
Texto `#8A8078`, hover `#C9BFB2`.

### 11. ResultCard (tela final)
A função `ResultCard` ainda usa fundo branco (`#FFFFFF`) com texto escuro. Para coerência, transformar também:
- Wrapper interno: `background: transparent` (já está dentro da seção escura), remover o `-m-6 sm:-m-10` e o `rounded-[28px] ... p-6 sm:p-10` brancos.
- Texto do título do resultado: `#F5F0E8`.
- Lista de razões: texto `#C9BFB2`, ícones coral.
- Bloco "Suas escolhas no quiz": `background: #150F08`, borda `rgba(255,107,53,0.12)`, chips com fundo `rgba(245,240,232,0.04)` e borda `rgba(245,240,232,0.10)`.
- CTAs principais (comprar / WhatsApp / calculadora) mantêm cores próprias — apenas o botão secundário "Falar com especialista" muda para borda `rgba(245,240,232,0.18)` e texto `#C9BFB2`.

---

## Fora de escopo
- Lógica de recomendação, leads, analytics, navegação.
- Outras seções do site.
- Trocar imagens dos cards.

## Verificação após implementação
- Preview em desktop (1280) e mobile (390): confirmar que não há mais "caixa branca" e que a seção respira do topo ao rodapé.
- Conferir contraste do texto branco sobre os cards de cozinha e escritório.
- Conferir que o botão "Próxima etapa" ocupa 100% da largura útil.
- Conferir tela de resultado em ambos os modos (`direct` e `consult`).

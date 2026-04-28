## Padronização do cabeçalho do quiz

Refinar o header do `QuizMatch` para reforçar o estilo premium da marca (Playfair + laranja Ágil), mantendo o restante do quiz intacto.

### Mudanças em `src/components/site/QuizMatch.tsx` (apenas o bloco header, linhas ~468–503)

1. **Badge "Assistente Inteligente"**
   - Manter `rounded-full` (já arredondado), porém suavizar:
     - Fundo mais suave: `rgba(255,107,53,0.08)` com borda `1px solid rgba(255,107,53,0.18)`.
     - Padding aumentado: `px-4 py-2`.
     - Sombra leve: `box-shadow: 0 1px 2px rgba(0,0,0,0.04)`.

2. **Título principal (H2)**
   - Trocar para fonte serif premium da marca: usar `font-display` (Playfair Display, já no design system) e garantir `font-family: var(--font-display)` inline para sobrescrever qualquer reset.
   - `font-weight: 500`, `letter-spacing: -0.025em`, `line-height: 1.05`.
   - Tamanho mantém `clamp(34px, 5.4vw, 58px)`.
   - Primeira linha: "Descubra a persiana ideal" em `dark.text` (regular).
   - Segunda linha: `<em>para a sua casa.</em>` em **itálico real** (remover `not-italic`), cor `var(--color-primary)` (laranja vibrante da marca, `#FF6B00`), `font-style: italic`, mesmo peso 500.

3. **Espaçamento generoso**
   - Margem entre badge e título: `mt-8` (era `mt-6`).
   - Margem entre título e subtítulo: `mt-7` (era `mt-5`).
   - Margem entre subtítulo e link "Pular": `mt-10` (era `mt-7`).
   - Container header: `mb-12 sm:mb-16` (era `mb-8 sm:mb-12`).

4. **Subtítulo**
   - Manter texto e cor `dark.textSoft`, mas usar `font-light` + `tracking-[0.005em]` e `max-w-lg` para visual mais clean e centrado.

### Fora de escopo
- Não alterar a lógica do quiz, perguntas, imagens dos ambientes ou estilos do CTA.
- Não mexer em `styles.css` (Playfair já está disponível via `font-display`).

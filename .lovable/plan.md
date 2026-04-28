## Objetivo
Converter o cabeçalho e o container do **QuizMatch** do modo escuro atual para um visual claro e editorial em off-white, mantendo o caráter premium e refinando o tratamento das imagens dos cards.

## Escopo
Apenas `src/components/site/QuizMatch.tsx` (camada de apresentação). Sem alterar lógica do quiz, recomendação, integração com Supabase ou navegação.

---

## Mudanças visuais

### 1. Fundo da seção
- Trocar `backgroundColor: dark.bg` (`#1A1208`) por **`#F9F7F2`** (off-white quente).
- Ajustar o glow ambiente para tons claros sutis (champagne suave + um leve toque de coral) em vez de gradientes pensados para fundo escuro.

### 2. Cabeçalho
- **Linha de credencial** (“Mais de 20 mil lares transformados”): manter ornamento, mas escurecer o coral para leitura sobre claro (`#B85A2C`/`#C2622E` em ~70% de opacidade) e linhas laterais com a mesma cor em ~25%.
- **Título principal** em fonte serifada elegante (`var(--font-display)` — Playfair Display, já usado no projeto):
  - Linha 1 “Descubra a persiana ideal” em `#1F1A15` (ink), peso 400, **sem itálico**.
  - Linha 2 “para a sua casa.” em **itálico**, cor laranja da marca **`#D9663C`** (coral premium, harmoniza com fundo claro), peso 500.
  - Estrutura: quebra de linha entre as duas partes (mantém hierarquia atual).
- **Separador decorativo**: 60px, mesma laranja a 35% de opacidade.
- **Subtítulo** em `#5A5048` (inkSoft), peso 300, mesma largura máxima.
- **Badge “Assistente Inteligente”**: fundo `rgba(217,102,60,0.08)`, borda `rgba(217,102,60,0.25)`, texto coral escuro — pílula arredondada já existente.
- **Link “Pular e ver a coleção”**: cor `#9A9089` (cinza quente) com hover `#5A5048`. Mantém quase invisível mas legível em fundo claro.

### 3. Container do quiz (card branco)
- Fundo **`#FFFFFF` puro**.
- Remover borda visível (`border: 1px solid rgba(0,0,0,0)` ou cor extremamente sutil `rgba(31,26,21,0.04)`).
- Substituir a sombra atual por **sombra dupla muito leve e sofisticada**:
  ```
  box-shadow:
    0 1px 2px rgba(31,26,21,0.04),
    0 24px 60px -28px rgba(31,26,21,0.18);
  ```
- Manter raio `28–32px`.

### 4. Stepper, bot de feedback e perguntas (dentro do card)
- Stepper: bolinhas inativas com fundo `#FFFFFF` e borda `rgba(31,26,21,0.10)`, texto `#8A8078`. Ativas/concluídas continuam coral.
- Bot de feedback: fundo `#FBF7F1` (já está), borda `rgba(31,26,21,0.06)`, texto `#5A5048`.
- Título da pergunta (`h3`) em `#1F1A15`, fonte serifada, peso 500.

### 5. Cards das opções (imagens)
- **Overlay reforçado** para garantir contraste do texto branco em qualquer foto:
  ```
  background: linear-gradient(
    to top,
    rgba(15,10,5,0.78) 0%,
    rgba(15,10,5,0.35) 45%,
    rgba(15,10,5,0.05) 100%
  );
  ```
  (atual vai de `rgba(0,0,0,0.85)` direto a `0.2`; a versão proposta tem transição mais suave e mantém legibilidade no rodapé).
- Adicionar `text-shadow: 0 1px 8px rgba(0,0,0,0.45)` no rótulo branco para reforço extra em fotos muito claras (cozinha, escritório).
- Borda padrão: `1px solid rgba(31,26,21,0.06)`. Selecionado mantém `2px solid coral` + sombra coral (já existe).
- Sombra padrão dos cards mais discreta: `0 4px 14px rgba(31,26,21,0.08)`.

### 6. Tela final (resultado)
- Aplicar mesma paleta clara (já parcialmente preparada via objeto `palette`): garantir que textos usem `palette.ink`/`inkSoft` e CTA continue coral.

---

## Fora de escopo
- Trocar imagens dos ambientes (já feito anteriormente).
- Alterar lógica de recomendação, leads, analytics ou rotas.
- Mexer em outras seções do site.

## Verificação após implementação
- Conferir o build/preview na home (`/`) com viewport mobile e desktop.
- Inspecionar contraste do texto branco sobre os cards de cozinha (fundo claro) e escritório.
- Validar que o título serifado renderiza com Playfair Display (já carregado via `--font-display`).

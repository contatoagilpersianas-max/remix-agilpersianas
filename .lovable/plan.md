## Objetivo
Substituir completamente o visual do QuizMatch pelo padrão **editorial creme** descrito — fundo claro `#FAF7F2`, cabeçalho serifado, barra de progresso linear, cards quadrados claros e botão pill escuro. Sem qualquer elemento escuro/preto na seção (exceto o próprio botão CTA).

## Escopo
Apenas `src/components/site/QuizMatch.tsx`. Lógica do quiz, recomendação, leads, navegação e imagens permanecem intactas. Demais seções do site não são tocadas.

## Observação importante
O quiz tem **5 etapas** (`STEPS.length === 5`), não 6. O label será dinâmico — `Etapa {step+1} de {STEPS.length}` — mantendo o padrão "Etapa X de N" pedido.

---

## Mudanças

### 1. Paleta da seção
Substituir o objeto `dark` (hoje em tons escuros) por uma paleta creme editorial. Mantém-se o nome `dark` para minimizar churn nas referências internas:

```ts
const dark = {
  bg: "#FAF7F2",         // creme quente da seção
  surface: "#FFFFFF",     // cards
  surface2: "#F0EBE3",    // card do assistente
  border: "#E8DDD0",      // bordas e barra de progresso (fundo)
  borderSoft: "#EFE6D8",
  borderHard: "#D4B89A",  // separador decorativo
  text: "#1A0F08",        // ink principal
  textSoft: "#5A4A3E",    // corpo de texto
  textMuted: "#B89070",   // eyebrow / labels secundárias
  textDim: "#C4AE96",     // estados desabilitados / link skip
  coral: "#FF6B35",
  coralWash: "rgba(255,107,53,0.10)",
  coralBorder: "rgba(255,107,53,0.35)",
};
```

### 2. Wrapper da seção
- Mantém full-bleed com `max-width: 1280px`, padding `100px 20px`.
- Remover o radial-gradient escuro (substituir por `transparent` ou um glow muito sutil em `rgba(255,107,53,0.04)` no topo).

### 3. Cabeçalho
Reduzir o cabeçalho para o formato pedido (mais limpo, menos elementos):
- **Eyebrow**: `— Assistente Inteligente —` em uppercase, 11px, letter-spacing 3px, cor `#B89070`, peso 500, centralizado.
- **Título principal** em Playfair Display (`var(--font-display)`):
  - Linha 1 "Descubra a persiana ideal" — weight 300, cor `#1A0F08`, `clamp(2.25rem, 5vw, 3.5rem)`.
  - Linha 2 "para a sua casa." — weight 700 itálico, cor `#FF6B35`.
- **Separador**: `<hr>` decorativo de 48px, altura 1px, cor `#D4B89A`, margin 14px 0, centralizado.
- **Remover**: a linha “Mais de 20 mil lares transformados”, o subtítulo de 5 perguntas, a badge "Assistente Inteligente" pill (substituída pelo eyebrow). O link “Pular” se move para a barra de ação inferior junto do botão.

### 4. Barra de progresso (substitui o stepper de bolinhas)
Trocar as 5 bolinhas conectadas por uma **barra fina linear**:
- Container `width: 100%`, altura `2px`, fundo `#E8DDD0`, border-radius 999.
- Preenchimento `#FF6B35` com largura = `progress%`, transição suave 300ms.
- Acima da barra, linha de label flex justify-between:
  - Esquerda: `Etapa {step+1} de {STEPS.length}` em `#B89070`, 11px, letter-spacing 0.18em, uppercase.
  - Direita: `{progress}%` na mesma tipografia.
- Mantém atributos ARIA `role="progressbar"`, `aria-valuenow`, etc.

### 5. Card do assistente
- Fundo `#F0EBE3`.
- Border-left `3px solid #FF6B35`.
- Border-radius `0 10px 10px 0` (cantos retos só na esquerda).
- Sem borda nas demais arestas.
- Avatar circular 36px com gradiente coral `linear-gradient(135deg, #FF8A5C, #FF6B35)`.
- Label "Assistente Ágil" em `#FF6B35`, 10px, uppercase, letter-spacing 0.2em.
- Texto da mensagem em `#5A4A3E`, 14px, peso 300.

### 6. Pergunta (h3)
- Cor `#1A0F08`, fonte serifada (`var(--font-display)`), peso 500, `clamp(26px, 3.4vw, 36px)`.
- Hint "Selecione uma ou mais opções" (etapa convivência) em `#B89070`, uppercase 12px.

### 7. Cards de opções
- Fundo `#FFFFFF`, borda `1px solid #E8DDD0`, border-radius `12px`.
- **Aspect ratio 1 / 1** (quadrado), sem `min-height`.
- Imagem ocupa a parte superior do card via `aspect-[1/1]` interno com `filter: brightness(0.72)` (escurece para suportar texto sobreposto, mas sem virar overlay preto sólido).
- Layout interno do texto:
  - Estado padrão: imagem cobre todo o card, com gradiente leve no rodapé apenas para garantir contraste.
  - Nome do item: Playfair Display 11px, cor `#1A0F08` quando o card tem rodapé claro... mas como o pedido manda foto com brightness(0.72) cobrindo, o texto fica **sobre a imagem** no rodapé do card, em branco. Para respeitar literalmente as cores do pedido (#1A0F08 nome, #B89070 subtítulo), o texto será posicionado **fora da foto**, no rodapé branco do card:
    - Estrutura: `<button>` com `<div class="aspect-square">` (foto + brightness 0.72) + `<div class="p-3 bg-white">` (nome + subtítulo).
    - Nome: Playfair Display 11px, peso 600, cor `#1A0F08`.
    - Subtítulo (`stepCaption[current.key]`): 9px uppercase letter-spacing 0.16em, cor `#B89070`.
- **Hover**: borda `#FF6B35`, `translateY(-2px)`, transição 200ms.
- **Selecionado**: borda `1.5px solid #FF6B35`, sombra `0 4px 20px rgba(255,107,53,0.15)`, sem translateY persistente.
- Ícone de check no canto superior direito (estado selecionado): círculo `#FF6B35` 28px com check branco — mantém.
- Badge "Recomendado" (acionamento motorizado quando há crianças): mantém em `#FF6B35`, posicionada no canto superior esquerdo da foto.
- Grid: `grid-cols-2 lg:grid-cols-4`, gap `12px sm:16px`.

### 8. Barra de ação inferior (botão + link skip)
Substituir o bloco atual pela linha pedida:
- Container `flex justify-between items-center mt-10`.
- **Esquerda**: link "Pular quiz" em `#C4AE96`, 13px, `text-decoration: underline`, `text-underline-offset: 3px`. Aparece apenas enquanto `!isComplete`.
- **Direita**: botão "Próxima etapa" em formato pill:
  - Fundo `#1A0F08`, texto branco, peso 600, padding `12px 8px 12px 24px`, border-radius `99px`.
  - Conteúdo: label "Próxima etapa" + círculo laranja `#FF6B35` 28px (14px = ícone interno) à direita com seta branca.
  - Estado desabilitado (sem resposta): fundo `#E8DDD0`, texto `#C4AE96`, círculo `#D4B89A`, cursor `not-allowed`.
  - No último step, label muda para "Ver minha recomendação".
- Botão "Voltar" (passos > 0): pequeno texto em `#B89070`, posicionado acima da barra de ação ou como link à esquerda do "Pular quiz" (manter posição atual: separado, mt-3, alinhado à esquerda). Cor `#B89070`, hover `#5A4A3E`.

### 9. Tela de resultado (`ResultCard`)
Hoje a tela final ainda usa cores escuras dos passos anteriores (texto `#F5F0E8`, painéis `#150F08`). Adaptá-la ao tema creme:
- Wrapper `color: #1A0F08`.
- Painel da imagem do produto: fundo `#F0EBE3`, borda `1px solid #E8DDD0`.
- Título do produto (h3): `#1A0F08`, Playfair Display.
- Lista de razões: texto `#5A4A3E`, ícones `#FF6B35`.
- Bloco "Suas escolhas no quiz": fundo `#F0EBE3`, borda `1px solid #E8DDD0`, chips com fundo branco e borda `#E8DDD0`.
- Botão "Falar com especialista": borda `#E8DDD0`, texto `#5A4A3E`.
- Botão "Refazer quiz" e copy de rodapé: cor `#B89070`.

### 10. Limpeza
- Remover badge laranja flutuante e separador decorativo redundantes do cabeçalho original.
- Remover a régua preto/branco contextual da etapa "luz" — não combina com o visual creme. Substituir por nada (a foto + caption já comunicam).
- Remover o glow radial escuro residual do background.

---

## Fora de escopo
- Lógica de recomendação, leads, analytics, navegação.
- Demais seções do site, header global, rotas.
- Trocar imagens dos cards (continuam as atuais).

## Verificação após implementação
- Preview em desktop (1280) e mobile (390): conferir que o visual é uniformemente creme, com botão escuro pill alinhado à direita.
- Validar contraste do texto nos cards (nome `#1A0F08` sobre branco, subtítulo `#B89070`).
- Validar barra de progresso preenchendo conforme o avanço.
- Validar tela de resultado em ambos os modos (`direct` e `consult`).

## Objetivo

Quando o usuário avançar (ou voltar) entre etapas do quiz, a tela deve enquadrar a área de pergunta exatamente como na imagem de referência: card do **Assistente Ágil** no topo, em seguida o **título da etapa** (ex.: "Qual seu objetivo de luz?") e logo abaixo a grade de **4 imagens**. Hoje o scroll volta para o título principal "Descubra a persiana ideal para a sua casa.", deixando o título da etapa fora do enquadramento inicial.

## Mudanças (somente `src/components/site/QuizMatch.tsx`)

### 1. Novo alvo de scroll: bloco do assistente + pergunta
- Adicionar uma `ref` (`stepBlockRef`) no contêiner que envolve o **card do Assistente Ágil + título da etapa + grid de opções** (envolver os blocos atuais em uma `div` com essa ref, sem alterar estilos).
- Manter `sectionRef` apenas para o cálculo de "o quiz saiu da viewport" (lógica existente continua válida).

### 2. Reescrever `scrollToQuizTop` para mirar a etapa
- Substituir o alvo atual (topo da `<section>`) pelo `stepBlockRef.current`.
- Manter o offset do header fixo (~96px) e respeitar `prefers-reduced-motion`.
- O resultado: o card do assistente fica logo abaixo do header, o título da etapa aparece em destaque e os 4 cards aparecem inteiros — enquadramento idêntico à imagem anexada.

### 3. Disparar o scroll ao avançar e ao voltar
- `Próxima etapa` (botão laranja): já chama `scrollToQuizTop()` — passa a enquadrar a próxima etapa automaticamente.
- `Voltar` (`handleBack`): mantém a chamada, agora enquadrando a etapa anterior.
- Clique nos cards de opção: continua **sem** scroll (mantém o comportamento atual de só selecionar).
- Reset (`Refazer quiz` na tela final): ao voltar para a etapa 1, também enquadrar o bloco da etapa.

### 4. Garantir suavidade entre etapas curtas e longas
- Usar `requestAnimationFrame` + leitura de `getBoundingClientRect()` no momento do scroll (já é o padrão da função) para que a posição seja calculada **após** o React renderizar o novo título/opções.
- Em telas muito altas (desktop wide), se o bloco couber inteiro acima da dobra, ainda assim posicioná-lo logo abaixo do header (não centralizar) — assim o padrão de enquadramento é consistente em todas as etapas.

### 5. Sem alterações em
- Lógica de seleção, multi-select de "convivência", recomendação final, lead/analytics.
- Estilos dos cards, botão laranja "Próxima etapa", link "Pular quiz", barra de progresso.
- Microcopy do assistente.

## Arquivos afetados
- `src/components/site/QuizMatch.tsx` (edição única)

## Validação manual sugerida
- Navegar etapa 1 → 2 → 3 → 4 → 5 e confirmar que cada transição enquadra: assistente no topo, título da etapa, 4 cards visíveis (desktop) ou 2x2 (mobile).
- Voltar com o botão "Voltar" e confirmar o mesmo enquadramento.
- Conferir em mobile (≤640px) e desktop (≥1024px).

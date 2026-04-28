## Objetivo

Substituir as fotos atuais (Unsplash) dos ambientes do quiz por recortes da imagem de referência enviada, para 5 ambientes:

| Ambiente no quiz (key) | Recorte da imagem de referência |
|---|---|
| `quarto` | Card "Quarto" (linha 1, col 1) |
| `sala` | Card "Sala de estar" (linha 1, col 2) |
| `cozinha` | Card "Cozinha" (linha 1, col 3) |
| `escritorio` | Card "Escritório" (linha 2, col 1) |
| `home` (Sala de TV / Home theater) | Card "Sala de cinema" (linha 3, col 2) |

Os demais ambientes (`lavanderia`, `infantil`, `externa`) ficam exatamente como estão.

## Passos

1. **Copiar a imagem de referência para um path real**
   - `code--copy user-uploads://image-33.png /tmp/ref.png`

2. **Recortar os 5 cards usando ImageMagick**
   - Identificar coordenadas dos 4 cards na imagem (grid 4 colunas × 3 linhas, áreas só da foto, sem o rótulo de texto).
   - Gerar 5 arquivos JPEG otimizados (largura 600px, qualidade 80) em `src/assets/`:
     - `src/assets/quiz-amb-quarto.jpg`
     - `src/assets/quiz-amb-sala.jpg`
     - `src/assets/quiz-amb-cozinha.jpg`
     - `src/assets/quiz-amb-escritorio.jpg`
     - `src/assets/quiz-amb-cinema.jpg`
   - QA visual: abrir cada arquivo gerado e confirmar que o recorte ficou limpo (sem rótulo, sem cortar móveis). Se algum ficar errado, ajustar coordenadas e re-recortar.

3. **Atualizar `src/components/site/QuizMatch.tsx`**
   - Adicionar 5 imports ES6 dos novos assets.
   - No objeto `ambienteImages` (linhas 88–97), trocar as 5 URLs:
     ```ts
     quarto: quizAmbQuartoImg,
     sala: quizAmbSalaImg,
     home: quizAmbCinemaImg,        // Sala de TV recebe a foto de Sala de cinema
     cozinha: quizAmbCozinhaImg,
     escritorio: quizAmbEscritorioImg,
     ```
   - Manter `lavanderia`, `infantil`, `externa` intactos.

## Arquivos afetados

- `src/assets/quiz-amb-quarto.jpg` (novo)
- `src/assets/quiz-amb-sala.jpg` (novo)
- `src/assets/quiz-amb-cozinha.jpg` (novo)
- `src/assets/quiz-amb-escritorio.jpg` (novo)
- `src/assets/quiz-amb-cinema.jpg` (novo)
- `src/components/site/QuizMatch.tsx` (5 imports + 5 linhas no objeto)

Sem alterações de lógica, estilo, rotas ou banco.
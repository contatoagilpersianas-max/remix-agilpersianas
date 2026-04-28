## Objetivo

Substituir a imagem do card "Quarto Infantil" no quiz pela imagem que você enviou (foto real do quarto de bebê com berço, cortina bege e cômoda).

## Passos

1. **Copiar a imagem para o projeto**
   - De: `user-uploads://image-32.png`
   - Para: `src/assets/quiz-quarto-infantil.jpg` (renomeada para .jpg via processamento, mantendo qualidade enxuta para web)

2. **Importar no QuizMatch**
   - Em `src/components/site/QuizMatch.tsx`, adicionar o import ES6 do asset.
   - Atualizar o mapa `ambienteImages` (linha ~94), trocando a URL do Unsplash de `infantil` pela imagem importada.

## Arquivos afetados

- `src/assets/quiz-quarto-infantil.jpg` (novo)
- `src/components/site/QuizMatch.tsx` (1 linha de import + 1 linha no objeto de imagens)

Nenhuma outra opção do quiz é afetada. Sem mudanças de lógica, estilo ou backend.
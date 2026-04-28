# Ajustes finais no QuizMatch

Quatro refinamentos pontuais no `src/components/site/QuizMatch.tsx`. Tudo é frontend/visual — nenhuma lógica é alterada.

## 1. Botão "Próxima etapa" — Coral vibrante e sólido

Hoje o botão usa `dark.coral` (`#FF6B35`) com `hover:opacity-95`, o que dá uma leve sensação de transparência.

- Garantir cor 100% sólida: `#FF6B35` no estado ativo, sem `opacity` em nenhum estado.
- Texto branco puro (`#FFFFFF`) com `font-weight: 600`.
- Manter o ícone `ArrowRight` à direita, com a sutil animação de translate no hover (já existe).
- No hover, escurecer levemente (`#E85A24`) em vez de aplicar opacidade — mantém a sensação de cor cheia.
- Sombra coral mais marcada para sensação premium: `0 14px 32px -10px rgba(255,107,53,0.55)`.

## 2. Fade-in suave ao trocar de etapa

Hoje as opções já usam classes `animate-quiz-forward` / `animate-quiz-back`, mas elas dependem de keyframes definidos em `src/styles.css` (que podem estar com slide forte ou ausentes).

- Verificar/garantir em `src/styles.css` os keyframes `quiz-forward` (fade + leve translate Y de 8px → 0) e `quiz-back` (mirror), com duração de 400ms e easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Aplicar um pequeno delay escalonado (`stagger`) nos cards de opção via `style={{ animationDelay: \`${i * 40}ms\` }}` para que cada card apareça em cascata suave.
- Manter `key={\`opts-${step}\`}` para forçar remontagem (já está) — assim a animação dispara a cada etapa.

## 3. Link "Pular e ver coleção" — manter inalterado

Sem mudanças: o link continua com `opacity: 0.4`, `tracking-[0.22em]`, fonte 12px, posicionado abaixo do parágrafo descritivo do título.

## 4. Cantos arredondados nas imagens dos cards

Os botões dos cards já usam `rounded-2xl` e a `<img>` herda o clipping via `overflow-hidden`. Vou apenas reforçar visualmente:

- Confirmar `rounded-2xl` (16px) em todos os cards de opção (já está).
- O badge "Recomendado" e o check de selecionado seguem o mesmo radius da família arredondada.

## Arquivos a editar

- `src/components/site/QuizMatch.tsx` — ajustes no botão CTA + animation-delay nos cards.
- `src/styles.css` — garantir keyframes `quiz-forward` / `quiz-back` com fade suave (apenas se não estiverem com fade adequado).

Nenhuma alteração de lógica, dados, rotas ou banco.

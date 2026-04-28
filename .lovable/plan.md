## Plano

Vou aplicar as mudanças apenas em `src/components/site/QuizMatch.tsx`.

### 1. Atualizar o texto do assistente
- Trocar o feedback exibido acima das opções para:
  `Perfeito. Vamos encontrar a solução que equilibra sua privacidade com a entrada ideal de luz.`
- Ajustar a ênfase visual do texto no card do assistente para destacar `Privacidade`, `Luminosidade` e `Conforto` com um tratamento mais sofisticado, mantendo o tom profissional e consultivo.

### 2. Corrigir o avanço ao clicar na imagem
- Remover o comportamento que rola a tela de volta para o topo do título quando o usuário clica em uma opção.
- Fazer o clique no card/imagem encaminhar diretamente para a próxima etapa do quiz, exibindo imediatamente as imagens da etapa seguinte.
- Manter exceção apenas para a etapa multi-seleção (`convivencia`), onde o clique continua marcando/desmarcando sem autoavanço.

### 3. Reposicionar o botão “Pular quiz”
- Tirar o link de “Pular quiz” do rodapé inferior do card.
- Recolocar o botão/link no início da área de navegação do quiz, como era antes, acima do CTA principal.
- Preservar o estilo discreto pedido anteriormente, sem competir com o botão principal.

### 4. Preservar a hierarquia visual atual
- Manter o botão `Próxima etapa` centralizado e em laranja.
- Manter o efeito premium de seleção nos cards, sem regredir para um estado visual simples.
- Garantir que a transição entre etapas continue fluida em desktop e mobile.

## Detalhes técnicos
- Ajustar a renderização do card do assistente que hoje usa `feedback || current.botMessage`.
- Revisar o `onClick` dos cards de opção para evitar o scroll prematuro do `scrollToQuizTop()` no momento do clique.
- Reorganizar o bloco da barra de ação para que `Pular quiz` volte ao topo dessa seção.
- Não haverá mudanças em backend, banco, catálogo ou recomendação final do quiz.
# Ajustes no Quiz — clique avança, seleção premium, CTA laranja

Três correções pontuais em `src/components/site/QuizMatch.tsx`. Nenhuma outra parte do site é tocada.

## 1. Clicar na imagem deve avançar para a próxima etapa

**Hoje:** clicar só marca a opção e dispara `ensureQuizInView()`, que rola a página de volta ao topo do quiz — o usuário sente que "voltou pro título". Para avançar, precisa clicar no botão "Próxima etapa".

**Correção:** ao clicar num card, gravar a resposta E avançar imediatamente para a próxima etapa (mesma lógica do botão "Próxima etapa"). Sem chamar `scrollToQuizTop` antes — o avanço já vai re-renderizar a etapa nova e disparar o scroll suave para o topo do quiz.

Exceção: a etapa **`convivencia`** é multi-select (crianças + pets). Nessa etapa o clique continua só marcando/desmarcando, e o avanço fica no botão "Próxima etapa" (caso contrário o usuário não consegue marcar duas opções).

Última etapa: o clique conclui o quiz (mesmo comportamento do botão "Ver minha recomendação").

## 2. Efeito premium ao selecionar (não só borda laranja)

**Hoje:** card selecionado vira bloco laranja chapado com texto branco — visualmente pesado e perde o ar editorial.

**Correção:** voltar ao tratamento premium anterior, com camadas:

- Card mantém **fundo branco** (não vira laranja chapado).
- **Borda coral 2px** `#FF6B35` (mais presente que 1.5px).
- **Glow externo** suave: `box-shadow: 0 8px 24px rgba(255,107,53,0.22), 0 0 0 4px rgba(255,107,53,0.08)` (halo + anel sutil).
- **Imagem ganha overlay coral** discreto: gradient `linear-gradient(180deg, rgba(255,107,53,0.0) 40%, rgba(255,107,53,0.28) 100%)` por cima da imagem (mantém `brightness(0.78)` em vez de 0.72 para a foto não escurecer demais com o overlay).
- **Leve scale-up** do card: `transform: scale(1.02)` com `transition` suave (eleva o card escolhido).
- **Badge de check** no canto superior direito permanece (já existe, círculo coral com check branco).
- **Texto do label** volta para escuro `#1A0F08` e caption em `#B89070` (sem mais texto branco — fundo do card é branco de novo).

Resultado: o card escolhido "se acende" com halo coral, sobe levemente e ganha um wash de cor na imagem, sem virar um bloco laranja chapado.

## 3. Botão "Próxima etapa" laranja em vez de preto

**Hoje:** `backgroundColor: "#1A0F08"` (preto/marrom escuro) com a seta num círculo laranja.

**Correção:** botão inteiro em coral da marca:
- `backgroundColor: "#FF6B35"` (estado ativo).
- Texto branco `#FFFFFF` (já é).
- Círculo da seta passa para **branco translúcido** `rgba(255,255,255,0.22)` para criar contraste interno em vez de competir com o fundo.
- Hover: leve escurecimento `#E85D2C` via `:hover` (filter brightness 0.95 ou cor explícita).
- Sombra coral suave: `box-shadow: 0 6px 18px rgba(255,107,53,0.28)`.
- Estado desabilitado (sem resposta): mantém atual `#E8DDD0` com texto `#C4AE96`.

## Detalhes técnicos

Arquivo único: `src/components/site/QuizMatch.tsx`.

1. **onClick do card** (linha 701-704):
   ```tsx
   onClick={() => {
     handleSelect(opt.value, opt.feedback);
     if (current.key === "convivencia") return; // multi-select: não avança
     if (step === STEPS.length - 1) {
       // última etapa — conclui (mesmo efeito do CTA "Ver minha recomendação")
       setDirection("forward");
       setStep((s) => s + 1);
       setFeedback("");
       scrollToQuizTop();
     } else {
       setDirection("forward");
       setStep((s) => s + 1);
       setFeedback("");
       scrollToQuizTop();
     }
   }}
   ```
   Remover `ensureQuizInView()` daqui. A função pode ser deletada se não for usada em outro lugar.

2. **Style do card selecionado** (linhas 707-713):
   ```ts
   backgroundColor: "#FFFFFF", // sempre branco
   border: selected ? "2px solid #FF6B35" : "1px solid #E8DDD0",
   borderRadius: 12,
   boxShadow: selected
     ? "0 8px 24px rgba(255,107,53,0.22), 0 0 0 4px rgba(255,107,53,0.08)"
     : "none",
   transform: selected ? "scale(1.02)" : "scale(1)",
   ```
   E adicionar overlay coral no container da imagem (depois do `<img>`, antes do badge "Recomendado"):
   ```tsx
   {selected && (
     <div className="pointer-events-none absolute inset-0"
       style={{ background: "linear-gradient(180deg, rgba(255,107,53,0) 40%, rgba(255,107,53,0.28) 100%)" }} />
   )}
   ```
   Ajustar `filter: "brightness(0.78)"` quando `selected` (mantém 0.72 quando não selecionado, para não ficar muito claro).

3. **Texto do card** (linhas 742-755): remover branco quando selected — voltar para `#1A0F08` e `#B89070` em todos os estados.

4. **Botão "Próxima etapa"** (linhas 803-824):
   ```ts
   backgroundColor: hasAnswer ? "#FF6B35" : "#E8DDD0",
   color: hasAnswer ? "#FFFFFF" : "#C4AE96",
   boxShadow: hasAnswer ? "0 6px 18px rgba(255,107,53,0.28)" : "none",
   ```
   E o círculo da seta:
   ```ts
   backgroundColor: hasAnswer ? "rgba(255,255,255,0.22)" : "#D4B89A",
   ```
   Hover usa `hover:brightness-95` (já tem `hover:opacity-95`, trocar para brightness para não embaçar).

Sem mudanças em paleta global, lógica de recomendação, microcopy ou outros componentes.

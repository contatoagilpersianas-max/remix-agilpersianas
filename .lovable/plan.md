# Ajustes pontuais no Quiz (QuizMatch)

Três correções localizadas, sem mexer em nenhuma outra parte do site.

## 1. Clique na imagem não deve "jogar" para a seção Mais Vendidas

**Causa real:** `handleSelect` (linha 417) apenas grava a resposta — não avança de etapa. Mas como a etapa atual continua renderizando com a mesma altura e o usuário já está perto do final da seção, o navegador acaba expondo a seção seguinte (BestSellersWeek) na linha do olhar, dando a sensação de que o quiz "pulou".

**Correção:** ao selecionar uma opção, garantir que o usuário continue vendo o quiz — chamar `scrollToQuizTop()` também no `handleSelect`, mas **só quando o topo do quiz estiver fora da viewport** (evita scroll desnecessário em desktop com tela grande). A navegação para a próxima etapa continua acontecendo **apenas** via botão "Próxima etapa", como hoje.

- Em `handleSelect` (após gravar a resposta), checar `sectionRef.current.getBoundingClientRect().top < 0` e, se sim, chamar `scrollToQuizTop()`.
- Não alterar a lógica multi-select de "convivencia".

## 2. Botão "Próxima etapa" centralizado

**Hoje:** linha 755 usa `flex items-center justify-between` — joga "Pular quiz" para a esquerda e "Próxima etapa" para a direita.

**Correção:** mudar a estrutura do rodapé de ação para:
- "Pular quiz" como link discreto **acima** do botão, alinhado ao centro com tamanho menor (mantém visibilidade mas tira da linha do CTA).
- Botão "Próxima etapa" **centralizado** logo abaixo, ocupando largura natural (não 100%, mantém o pill premium atual).
- Botão "Voltar" (quando step > 0) continua abaixo, centralizado e discreto.

Hierarquia visual final, de cima para baixo:
```text
[ Pular quiz ]              ← link pequeno, centralizado
[ Próxima etapa → ]         ← CTA pill centralizado (estilo atual)
[ ← Voltar ]                ← link discreto, centralizado, só se step > 0
```

## 3. Card laranja quando selecionado

**Hoje:** o card selecionado mantém fundo branco e ganha apenas borda coral 1.5px + sombra leve + check no canto. Visualmente sutil demais.

**Correção:** quando `selected === true`, aplicar estado laranja claro e nítido:
- `backgroundColor: "#FF6B35"` (coral da marca) no card inteiro.
- `border: "1.5px solid #FF6B35"`.
- Imagem com overlay sutil para não sumir: manter `filter: brightness(0.72)` e adicionar uma leve mistura coral via `mix-blend-mode: multiply` no container ou aumentar o contraste do badge de check (já existe).
- Texto do rodapé do card (`opt.label` e `caption`) passa para **branco** quando selecionado, para legibilidade sobre o coral.
- Card não-selecionado permanece branco com borda `#E8DDD0` (igual ao atual).

## Detalhes técnicos

Arquivo único: `src/components/site/QuizMatch.tsx`

1. **handleSelect** (linha 417): após `setAnswers(...)`, adicionar:
   ```ts
   if (typeof window !== "undefined" && sectionRef.current) {
     const rect = sectionRef.current.getBoundingClientRect();
     if (rect.top < 0) scrollToQuizTop();
   }
   ```

2. **Rodapé de ação** (linhas 748-813): substituir o `<div className="mt-10 flex items-center justify-between gap-4">` por uma coluna centralizada:
   ```tsx
   <div className="mt-10 flex flex-col items-center gap-4">
     <Link to="/catalogo" /* estilo skip atual, sem mudar cor */>Pular quiz</Link>
     <button /* CTA pill atual, sem mudar estilo interno */>Próxima etapa →</button>
   </div>
   ```
   E o bloco "Voltar" (linhas 814-831) muda de `<div className="mt-3">` para `<div className="mt-3 flex justify-center">`.

3. **Card selecionado** (linhas 686-742): no `style` do `<button>`:
   ```ts
   backgroundColor: selected ? "#FF6B35" : "#FFFFFF",
   border: selected ? "1.5px solid #FF6B35" : "1px solid #E8DDD0",
   ```
   No bloco do rodapé do card (linhas 726-741), trocar a cor dos textos quando `selected`:
   - `opt.label`: `color: selected ? "#FFFFFF" : "#1A0F08"`
   - `caption`: `color: selected ? "rgba(255,255,255,0.85)" : "#B89070"`

Sem mudanças em paleta global, layout da seção, lógica de recomendação, microcopy ou qualquer outro componente.

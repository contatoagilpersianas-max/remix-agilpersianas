# Ajustes no Quiz Inteligente (QuizMatch)

Dois problemas pontuais, sem mexer em nenhuma outra parte do site.

## 1. Bug do "Próxima etapa" jogando para a seção de mais vendidas

**O que acontece hoje:** ao clicar em "Próxima etapa", o estado avança corretamente para a próxima pergunta — mas como a altura da seção muda entre etapas e o botão fica perto do final da seção, o usuário continua olhando para a área inferior da página e vê a seção seguinte (Mais vendidas / Produtos em destaque), tendo a impressão de que o quiz "pulou" para lá.

**Correção:** ao avançar ou voltar de etapa, fazer um scroll suave de volta para o topo do quiz (âncora `#quiz-persiana-ideal`), respeitando o offset do header fixo. Isso garante que o usuário veja imediatamente o novo título da pergunta e os novos cards.

- Adicionar uma `ref` no `<section>` do quiz.
- Nos handlers `onClick` do botão "Próxima etapa" e do "Voltar", chamar `scrollIntoView({ behavior: "smooth", block: "start" })` com um pequeno offset para não esconder o título atrás do header.
- Respeitar `prefers-reduced-motion` (sem animação se o usuário preferir).

## 2. Caption repetitiva abaixo do nome da opção

**O que acontece hoje:** abaixo de cada card (ex: "Sala de TV / Home", "Cozinha", "Quarto") aparece sempre a mesma palavra — "Ambiente". Na etapa seguinte aparece "Objetivo de luz" em todos os cards. É redundante (já está no título da pergunta) e não agrega.

**Correção:** substituir o objeto `stepCaption` (label fixo por etapa) por uma microcopy curta **por opção**, que ajuda o cliente a se identificar com o cenário. Texto curto (até ~28 caracteres), em caixa alta com letter-spacing, mantendo o estilo visual atual (#B89070, 9px).

### Microcopy proposta

**Ambiente:**
- Quarto → "Sono & descanso"
- Sala de Estar → "Convívio & receber"
- Sala de TV / Home → "Cinema em casa"
- Cozinha → "Praticidade no dia a dia"
- Escritório → "Foco & produtividade"
- Lavanderia → "Área úmida"
- Quarto Infantil → "Segurança em primeiro lugar"
- Área Externa → "Sol, chuva & vento"

**Objetivo de luz:**
- Escuridão Total → "Sono profundo"
- Filtrar Luz Suave → "Clima aconchegante"
- Apenas Privacidade → "Sem bloquear claridade"
- Visão Externa → "Você vê, ninguém vê"

**Estilo:**
- Moderno / Clean → "Linhas retas"
- Clássico / Aconchegante → "Tons quentes"
- Rústico / Natural → "Fibras naturais"
- Industrial → "Acabamento robusto"

**Convivência:**
- Tenho Crianças → "Sem cordões soltos"
- Tenho Pets → "Tecidos resistentes"
- Não → "Liberdade total"

**Acionamento:**
- Manual → "Prático & econômico"
- Motorizado → "Controle, app ou Alexa"

Caso o usuário prefira outro tom (mais técnico, mais emocional, mais curto), ajusto após a aprovação.

## Detalhes técnicos

Arquivo único: `src/components/site/QuizMatch.tsx`

1. Adicionar campo opcional `caption?: string` em `OptionDef<T>` e preencher em cada array (`ambientes`, `luzes`, `estilos`, `convivencias`, `acionamentos`).
2. Remover o objeto `stepCaption` e ler `opt.caption` no render do card (fallback para vazio se faltar).
3. Adicionar `sectionRef = useRef<HTMLElement>(null)` no `<section>` e uma função `scrollToQuizTop()` chamada após `setStep(...)` no botão "Próxima etapa" e em `handleBack()`. Usar `requestAnimationFrame` para esperar o re-render antes do scroll.

Sem mudanças em estilos, paleta, layout, lógica de recomendação, ou qualquer outro componente do site.
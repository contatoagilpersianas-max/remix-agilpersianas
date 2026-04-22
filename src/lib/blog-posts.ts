import medirImg from "@/assets/blog-medir.jpg";
import tecidosImg from "@/assets/blog-tecidos.jpg";
import automacaoImg from "@/assets/blog-automacao.jpg";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-medir-janela-persiana",
    title: "Como medir sua janela para persiana sob medida",
    excerpt:
      "Guia passo a passo para tirar as medidas corretas e evitar erros comuns na hora de comprar sua persiana.",
    date: "2026-04-10",
    readingTime: "5 min",
    category: "Guia prático",
    image: medirImg,
    content: `
## Por que medir corretamente é essencial

Uma medição incorreta é o principal motivo de retrabalho em persianas. Alguns
milímetros a mais podem fazer a peça não encaixar; alguns a menos criam frestas
de luz. Por isso, dedique 5 minutos a esta tarefa antes de pedir o orçamento.

## Materiais necessários

- Trena metálica de pelo menos 3 metros
- Caneta e papel (ou seu celular)
- Nível de bolha (opcional, mas recomendado)
- Um auxiliar — ajuda muito em janelas grandes

## Passo 1 — Decidir a instalação

Existem duas formas de instalar a persiana:

- **Dentro do vão**: a persiana fica dentro da janela. Visual mais limpo, mas
  exige um vão profundo (mínimo 5 cm).
- **Sobre o vão**: a persiana cobre toda a moldura. Bloqueio de luz mais
  eficiente e disfarça paredes irregulares.

## Passo 2 — Largura

Meça a largura em três pontos: superior, central e inferior. Use sempre a
**menor medida** para garantir que a persiana caiba.

## Passo 3 — Altura

Meça da parte superior do vão (ou do trilho de instalação) até onde deseja que
a persiana termine. Para janelas baixas, considere 5 cm a mais para evitar luz
embaixo.

## Passo 4 — Conferir

Sempre confira duas vezes. Anote no formato **largura × altura em centímetros**
(ex: 120 × 180 cm). Envie no orçamento essas medidas e a foto do vão.

## Erros mais comuns

- Medir só uma vez
- Usar trena de tecido (não é precisa)
- Não considerar o tipo de instalação
- Esquecer de descontar o trilho

Pronto! Com essas medidas em mãos, é só nos enviar pelo WhatsApp ou pelo
formulário de orçamento que respondemos em poucas horas.
    `.trim(),
  },
  {
    slug: "como-escolher-tecido-persiana",
    title: "Como escolher o tecido ideal para sua persiana",
    excerpt:
      "Blackout, screen, linho ou voil? Entenda as diferenças e descubra qual tecido combina com cada ambiente.",
    date: "2026-04-05",
    readingTime: "6 min",
    category: "Decoração",
    image: tecidosImg,
    content: `
## A escolha do tecido define o resultado

Mais importante que o modelo da persiana é o tecido. Ele determina o quanto de
luz passa, o quanto se vê de dentro para fora (e vice-versa), e o estilo do
ambiente.

## Tecido Blackout

- **Bloqueia 100% da luz**
- Ideal para quartos, home theaters e salas de cinema
- Ótimo isolamento térmico
- Não permite visão para fora

## Tecido Screen Solar

- **Filtra UV mantendo a visão**
- Disponível em aberturas 1%, 3% e 5%
- Reduz calor e protege móveis
- Ideal para escritórios, salas e fachadas

## Tecido Voil / Translúcido

- **Permite passagem de luz suave**
- Não oferece privacidade total
- Cria atmosfera leve e arejada
- Combina com cortinas em camadas

## Tecido Linho e Premium

- Visual sofisticado e atemporal
- Texturas naturais
- Requer cuidados especiais na limpeza
- Perfeito para cortinas romanas

## Combinando tecidos

Uma das melhores soluções é combinar dois sistemas: por exemplo, persiana
screen + cortina blackout. Você ganha controle total ao longo do dia, com
filtragem suave durante o trabalho e bloqueio absoluto à noite.

## Cores

Tons claros (branco, areia, fendi) refletem mais luz e mantêm o ambiente mais
fresco. Tons escuros (grafite, preto) absorvem mais calor mas trazem
sofisticação. Escolha pensando tanto na função quanto na estética.
    `.trim(),
  },
  {
    slug: "automacao-persianas-casa-inteligente",
    title: "Automação de persianas: vale a pena para sua casa?",
    excerpt:
      "Persianas motorizadas integradas a Alexa e Google Home: tudo o que você precisa saber antes de investir.",
    date: "2026-03-28",
    readingTime: "7 min",
    category: "Tecnologia",
    image: automacaoImg,
    content: `
## A casa que se ajusta sozinha

Imagine acordar com as persianas abrindo automaticamente no horário do
despertador, ou pedir "Alexa, fecha a sala" enquanto assiste a um filme. A
automação de persianas, que parecia luxo há poucos anos, ficou acessível e
prática.

## Tipos de motorização

- **Motor com fio**: mais barato, exige instalação elétrica próxima.
- **Motor com bateria recarregável**: instalação simples, sem fios aparentes.
- **Motor solar**: bateria carregada por painel solar pequeno na janela.

## Tipos de controle

### Controle remoto RF

Mais simples e econômico. Cada motor vem com seu controle, e é possível
agrupar múltiplas persianas em um único botão.

### Wi-Fi com aplicativo

Permite controle pelo celular de qualquer lugar. Você pode programar horários,
criar cenas (manhã, cinema, dormir) e acompanhar o status.

### Integração com Alexa e Google Home

Comando por voz. Fala "Alexa, abre a persiana do quarto" e pronto. Funciona
perfeitamente com os mecanismos Wi-Fi modernos.

## Vantagens reais

1. **Conforto**: nunca mais precisar levantar da cama para fechar
2. **Economia de energia**: persianas que fecham automaticamente nas horas
   mais quentes reduzem o uso do ar-condicionado
3. **Segurança**: simulação de presença com horários programados
4. **Acessibilidade**: ideal para idosos e pessoas com mobilidade reduzida

## Quanto custa?

A motorização adiciona em média R$ 600 a R$ 1.500 por persiana, dependendo do
tipo. O custo se justifica em janelas de difícil acesso, quartos altos e
projetos premium.

## Vale a pena?

Sim — especialmente em quartos, salas grandes e janelas altas. Para janelas
pequenas e de fácil acesso, talvez não compense.
    `.trim(),
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);

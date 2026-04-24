import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-blackout.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Persiana Rolô Blackout",
  description:
    "Persiana rolô blackout sob medida com bloqueio total de luz, tecido premium e instalação em todo o Brasil.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/lp-blackout.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "189",
    highPrice: "1290",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1247" },
};

export const Route = createFileRoute("/persiana-rolo-blackout")({
  head: () => ({
    meta: [
      { title: "Persiana Rolô Blackout sob Medida — Ágil Persianas" },
      {
        name: "description",
        content:
          "Persiana rolô blackout 100% sob medida. Bloqueia totalmente a luz, isolamento térmico e acabamento premium. Frete para todo Brasil.",
      },
      { name: "keywords", content: "persiana blackout, persiana rolô blackout, persiana quarto, blackout sob medida" },
      { property: "og:title", content: "Persiana Rolô Blackout sob Medida" },
      {
        property: "og:description",
        content: "Bloqueio total de luz, sono perfeito. Sob medida.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-blackout.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-blackout.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(jsonLd) },
    ],
  }),
  component: PersianaRoloBlackoutPage,
});

function PersianaRoloBlackoutPage() {
  return (
    <LandingLayout
      eyebrow="Linha Premium"
      title="Persiana Rolô Blackout sob Medida"
      subtitle="Bloqueio total de luz e privacidade absoluta — o sono perfeito para o seu quarto."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Persiana Rolô Blackout."
      intro={
        <>
          <h2>O que é a Persiana Rolô Blackout</h2>
          <p>
            A persiana rolô blackout é a solução definitiva para quem busca escurecimento
            total. Com tecido técnico de tripla camada, ela bloqueia 100% da luz externa,
            cria isolamento térmico e acústico parcial e oferece o ambiente ideal para
            quartos, home theaters e espaços que exigem total controle de claridade.
          </p>
          <h3>Aplicações ideais</h3>
          <p>
            Quartos de casal, suítes, quartos infantis, salas de cinema em casa, escritórios
            voltados ao sol da tarde e ambientes hospitalares. O blackout é especialmente
            recomendado para quem trabalha em turnos invertidos ou tem dificuldade para
            dormir com luz.
          </p>
          <h3>Acabamento premium</h3>
          <p>
            Trabalhamos apenas com tecidos blackout certificados, perfis de alumínio
            anodizado e acionamento manual ou motorizado (RF, Wi-Fi, Alexa e Google Home).
            Cada peça é fabricada na nossa unidade em Juiz de Fora — MG e enviada para
            todo o Brasil.
          </p>
        </>
      }
      benefits={[
        "Bloqueio de 100% da luz externa",
        "Isolamento térmico e acústico parcial",
        "Tecido tripla camada antichamas",
        "Acionamento manual, RF ou Wi-Fi",
        "Parcelamento em até 6× sem juros",
      ]}
      features={[
        {
          title: "Tecido blackout 3 camadas",
          description: "Trama técnica que impede 100% da passagem de luz, mesmo nas bordas.",
        },
        {
          title: "Perfil de alumínio",
          description: "Estrutura leve, anodizada e resistente à umidade — não deforma com o tempo.",
        },
        {
          title: "Motorização inteligente",
          description: "Compatível com Alexa, Google Home e controle por aplicativo via Wi-Fi.",
        },
        {
          title: "Sob medida real",
          description: "Larguras de 30 a 320 cm e alturas de até 320 cm — produzido em até 7 dias úteis.",
        },
        {
          title: "Instalação descomplicada",
          description: "Acompanha kit completo de instalação e tutorial em vídeo passo a passo.",
        },
      ]}
      faq={[
        {
          q: "A persiana rolô blackout bloqueia mesmo 100% da luz?",
          a: "Sim, o tecido em si bloqueia 100% da luz. As bordas têm uma folga técnica mínima de 1 a 2 cm para o movimento. Para escurecimento total absoluto, recomendamos a instalação dentro do vão com trilho lateral.",
        },
        {
          q: "Qual a diferença entre blackout e screen?",
          a: "O blackout bloqueia totalmente a luz e a visão; é ideal para quartos. O screen permite visão para fora e filtra a luz solar, sendo indicado para salas e escritórios.",
        },
        {
          q: "Posso usar em sala de TV ou home theater?",
          a: "Sim. É a escolha número 1 para salas de cinema em casa, eliminando reflexos na tela e criando o clima de cinema.",
        },
        {
          q: "Quanto tempo leva para chegar?",
          a: "Produção em até 7 dias úteis e envio para todo o Brasil via transportadora ou Correios. Prazo total médio de 10 a 15 dias úteis.",
        },
      ]}
      bottomCta={{
        title: "Personalize sua persiana blackout agora",
        description:
          "Envie as medidas e em poucas horas você recebe orçamento com tecidos, opções de acionamento e prazo.",
      }}
    />
  );
}

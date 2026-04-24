import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-solar.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Persiana Solar Screen",
  description:
    "Persiana solar screen sob medida com proteção UV, visão para fora e controle térmico. Ideal para escritórios e salas.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/lp-solar.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "229",
    highPrice: "1490",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "892" },
};

export const Route = createFileRoute("/persiana-solar-screen")({
  head: () => ({
    meta: [
      { title: "Persiana Solar Screen 1%, 3% e 5% — Ágil Persianas" },
      {
        name: "description",
        content:
          "Persiana screen com tecido técnico que filtra os raios UV, mantém a visão para fora e reduz o calor. Disponível em abertura 1%, 3% e 5%, sob medida.",
      },
      { name: "keywords", content: "persiana screen, persiana solar, screen 5%, persiana escritório, controle solar" },
      { property: "og:title", content: "Persiana Solar Screen — Conforto Térmico e Visual" },
      {
        property: "og:description",
        content:
          "Filtra UV, reduz calor e preserva a vista. Sob medida com tecidos premium.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-solar.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-solar.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: SolarScreenPage,
});

function SolarScreenPage() {
  return (
    <LandingLayout
      eyebrow="Conforto Térmico"
      title="Persiana Solar Screen sob Medida"
      subtitle="Filtra os raios UV, reduz o calor e preserva a vista — ideal para salas, escritórios e fachadas envidraçadas."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Persiana Screen."
      intro={
        <>
          <h2>O que é a Persiana Screen Solar</h2>
          <p>
            A persiana screen é fabricada com tecido técnico de fibra de vidro revestida em
            PVC, criando uma malha micro-perfurada que filtra a radiação ultravioleta sem
            bloquear a visão para fora. É a escolha favorita de arquitetos e engenheiros
            para fachadas envidraçadas, salas comerciais e ambientes corporativos.
          </p>
          <h3>Aberturas 1%, 3% e 5%</h3>
          <p>
            A porcentagem de abertura define o quanto de luz e visão passa pelo tecido. O
            screen 1% é o mais opaco, ideal para controle térmico máximo; o 3% equilibra
            visão e filtragem; e o 5% é o mais leve, mantendo ampla visibilidade externa.
          </p>
          <h3>Aplicações</h3>
          <p>
            Salas de estar com janelas amplas, escritórios e coworkings, áreas com sol
            poente intenso, fachadas envidraçadas em prédios comerciais, hotéis e
            consultórios médicos.
          </p>
        </>
      }
      benefits={[
        "Bloqueia até 95% dos raios UV",
        "Mantém a visão para fora durante o dia",
        "Reduz a temperatura interna em até 7 °C",
        "Tecido antichamas e antibacteriano",
        "Disponível em 1%, 3% e 5% de abertura",
        "Motorização Wi-Fi e RF disponível",
      ]}
      features={[
        {
          title: "Filtro UV técnico",
          description: "Tecido screen com fator de bloqueio UV de até 95%, protegendo móveis e pessoas.",
        },
        {
          title: "Eficiência térmica",
          description: "Reduz o ganho de calor solar — economia comprovada de energia em ar-condicionado.",
        },
        {
          title: "Visão preservada",
          description: "Diferente do blackout, mantém a paisagem visível durante o dia.",
        },
        {
          title: "Cores neutras",
          description: "Branco, areia, fendi, cinza grafite e preto — combina com qualquer projeto.",
        },
        {
          title: "Resistente e durável",
          description: "Não desbota, não cria mofo e é fácil de limpar com pano úmido.",
        },
        {
          title: "Acionamento à escolha",
          description: "Manual com corrente, motorizado por controle remoto ou via app.",
        },
      ]}
      faq={[
        {
          q: "Qual abertura screen escolher?",
          a: "Para escritórios e salas com sol forte, indicamos 3%. Para vista panorâmica preservada, o 5%. Para máximo controle térmico, o 1%.",
        },
        {
          q: "A persiana screen escurece o ambiente à noite?",
          a: "Não totalmente. À noite, com luz interna acesa, é possível ver de fora. Para dormitórios, recomendamos blackout combinado.",
        },
        {
          q: "Posso usar em ambientes com muito sol direto?",
          a: "Sim, o tecido foi desenvolvido para resistir à incidência solar direta sem desbotar.",
        },
        {
          q: "Funciona em janelas grandes de prédio comercial?",
          a: "Sim. Atendemos projetos corporativos com larguras de até 320 cm por painel e instalação técnica.",
        },
      ]}
      bottomCta={{
        title: "Conforto térmico e visual com Solar Screen",
        description:
          "Solicite seu orçamento e receba a recomendação de abertura ideal para o seu projeto.",
      }}
    />
  );
}

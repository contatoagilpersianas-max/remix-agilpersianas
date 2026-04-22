import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-doublevision.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Persiana Double Vision",
  description:
    "Persiana double vision (zebra) com faixas alternadas de tecido, controlando luz e visão com elegância.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/lp-doublevision.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "279",
    highPrice: "1690",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "503" },
};

export const Route = createFileRoute("/persiana-double-vision")({
  head: () => ({
    meta: [
      { title: "Persiana Double Vision (Zebra) sob Medida — Ágil" },
      {
        name: "description",
        content:
          "Persiana double vision com faixas alternadas que regulam luz e visão. Design moderno, sob medida e com motorização opcional.",
      },
      { property: "og:title", content: "Persiana Double Vision sob Medida" },
      {
        property: "og:description",
        content: "Controle preciso de luz e privacidade com design contemporâneo.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-doublevision.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-doublevision.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: DoubleVisionPage,
});

function DoubleVisionPage() {
  return (
    <LandingLayout
      eyebrow="Design Contemporâneo"
      title="Persiana Double Vision sob Medida"
      subtitle="Faixas alternadas de tecido que controlam luz e privacidade com um simples deslize — o queridinho do design moderno."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Persiana Double Vision."
      intro={
        <>
          <h2>O que é a Double Vision</h2>
          <p>
            Também conhecida como persiana zebra, a double vision combina faixas
            alternadas de tecido translúcido e opaco. Com um movimento simples, você
            ajusta o nível de luz e privacidade — do filtro suave ao bloqueio quase
            total — sem precisar abrir ou fechar totalmente a persiana.
          </p>
          <h3>Aplicações</h3>
          <p>
            Salas de estar e jantar, quartos, escritórios em casa, varandas gourmet e
            ambientes que precisam de versatilidade ao longo do dia.
          </p>
        </>
      }
      benefits={[
        "Controle gradual de luz e privacidade",
        "Visual contemporâneo e elegante",
        "Disponível com forro blackout",
        "Motorização Wi-Fi e RF",
        "Tecidos com proteção antimofo",
        "Garantia de 5 anos",
      ]}
      features={[
        { title: "Faixas duplas", description: "Tecido translúcido + opaco que se sobrepõem para regular a luz." },
        { title: "Mecanismo silencioso", description: "Acionamento por corrente metálica de longa durabilidade." },
        { title: "Versão blackout", description: "Combinação de tecidos com bloqueio completo quando fechada." },
        { title: "Motorização", description: "Compatível com Alexa, Google Home e controle por aplicativo." },
        { title: "Cores modernas", description: "Branco, fendi, grafite, preto e tons neutros sob medida." },
        { title: "Largura até 280 cm", description: "Produzimos em peças únicas ou painéis múltiplos." },
      ]}
      faq={[
        {
          q: "Double vision é o mesmo que persiana zebra?",
          a: "Sim, são nomes diferentes para o mesmo produto.",
        },
        {
          q: "Bloqueia 100% da luz?",
          a: "Não na versão padrão. Para bloqueio total, peça a versão com forro blackout.",
        },
        {
          q: "Como limpar?",
          a: "Pano levemente úmido e aspirador com bocal de tecido. Não usar produtos abrasivos.",
        },
        {
          q: "Funciona em ambiente comercial?",
          a: "Sim, é muito usada em escritórios, recepções e showrooms pela versatilidade visual.",
        },
      ]}
      bottomCta={{
        title: "Design e funcionalidade em um só produto",
        description: "Solicite o orçamento e descubra cores, tecidos e opções de motorização disponíveis.",
      }}
    />
  );
}

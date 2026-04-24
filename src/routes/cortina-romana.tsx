import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-romana.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Cortina Romana sob Medida",
  description:
    "Cortina romana sob medida com tecidos premium, dobras perfeitas e acabamento sofisticado.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/lp-romana.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "349",
    highPrice: "2190",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "612" },
};

export const Route = createFileRoute("/cortina-romana")({
  head: () => ({
    meta: [
      { title: "Cortina Romana sob Medida — Elegância Clássica | Ágil" },
      {
        name: "description",
        content:
          "Cortina romana sob medida com tecidos premium, dobras horizontais perfeitas e visual sofisticado para salas e quartos.",
      },
      { name: "keywords", content: "cortina romana, romana sob medida, cortina elegante, cortina sala" },
      { property: "og:title", content: "Cortina Romana sob Medida — Ágil Persianas" },
      {
        property: "og:description",
        content: "Dobras impecáveis, tecidos premium e instalação em todo o Brasil.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-romana.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-romana.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: CortinaRomanaPage,
});

function CortinaRomanaPage() {
  return (
    <LandingLayout
      eyebrow="Elegância Clássica"
      title="Cortina Romana sob Medida"
      subtitle="Dobras horizontais impecáveis, tecidos premium e o charme atemporal da cortina romana."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Cortina Romana."
      intro={
        <>
          <h2>A sofisticação da cortina romana</h2>
          <p>
            A cortina romana combina o requinte do tecido com a praticidade de uma
            persiana. Suas dobras horizontais perfeitas criam um efeito visual elegante e
            atemporal, perfeito para salas de estar, salas de jantar, suítes e ambientes
            que pedem um acabamento mais sofisticado.
          </p>
          <h3>Tecidos disponíveis</h3>
          <p>
            Trabalhamos com linho natural, blends de algodão, voil técnico e tecidos
            blackout. Cada peça é confeccionada artesanalmente com costuras reforçadas e
            varetas de aço inoxidável que garantem o caimento perfeito por anos.
          </p>
          <h3>Acionamento</h3>
          <p>
            Manual com corrente lateral, com sistema de roldanas silencioso, ou
            motorizada para painéis grandes — operada por controle remoto ou aplicativo.
          </p>
        </>
      }
      benefits={[
        "Dobras horizontais perfeitas",
        "Tecidos linho, blackout e voil",
        "Costura reforçada e varetas inox",
        "Manual silenciosa ou motorizada",
        "Acabamento artesanal",
      ]}
      features={[
        { title: "Costura artesanal", description: "Cada cortina é confeccionada e revisada manualmente." },
        { title: "Varetas inox", description: "Garantem caimento uniforme em qualquer altura." },
        { title: "Tecidos premium", description: "Linho italiano, algodão Pima e blackout técnico." },
        { title: "Bandô opcional", description: "Acabamento superior em tecido para cobrir o trilho." },
        { title: "Sistema silencioso", description: "Roldanas técnicas que não fazem ruído na operação." },
        { title: "Motorização", description: "Disponível para vãos a partir de 1,20 m de largura." },
      ]}
      faq={[
        {
          q: "Qual a diferença entre romana e rolô?",
          a: "A romana é mais decorativa, com dobras visíveis e tecidos mais nobres. O rolô tem visual mais limpo e funcional.",
        },
        {
          q: "Posso ter cortina romana blackout?",
          a: "Sim. Combinamos o forro blackout com o tecido externo de sua escolha.",
        },
        {
          q: "Qual altura mínima e máxima?",
          a: "Produzimos a partir de 50 cm de largura até 280 cm, com altura de até 320 cm.",
        },
        {
          q: "É indicada para sala?",
          a: "Sim, é uma das aplicações mais clássicas — combina elegância com controle de luz.",
        },
      ]}
      bottomCta={{
        title: "Sua cortina romana, perfeita até o último detalhe",
        description: "Envie as medidas e o estilo desejado. Nosso time monta uma proposta personalizada.",
      }}
    />
  );
}

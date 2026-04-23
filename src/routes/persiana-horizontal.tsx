import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/cat-horizontal.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Persiana Horizontal sob Medida",
  description:
    "Persiana horizontal sob medida em madeira, PVC ou alumínio — controle de luz preciso e visual atemporal.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/cat-horizontal.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "189",
    highPrice: "1690",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "574" },
};

export const Route = createFileRoute("/persiana-horizontal")({
  head: () => ({
    meta: [
      { title: "Persiana Horizontal sob Medida — Madeira, PVC, Alumínio | Ágil" },
      {
        name: "description",
        content:
          "Persiana horizontal sob medida em madeira natural, PVC ou alumínio. Controle preciso de luz e visual clássico. Parcele em até 6× sem juros.",
      },
      { name: "keywords", content: "persiana horizontal, persiana de madeira, horizontal pvc, persiana alumínio" },
      { property: "og:title", content: "Persiana Horizontal sob Medida — Ágil Persianas" },
      { property: "og:description", content: "Madeira natural, PVC ou alumínio. Visual atemporal e controle de luz preciso." },
      { property: "og:image", content: "https://agil2.lovable.app/og/cat-horizontal.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/cat-horizontal.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: HorizontalPage,
});

function HorizontalPage() {
  return (
    <LandingLayout
      eyebrow="Visual Atemporal"
      title="Persiana Horizontal sob Medida"
      subtitle="O clássico que nunca sai de moda — escolha entre madeira natural, PVC durável ou alumínio leve."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Persiana Horizontal."
      intro={
        <>
          <h2>Três materiais, infinitas combinações</h2>
          <p>
            A persiana horizontal é a mais clássica do mercado — lâminas paralelas que
            giram para regular a luz e sobem totalmente quando você quer liberar a vista.
            Disponível em três materiais com personalidades diferentes para cada projeto.
          </p>
          <h3>Madeira natural</h3>
          <p>
            Madeira de Paulownia tratada, leve e estável. Acabamento envernizado em
            cores que vão do natural ao preto fosco. Aquece o ambiente e combina com
            decoração escandinava, rústica ou contemporânea.
          </p>
          <h3>PVC e alumínio</h3>
          <p>
            <strong>PVC</strong> imitação madeira é resistente à umidade — ideal para
            cozinhas e banheiros. <strong>Alumínio</strong> de 25 mm é leve, moderno e
            disponível em mais de 20 cores, perfeito para escritórios.
          </p>
        </>
      }
      benefits={[
        "Lâminas em madeira, PVC ou alumínio",
        "Controle preciso de luz",
        "Sobem totalmente quando recolhidas",
        "Cordão duplo (subir e girar)",
        "Acabamentos envernizados",
        "Garantia de 5 anos",
      ]}
      features={[
        { title: "Madeira de Paulownia", description: "Leve, estável e tratada — não empena com a umidade." },
        { title: "Alumínio de 25 mm", description: "Lâminas finas e modernas — escolha entre 20+ cores." },
        { title: "PVC madeirado", description: "Resistente à água e ideal para áreas molhadas." },
        { title: "Sistema cordão duplo", description: "Um cordão para subir/descer, outro para girar as lâminas." },
        { title: "Cabeçalho discreto", description: "Estrutura compacta de 35 mm que se esconde na alvenaria." },
        { title: "Motorização (alumínio)", description: "Disponível para vãos a partir de 60 cm." },
      ]}
      faq={[
        {
          q: "Madeira natural pode ir na cozinha?",
          a: "Não recomendamos por causa da gordura e umidade. Para cozinhas, prefira PVC madeirado.",
        },
        {
          q: "Qual a diferença entre as lâminas de 25 mm e 50 mm?",
          a: "25 mm tem visual mais discreto e moderno. 50 mm é mais robusto e aquece visualmente o ambiente.",
        },
        {
          q: "Persiana horizontal sobe totalmente?",
          a: "Sim. Quando recolhida, as lâminas se acumulam no topo, liberando praticamente todo o vão.",
        },
        {
          q: "Qual o tamanho mínimo?",
          a: "Produzimos a partir de 35 cm de largura por 40 cm de altura.",
        },
      ]}
      bottomCta={{
        title: "A clássica horizontal, sob medida para você",
        description: "Envie as medidas e o material desejado — preparamos um orçamento personalizado.",
      }}
    />
  );
}

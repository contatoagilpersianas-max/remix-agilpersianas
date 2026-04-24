import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/cat-vertical.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Persiana Vertical sob Medida",
  description:
    "Persiana vertical sob medida — controle preciso de luz para escritórios, salas comerciais e ambientes amplos.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/cat-vertical.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "229",
    highPrice: "1890",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", reviewCount: "428" },
};

export const Route = createFileRoute("/persiana-vertical")({
  head: () => ({
    meta: [
      { title: "Persiana Vertical sob Medida — PVC e Tecido | Ágil" },
      {
        name: "description",
        content:
          "Persiana vertical sob medida em PVC ou tecido. Lâminas giratórias para controle total da luz. Parcele em até 6× sem juros e instalação em todo Brasil.",
      },
      { name: "keywords", content: "persiana vertical, vertical pvc, persiana de escritório, vertical tecido" },
      { property: "og:title", content: "Persiana Vertical sob Medida — Ágil Persianas" },
      { property: "og:description", content: "Lâminas giratórias para controle total da luz em escritórios e salas." },
      { property: "og:image", content: "https://agil2.lovable.app/og/cat-vertical.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/cat-vertical.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: VerticalPage,
});

function VerticalPage() {
  return (
    <LandingLayout
      eyebrow="Funcional & Versátil"
      title="Persiana Vertical sob Medida"
      subtitle="Controle preciso de luz com lâminas giratórias — escolha entre PVC, alumínio ou tecido para qualquer ambiente."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Persiana Vertical."
      intro={
        <>
          <h2>A clássica vertical, repaginada</h2>
          <p>
            A persiana vertical é referência em escritórios, salas comerciais, recepções
            e ambientes amplos pela sua eficiência: lâminas giram em 180° para regular
            a luz com precisão e abrem totalmente para liberar o vão.
          </p>
          <h3>Materiais disponíveis</h3>
          <p>
            <strong>PVC</strong> resistente, fácil de limpar e ideal para ambientes
            úmidos. <strong>Tecido</strong> com forração blackout ou translúcida para um
            visual mais aconchegante. <strong>Alumínio</strong> sob consulta — com
            tratamento antichamas para uso comercial.
          </p>
          <h3>Acionamento</h3>
          <p>
            Corrente lateral com cordão de movimento (manual) ou versão motorizada com
            controle por app, indicada para vãos acima de 2,5 m de largura.
          </p>
        </>
      }
      benefits={[
        "Lâminas giratórias 180°",
        "Materiais PVC, tecido e alumínio",
        "Ideal para escritórios e salas",
        "Manual silenciosa ou motorizada",
        "Lavável e durável",
      ]}
      features={[
        { title: "Lâminas de 89 mm ou 127 mm", description: "Duas larguras padrão — escolha conforme o tamanho do vão." },
        { title: "Trilho de alumínio", description: "Estrutura reforçada com carros de movimento internos." },
        { title: "PVC antichamas", description: "Conforme NBR — indicado para escritórios corporativos." },
        { title: "Pesos selados", description: "Barras inferiores escondidas no acabamento das lâminas." },
        { title: "Cordão de segurança", description: "Sistema com break para evitar acidentes (norma ABNT)." },
        { title: "Motorização opcional", description: "Controle remoto ou via app Wi-Fi." },
      ]}
      faq={[
        {
          q: "Posso usar persiana vertical em casa?",
          a: "Sim. As versões em tecido têm visual aconchegante e funcionam bem em salas grandes e quartos com janelões.",
        },
        {
          q: "Vertical PVC pode ir em ambientes úmidos?",
          a: "Sim, é a melhor opção para áreas de serviço, varandas cobertas e cozinhas.",
        },
        {
          q: "Qual a largura mínima e máxima?",
          a: "Produzimos a partir de 60 cm e cobrimos vãos de até 600 cm com trilho contínuo.",
        },
        {
          q: "É difícil limpar?",
          a: "Não. Lâminas de PVC se limpam com pano úmido; lâminas de tecido podem ser removidas e lavadas.",
        },
      ]}
      bottomCta={{
        title: "Persianas verticais para qualquer projeto",
        description: "Envie as medidas e a aplicação — montamos a melhor combinação de material e acionamento.",
      }}
    />
  );
}

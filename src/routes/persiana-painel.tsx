import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/cat-painel.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Painel Japonês sob Medida",
  description:
    "Painel deslizante japonês sob medida — solução elegante para grandes vãos, divisórias e portas de vidro.",
  brand: { "@type": "Brand", name: "Ágil Persianas" },
  image: "https://agil2.lovable.app/og/cat-painel.jpg",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "459",
    highPrice: "2890",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "318" },
};

export const Route = createFileRoute("/persiana-painel")({
  head: () => ({
    meta: [
      { title: "Painel Japonês sob Medida — Persiana Deslizante | Ágil" },
      {
        name: "description",
        content:
          "Painel japonês sob medida com tecidos premium e trilho silencioso. Ideal para grandes vãos, divisórias e portas de vidro. Parcele em até 6× sem juros.",
      },
      { name: "keywords", content: "painel japonês, persiana painel, painel deslizante, divisória de tecido" },
      { property: "og:title", content: "Painel Japonês sob Medida — Ágil Persianas" },
      { property: "og:description", content: "Elegância oriental para grandes vãos. Trilho silencioso e tecidos premium." },
      { property: "og:image", content: "https://agil2.lovable.app/og/cat-painel.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/cat-painel.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: PainelPage,
});

function PainelPage() {
  return (
    <LandingLayout
      eyebrow="Inspiração Oriental"
      title="Painel Japonês sob Medida"
      subtitle="Movimento suave, design minimalista e versatilidade para vãos amplos, divisórias e fechamentos panorâmicos."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Quero um orçamento de Painel Japonês."
      intro={
        <>
          <h2>O que é o painel japonês</h2>
          <p>
            Inspirado nos shoji tradicionais, o painel japonês é formado por lâminas
            verticais largas de tecido que deslizam sobre um trilho de alumínio. É a
            solução ideal para janelões, portas de correr, sacadas envidraçadas e até
            como divisória entre ambientes.
          </p>
          <h3>Tecidos disponíveis</h3>
          <p>
            Trabalhamos com tela solar, blackout, voil técnico e linho sintético — todos
            com tratamento anti-mofo e fácil higienização. Você pode misturar tecidos
            (ex.: tela solar + blackout) em painéis intercalados para controlar luz e
            privacidade conforme a hora do dia.
          </p>
          <h3>Acionamento</h3>
          <p>
            Manual com bastão e roldanas silenciosas, ou motorizado para vãos a partir
            de 2 metros — operado por controle remoto ou aplicativo Wi-Fi.
          </p>
        </>
      }
      benefits={[
        "Ideal para grandes vãos e portas",
        "Trilho de alumínio silencioso",
        "Mistura de tecidos em painéis",
        "Manual ou motorizado",
        "Anti-mofo e fácil limpeza",
      ]}
      features={[
        { title: "Lâminas largas", description: "Painéis de até 100 cm de largura cada — visual amplo e moderno." },
        { title: "Trilho técnico", description: "Alumínio anodizado com roldanas selantes para deslizamento silencioso." },
        { title: "Mix de tecidos", description: "Combine tela solar e blackout no mesmo conjunto para flexibilidade." },
        { title: "Pesos contrabalançados", description: "Barras inferiores em alumínio garantem caimento perfeito." },
        { title: "Motorização Wi-Fi", description: "Controle pelo app, Alexa ou Google Home." },
        { title: "Trilhos curvos", description: "Sob consulta — cobrem janelas em L ou em arco." },
      ]}
      benefitsTitle="Por que escolher o painel japonês"
      faq={[
        {
          q: "Painel japonês serve como divisória?",
          a: "Sim. É uma das aplicações mais elegantes — separa ambientes sem fechar a luz natural completamente.",
        },
        {
          q: "Posso usar em sacada envidraçada?",
          a: "Perfeitamente. O painel desliza ao longo de toda a extensão e cobre vãos longos com poucos painéis.",
        },
        {
          q: "Qual o vão mínimo e máximo?",
          a: "Produzimos a partir de 120 cm e cobrimos vãos de até 600 cm com trilho contínuo.",
        },
        {
          q: "Quantas faixas de tecido cabem em um trilho?",
          a: "De 3 a 8 faixas, dependendo da largura do vão e da estética desejada.",
        },
      ]}
      bottomCta={{
        title: "Painéis japoneses para o seu projeto",
        description: "Envie as medidas e o estilo — preparamos um croqui com a melhor combinação de tecidos.",
      }}
    />
  );
}

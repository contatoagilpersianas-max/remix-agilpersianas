import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-juizdefora.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Ágil Persianas — Juiz de Fora",
  image: "https://agil2.lovable.app/og/lp-juizdefora.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Juiz de Fora",
    addressRegion: "MG",
    addressCountry: "BR",
  },
  telephone: "+55-11-4002-8922",
  priceRange: "$$",
  areaServed: "Juiz de Fora e região",
};

export const Route = createFileRoute("/persiana-juiz-de-fora")({
  head: () => ({
    meta: [
      { title: "Persianas em Juiz de Fora — Fábrica Própria | Ágil" },
      {
        name: "description",
        content:
          "Fábrica de persianas em Juiz de Fora MG. Atendimento técnico, instalação local, sob medida e entrega rápida em toda a região.",
      },
      { name: "keywords", content: "persiana juiz de fora, persianas em juiz de fora mg, cortina juiz de fora" },
      { property: "og:title", content: "Persianas em Juiz de Fora — Fábrica Própria" },
      {
        property: "og:description",
        content: "Atendimento e instalação técnica em Juiz de Fora MG. Sob medida com prazo curto.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-juizdefora.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-juizdefora.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: PersianaJFPage,
});

function PersianaJFPage() {
  return (
    <LandingLayout
      eyebrow="Atendimento Local"
      title="Persianas em Juiz de Fora — MG"
      subtitle="Fábrica própria na cidade. Atendimento técnico, medição em domicílio e instalação por equipe local treinada."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Sou de Juiz de Fora e quero um orçamento."
      intro={
        <>
          <h2>Fábrica em Juiz de Fora MG</h2>
          <p>
            A Ágil Persianas tem fábrica própria em Juiz de Fora, atendendo clientes
            residenciais, comerciais e empresariais em toda a Zona da Mata Mineira. Por
            estarmos aqui, oferecemos prazos curtos, visita técnica gratuita e
            instalação por equipe própria.
          </p>
          <h3>Bairros atendidos</h3>
          <p>
            Centro, Bom Pastor, São Mateus, Cascatinha, Granjas Bethânia, São Pedro,
            Aeroporto, Granbery, Santa Catarina, Cruzeiro do Sul e toda a região
            metropolitana — incluindo Matias Barbosa, Lima Duarte e Santos Dumont.
          </p>
          <h3>Serviços completos</h3>
          <p>
            Persianas rolô, screen, blackout, double vision, romanas, cortinas, toldos,
            telas mosquiteiras e automação residencial. Tudo sob medida, fabricado
            localmente.
          </p>
        </>
      }
      benefits={[
        "Fábrica própria em Juiz de Fora",
        "Visita técnica gratuita na cidade",
        "Instalação por equipe local",
        "Prazo médio de 5 dias úteis",
        "Atendimento pós-venda presencial",
      ]}
      features={[
        { title: "Visita técnica grátis", description: "Agendamos uma medição profissional sem custo em Juiz de Fora." },
        { title: "Instalação inclusa", description: "Equipe própria garante alinhamento e acabamento perfeitos." },
        { title: "Atendimento rápido", description: "Pedidos prontos em até 5 dias úteis na maioria dos casos." },
        { title: "Suporte local", description: "Pós-venda presencial com técnicos que conhecem o produto." },
        { title: "Showroom", description: "Visite nosso espaço e veja amostras reais de tecidos e mecanismos." },
        { title: "Projetos comerciais", description: "Empresas, clínicas e escritórios em Juiz de Fora e região." },
      ]}
      faq={[
        { q: "Vocês atendem em Juiz de Fora?", a: "Sim, somos uma fábrica local com equipe própria de instalação." },
        {
          q: "A medição é cobrada?",
          a: "Não. Em Juiz de Fora e região metropolitana a visita técnica é gratuita.",
        },
        { q: "Qual o prazo médio?", a: "Em média 5 dias úteis após aprovação do orçamento." },
        {
          q: "Atendem cidades vizinhas?",
          a: "Sim — Matias Barbosa, Lima Duarte, Santos Dumont, Bicas e toda a Zona da Mata.",
        },
      ]}
      bottomCta={{
        title: "Atendimento técnico em Juiz de Fora",
        description: "Solicite uma visita técnica gratuita e receba seu orçamento personalizado.",
      }}
    />
  );
}

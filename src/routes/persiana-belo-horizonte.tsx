import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-bh.jpg";

export const Route = createFileRoute("/persiana-belo-horizonte")({
  head: () => ({
    meta: [
      { title: "Persianas em Belo Horizonte — Sob Medida com Entrega Rápida" },
      {
        name: "description",
        content:
          "Persianas e cortinas sob medida em Belo Horizonte. Frete rápido a partir da nossa fábrica em Juiz de Fora MG.",
      },
      { property: "og:title", content: "Persianas em Belo Horizonte" },
      {
        property: "og:description",
        content: "Frete expresso de Juiz de Fora para BH. Tecidos premium e motorização inteligente.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-bh.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-bh.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PersianaBHPage,
});

function PersianaBHPage() {
  return (
    <LandingLayout
      eyebrow="Atendimento BH"
      title="Persianas em Belo Horizonte"
      subtitle="Direto da nossa fábrica em Minas Gerais para sua casa em BH — sob medida, entrega rápida e qualidade premium."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Sou de Belo Horizonte e quero um orçamento."
      intro={
        <>
          <h2>Persianas premium em BH</h2>
          <p>
            Como nossa fábrica fica em Juiz de Fora — MG, a logística para Belo
            Horizonte é uma das mais rápidas do Brasil. Atendemos toda a região
            metropolitana, incluindo Contagem, Betim, Nova Lima e Sabará.
          </p>
          <h3>Linhas mais pedidas em BH</h3>
          <p>
            Persiana rolô blackout para quartos, screen 3% para salas com sol da
            tarde, romanas em linho para áreas sociais e telas mosquiteiras
            magnéticas para sacadas e janelas.
          </p>
        </>
      }
      benefits={[
        "Frete expresso de MG para BH",
        "Tecidos antichamas e antifungo",
        "Motorização inteligente",
        "Visita técnica em projetos grandes",
        "Parcelamento em até 6× sem juros",
      ]}
      features={[
        { title: "Logística rápida", description: "Saída direta da fábrica de Juiz de Fora — entrega em poucos dias." },
        { title: "Tecidos premium", description: "Blackout, screen e linho importado disponíveis." },
        { title: "Atendimento técnico", description: "Suporte por WhatsApp para tirar dúvidas de medição e instalação." },
        { title: "Telas mosquiteiras", description: "Magnéticas, painéis ou retráteis — proteção contra insetos." },
        { title: "Projetos B2B", description: "Hotéis, edifícios corporativos e empreendimentos imobiliários." },
        { title: "Pós-venda", description: "Garantia oficial de 5 anos com cobertura em toda a cidade." },
      ]}
      faq={[
        { q: "Vocês entregam em BH?", a: "Sim. Somos da Zona da Mata Mineira, com frete rápido para toda a Grande BH." },
        { q: "Há instalador em BH?", a: "Trabalhamos com instaladores parceiros certificados em todas as regiões." },
        { q: "Qual o prazo médio?", a: "Em média 7 a 12 dias úteis incluindo produção e transporte." },
        { q: "Atendem cidades próximas?", a: "Sim — Contagem, Betim, Nova Lima, Sabará, Lagoa Santa e demais cidades da RMBH." },
      ]}
      bottomCta={{
        title: "Persianas premium para sua casa em BH",
        description: "Solicite seu orçamento online — produção rápida direto da fábrica em Minas.",
      }}
    />
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/components/seo/LandingLayout";
import heroImg from "@/assets/lp-rio.jpg";

export const Route = createFileRoute("/persiana-rio-de-janeiro")({
  head: () => ({
    meta: [
      { title: "Persianas no Rio de Janeiro — Sob Medida e Entrega Rápida" },
      {
        name: "description",
        content:
          "Persianas e cortinas sob medida com entrega para todo Rio de Janeiro. Tecidos premium, motorização e instalação técnica.",
      },
      { property: "og:title", content: "Persianas no Rio de Janeiro" },
      {
        property: "og:description",
        content: "Atendimento para Rio de Janeiro: zonas Sul, Norte, Oeste e Barra. Sob medida, prazos curtos.",
      },
      { property: "og:image", content: "https://agil2.lovable.app/og/lp-rio.jpg" },
      { name: "twitter:image", content: "https://agil2.lovable.app/og/lp-rio.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PersianaRJPage,
});

function PersianaRJPage() {
  return (
    <LandingLayout
      eyebrow="Atendimento RJ"
      title="Persianas no Rio de Janeiro"
      subtitle="Sob medida, entrega rápida e instalação técnica em toda a cidade — da Zona Sul à Barra da Tijuca."
      heroImage={heroImg}
      ctaSecondaryWhatsapp="Olá! Sou do Rio de Janeiro e quero um orçamento."
      intro={
        <>
          <h2>Atendimento no Rio de Janeiro</h2>
          <p>
            Atendemos clientes em todas as regiões do Rio de Janeiro: Copacabana,
            Ipanema, Leblon, Botafogo, Flamengo, Tijuca, Vila Isabel, Méier, Recreio,
            Barra da Tijuca, Jacarepaguá e Niterói. Trabalhamos com persianas e
            cortinas premium adaptadas ao clima carioca — tecidos resistentes à
            umidade, salinidade e ao sol forte.
          </p>
          <h3>Apartamentos com vista</h3>
          <p>
            Para apartamentos com vista para o mar, recomendamos a persiana solar
            screen, que filtra os raios UV e preserva a paisagem. Para suítes,
            blackout com forro térmico para conforto à noite.
          </p>
        </>
      }
      benefits={[
        "Entrega para todo Rio de Janeiro",
        "Tecidos resistentes à umidade",
        "Motorização Wi-Fi e Alexa",
        "Frete calculado e rápido",
        "Garantia de 5 anos",
        "Suporte por WhatsApp",
      ]}
      features={[
        { title: "Tecidos antifungo", description: "Tratamento especial para o clima úmido carioca." },
        { title: "Solar screen", description: "Ideal para apartamentos com vista para o mar — preserva a paisagem." },
        { title: "Blackout para suítes", description: "Sono perfeito mesmo com a iluminação urbana intensa." },
        { title: "Motorização", description: "Persianas inteligentes integradas à sua casa conectada." },
        { title: "Logística RJ", description: "Envio expresso para Zona Sul, Norte, Oeste e Niterói." },
        { title: "Garantia 5 anos", description: "Cobertura nacional, com suporte por WhatsApp e e-mail." },
      ]}
      faq={[
        { q: "Vocês instalam no Rio?", a: "Trabalhamos com parceiros instaladores certificados em todas as zonas da cidade." },
        { q: "Qual o prazo de entrega?", a: "Em média 10 a 15 dias úteis, incluindo produção e envio." },
        { q: "Os tecidos suportam o clima do Rio?", a: "Sim, todos têm tratamento antifungo e antimofo." },
        { q: "Atendem comércios e hotéis?", a: "Sim, fazemos projetos comerciais com condições especiais." },
      ]}
      bottomCta={{
        title: "Persianas premium no Rio de Janeiro",
        description: "Orçamento online e entrega para toda a cidade. Fale com nosso time agora.",
      }}
    />
  );
}

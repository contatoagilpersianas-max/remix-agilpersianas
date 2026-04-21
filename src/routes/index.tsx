import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { MeasureCTA } from "@/components/site/MeasureCTA";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ágil Persianas — Persianas e cortinas sob medida com entrega para todo Brasil" },
      {
        name: "description",
        content:
          "Persianas rolô, romana, horizontais, verticais e toldos sob medida. Tecidos premium, 12× sem juros, frete grátis acima de R$ 1.500.",
      },
      { property: "og:title", content: "Ágil Persianas — Conforto sob medida" },
      {
        property: "og:description",
        content:
          "Coleção 2026 de persianas e cortinas premium. Calcule pelo tamanho exato da sua janela.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <MeasureCTA />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

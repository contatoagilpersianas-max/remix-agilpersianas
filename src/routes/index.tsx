import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { PromoStrip } from "@/components/site/PromoStrip";
import { BenefitsRow } from "@/components/site/BenefitsRow";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { CategoryBanners } from "@/components/site/CategoryBanners";
import { DiscountsGrid } from "@/components/site/DiscountsGrid";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ágil Persianas — Luz, Forma e Função. Coleção 2026 sob medida" },
      {
        name: "description",
        content:
          "Persianas e cortinas sob medida com tecidos premium, frete grátis para todo o Brasil, 12× sem juros e garantia de 5 anos.",
      },
      { property: "og:title", content: "Ágil Persianas — Luz, Forma e Função" },
      {
        property: "og:description",
        content:
          "Coleção 2026: Soluções arquitetônicas sob medida para transformar sua visão em realidade.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <PromoStrip />
        <BenefitsRow />
        <FeaturedProducts />
        <CategoryBanners />
        <DiscountsGrid />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

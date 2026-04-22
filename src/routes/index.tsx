import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { CategoryNav } from "@/components/site/CategoryNav";
import { Hero } from "@/components/site/Hero";
import { PromoStrip } from "@/components/site/PromoStrip";
import { TrustBar } from "@/components/site/TrustBar";
// BenefitsRow removido — informação já está no TrustBar do topo
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { CategoryBanners } from "@/components/site/CategoryBanners";
import { Categories } from "@/components/site/Categories";
import { DiscountsGrid } from "@/components/site/DiscountsGrid";
import { MeasureCTA } from "@/components/site/MeasureCTA";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ágil Persianas — Persianas e Cortinas sob Medida" },
      {
        name: "description",
        content:
          "Persianas, cortinas e toldos sob medida com tecidos premium. Envio para todo o Brasil, parcelamento em até 12× e garantia de 5 anos.",
      },
      { property: "og:title", content: "Ágil Persianas — Luz, Forma e Função" },
      {
        property: "og:description",
        content:
          "Coleção 2026: persianas e cortinas sob medida com tecidos premium e garantia de 5 anos.",
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
      <CategoryNav />
      <main>
        <Hero />
        {/* Marquee laranja com benefícios — mantido conforme preferência */}
        <PromoStrip />
        {/* Selos de confiança imediatamente após o hero */}
        <TrustBar />
        {/* Categorias visuais — navegação rápida */}
        <Categories />
        {/* Mais vendidos com gatilhos de conversão */}
        <FeaturedProducts />
        {/* Banners promo dupla */}
        <CategoryBanners />
        {/* CTA forte para captura de lead via WhatsApp */}
        <MeasureCTA />
        {/* Descontos */}
        <DiscountsGrid />
        {/* Prova social */}
        <Testimonials />
        {/* Newsletter cupom */}
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

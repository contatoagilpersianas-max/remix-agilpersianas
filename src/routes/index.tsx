import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { PromoStrip } from "@/components/site/PromoStrip";
// TrustBar e Categories removidos a pedido do cliente
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { CategoriesPremium } from "@/components/site/CategoriesPremium";
import { CategoryBanners } from "@/components/site/CategoryBanners";
import { DiscountsGrid } from "@/components/site/DiscountsGrid";
import { MeasureCTA } from "@/components/site/MeasureCTA";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { RoomsSection } from "@/components/site/RoomsSection";
import { AutomationSection } from "@/components/site/AutomationSection";
import { MosquitoSection } from "@/components/site/MosquitoSection";
// B2BSection removido a pedido do cliente (anexo 2)
import { QuoteSection } from "@/components/site/QuoteSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ágil Persianas — Persianas e Cortinas sob Medida" },
      {
        name: "description",
        content:
          "Persianas, cortinas e toldos sob medida com tecidos premium. Envio para todo o Brasil, parcelamento em até 6× sem juros.",
      },
      { property: "og:title", content: "Ágil Persianas — Luz, Forma e Função" },
      {
        property: "og:description",
        content:
          "Coleção 2026: persianas e cortinas sob medida com tecidos premium.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        {/* Marquee laranja com benefícios — mantido conforme preferência */}
        <PromoStrip />
        {/* NOVO: Categorias premium estilo Blinds.com */}
        <CategoriesPremium />
        {/* Mais vendidos */}
        <FeaturedProducts />
        {/* Inspiração por ambiente */}
        <RoomsSection />
        {/* Banners promo dupla */}
        <CategoryBanners />
        {/* Tela mosquiteira — priorizada antes da automação */}
        <MosquitoSection />
        {/* Automação residencial */}
        <AutomationSection />
        {/* CTA medida */}
        <MeasureCTA />
        {/* Captura de leads — formulário público alimenta CRM */}
        <QuoteSection />
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

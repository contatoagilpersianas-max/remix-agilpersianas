import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroBanner, HeroIntro } from "@/components/site/Hero";
import { PromoStrip } from "@/components/site/PromoStrip";
// TrustBar e Categories removidos a pedido do cliente
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { CategoriesPremium } from "@/components/site/CategoriesPremium";
import { BenefitsRow } from "@/components/site/BenefitsRow";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CategoryBanners } from "@/components/site/CategoryBanners";
import { DiscountsGrid } from "@/components/site/DiscountsGrid";
import { MeasureCTA } from "@/components/site/MeasureCTA";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { LumiWidget } from "@/components/site/LumiWidget";

import { AutomationSection } from "@/components/site/AutomationSection";
import { MosquitoSection } from "@/components/site/MosquitoSection";
// B2BSection removido a pedido do cliente (anexo 2)
import { QuoteSection } from "@/components/site/QuoteSection";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

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
  useRevealOnScroll();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* 1) Categorias premium — primeira coisa após o header */}
        <CategoriesPremium />
        {/* 2) Banner visual (imagens em fade) — vem antes dos produtos */}
        <HeroBanner />
        {/* 3) Faixa laranja com benefícios — logo abaixo do banner */}
        <PromoStrip />
        {/* 4) Bloco editorial "Seu ambiente merece..." + Lumi */}
        <HeroIntro />
        {/* Selos de confiança / benefícios premium */}
        <BenefitsRow />
        {/* Mais vendidos */}
        <FeaturedProducts />
        {/* Banners promo dupla */}
        <CategoryBanners />
        {/* Antes & Depois — prova social visual */}
        <BeforeAfter />
        {/* Tela mosquiteira */}
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
      <LumiWidget />
    </div>
  );
}

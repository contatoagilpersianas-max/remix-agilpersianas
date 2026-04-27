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
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { LumiWidget } from "@/components/site/LumiWidget";

import { AutomationSection } from "@/components/site/AutomationSection";
import { MosquitoSection } from "@/components/site/MosquitoSection";
// B2BSection removido a pedido do cliente (anexo 2)
import { QuoteSection } from "@/components/site/QuoteSection";
import { QuizMatch } from "@/components/site/QuizMatch";
import { PriceCalculator } from "@/components/site/PriceCalculator";
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
        {/* 1) Hero Banner — PRIMEIRA seção abaixo do header */}
        <HeroBanner />
        {/* 2) Faixa laranja com benefícios — logo abaixo do banner */}
        <PromoStrip />
        {/* 3) ⭐ QUIZ INTELIGENTE — logo abaixo da faixa laranja */}
        <QuizMatch />
        {/* 3) Bloco editorial "Seu ambiente merece..." + Lumi (Hero principal completo) */}
        <HeroIntro />
        {/* 5) Produtos em destaque */}
        <FeaturedProducts />
        {/* 6) Categorias premium */}
        <CategoriesPremium />
        {/* Selos de confiança / benefícios premium */}
        <BenefitsRow />
        {/* Banners promo dupla */}
        <CategoryBanners />
        {/* Antes & Depois — prova social visual */}
        <BeforeAfter />
        {/* Tela mosquiteira */}
        <MosquitoSection />
        {/* Automação residencial */}
        <AutomationSection />
        {/* Captura de leads — formulário público alimenta CRM */}
        <QuoteSection />
        {/* Calculadora de m² — ancorada em #calculadora, recebe pré-preenchimento do Quiz */}
        <section id="calculadora" className="py-16 sm:py-20 bg-sand">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                Calcule sua persiana por m²
              </h2>
              <p className="mt-3 text-base text-foreground/70 max-w-xl mx-auto">
                Estimativa instantânea com base nas suas medidas. Vindo do quiz?
                Já preenchemos a recomendação para você.
              </p>
            </div>
            <PriceCalculator />
          </div>
        </section>
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

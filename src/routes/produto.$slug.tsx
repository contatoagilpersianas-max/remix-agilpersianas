import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyBox } from "@/components/product/BuyBox";
import { TrustBar } from "@/components/product/TrustBar";
import { BenefitsGrid } from "@/components/product/BenefitsGrid";
import { LifestyleSection } from "@/components/product/LifestyleSection";
import { HowToMeasure } from "@/components/product/HowToMeasure";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { PriceCalculator } from "@/components/site/PriceCalculator";
import { QuoteSection } from "@/components/site/QuoteSection";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/produto/$slug")({
  component: ProductPage,
});

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  cover_image: string | null;
  gallery: string[];
  price_per_sqm: number;
  min_area: number;
  min_width_cm: number;
  max_width_cm: number;
  min_height_cm: number;
  max_height_cm: number;
  motor_manual_price: number;
  motor_rf_price: number;
  motor_wifi_price: number;
  bando_price: number;
  colors: { name: string; hex: string }[];
  features: string[];
  faq: { q: string; a: string }[];
  rating: number;
  reviews_count: number;
  badge: string | null;
};

function ProductPage() {
  const { slug } = useParams({ from: "/produto/$slug" });
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        setProduct(data as unknown as Product);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const images = useMemo(() => {
    if (!product) return [];
    const list = Array.isArray(product.gallery) ? product.gallery : [];
    return list.length ? list : product.cover_image ? [product.cover_image] : [];
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-premium py-10 grid lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-premium py-20 text-center">
          <h1 className="text-2xl font-display">Produto não encontrado</h1>
          <Link to="/" className="text-primary underline mt-4 inline-block">Voltar à home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border/60">
        <div className="container-premium py-3 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span>Persianas</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* HERO */}
      <section className="container-premium py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14">
          <ProductGallery images={images} alt={product.name} badge={product.badge} />
          <BuyBox product={product} />
        </div>
      </section>

      <TrustBar />
      <ProductSpecs product={product} />
      <BenefitsGrid features={product.features} />
      <LifestyleSection />
      <HowToMeasure />
      <ProductFAQ items={product.faq} />
      <RelatedProducts categoryId={product.category_id} excludeId={product.id} />

      <Footer />
      <WhatsAppFAB />
      <StickyBuyBar name={product.name} pricePerSqm={product.price_per_sqm} />
    </div>
  );
}

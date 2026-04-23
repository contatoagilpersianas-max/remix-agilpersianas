import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { ProductGallery, type GalleryImage } from "@/components/product/ProductGallery";
import { BuyBox } from "@/components/product/BuyBox";
import { TrustBar } from "@/components/product/TrustBar";
import { BenefitsGrid } from "@/components/product/BenefitsGrid";
import { LifestyleSection } from "@/components/product/LifestyleSection";
import { HowToMeasure } from "@/components/product/HowToMeasure";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductDescription } from "@/components/product/ProductDescription";
import { ProductInstallation } from "@/components/product/ProductInstallation";
import { ProductManual } from "@/components/product/ProductManual";
import { ProductVideo } from "@/components/product/ProductVideo";
import { QuoteSection } from "@/components/site/QuoteSection";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/produto/$slug")({
  component: ProductPage,
});

type Category = { id: string; name: string; slug: string; parent_id: string | null };

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  installation: string | null;
  manual_pdf_url: string | null;
  video_url: string | null;
  category_id: string | null;
  cover_image: string | null;
  gallery: GalleryImage[];
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
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!mounted) return;
        setProduct(data as unknown as Product);
        // build hierarchical breadcrumb
        if (data?.category_id) {
          const { data: cats } = await supabase
            .from("categories")
            .select("id,name,slug,parent_id");
          const map = new Map<string, Category>();
          (cats ?? []).forEach((c) => map.set(c.id, c as Category));
          const chain: Category[] = [];
          let cur = map.get(data.category_id);
          while (cur) {
            chain.unshift(cur);
            cur = cur.parent_id ? map.get(cur.parent_id) : undefined;
          }
          if (mounted) setBreadcrumb(chain);
        } else {
          setBreadcrumb([]);
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const images = useMemo<GalleryImage[]>(() => {
    if (!product) return [];
    const list = Array.isArray(product.gallery) ? product.gallery : [];
    if (list.length) return list;
    return product.cover_image ? [product.cover_image] : [];
  }, [product]);

  // SEO – injeta título quando produto carrega
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Ágil Persianas`;
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
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
        <SiteHeader />
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
      <SiteHeader />

      {/* Breadcrumb hierárquico */}
      <div className="border-b border-border/60">
        <div className="container-premium py-3 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {breadcrumb.length > 0 ? (
            breadcrumb.map((c) => (
              <span key={c.id}>
                <span className="mx-2">/</span>
                <span className="hover:text-foreground">{c.name}</span>
              </span>
            ))
          ) : (
            <>
              <span className="mx-2">/</span>
              <span>Persianas</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* HERO */}
      <section className="container-premium py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14">
          <ProductGallery
            images={images}
            alt={product.name}
            badge={product.badge}
            activeColor={activeColor}
          />
          <BuyBox product={product} onColorChange={setActiveColor} />
        </div>
      </section>

      <TrustBar />

      {/* Descrição rica vinda do admin */}
      <ProductDescription short={product.short_description} long={product.description} />

      <ProductSpecs product={product} />

      {/* Características vindas do admin */}
      <BenefitsGrid features={product.features ?? []} />

      <LifestyleSection />

      {/* Instalação rica do admin */}
      <ProductInstallation text={product.installation} />

      {/* Manual em PDF */}
      <ProductManual url={product.manual_pdf_url} />

      {/* Vídeo do produto */}
      <ProductVideo url={product.video_url} title={`${product.name} em ação`} />

      <HowToMeasure />

      {/* FAQ vindas do admin */}
      <ProductFAQ items={product.faq ?? []} />

      <RelatedProducts categoryId={product.category_id} excludeId={product.id} />
      <QuoteSection />

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

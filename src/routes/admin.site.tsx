import { createFileRoute } from "@tanstack/react-router";
import { ModulesIndex } from "@/components/admin/site/_shared/ModulesIndex";
import { HeroModule } from "@/components/admin/site/HeroModule";
import { BannersModule } from "@/components/admin/site/BannersModule";
import { PromoStripModule } from "@/components/admin/site/PromoStripModule";
import { ContactModule } from "@/components/admin/site/ContactModule";
import { FooterModule } from "@/components/admin/site/FooterModule";
import { SeoModule } from "@/components/admin/site/SeoModule";
import { MediaLibraryModule } from "@/components/admin/site/MediaLibraryModule";

export const Route = createFileRoute("/admin/site")({ component: SiteContent });

function SiteContent() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Conteúdo</div>
        <h1 className="font-display text-3xl mt-1">Site / Conteúdo</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Edite todas as seções editáveis do site. Use o índice abaixo para navegar entre módulos.
        </p>
      </div>

      <ModulesIndex />

      <div className="space-y-6">
        <HeroModule />
        <BannersModule />
        <PromoStripModule />
        <ContactModule />
        <FooterModule />
        <SeoModule />
        <MediaLibraryModule />
      </div>
    </div>
  );
}
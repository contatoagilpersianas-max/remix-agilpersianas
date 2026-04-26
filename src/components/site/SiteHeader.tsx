// Cabeçalho com comportamento "smart sticky":
// - No topo: tudo visível (TopBar + Header + CategoryNav).
// - Ao rolar PARA BAIXO: esconde para liberar conteúdo.
// - Ao rolar PARA CIMA: reaparece compacto.
// - Em PÁGINAS DE PRODUTO: usa modo SLIM por padrão (sem TopBar, sem CategoryNav)
//   para reduzir ruído enquanto o cliente lê o produto. Um botão "Categorias"
//   permite abrir/fechar o menu sob demanda.
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/produto/");
  const [showNav, setShowNav] = useState(!isProductPage);

  // Reset ao trocar de rota
  useEffect(() => {
    setShowNav(!isProductPage);
  }, [isProductPage]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 8);
      if (y > 160 && delta > 6) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/60 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "shadow-md" : "shadow-sm"}`}
    >
      {/* TopBar só no topo da página e fora do produto */}
      {!isProductPage && (
        <div className={`${scrolled ? "hidden" : "block"}`}>
          <TopBar />
        </div>
      )}

      {/* Header com toggle de categorias em páginas de produto */}
      <div className="relative">
        <Header />
        {isProductPage && (
          <div className="container-premium absolute inset-y-0 right-2 hidden items-center md:flex pointer-events-none">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNav((v) => !v)}
              aria-expanded={showNav}
              aria-controls="produto-categorynav"
              className="pointer-events-auto gap-1.5 text-xs font-semibold uppercase tracking-wider"
            >
              {showNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              Categorias
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

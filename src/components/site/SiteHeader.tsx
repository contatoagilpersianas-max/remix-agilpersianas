// Cabeçalho com comportamento "smart sticky":
// - No topo: tudo visível (TopBar + Header + CategoryNav).
// - Ao rolar PARA BAIXO: esconde para liberar conteúdo.
// - Ao rolar PARA CIMA: reaparece compacto.
// - Em PÁGINAS DE PRODUTO: usa modo SLIM por padrão (sem TopBar, sem CategoryNav)
//   para reduzir ruído enquanto o cliente lê o produto. Um botão "Categorias"
//   permite abrir/fechar o menu sob demanda.
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { TopBar } from "./TopBar";
import { Header } from "./Header";

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/produto/");

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
      </div>
    </div>
  );
}

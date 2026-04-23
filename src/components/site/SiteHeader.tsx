// Cabeçalho com comportamento "smart sticky":
// - No topo: tudo visível (TopBar + Header + CategoryNav).
// - Ao rolar PARA BAIXO: esconde para liberar conteúdo.
// - Ao rolar PARA CIMA: reaparece compacto (apenas Header + CategoryNav).
// Padrão usado por Hunter Douglas, Amazon, Mercado Livre etc.
import { useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { CategoryNav } from "./CategoryNav";

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 8);
      // Só esconde após passar 160px e quando rola para baixo > 6px
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
      {/* TopBar só visível no topo da página — economiza espaço ao rolar */}
      <div className={`${scrolled ? "hidden" : "block"}`}>
        <TopBar />
      </div>
      <Header />
      <CategoryNav />
    </div>
  );
}

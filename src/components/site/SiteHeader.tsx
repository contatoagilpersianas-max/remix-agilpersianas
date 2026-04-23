// Cabeçalho do site agrupando TopBar + Header + CategoryNav, fixo ao rolar.
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { CategoryNav } from "./CategoryNav";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/60 shadow-sm">
      <TopBar />
      <Header />
      <CategoryNav />
    </div>
  );
}

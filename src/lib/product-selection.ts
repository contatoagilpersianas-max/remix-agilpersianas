// Persistência leve por produto (cor selecionada, largura, altura) em sessionStorage.
// Usada em BuyBox e ProductGallery para sincronização ao voltar à página.
const PREFIX = "agil:product:";

export type ProductSelection = {
  color?: string;
  widthCm?: number;
  heightCm?: number;
};

export function loadSelection(slug: string): ProductSelection {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(PREFIX + slug);
    if (!raw) return {};
    return JSON.parse(raw) as ProductSelection;
  } catch {
    return {};
  }
}

export function saveSelection(slug: string, sel: ProductSelection) {
  if (typeof window === "undefined") return;
  try {
    const merged = { ...loadSelection(slug), ...sel };
    sessionStorage.setItem(PREFIX + slug, JSON.stringify(merged));
  } catch {
    /* quota / disabled */
  }
}

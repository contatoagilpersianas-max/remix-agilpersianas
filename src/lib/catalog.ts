export type CatalogSettings = {
  bestsellerSecondarySort: "featured" | "rating";
  bestsellerTertiarySort: "featured" | "rating";
};

export const DEFAULT_CATALOG_SETTINGS: CatalogSettings = {
  bestsellerSecondarySort: "featured",
  bestsellerTertiarySort: "rating",
};

export function normalizeCatalogSettings(value: unknown): CatalogSettings {
  if (!value || typeof value !== "object") return DEFAULT_CATALOG_SETTINGS;

  const raw = value as Partial<CatalogSettings>;
  const secondary = raw.bestsellerSecondarySort === "rating" ? "rating" : "featured";
  const tertiary =
    raw.bestsellerTertiarySort && raw.bestsellerTertiarySort !== secondary
      ? raw.bestsellerTertiarySort
      : secondary === "featured"
        ? "rating"
        : "featured";

  return {
    bestsellerSecondarySort: secondary,
    bestsellerTertiarySort: tertiary,
  };
}

export function getCatalogOrderColumns(settings: CatalogSettings) {
  const columns: Array<"bestseller" | "featured" | "rating" | "reviews_count"> = ["bestseller"];

  const pushSort = (sort: "featured" | "rating") => {
    if (sort === "rating") {
      columns.push("rating", "reviews_count");
      return;
    }
    columns.push("featured");
  };

  pushSort(settings.bestsellerSecondarySort);
  pushSort(settings.bestsellerTertiarySort);

  return columns.filter((column, index) => columns.indexOf(column) === index);
}
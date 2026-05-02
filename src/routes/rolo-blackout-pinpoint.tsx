import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryPage } from "@/components/site/SubcategoryPage";

type Search = {
  sort?: "destaque" | "menor-preco" | "maior-preco" | "novidades";
  q?: string;
  page?: number;
  tag?: string;
};

const SORTS = ["destaque", "menor-preco", "maior-preco", "novidades"] as const;

export const Route = createFileRoute("/rolo-blackout-pinpoint")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sort:
      typeof s.sort === "string" && (SORTS as readonly string[]).includes(s.sort)
        ? (s.sort as Search["sort"])
        : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    page: typeof s.page === "number" ? s.page : Number(s.page) || undefined,
    tag: typeof s.tag === "string" ? s.tag : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Persiana Rolô Blackout Pinpoint sob Medida — Ágil Persianas" },
      {
        name: "description",
        content:
          "Persiana rolô blackout Pinpoint: bloqueio total de luz com tecido de toque suave e acabamento premium. Calcule por m² e receba sob medida.",
      },
      { property: "og:title", content: "Rolô Blackout Pinpoint — Ágil Persianas" },
      {
        property: "og:description",
        content: "Linha Pinpoint: blackout premium com textura sutil. Sob medida com calculadora por m².",
      },
    ],
  }),
  component: PinpointPage,
});

function PinpointPage() {
  return (
    <SubcategoryPage
      categorySlug="rolo-blackout-pinpoint"
      routeId="/rolo-blackout-pinpoint"
      eyebrow="Linha Premium · Pinpoint"
      title="Persiana Rolô Blackout Pinpoint"
      subtitle="Tecido blackout com micro-textura Pinpoint. Bloqueio total de luz, sofisticação visual e cores neutras para qualquer ambiente."
      parentSlug="rolo-blackout"
      parentLabel="Rolô Blackout"
      tags={[
        { value: "branca", label: "Branca" },
        { value: "bege", label: "Bege" },
        { value: "cinza", label: "Cinza" },
        { value: "preta", label: "Preta" },
      ]}
    />
  );
}
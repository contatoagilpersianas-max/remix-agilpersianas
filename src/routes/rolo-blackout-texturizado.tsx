import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryPage } from "@/components/site/SubcategoryPage";

type Search = { sort?: string; q?: string };

export const Route = createFileRoute("/rolo-blackout-texturizado")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sort: typeof s.sort === "string" ? s.sort : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Persiana Rolô Blackout Texturizado sob Medida — Ágil Persianas" },
      {
        name: "description",
        content:
          "Linha Texturizado: persiana rolô blackout com tecido encorpado, textura rústica e bloqueio total de luz. Calculadora por m² com entrega para todo Brasil.",
      },
      { property: "og:title", content: "Rolô Blackout Texturizado — Ágil Persianas" },
      {
        property: "og:description",
        content: "Tecido texturizado encorpado com blackout total. Estética premium para salas e quartos.",
      },
    ],
  }),
  component: TexturizadoPage,
});

function TexturizadoPage() {
  return (
    <SubcategoryPage
      categorySlug="rolo-blackout-texturizado"
      routeId="/rolo-blackout-texturizado"
      eyebrow="Linha Premium · Texturizado"
      title="Persiana Rolô Blackout Texturizado"
      subtitle="Tecido blackout texturizado com toque encorpado e visual rústico-elegante. Bloqueia 100% da luz e valoriza qualquer ambiente."
      parentSlug="rolo-blackout"
      parentLabel="Rolô Blackout"
    />
  );
}
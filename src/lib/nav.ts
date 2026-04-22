/**
 * Tipo padronizado para itens de navegação.
 * REGRA: cada item DEVE ter EXATAMENTE um de `to` (rota interna TanStack)
 * OU `href` (URL externa/âncora). Nunca os dois, nunca nenhum.
 *
 * Para rotas dinâmicas (ex: "/blog/$slug"), use `href` com o slug já
 * resolvido — não exponha placeholders no menu.
 */
export type NavLink =
  | { label: string; to: string; href?: never }
  | { label: string; href: string; to?: never };

export interface NavColumn {
  title: string;
  links: NavLink[];
}

/**
 * Valida itens de navegação em tempo de execução, logando avisos amigáveis
 * que identificam exatamente qual lista/índice contém o item inválido.
 * Retorna apenas os itens válidos para nunca quebrar a renderização.
 */
export function validateNavLinks(
  links: unknown,
  context: string,
): NavLink[] {
  if (!Array.isArray(links)) {
    console.warn(
      `[nav] "${context}": esperado array de links, recebido ${typeof links}.`,
    );
    return [];
  }

  return links.filter((item, index): item is NavLink => {
    const path = `${context}[${index}]`;

    if (item == null || typeof item !== "object") {
      console.warn(`[nav] ${path}: item inválido (não é objeto).`, item);
      return false;
    }

    const { label, to, href } = item as Record<string, unknown>;

    if (typeof label !== "string" || label.trim() === "") {
      console.warn(`[nav] ${path}: "label" ausente ou inválido.`, item);
      return false;
    }
    if (to !== undefined && href !== undefined) {
      console.warn(
        `[nav] ${path} ("${label}"): use APENAS "to" OU "href", nunca os dois.`,
        item,
      );
      return false;
    }
    if (to === undefined && href === undefined) {
      console.warn(
        `[nav] ${path} ("${label}"): falta "to" ou "href".`,
        item,
      );
      return false;
    }
    if (to !== undefined && typeof to !== "string") {
      console.warn(`[nav] ${path} ("${label}"): "to" deve ser string.`, item);
      return false;
    }
    if (href !== undefined && typeof href !== "string") {
      console.warn(`[nav] ${path} ("${label}"): "href" deve ser string.`, item);
      return false;
    }
    if (typeof to === "string" && to.includes("$")) {
      console.warn(
        `[nav] ${path} ("${label}"): rota dinâmica não resolvida em "to" ("${to}"). Use "href" com slug real.`,
        item,
      );
      return false;
    }
    return true;
  });
}

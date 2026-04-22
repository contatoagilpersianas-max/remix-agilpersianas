import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { Footer } from "../Footer";
import { validateNavLinks } from "@/lib/nav";

function renderWithRouter(ui: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <>{ui}</>,
  });
  // Catch-all for any /to links so router doesn't 404 in tests
  const splatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    component: () => <>{ui}</>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, splatRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("Footer", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("renderiza sem lançar 'Objects are not valid as a React child'", async () => {
    const { findByText } = renderWithRouter(<Footer />);
    await findByText("Produtos");
  });

  it("não renderiza nenhum [object Object] no DOM", async () => {
    const { container, findByText } = renderWithRouter(<Footer />);
    await findByText("Produtos");
    expect(container.textContent).not.toContain("[object Object]");
    expect(container.textContent).not.toContain("{label");
  });

  it("todos os links possuem href não vazio e clicável", async () => {
    renderWithRouter(<Footer />);
    await screen.findByText("Produtos");
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("undefined");
      expect(href).not.toContain("$");
    }
  });

  it("renderiza colunas e itens conhecidos", async () => {
    renderWithRouter(<Footer />);
    expect(await screen.findByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Atendimento")).toBeInTheDocument();
    expect(screen.getByText("Persiana Rolô Blackout")).toBeInTheDocument();
  });
});

describe("validateNavLinks", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("aceita itens válidos com 'to' OU 'href'", () => {
    const result = validateNavLinks(
      [
        { label: "A", to: "/a" },
        { label: "B", href: "#b" },
      ],
      "test",
    );
    expect(result).toHaveLength(2);
  });

  it("rejeita item com 'to' e 'href' juntos", () => {
    const result = validateNavLinks(
      [{ label: "X", to: "/x", href: "/x" } as never],
      "test",
    );
    expect(result).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('test[0] ("X")'),
      expect.anything(),
    );
  });

  it("rejeita rota dinâmica não resolvida em 'to'", () => {
    const result = validateNavLinks(
      [{ label: "Post", to: "/blog/$slug" }],
      "Footer/Blog",
    );
    expect(result).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Footer/Blog[0]"),
      expect.anything(),
    );
  });

  it("rejeita item sem label", () => {
    const result = validateNavLinks([{ to: "/x" } as never], "test");
    expect(result).toHaveLength(0);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { act, render, renderHook } from "@testing-library/react";
import { CartProvider, useCart, formatBRL } from "./cart";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("inicia vazio e marca como hidratado após o primeiro effect", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    // Após o useEffect inicial, hydrated vira true.
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.hydrated).toBe(true);
  });

  it("adiciona item, calcula subtotal e count", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        id: "p1",
        productId: "p1",
        productSlug: "rolo",
        productName: "Persiana Rolô",
        image: null,
        unitPrice: 250,
      });
    });
    expect(result.current.count).toBe(1);
    expect(result.current.subtotal).toBe(250);
  });

  it("incrementa quantidade ao adicionar mesmo id", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        id: "p1",
        productId: "p1",
        productSlug: "rolo",
        productName: "Rolô",
        image: null,
        unitPrice: 100,
      });
      result.current.addItem({
        id: "p1",
        productId: "p1",
        productSlug: "rolo",
        productName: "Rolô",
        image: null,
        unitPrice: 100,
        quantity: 2,
      });
    });
    expect(result.current.count).toBe(3);
    expect(result.current.subtotal).toBe(300);
  });

  it("updateQty atualiza subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        id: "p1",
        productId: "p1",
        productSlug: "rolo",
        productName: "Rolô",
        image: null,
        unitPrice: 50,
      });
      result.current.updateQty("p1", 4);
    });
    expect(result.current.subtotal).toBe(200);
  });

  it("removeItem retira do carrinho", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        id: "p1",
        productId: "p1",
        productSlug: "rolo",
        productName: "Rolô",
        image: null,
        unitPrice: 50,
      });
      result.current.removeItem("p1");
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("persiste no localStorage e recupera ao remontar", () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        id: "p1",
        productId: "p1",
        productSlug: "rolo",
        productName: "Rolô",
        image: null,
        unitPrice: 99,
      });
    });
    unmount();

    const remount = renderHook(() => useCart(), { wrapper });
    // Após hidratação, o item volta.
    expect(remount.result.current.count).toBe(1);
    expect(remount.result.current.subtotal).toBe(99);
  });

  it("useCart fora do provider retorna fallback seguro com hydrated=false", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.hydrated).toBe(false);
    // Não pode lançar
    expect(() => result.current.addItem({
      id: "x",
      productId: "x",
      productSlug: "x",
      productName: "X",
      image: null,
      unitPrice: 10,
    })).not.toThrow();
  });

  it("formatBRL formata em pt-BR", () => {
    expect(formatBRL(1234.5)).toMatch(/1\.234,50/);
  });

  it("renderiza children sem erro", () => {
    const { getByText } = render(
      <CartProvider>
        <span>ok</span>
      </CartProvider>,
    );
    expect(getByText("ok")).toBeInTheDocument();
  });
});

/**
 * Carrinho global (client-side, persistido em localStorage).
 * Suporta produtos simples e configuráveis (m²).
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string; // chave única (productId + variant fingerprint)
  productId: string;
  productSlug: string;
  productName: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  // Detalhes opcionais para persianas sob medida
  widthCm?: number;
  heightCm?: number;
  motor?: string;
  color?: string;
  bando?: boolean;
  side?: string;
  // Preço cheio antes de oferta (para mostrar "de … por")
  fullPrice?: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "agil:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextType>(() => {
    const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const count = items.reduce((acc, it) => acc + it.quantity, 0);
    return {
      items,
      count,
      subtotal,
      open,
      setOpen,
      addItem(item) {
        setItems((prev) => {
          const idx = prev.findIndex((p) => p.id === item.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) };
            return next;
          }
          return [...prev, { ...item, quantity: item.quantity ?? 1 }];
        });
        setOpen(true);
      },
      removeItem(id) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      },
      updateQty(id, qty) {
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)),
        );
      },
      clear() {
        setItems([]);
      },
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

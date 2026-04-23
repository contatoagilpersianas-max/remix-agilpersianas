/**
 * Carrinho global (client-side, persistido em localStorage).
 * SSR-safe: durante a renderização no servidor e no primeiro paint do
 * cliente o contexto retorna um estado vazio. Após o `useEffect` de
 * hidratação, lê o localStorage e expõe os itens reais.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
  hydrated: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};

const noop = () => {};

// Marker no contexto default para que o hook detecte "sem provider".
const DEFAULT_MARKER = Symbol("cart-default");

const defaultCartContext: CartContextType & { [DEFAULT_MARKER]?: true } = {
  items: [],
  count: 0,
  subtotal: 0,
  open: false,
  hydrated: false,
  setOpen: noop,
  addItem: noop,
  removeItem: noop,
  updateQty: noop,
  clear: noop,
  [DEFAULT_MARKER]: true,
};

const CartContext = createContext<CartContextType>(defaultCartContext);
const STORAGE_KEY = "agil:cart";
const isDev =
  typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV;

export function CartProvider({ children }: { children: ReactNode }) {
  // Sempre inicia vazio — evita mismatch SSR/cliente.
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const initialLoad = useRef(true);

  // Hidrata do localStorage só no cliente, no primeiro effect.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (err) {
      if (isDev) console.warn("[cart] falha ao ler localStorage:", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persiste mudanças (depois da hidratação para não sobrescrever com [] inicial)
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota */
    }
  }, [items]);

  const addItem = useCallback<CartContextType["addItem"]>((item) => {
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
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextType>(() => {
    const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const count = items.reduce((acc, it) => acc + it.quantity, 0);
    return {
      items,
      count,
      subtotal,
      open,
      hydrated,
      setOpen,
      addItem,
      removeItem,
      updateQty,
      clear,
    };
  }, [items, open, hydrated, addItem, removeItem, updateQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (isDev && (ctx as { [DEFAULT_MARKER]?: true })[DEFAULT_MARKER]) {
    // Apenas em dev, alerta uma vez para facilitar diagnóstico.
    if (typeof window !== "undefined") {
      const flag = "__cart_default_warned__";
      const w = window as unknown as Record<string, boolean>;
      if (!w[flag]) {
        w[flag] = true;
        // eslint-disable-next-line no-console
        console.warn(
          "[cart] useCart() está retornando o contexto padrão (sem CartProvider). " +
            "Verifique se a árvore está dentro de <CartProvider>.",
        );
      }
    }
  }
  return ctx;
}

/** Hook auxiliar para componentes que precisam saber se o cart já foi hidratado do localStorage. */
export function useIsCartHydrated(): boolean {
  return useContext(CartContext).hydrated;
}

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

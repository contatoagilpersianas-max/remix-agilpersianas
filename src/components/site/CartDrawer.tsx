import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, formatBRL } from "@/lib/cart";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, removeItem, updateQty, count, hydrated } = useCart();

  // Fecha drawer quando rota muda — uso simples via popstate
  useEffect(() => {
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setOpen]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 bg-background"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg">
              Carrinho{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {hydrated ? `(${count} ${count === 1 ? "item" : "itens"})` : "(…)"}
              </span>
            </h2>
          </div>
        </header>

        {/* Body — só renderiza após hidratação para evitar flash de "vazio" */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {!hydrated ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Carregando carrinho…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Explore nosso catálogo e encontre a persiana ideal para seu ambiente.
              </p>
              <Button onClick={() => setOpen(false)} className="mt-6" asChild>
                <Link to="/catalogo">Continuar comprando</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="rounded-xl border bg-card p-3 flex gap-3"
                >
                  <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.productName}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to="/produto/$slug"
                        params={{ slug: it.productSlug }}
                        onClick={() => setOpen(false)}
                        className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary"
                      >
                        {it.productName}
                      </Link>
                      <div className="text-right shrink-0">
                        {it.fullPrice && it.fullPrice > it.unitPrice && (
                          <div className="text-[11px] text-muted-foreground line-through">
                            {formatBRL(it.fullPrice)}
                          </div>
                        )}
                        <div className="font-bold text-primary text-sm">
                          {formatBRL(it.unitPrice * it.quantity)}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes da configuração */}
                    {(it.widthCm || it.motor || it.color) && (
                      <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                        {it.widthCm && (
                          <span>
                            Largura:{" "}
                            <strong className="text-foreground/80">
                              {(it.widthCm / 100).toFixed(2)} m
                            </strong>
                          </span>
                        )}
                        {it.heightCm && (
                          <span>
                            Altura:{" "}
                            <strong className="text-foreground/80">
                              {(it.heightCm / 100).toFixed(2)} m
                            </strong>
                          </span>
                        )}
                        {it.side && (
                          <span>
                            Cordinha:{" "}
                            <strong className="text-foreground/80">
                              {it.side === "left" ? "Esquerdo" : "Direito"}
                            </strong>
                          </span>
                        )}
                        {it.motor && (
                          <span>
                            Acionamento:{" "}
                            <strong className="text-foreground/80">
                              {it.motor === "manual"
                                ? "Manual"
                                : it.motor === "rf"
                                  ? "Motor RF"
                                  : "Wi-Fi"}
                            </strong>
                          </span>
                        )}
                        {typeof it.bando === "boolean" && (
                          <span>
                            Acabamento:{" "}
                            <strong className="text-foreground/80">
                              {it.bando ? "Com bandô" : "Sem bandô"}
                            </strong>
                          </span>
                        )}
                        {it.color && (
                          <span>
                            Cor:{" "}
                            <strong className="text-foreground/80">{it.color}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Qty + delete */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border bg-background">
                        <button
                          onClick={() => updateQty(it.id, it.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={it.quantity <= 1}
                          aria-label="Diminuir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(it.id, it.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/5"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer fixo com totais e CTAs */}
        {hydrated && items.length > 0 && (
          <footer className="border-t bg-background px-5 py-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-semibold">Total estimado</div>
                <div className="text-[11px] text-muted-foreground">
                  Frete e descontos calculados no checkout
                </div>
              </div>
              <div className="font-display text-2xl">{formatBRL(subtotal)}</div>
            </div>

            <Button
              size="lg"
              className="w-full h-12 bg-success text-white hover:bg-success/90 text-sm font-semibold"
            >
              Finalizar a compra <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-11"
              onClick={() => setOpen(false)}
            >
              Continuar comprando
            </Button>
          </footer>
        )}
      </SheetContent>
    </Sheet>
  );
}

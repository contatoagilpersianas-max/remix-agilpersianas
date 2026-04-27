import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-premium">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card md:p-14">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Cupom exclusivo
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
                Ganhe <span className="text-primary">10% OFF</span> no primeiro
                pedido
              </h2>
              <p className="mt-3 text-muted-foreground">
                Assine e receba ofertas, lançamentos e o cupom direto no email.
              </p>
            </div>

            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="h-14 w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="h-14 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110">
                Receber cupom
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

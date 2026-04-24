import { QuoteForm } from "./QuoteForm";

export function QuoteSection() {
  return (
    <section id="orcamento" className="py-16 sm:py-20 bg-graphite text-graphite-foreground">
      <div className="container mx-auto px-4">
        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Orçamento gratuito
            </div>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">
              Conte sobre sua janela.
              <br />
              <span className="text-primary">A gente cuida do resto.</span>
            </h2>
            <p className="text-graphite-foreground/70 mt-3 max-w-md">
              Receba um orçamento personalizado em até 1 hora útil — sem compromisso, sem cobrança de visita.
            </p>
          </div>
          <div className="bg-background rounded-3xl p-2 shadow-2xl">
            <QuoteForm source="home_form" />
          </div>
        </div>
      </div>
    </section>
  );
}

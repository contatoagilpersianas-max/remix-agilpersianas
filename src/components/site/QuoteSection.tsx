import { QuoteForm } from "./QuoteForm";
import { Clock, ShieldCheck, MapPin } from "lucide-react";

export function QuoteSection() {
  return (
    <section id="orcamento" className="py-16 sm:py-20 bg-graphite text-graphite-foreground">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
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

          <ul className="grid gap-3 mt-6 text-sm">
            <li className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </span>
              Atendimento humano em horário comercial
            </li>
            <li className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Garantia de 5 anos em todos os produtos
            </li>
            <li className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </span>
              Fábrica em Juiz de Fora · entregamos para todo o Brasil
            </li>
          </ul>
        </div>

        <div className="bg-background rounded-3xl p-2 shadow-2xl">
          <QuoteForm source="home_form" />
        </div>
      </div>
    </section>
  );
}

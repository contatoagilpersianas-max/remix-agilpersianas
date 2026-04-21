import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ProductFAQ({ items }: { items: { q: string; a: string }[] }) {
  if (!items?.length) return null;
  return (
    <section className="bg-sand/40 border-y">
      <div className="container-premium py-20">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">FAQ</span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">Perguntas frequentes</h2>
            <p className="text-muted-foreground mt-3">
              Não encontrou o que procurava? Fale com um especialista pelo WhatsApp.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">{it.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

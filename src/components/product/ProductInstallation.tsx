import { Wrench, CheckCircle2 } from "lucide-react";

export function ProductInstallation({ text }: { text?: string | null }) {
  if (!text || !text.trim()) return null;

  // Quebra por linhas vazias ou por "1.", "-", "•"
  const steps = text
    .split(/\n+/)
    .map((s) => s.replace(/^\s*(?:\d+[\.\)]|[-•])\s*/, "").trim())
    .filter(Boolean);

  return (
    <section className="bg-gradient-to-br from-sand/30 to-background border-y">
      <div className="container-premium py-16">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-semibold inline-flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5" /> Instalação
            </span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">Fácil de instalar</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Acompanha kit completo, parafusos e guia ilustrado. Em poucos minutos
              sua persiana está pronta para uso.
            </p>
          </div>

          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border bg-card p-4 shadow-card"
              >
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed pt-1.5">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { Check } from "lucide-react";

export function BenefitsGrid({ features }: { features: string[] }) {
  if (!features?.length) return null;
  return (
    <section className="container-premium py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Diferenciais</span>
        <h2 className="font-display text-3xl lg:text-4xl mt-2">Por que escolher a Ágil</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f} className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <p className="font-medium leading-snug">{f}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

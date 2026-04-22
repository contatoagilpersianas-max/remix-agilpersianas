export function ProductDescription({
  short,
  long,
}: {
  short?: string | null;
  long?: string | null;
}) {
  if (!long || !long.trim()) return null;
  // suporta parágrafos por quebra de linha
  const paragraphs = long.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <section className="container-premium py-12">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Sobre o produto
          </span>
          <h2 className="font-display text-3xl lg:text-4xl mt-2">Detalhes que fazem diferença</h2>
          {short && <p className="text-muted-foreground mt-4 leading-relaxed text-base">{short}</p>}
        </div>
        <div className="prose prose-neutral max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-foreground/85 leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

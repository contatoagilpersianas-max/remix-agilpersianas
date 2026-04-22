import { FileText, Download } from "lucide-react";

export function ProductManual({ url }: { url?: string | null }) {
  if (!url) return null;
  return (
    <section className="container-premium pb-12">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="block max-w-3xl mx-auto rounded-2xl border bg-gradient-to-br from-sand/60 to-card p-6 shadow-card hover:shadow-lg transition group"
      >
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">
              Material para download
            </div>
            <h3 className="font-display text-xl mt-1">Manual de instalação (PDF)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Passo a passo ilustrado, lista de ferramentas e dicas de medição.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium group-hover:bg-primary/90 transition">
            <Download className="h-4 w-4" /> Baixar PDF
          </div>
        </div>
      </a>
    </section>
  );
}

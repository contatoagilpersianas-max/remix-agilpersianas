import { Play } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m?.[1] ?? null;
}
function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m?.[1] ?? null;
}

export function ProductVideo({ url, title }: { url?: string | null; title?: string }) {
  if (!url) return null;
  const yt = getYouTubeId(url);
  const vimeo = getVimeoId(url);
  const src = yt
    ? `https://www.youtube.com/embed/${yt}`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo}`
      : null;
  if (!src) return null;

  return (
    <section className="container-premium py-16">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold inline-flex items-center gap-2">
          <Play className="h-3.5 w-3.5" /> Veja em ação
        </span>
        <h2 className="font-display text-3xl lg:text-4xl mt-2">{title ?? "Conheça o produto"}</h2>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-card border max-w-4xl mx-auto aspect-video bg-black">
        <iframe
          src={src}
          title={title ?? "Vídeo do produto"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

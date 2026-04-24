// Grid premium estilo Blinds.com / SelectBlinds — 7 categorias principais
// com imagens reais, hover com zoom suave e link direto para o catálogo filtrado.
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import imgRolo from "@/assets/cat-rolo.jpg";
import imgDouble from "@/assets/cat-double-vision.jpg";
import imgRomana from "@/assets/cat-romana.jpg";
import imgPainel from "@/assets/cat-painel.jpg";
import imgHorizontal from "@/assets/cat-horizontal.jpg";
import imgVertical from "@/assets/cat-vertical.jpg";
import imgAutomacao from "@/assets/section-automacao.jpg";

type Item = {
  title: string;
  desc: string;
  img: string;
  slug: string;
  badge?: string;
  large?: boolean;
};

const ITEMS: Item[] = [
  {
    title: "Persiana Rolô",
    desc: "Versátil, moderna e perfeita para qualquer ambiente.",
    img: imgRolo,
    slug: "persiana-rolo",
    badge: "Mais vendida",
    large: true,
  },
  {
    title: "Double Vision",
    desc: "Faixas duplas para controle total da luz.",
    img: imgDouble,
    slug: "double-vision",
  },
  {
    title: "Romana",
    desc: "Elegância clássica em tecidos premium.",
    img: imgRomana,
    slug: "cortina-romana",
  },
  {
    title: "Painel",
    desc: "Ideal para grandes vãos e portas de vidro.",
    img: imgPainel,
    slug: "persiana-painel",
  },
  {
    title: "Horizontal",
    desc: "Madeira, alumínio ou PVC — clássico atemporal.",
    img: imgHorizontal,
    slug: "persiana-horizontal",
  },
  {
    title: "Vertical",
    desc: "Excelente para escritórios e ambientes amplos.",
    img: imgVertical,
    slug: "persiana-vertical",
  },
  {
    title: "Motorizadas",
    desc: "Automação Wi-Fi, controle remoto e voz.",
    img: imgAutomacao,
    slug: "motorizadas",
    badge: "Novidade",
    large: true,
  },
];

export function CategoriesPremium() {
  return (
    <section id="categorias" className="bg-background py-16 md:py-24">
      <div className="container-premium">
        {/* Cabeçalho */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Coleção 2026
            </span>
            <h2 className="font-display mt-2 text-3xl leading-tight tracking-tight md:text-5xl">
              Encontre a persiana ideal para o seu ambiente
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Tecidos premium, sob medida exata e instalação profissional. Escolha
              o modelo perfeito para cada janela.
            </p>
          </div>
          <Link
            to="/catalogo"
            className="inline-flex h-11 items-center gap-2 rounded-full border-2 px-5 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:bg-primary hover:text-white"
            style={{ borderColor: "#F57C00", color: "#F57C00" }}
          >
            Ver todas as categorias
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid Bento — 2 cards grandes (linha 1 e linha 4) + 4 cards normais */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ITEMS.map((item, i) => {
            const span = item.large ? "lg:col-span-2" : "lg:col-span-1";
            const aspect = item.large ? "aspect-[16/9]" : "aspect-[4/5]";
            return (
              <Link
                key={item.slug}
                to="/catalogo"
                search={{ categoria: item.slug }}
                className={`group relative overflow-hidden rounded-2xl bg-foreground shadow-sm ring-1 ring-border transition hover:shadow-2xl hover:ring-primary/30 ${span} ${aspect}`}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Badge */}
                {item.badge && (
                  <span
                    className="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-md"
                    style={{ backgroundColor: "#F57C00" }}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Conteúdo */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">
                  <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/85 md:text-sm">
                    {item.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all group-hover:gap-3">
                    Explorar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

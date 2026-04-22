import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import logoAgil from "@/assets/agil-logo.png";
import { type NavColumn, validateNavLinks } from "@/lib/nav";
import { SITE_CONFIG, whatsappLink } from "@/lib/site-config";

const COLS: NavColumn[] = [
  {
    title: "Produtos",
    links: [
      { label: "Persiana Rolô Blackout", to: "/persiana-rolo-blackout" },
      { label: "Persiana Solar Screen", to: "/persiana-solar-screen" },
      { label: "Cortina Romana", to: "/cortina-romana" },
      { label: "Double Vision", to: "/persiana-double-vision" },
      { label: "Catálogo completo", to: "/catalogo" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { label: "Como medir", href: "/blog/como-medir-janela-persiana" },
      { label: "Escolha de tecidos", href: "/blog/como-escolher-tecido-persiana" },
      { label: "Automação", href: "/blog/automacao-persianas-casa-inteligente" },
      { label: "Frete e prazo", href: "#frete" },
      { label: "Garantia 5 anos", href: "#garantia" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Ágil",
    links: [
      { label: "Persiana Juiz de Fora", to: "/persiana-juiz-de-fora" },
      { label: "Persiana Rio de Janeiro", to: "/persiana-rio-de-janeiro" },
      { label: "Persiana Belo Horizonte", to: "/persiana-belo-horizonte" },
      { label: "Blog Ágil", to: "/blog" },
      { label: "Política de privacidade", href: "#privacidade" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-graphite text-graphite-foreground">
      <div className="container-premium grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <div className="rounded-xl bg-white/95 px-4 py-3 inline-block">
            <img src={logoAgil} alt="Ágil Persianas" className="h-10 w-auto" />
          </div>

          <p className="mt-5 max-w-sm text-sm text-white/70">
            Há mais de 15 anos transformando ambientes com persianas, cortinas
            e toldos sob medida — entrega para todo o Brasil.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href={`tel:+${SITE_CONFIG.whatsappNumber}`}
                className="opacity-80 hover:opacity-100"
              >
                {SITE_CONFIG.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="opacity-80 hover:opacity-100"
              >
                WhatsApp {SITE_CONFIG.whatsappDisplay} · {SITE_CONFIG.hours}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="opacity-80 hover:opacity-100"
              >
                {SITE_CONFIG.email}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex gap-2">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Rede social"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-primary hover:border-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => {
          const safeLinks = validateNavLinks(col.links, `Footer/${col.title}`);
          return (
            <div key={col.title} className="md:col-span-2">
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
                {col.title}
              </div>
              <ul className="space-y-2.5 text-sm">
                {safeLinks.map((l) => (
                  <li key={l.label}>
                    {"to" in l && l.to ? (
                      <Link
                        to={l.to}
                        className="text-white/75 transition hover:text-white"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-white/75 transition hover:text-white"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div className="md:col-span-2">
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
            Pague com
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Visa", "Master", "Elo", "Amex", "Pix", "Boleto"].map((b) => (
              <span
                key={b}
                className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
            <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
            <span className="opacity-85">
              Site seguro com criptografia SSL e certificado.
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
            <CreditCard className="h-5 w-5 shrink-0 text-primary-glow" />
            <span className="opacity-85">Parcele em até 12× no cartão.</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 md:flex-row">
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.brand} — CNPJ {SITE_CONFIG.cnpj}. Todos os direitos reservados.
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Termos</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

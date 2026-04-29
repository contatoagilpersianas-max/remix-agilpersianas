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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContact, whatsappLink } from "@/hooks/use-site-contact";
import { SITE_CONFIG } from "@/lib/site-config";

type FooterLink = { label: string; url: string };
type FooterColumn = { title: string; enabled: boolean; links: FooterLink[] };
type FooterCfg = { intro: string; columns: FooterColumn[]; copyright: string };

const DEFAULT_COLS: FooterColumn[] = [
  {
    title: "Produtos",
    enabled: true,
    links: [
      { label: "Persiana Rolô Blackout", url: "/persiana-rolo-blackout" },
      { label: "Persiana Solar Screen", url: "/persiana-solar-screen" },
      { label: "Cortina Romana", url: "/cortina-romana" },
      { label: "Double Vision", url: "/persiana-double-vision" },
      { label: "Catálogo completo", url: "/catalogo" },
    ],
  },
  {
    title: "Atendimento",
    enabled: true,
    links: [
      { label: "Como medir", url: "/blog/como-medir-janela-persiana" },
      { label: "Escolha de tecidos", url: "/blog/como-escolher-tecido-persiana" },
      { label: "Automação", url: "/blog/automacao-persianas-casa-inteligente" },
      { label: "FAQ", url: "#faq" },
    ],
  },
  {
    title: "Ágil",
    enabled: true,
    links: [
      { label: "Blog Ágil", url: "/blog" },
      { label: "Política de privacidade", url: "#privacidade" },
    ],
  },
];

const DEFAULT_FOOTER: FooterCfg = {
  intro: "Transformando ambientes com persianas, cortinas e toldos sob medida — entrega para todo o Brasil.",
  columns: DEFAULT_COLS,
  copyright: `© ${new Date().getFullYear()} ${SITE_CONFIG.brand} — CNPJ ${SITE_CONFIG.cnpj}. Todos os direitos reservados.`,
};

export function Footer() {
  const contact = useSiteContact();
  const [cfg, setCfg] = useState<FooterCfg>(DEFAULT_FOOTER);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "footer").maybeSingle();
      if (!cancelled && data?.value) setCfg({ ...DEFAULT_FOOTER, ...(data.value as Partial<FooterCfg>) });
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const cols = (cfg.columns || []).filter((c) => c.enabled !== false && c.title?.trim());
  const socials: Array<{ Icon: typeof Instagram; href: string; label: string }> = [
    { Icon: Instagram, href: contact.instagram, label: "Instagram" },
    { Icon: Facebook, href: contact.facebook, label: "Facebook" },
    { Icon: Youtube, href: contact.youtube, label: "YouTube" },
  ].filter((s) => s.href);
  return (
    <footer className="bg-graphite text-graphite-foreground">
      <div className="container-premium grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <div className="rounded-xl bg-white/95 px-4 py-3 inline-block">
            <img src={logoAgil} alt="Ágil Persianas" className="h-10 w-auto" />
          </div>

          <p className="mt-5 max-w-sm text-sm text-white/70">
            {cfg.intro}
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href={`tel:+${(contact.whatsapp || "").replace(/\D/g, "")}`}
                className="opacity-80 hover:opacity-100"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href={whatsappLink(contact.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="opacity-80 hover:opacity-100"
              >
                WhatsApp {contact.whatsappDisplay} · {contact.hours}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href={`mailto:${contact.email}`}
                className="opacity-80 hover:opacity-100"
              >
                {contact.email}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex gap-2">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label="Rede social"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-primary hover:border-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
              {col.title}
            </div>
            <ul className="space-y-2.5 text-sm">
              {col.links.filter((l) => l.label?.trim()).map((l) => {
                const isInternal = l.url?.startsWith("/") && !l.url.startsWith("//");
                return (
                  <li key={l.label}>
                    {isInternal ? (
                      <Link to={l.url as string} className="text-white/75 transition hover:text-white">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.url || "#"} className="text-white/75 transition hover:text-white">
                        {l.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

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
            <span className="opacity-85">Parcele em até 6× sem juros no cartão.</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 md:flex-row">
          <div>
            {cfg.copyright}
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

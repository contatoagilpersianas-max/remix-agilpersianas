import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

const COLS = [
  {
    title: "Produtos",
    links: ["Rolô", "Romana", "Double Vision", "Painel", "Horizontais", "Verticais", "Toldos"],
  },
  {
    title: "Atendimento",
    links: ["Como medir", "Como instalar", "Trocas e devoluções", "Frete e prazo", "Garantia", "FAQ"],
  },
  {
    title: "Institucional",
    links: ["Sobre a Ágil", "Showroom", "Trabalhe conosco", "Blog", "Política de privacidade", "Termos de uso"],
  },
];

export function Footer() {
  return (
    <footer className="bg-graphite text-graphite-foreground">
      {/* Top: brand + columns */}
      <div className="container-premium grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <span className="font-display text-xl font-bold">Á</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl font-bold">
                Ágil <span className="text-primary-glow">Persianas</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                Conforto sob medida
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm text-white/70">
            Há mais de 15 anos transformando ambientes com persianas, cortinas
            e toldos sob medida — entrega para todo o Brasil.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a href="tel:+551140028922" className="opacity-80 hover:opacity-100">
                (11) 4002-8922
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noreferrer"
                className="opacity-80 hover:opacity-100"
              >
                WhatsApp · seg a sáb, 8h–20h
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary-glow" />
              <a
                href="mailto:contato@agilpersianas.com.br"
                className="opacity-80 hover:opacity-100"
              >
                contato@agilpersianas.com.br
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary-glow" />
              <span className="opacity-80">
                Showroom — Av. das Persianas, 1234 · São Paulo, SP
              </span>
            </li>
          </ul>

          <div className="mt-6 flex gap-2">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-primary hover:border-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
              {col.title}
            </div>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/75 transition hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
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
            <span className="opacity-85">Em até 12× sem juros no cartão.</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 md:flex-row">
          <div>
            © {new Date().getFullYear()} Ágil Persianas — CNPJ 00.000.000/0001-00. Todos os direitos reservados.
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

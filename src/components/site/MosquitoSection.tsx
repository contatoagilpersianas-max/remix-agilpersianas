// Seção Tela Mosquiteira — janela aberta, casa protegida
import { Check, ArrowRight } from "lucide-react";
import imgTela from "@/assets/section-tela.jpg";

const TYPES = [
  { t: "Fixa", s: "Quadro discreto, ideal para janelas que ficam abertas." },
  { t: "Retrátil", s: "Recolhe quando não está em uso, perfeita para portas." },
  { t: "Magnética", s: "Encaixe sem furos, fácil de instalar e remover." },
  { t: "Pet reforçada", s: "Tela mais resistente para casas com cães e gatos." },
];

export function MosquitoSection() {
  return (
    <section className="bg-sand py-12 md:py-16">
      <div className="container-premium grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "#B8541C" }}
          >
            ✦ Tela mosquiteira
          </span>
          <h2
            className="font-display mt-4 leading-[1.05] tracking-tight text-foreground"
            style={{ fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Janela aberta. <br />
            <span style={{ color: "#F57C00" }}>Casa protegida.</span>
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground md:text-[17px]">
            Telas para qualquer tipo de janela ou porta — proteção contra
            mosquitos, dengue e insetos sem perder a ventilação natural.
          </p>

          <ul className="mt-8 space-y-3">
            {TYPES.map((t) => (
              <li key={t.t} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#F57C00", color: "#fff" }}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="font-semibold text-foreground">{t.t}</div>
                  <div className="text-sm text-muted-foreground">{t.s}</div>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/5532351202810?text=Olá,%20gostaria%20de%20um%20orçamento%20de%20tela%20mosquiteira"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.16em] transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#1a1208", color: "#fff" }}
          >
            Solicitar orçamento <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl md:order-first">
          <img
            src={imgTela}
            alt="Tela mosquiteira em sacada de apartamento"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

// Seção B2B — lojistas, arquitetos, construtoras, corporativo
import { Building2, HardHat, Compass, Briefcase, ArrowRight } from "lucide-react";
import imgB2B from "@/assets/section-b2b.jpg";

const PARTNERS = [
  { icon: Building2, t: "Construtoras", s: "Projetos residenciais e empreendimentos." },
  { icon: Compass, t: "Arquitetos", s: "Especificação técnica e amostras." },
  { icon: HardHat, t: "Lojistas", s: "Revenda com margens diferenciadas." },
  { icon: Briefcase, t: "Corporativo", s: "Escritórios, hotéis e franquias." },
];

export function B2BSection() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 md:py-28 text-background">
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0">
        <img
          src={imgB2B}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(15,10,5,0.96) 0%, rgba(15,10,5,0.78) 60%, rgba(15,10,5,0.5) 100%)",
          }}
        />
      </div>

      <div className="relative container-premium grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "#FFB877" }}
          >
            ✦ B2B & Parcerias
          </span>
          <h2
            className="font-display mt-4 leading-[1.05] tracking-tight"
            style={{ fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Soluções para quem <br />
            <span style={{ color: "#F57C00" }}>cria espaços.</span>
          </h2>
          <p className="mt-5 max-w-md text-white/75 md:text-[17px]">
            Atendimento dedicado para arquitetos, construtoras, lojistas e
            corporativo — com tabelas comerciais, suporte técnico e prazos
            programados.
          </p>

          <a
            href="https://wa.me/5532351202810?text=Olá,%20tenho%20interesse%20em%20parceria%20comercial"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.16em] transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#F57C00", color: "#fff" }}
          >
            Seja parceiro comercial <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PARTNERS.map((p) => (
            <div
              key={p.t}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <p.icon className="h-6 w-6" style={{ color: "#FFB877" }} />
              <div className="mt-3 font-display text-base font-semibold">{p.t}</div>
              <div className="mt-1 text-[13px] text-white/65">{p.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

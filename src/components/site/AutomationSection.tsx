// Seção Automação Residencial — Alexa, Google Home, Wi-Fi, RF, App
import { Smartphone, Wifi, Mic, RadioTower, Zap, ArrowRight } from "lucide-react";
import imgAutomacao from "@/assets/section-automacao.jpg";

const FEATURES = [
  { icon: Mic, t: "Alexa", s: "Comando por voz" },
  { icon: Wifi, t: "Google Home", s: "Integração total" },
  { icon: Smartphone, t: "App celular", s: "iOS e Android" },
  { icon: RadioTower, t: "Controle remoto", s: "Sem fios pela parede" },
  { icon: Zap, t: "Wi-Fi e RF", s: "Múltiplos protocolos" },
];

export function AutomationSection() {
  return (
    <section className="relative overflow-hidden bg-graphite py-20 md:py-28 text-graphite-foreground">
      <div className="container-premium grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={imgAutomacao}
            alt="Persiana motorizada controlada por aplicativo"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "#FFB877" }}
          >
            ✦ Automação residencial
          </span>
          <h2
            className="font-display mt-4 leading-[1.05] tracking-tight"
            style={{ fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Sua casa inteligente <br />
            começa <span style={{ color: "#F57C00" }}>na janela</span>.
          </h2>
          <p className="mt-5 max-w-md text-white/75 md:text-[17px]">
            Persianas motorizadas com integração total a Alexa, Google Home e
            controle pelo celular. Subir, descer e programar cenas com um toque
            ou um comando de voz.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.t}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <f.icon className="h-5 w-5" style={{ color: "#FFB877" }} />
                <div className="mt-3 font-display text-sm font-semibold text-white">
                  {f.t}
                </div>
                <div className="mt-0.5 text-[12px] text-white/60">{f.s}</div>
              </div>
            ))}
          </div>

          <a
            href="#categorias"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.16em] transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#F57C00", color: "#fff" }}
          >
            Ver linha motorizada <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

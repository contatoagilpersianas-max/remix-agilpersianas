// Seção Automação Residencial — Alexa, Google Home, Wi-Fi, RF, App
import { Smartphone, Wifi, Mic, RadioTower, Zap, Cpu, Bot, ArrowRight, type LucideIcon } from "lucide-react";
import imgAutomacao from "@/assets/section-automacao.jpg";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { AUTOMATION_DEFAULTS, type AutomationConfig } from "@/components/admin/site/AutomationModule";

const ICONS: Record<string, LucideIcon> = {
  Mic,
  Wifi,
  Smartphone,
  RadioTower,
  Zap,
  Cpu,
  Bot,
};

export function AutomationSection() {
  const { value: cfg } = useSiteSetting<AutomationConfig>("automation", AUTOMATION_DEFAULTS);
  if (!cfg.enabled) return null;
  // Divide a linha 2 para destacar a última palavra em laranja
  const words = (cfg.titleLine2 || "").trim().split(/\s+/);
  const accent = words.pop() ?? "";
  const head = words.join(" ");
  return (
    <section className="relative overflow-hidden bg-graphite py-12 md:py-16 text-graphite-foreground">
      <div className="container-premium grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={cfg.image || imgAutomacao}
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
            {cfg.eyebrow}
          </span>
          <h2
            className="font-display mt-4 leading-[1.05] tracking-tight"
            style={{ fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            {cfg.titleLine1} <br />
            {head ? `${head} ` : ""}
            <span style={{ color: "#F57C00" }}>{accent}</span>
          </h2>
          <p className="mt-5 max-w-md text-white/75 md:text-[17px]">
            {cfg.description}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cfg.features.map((f) => {
              const Icon = ICONS[f.icon] ?? Cpu;
              return (
                <div
                  key={f.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <Icon className="h-5 w-5" style={{ color: "#FFB877" }} />
                  <div className="mt-3 font-display text-sm font-semibold text-white">
                    {f.t}
                  </div>
                  <div className="mt-0.5 text-[12px] text-white/60">{f.s}</div>
                </div>
              );
            })}
          </div>

          <a
            href={cfg.ctaUrl}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.16em] transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#F57C00", color: "#fff" }}
          >
            {cfg.ctaLabel} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

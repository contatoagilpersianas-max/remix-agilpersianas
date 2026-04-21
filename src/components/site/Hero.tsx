// Hero comercial — foto imersiva + texto sobreposto + CTAs + captura WhatsApp
import heroImg from "@/assets/hero-living-room.jpg";
import { ArrowRight, Shield, Truck, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Foto de fundo */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Sala premium com persianas Ágil"
          className="h-full w-full object-cover"
        />
        {/* Overlay para contraste do texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,12,4,0.78) 0%, rgba(20,12,4,0.55) 45%, rgba(20,12,4,0.15) 100%)",
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="relative container-premium py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(226,118,58,0.55)",
              color: "#E2763A",
              backgroundColor: "rgba(20,12,4,0.5)",
            }}
          >
            <span>✦</span> Coleção 2026 — Sob medida
          </div>

          {/* Headline */}
          <h1
            className="font-display mt-6 leading-[1.02] tracking-tight"
            style={{
              fontWeight: 400,
              fontSize: "clamp(40px, 6vw, 68px)",
              color: "#f5ede0",
              textShadow: "0 2px 30px rgba(0,0,0,0.4)",
            }}
          >
            A luz certa.
            <br />
            <span style={{ color: "#E2763A" }}>Para cada ambiente.</span>
          </h1>

          {/* Subtítulo */}
          <p
            className="mt-5 max-w-xl text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(245,237,224,0.85)" }}
          >
            Persianas, cortinas e toldos sob medida com tecidos premium,
            instalação profissional e até <strong>36× sem juros</strong>.
          </p>

          {/* Selos rápidos */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium" style={{ color: "rgba(245,237,224,0.75)" }}>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" style={{ color: "#E2763A" }} />
              Frete grátis Brasil
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" style={{ color: "#E2763A" }} />
              Garantia 5 anos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#E2763A" }} />
              4.9 (2.300+ avaliações)
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "#E2763A", color: "#fff" }}
            >
              Ver coleção completa <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#medida"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 px-6 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:bg-white/10"
              style={{
                borderColor: "rgba(245,237,224,0.5)",
                color: "#f5ede0",
              }}
            >
              Calcular minha medida
            </a>
          </div>

          {/* Quick capture WhatsApp — gatilho de conversão */}
          <form
            id="medida"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const medida = data.get("medida")?.toString().trim() || "";
              const msg = encodeURIComponent(
                `Olá! Quero orçamento para minha medida: ${medida}`,
              );
              window.open(`https://wa.me/5511999999999?text=${msg}`, "_blank");
            }}
            className="mt-6 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl rounded-full p-1.5"
            style={{
              backgroundColor: "rgba(20,12,4,0.65)",
              border: "1px solid rgba(245,237,224,0.18)",
              backdropFilter: "blur(6px)",
            }}
          >
            <input
              name="medida"
              required
              placeholder="Largura × Altura (ex.: 120 × 160 cm)"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[rgba(245,237,224,0.5)]"
              style={{ color: "#f5ede0" }}
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              Orçamento em 5 min <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
          <p
            className="mt-2 text-[11px]"
            style={{ color: "rgba(245,237,224,0.55)" }}
          >
            ⚡ Resposta via WhatsApp em até 5 minutos — sem compromisso.
          </p>

          {/* Métricas */}
          <div
            className="mt-8 border-t pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl"
            style={{ borderColor: "rgba(245,237,224,0.18)" }}
          >
            {[
              { v: "+20 mil", l: "Clientes" },
              { v: "4.9 ★", l: "Avaliação" },
              { v: "5 anos", l: "Garantia" },
              { v: "36×", l: "Sem juros" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  className="font-display text-2xl md:text-3xl"
                  style={{ color: "#f5ede0", fontWeight: 500 }}
                >
                  {m.v}
                </div>
                <div
                  className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,237,224,0.65)" }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

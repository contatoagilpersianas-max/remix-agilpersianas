// Hero — fundo amadeirado #1a1208, texto à esquerda, foto à direita
import heroImg from "@/assets/hero-living-room.jpg";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#1a1208" }}
    >
      <div className="container-premium grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-center py-14 md:py-20 lg:py-24">
        {/* Esquerda — conteúdo */}
        <div className="text-left">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(226,118,58,0.45)",
              color: "#E2763A",
            }}
          >
            <span>✦</span> Coleção 2026 — Sob medida
          </div>

          {/* Headline serif */}
          <h1
            className="font-display mt-6 leading-[1.05] tracking-tight"
            style={{ fontWeight: 400, fontSize: "clamp(36px, 5.4vw, 56px)" }}
          >
            <span style={{ color: "#f5ede0" }}>A luz certa.</span>
            <br />
            <span style={{ color: "#E2763A" }}>Forma e Função.</span>
          </h1>

          {/* Subtítulo */}
          <p
            className="mt-5 max-w-xl text-sm md:text-[15px] leading-relaxed"
            style={{ color: "rgba(245,237,224,0.65)" }}
          >
            Persianas, cortinas e toldos sob medida com tecidos premium,
            instalação profissional e até 36× sem juros.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:opacity-90"
              style={{ backgroundColor: "#E2763A", color: "#fff" }}
            >
              Ver coleção completa <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#medida"
              className="inline-flex h-12 items-center justify-center rounded-full border px-6 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:bg-white/5"
              style={{
                borderColor: "rgba(245,237,224,0.35)",
                color: "#f5ede0",
              }}
            >
              Calcular minha medida
            </a>
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center rounded-full border px-6 text-[12px] font-bold uppercase tracking-[0.14em] transition hover:bg-white/5"
              style={{
                borderColor: "rgba(245,237,224,0.35)",
                color: "#f5ede0",
              }}
            >
              Ver catálogo
            </a>
          </div>

          {/* Quick capture (lead) */}
          <form
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
              backgroundColor: "rgba(245,237,224,0.06)",
              border: "1px solid rgba(245,237,224,0.12)",
            }}
          >
            <input
              name="medida"
              required
              placeholder="Largura × Altura (ex.: 120 × 160 cm)"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[rgba(245,237,224,0.4)]"
              style={{ color: "#f5ede0" }}
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:opacity-90"
              style={{ backgroundColor: "#E2763A", color: "#fff" }}
            >
              Orçamento em 5 min <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
          <p
            className="mt-2 text-[11px]"
            style={{ color: "rgba(245,237,224,0.45)" }}
          >
            Informe sua medida e receba retorno via WhatsApp em até 5 minutos.
          </p>

          {/* Divisória + métricas */}
          <div
            className="mt-9 border-t pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl"
            style={{ borderColor: "rgba(245,237,224,0.12)" }}
          >
            {[
              { v: "+20 mil", l: "Clientes" },
              { v: "4.9 ★", l: "Avaliação" },
              { v: "5 anos", l: "Garantia" },
              { v: "36×", l: "Sem juros" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  className="font-display text-2xl"
                  style={{ color: "#f5ede0", fontWeight: 500 }}
                >
                  {m.v}
                </div>
                <div
                  className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,237,224,0.55)" }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direita — foto */}
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(226,118,58,0.25)",
              boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
            }}
          >
            <img
              src={heroImg}
              alt="Ambiente premium com persianas Ágil"
              className="aspect-[4/5] w-full object-cover"
              width={1200}
              height={1500}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// QuizMatch — Quiz interativo "Descubra a persiana ideal em 60s"
// Componente isolado, não interfere na Lumi. Mobile-first, cards grandes.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BedDouble,
  Sofa,
  Tv,
  ChefHat,
  Briefcase,
  WashingMachine,
  Baby,
  Moon,
  Sun,
  Eye,
  Trees,
  PawPrint,
  Users,
  Sparkles,
  Home,
  Mountain,
  Factory,
  Hand,
  Cpu,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  MessageCircle,
  ShoppingBag,
  Calculator,
  SkipForward,
  Bot,
  Shield,
  Sailboat,
  XCircle,
} from "lucide-react";
import { whatsappLink } from "@/lib/site-config";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/lib/analytics";

type OptionDef<T extends string> = {
  value: T;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  feedback: string;
};

/* ---------------- Paleta premium ----------------
   Nude / Champagne / Off-white com Coral apenas em CTAs e detalhes.
----------------------------------------------------*/
const palette = {
  offwhite: "#FAF7F2",
  champagne: "#EFE6D8",
  champagneSoft: "#F6EFE3",
  nude: "#E8DCC9",
  ink: "#1F1A15",
  inkSoft: "#5A5048",
  inkMuted: "#8A8078",
  hairline: "rgba(31,26,21,0.10)",
  coral: "#D9663C",
  coralSoft: "#E78A5F",
  coralWash: "rgba(217,102,60,0.08)",
};

// Imagem de interior de luxo desfocada usada como pano de fundo "editorial".
const editorialBg =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=70";

type Ambiente =
  | "quarto"
  | "sala"
  | "home"
  | "cozinha"
  | "escritorio"
  | "lavanderia"
  | "infantil"
  | "externa";
type Luz = "blackout" | "filtrar" | "privacidade" | "solar";
type Seguranca = "criancas" | "pets" | "adultos";
type Estilo = "moderno" | "classico" | "rustico" | "industrial";
type Acionamento = "manual" | "motorizado";
type Convivencia = "criancas" | "pets" | "nenhum";

type Answers = {
  ambiente?: Ambiente;
  luz?: Luz;
  estilo?: Estilo;
  convivencia?: Convivencia;
  acionamento?: Acionamento;
};

const ambientes: OptionDef<Ambiente>[] = [
  { value: "quarto", label: "Quarto", icon: BedDouble, feedback: "Ótimo! Quartos pedem privacidade e conforto." },
  { value: "sala", label: "Sala de Estar", icon: Sofa, feedback: "Perfeito! Vamos pensar em luz natural e elegância." },
  { value: "home", label: "Sala de TV / Home", icon: Tv, feedback: "Entendido! Foco em controle de reflexos e brilho." },
  { value: "cozinha", label: "Cozinha", icon: ChefHat, feedback: "Boa escolha! Tecidos fáceis de limpar entram na lista." },
  { value: "escritorio", label: "Escritório", icon: Briefcase, feedback: "Show! Vamos priorizar foco e zero ofuscação." },
  { value: "lavanderia", label: "Lavanderia", icon: WashingMachine, feedback: "Anotado! Resistência à umidade é essencial." },
  { value: "infantil", label: "Quarto Infantil", icon: Baby, feedback: "Importante! Vamos focar em segurança e blackout suave." },
  { value: "externa", label: "Área Externa / Varanda", icon: Sailboat, feedback: "Toldos e telas resistentes ao tempo entram na lista." },
];

const luzes: OptionDef<Luz>[] = [
  { value: "blackout", label: "Escuridão Total", icon: Moon, feedback: "Vamos de Blackout — sono profundo garantido." },
  { value: "filtrar", label: "Filtrar Luz Suave", icon: Sun, feedback: "Lindo! Tecidos translúcidos criam clima aconchegante." },
  { value: "privacidade", label: "Apenas Privacidade", icon: Eye, feedback: "Ok! Vamos cuidar da sua intimidade sem bloquear luz." },
  { value: "solar", label: "Visão Externa (Solar)", icon: Trees, feedback: "Perfeito! Você vê fora, ninguém vê dentro." },
];

const segurancas: OptionDef<Seguranca>[] = [
  { value: "criancas", label: "Tenho Crianças", icon: Baby, feedback: "Vamos sugerir motorização — sem cordões perigosos." },
  { value: "pets", label: "Tenho Pets", icon: PawPrint, feedback: "Entendido! Tecidos resistentes que não desfiam." },
  { value: "adultos", label: "Apenas Adultos", icon: Users, feedback: "Ok! Liberdade total nas escolhas de tecido e acionamento." },
];

const estilos: OptionDef<Estilo>[] = [
  { value: "moderno", label: "Moderno / Clean", icon: Sparkles, feedback: "Linhas retas e tecidos lisos — perfeito." },
  { value: "classico", label: "Clássico / Aconchegante", icon: Home, feedback: "Tons quentes e texturas suaves entram na seleção." },
  { value: "rustico", label: "Rústico / Natural", icon: Mountain, feedback: "Fibras naturais e tons terrosos — lindo!" },
  { value: "industrial", label: "Industrial", icon: Factory, feedback: "Acabamentos robustos e paleta neutra." },
];

const acionamentos: OptionDef<Acionamento>[] = [
  { value: "manual", label: "Manual", icon: Hand, feedback: "Prático e econômico." },
  { value: "motorizado", label: "Motorizado (Controle/Alexa)", icon: Cpu, feedback: "Conforto premium — abre e fecha por voz ou app." },
];

const convivencias: OptionDef<Convivencia>[] = [
  { value: "criancas", label: "Sim, crianças", icon: Baby, feedback: "Vamos priorizar modelos sem cordão solto — segurança máxima." },
  { value: "pets", label: "Sim, animais", icon: PawPrint, feedback: "Tecidos resistentes que não desfiam — ideais para pets." },
  { value: "nenhum", label: "Não", icon: XCircle, feedback: "Perfeito! Liberdade total nas escolhas de tecido e acionamento." },
];

/* ---------------- Lógica de recomendação ---------------- */

type Recommendation = {
  productName: string;
  score: number;
  reasons: string[];
  image: string;
  mode: "direct" | "consult";
  productPath?: string;
  badge?: string;
  calcProductId?: string;
};

function ambienteLabel(a: Ambiente) {
  return ambientes.find((x) => x.value === a)?.label.toLowerCase() ?? "ambiente";
}
function estiloLabel(e: Estilo) {
  return estilos.find((x) => x.value === e)?.label.toLowerCase() ?? "moderna";
}

function recommend(a: Required<Answers>): Recommendation {
  const reasons: string[] = [];
  let productName = "Persiana Rolô Premium";
  let productPath = "/persiana-rolo-blackout";
  let mode: Recommendation["mode"] = "direct";
  let badge: string | undefined;
  let calcProductId: string = "rolo-blackout";
  let image =
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80";

  // Área externa → toldos (sempre consultivo)
  if (a.ambiente === "externa") {
    productName = "Toldo Retrátil / Tela Externa";
    productPath = "/toldos";
    calcProductId = "rolo-solar";
    image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Resistente ao sol, chuva e vento — perfeito para área externa.");
    mode = "consult";
  } else if (a.luz === "blackout") {
    productName = "Persiana Rolô Blackout Premium";
    productPath = "/persiana-rolo-blackout";
    calcProductId = "rolo-blackout";
    image = "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1200&q=80";
    reasons.push(`Bloqueio total de luz — ideal para ${ambienteLabel(a.ambiente)}.`);
  } else if (a.luz === "solar") {
    productName = "Persiana Solar Screen";
    productPath = "/persiana-solar-screen";
    calcProductId = "rolo-solar";
    image = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Você enxerga a paisagem, sem deixar ninguém ver dentro.");
  } else if (a.luz === "filtrar") {
    productName = "Persiana Double Vision";
    productPath = "/persiana-double-vision";
    calcProductId = "double-vision";
    image = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Filtra a luz com elegância, alternando entre privacidade e claridade.");
  } else {
    if (a.estilo === "classico") {
      productName = "Persiana Horizontal Premium";
      productPath = "/persiana-horizontal";
      calcProductId = "horizontal-aluminio";
      image = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80";
    } else {
      productName = "Persiana Vertical";
      productPath = "/persiana-vertical";
      calcProductId = "horizontal-aluminio";
      image = "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80";
    }
    reasons.push("Privacidade ajustável sem abrir mão da iluminação natural.");
  }

  if (a.convivencia === "pets" && a.ambiente !== "externa" && a.luz !== "solar" && a.luz !== "blackout") {
    productName = "Persiana Solar Screen (Pet-Friendly)";
    productPath = "/persiana-solar-screen";
    calcProductId = "rolo-solar";
    image = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Tecido resistente que não desfia — perfeito para pets.");
  }

  if (a.convivencia === "criancas") {
    badge = "Motorização recomendada";
    reasons.push("Sem cordões soltos — segurança total para crianças em casa.");
  }

  if (a.acionamento === "motorizado") {
    reasons.push("Acionamento motorizado por controle, app ou Alexa.");
    badge = badge ?? "Motorizado";
  }

  reasons.push(`Combina com decoração ${estiloLabel(a.estilo)}.`);

  let score = 88;
  if (a.luz === "blackout" && (a.ambiente === "quarto" || a.ambiente === "infantil")) score += 6;
  if (a.luz === "solar" && (a.ambiente === "sala" || a.ambiente === "home")) score += 6;
  if (a.ambiente === "externa") score += 4;
  if (a.acionamento === "motorizado") score += 2;
  if (a.convivencia === "criancas" && a.acionamento === "motorizado") score += 2;
  score = Math.min(99, score);

  const directPaths = new Set([
    "/persiana-rolo-blackout",
    "/persiana-double-vision",
    "/persiana-horizontal",
    "/persiana-vertical",
    "/persiana-solar-screen",
  ]);
  if (!directPaths.has(productPath)) mode = "consult";

  return {
    productName,
    score,
    reasons: reasons.slice(0, 3),
    image,
    mode,
    productPath,
    badge,
    calcProductId,
  };
}

/* ---------------- Componente ---------------- */

const STEPS = [
  {
    key: "ambiente" as const,
    title: "Onde será instalada?",
    options: ambientes,
    botMessage: "Olá! Vou encontrar a solução perfeita para você. Comece pelo ambiente onde a persiana será instalada.",
  },
  {
    key: "luz" as const,
    title: "Qual seu objetivo de luz?",
    options: luzes,
    botMessage: "Ótimo! Agora me conte: você quer escurecer totalmente, filtrar a luz ou apenas ter privacidade?",
  },
  {
    key: "estilo" as const,
    title: "Qual seu estilo de decoração?",
    options: estilos,
    botMessage: "Vou alinhar a recomendação com a estética da sua casa — texturas, cores e acabamentos.",
  },
  {
    key: "convivencia" as const,
    title: "Crianças ou pets em casa?",
    options: convivencias,
    botMessage: "A segurança vem primeiro! Para crianças, recomendarei modelos sem cordão solto. Para pets, tecidos que não desfiam.",
  },
  {
    key: "acionamento" as const,
    title: "Como prefere acionar?",
    options: acionamentos,
    botMessage: "Última pergunta! Manual é econômico; motorizado é conforto premium — abre e fecha por controle, app ou Alexa.",
  },
];

export function QuizMatch() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<string>("");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [bgLoaded, setBgLoaded] = useState(false);
  const savedRef = useRef(false);

  const isComplete = step >= STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  const recommendation = useMemo<Recommendation | null>(() => {
    if (!isComplete) return null;
    return recommend(answers as Required<Answers>);
  }, [isComplete, answers]);

  // Quando o quiz termina, registra um lead "anônimo" no painel administrativo
  // (sem nome/telefone — apenas as escolhas, para o admin enxergar volume e perfil).
  useEffect(() => {
    if (!isComplete || !recommendation || savedRef.current) return;
    savedRef.current = true;
    const a = answers as Required<Answers>;
    const message =
      `Quiz concluído — Recomendação: ${recommendation.productName} ` +
      `(${recommendation.score}% match)\n` +
      `Ambiente: ${a.ambiente} | Luz: ${a.luz} | ` +
      `Estilo: ${a.estilo} | Convivência: ${a.convivencia} | Acionamento: ${a.acionamento}`;
    void supabase
      .from("leads")
      .insert({
        name: "Visitante do Quiz",
        source: "quiz_persiana_ideal",
        product_interest: recommendation.productName,
        message,
        status: "novo",
      })
      .then(({ error }) => {
        if (error) console.warn("Quiz lead insert error:", error.message);
      });
    trackLead({
      content_name: recommendation.productName,
      source: "quiz_persiana_ideal",
      value: 1,
      currency: "BRL",
    });
  }, [isComplete, recommendation, answers]);

  function handleSelect(value: string, fb: string) {
    setFeedback(fb);
    const next: Answers = { ...answers, [current.key]: value as never };
    setAnswers(next);
  }

  function handleBack() {
    setDirection("back");
    setStep((s) => Math.max(0, s - 1));
    setFeedback("");
  }

  function handleReset() {
    setDirection("forward");
    setStep(0);
    setAnswers({});
    setFeedback("");
    savedRef.current = false;
  }

  const progress = isComplete ? 100 : Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <section
      id="quiz-persiana-ideal"
      className="relative isolate overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 font-sans"
      style={{ backgroundColor: palette.offwhite }}
      aria-labelledby="quiz-title"
    >
      {/* Fundo editorial: foto de interior de luxo desfocada + véu champagne */}
      <img
        aria-hidden="true"
        src={editorialBg}
        alt=""
        loading="lazy"
        decoding="async"
        sizes="100vw"
        onLoad={() => setBgLoaded(true)}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700"
        style={{
          filter: "blur(28px) saturate(0.85)",
          transform: "scale(1.1)",
          opacity: bgLoaded ? 0.35 : 0,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${palette.offwhite} 0%, rgba(250,247,242,0.86) 30%, rgba(239,230,216,0.65) 100%)`,
        }}
      />

      <div className="container mx-auto max-w-4xl flex flex-col items-center px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 w-full">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em]"
            style={{ color: palette.coral }}
          >
            <span className="h-px w-6" style={{ backgroundColor: palette.coral }} />
            Editorial · Quiz personalizado
            <span className="h-px w-6" style={{ backgroundColor: palette.coral }} />
          </span>
          <h2
            id="quiz-title"
            className="mt-6 font-display tracking-tight"
            style={{
              color: palette.ink,
              fontSize: "clamp(34px, 5.4vw, 60px)",
              lineHeight: 1.02,
              fontWeight: 500,
            }}
          >
            A persiana certa para sua casa,
            <br className="hidden sm:block" />
            <em className="not-italic" style={{ color: palette.coral, fontStyle: "italic" }}>
              em apenas 60 segundos.
            </em>
          </h2>
          <p
            className="mt-5 text-[15px] sm:text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: palette.inkSoft }}
          >
            Seis perguntas curtas. Uma recomendação feita sob medida para o seu
            ambiente, estilo e rotina.
          </p>
          {!isComplete && (
            <div className="mt-7 flex justify-center">
              <Link
                to="/catalogo"
                aria-label="Pular o quiz e ir direto para a vitrine de produtos"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] font-medium underline-offset-[6px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm px-1"
                style={{ color: palette.inkMuted }}
              >
                <SkipForward className="h-3.5 w-3.5" strokeWidth={1.2} />
                Pular e ver a coleção
              </Link>
            </div>
          )}
        </div>

        <div
          className="w-full mx-auto rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(255, 253, 250, 0.78)",
            border: `1px solid ${palette.hairline}`,
            boxShadow:
              "0 30px 80px -30px rgba(31,26,21,0.18), 0 8px 24px -12px rgba(31,26,21,0.08)",
          }}
        >
          {!isComplete ? (
            <>
              {/* Indicador de etapa — minimalista (numeral + linhas finas) */}
              <div className="mb-8 sm:mb-10">
                <div className="mb-4 flex items-baseline justify-between">
                  <p
                    className="font-display"
                    style={{
                      color: palette.ink,
                      fontSize: "13px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span style={{ color: palette.coral }}>
                      {String(step + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: palette.inkMuted }}>
                      {" "}/ {String(STEPS.length).padStart(2, "0")}
                    </span>
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: palette.inkMuted }}
                  >
                    {STEPS.length - step - 1 === 0
                      ? "Última pergunta"
                      : `Faltam ${STEPS.length - step - 1}`}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso do quiz: etapa ${step + 1} de ${STEPS.length}`}
                >
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className="h-px flex-1 transition-all duration-500"
                      style={{
                        backgroundColor:
                          i <= step ? palette.coral : palette.hairline,
                        height: i <= step ? "2px" : "1px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Pergunta — tipografia editorial */}
              <div
                key={`q-${step}`}
                className={`mb-8 sm:mb-10 text-center ${direction === "back" ? "animate-quiz-back" : "animate-quiz-forward"}`}
              >
                <h3
                  className="font-display"
                  style={{
                    color: palette.ink,
                    fontSize: "clamp(26px, 3.6vw, 40px)",
                    lineHeight: 1.1,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {current.title}
                </h3>
                <p
                  className="mt-4 text-[14px] sm:text-[15px] leading-relaxed max-w-lg mx-auto"
                  style={{ color: palette.inkSoft }}
                  aria-live="polite"
                >
                  {feedback || current.botMessage}
                </p>
              </div>

              {/* Opções — cards minimalistas com glassmorphism + hover refinado */}
              <div
                key={`opts-${step}`}
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 ${direction === "back" ? "animate-quiz-back" : "animate-quiz-forward"}`}
                role="listbox"
                aria-label={current.title}
              >
                {current.options.map((opt) => {
                  const Icon = opt.icon;
                  const selected =
                    (answers as Record<string, string>)[current.key] === opt.value;
                  const highlightSafe =
                    current.key === "acionamento" &&
                    opt.value === "motorizado" &&
                    answers.convivencia === "criancas";
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value, opt.feedback)}
                      className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl p-5 sm:p-6 min-h-[150px] sm:min-h-[170px] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 backdrop-blur-md"
                      style={{
                        backgroundColor: selected
                          ? "rgba(255, 253, 250, 0.95)"
                          : "rgba(255, 253, 250, 0.55)",
                        border: selected
                          ? `1.5px solid ${palette.coral}`
                          : `1px solid ${palette.hairline}`,
                        boxShadow: selected
                          ? `0 20px 50px -20px rgba(217,102,60,0.35), 0 0 0 4px ${palette.coralWash}`
                          : "0 8px 30px -18px rgba(31,26,21,0.10)",
                        ...(highlightSafe && !selected
                          ? ({
                              ["--tw-ring-color" as never]: "rgba(217,102,60,0.35)",
                            } as React.CSSProperties)
                          : {}),
                      }}
                      aria-pressed={selected}
                    >
                      {highlightSafe && (
                        <span
                          className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-medium uppercase tracking-[0.18em]"
                          style={{
                            backgroundColor: palette.ink,
                            color: palette.offwhite,
                          }}
                        >
                          Recomendado
                        </span>
                      )}
                      <span
                        className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105"
                        style={{
                          backgroundColor: selected
                            ? palette.coralWash
                            : "rgba(31,26,21,0.04)",
                          color: selected ? palette.coral : palette.ink,
                          border: `1px solid ${selected ? "rgba(217,102,60,0.25)" : palette.hairline}`,
                        }}
                      >
                        <Icon
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          strokeWidth={1.2}
                        />
                      </span>
                      <span
                        className="text-[13px] sm:text-sm font-medium text-center leading-tight"
                        style={{
                          color: palette.ink,
                          letterSpacing: "0.005em",
                        }}
                      >
                        {opt.label}
                      </span>
                      {selected && (
                        <span
                          className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: palette.coral }}
                        >
                          <CheckCircle2
                            className="h-3.5 w-3.5"
                            style={{ color: "#fff" }}
                            strokeWidth={1.6}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {(() => {
                  const hasAnswer = !!(answers as Record<string, string>)[current.key];
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (hasAnswer) {
                          setStep((s) => s + 1);
                          setFeedback("");
                        }
                      }}
                      disabled={!hasAnswer}
                      style={{
                        backgroundColor: hasAnswer ? palette.ink : "transparent",
                        color: hasAnswer ? palette.offwhite : palette.inkMuted,
                        height: "56px",
                        borderRadius: "999px",
                        border: hasAnswer
                          ? `1px solid ${palette.ink}`
                          : `1px solid ${palette.hairline}`,
                        letterSpacing: "0.08em",
                        boxShadow: hasAnswer
                          ? "0 20px 40px -16px rgba(31,26,21,0.35)"
                          : "none",
                      }}
                      className="inline-flex w-full items-center justify-center gap-3 px-8 text-[12px] uppercase font-medium transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed"
                    >
                      {step === STEPS.length - 1 ? "Ver minha recomendação" : "Próxima etapa"}
                      <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  );
                })()}
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors hover:opacity-70"
                    style={{ color: palette.inkMuted }}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.4} /> Voltar
                  </button>
                )}
              </div>
            </>
          ) : (
            recommendation && (
              <ResultCard
                rec={recommendation}
                answers={answers as Required<Answers>}
                onReset={handleReset}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Card de resultado ---------------- */

function ResultCard({
  rec,
  answers,
  onReset,
}: {
  rec: Recommendation;
  answers: Required<Answers>;
  onReset: () => void;
}) {
  const ambiente = ambienteLabel(answers.ambiente);
  const waMessage = `Olá! O assistente me recomendou a ${rec.productName} para meu ${ambiente}. Gostaria de dar continuidade ao orçamento.`;
  const waLink = whatsappLink(waMessage);

  // Resumo legível das escolhas
  const summary: { label: string; value: string }[] = [
    { label: "Ambiente", value: ambientes.find((x) => x.value === answers.ambiente)?.label ?? answers.ambiente },
    { label: "Objetivo de luz", value: luzes.find((x) => x.value === answers.luz)?.label ?? answers.luz },
    { label: "Estilo", value: estilos.find((x) => x.value === answers.estilo)?.label ?? answers.estilo },
    { label: "Crianças/Pets", value: convivencias.find((x) => x.value === answers.convivencia)?.label ?? answers.convivencia },
    { label: "Acionamento", value: acionamentos.find((x) => x.value === answers.acionamento)?.label ?? answers.acionamento },
  ];

  // Link para a calculadora pré-preenchida com a recomendação
  const calcParams = new URLSearchParams({
    produto: rec.calcProductId ?? "rolo-blackout",
    largura: "120",
    altura: "140",
    motor: answers.acionamento === "motorizado" ? "1" : "0",
  });
  const calcHref = `/?${calcParams.toString()}#calculadora`;

  return (
    <div
      className="-m-5 sm:-m-8 rounded-3xl p-6 sm:p-10"
      style={{
        background: "linear-gradient(135deg, #1C1C1C 0%, #2A1F18 100%)",
        color: "#FFFFFF",
      }}
    >
    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
      <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: "#0F0F0F" }}>
        <img
          src={rec.image}
          alt={rec.productName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg"
          style={{ backgroundColor: "#FF6B35", color: "#FFFFFF" }}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {rec.score}% de compatibilidade
        </div>
        {rec.badge && (
          <div
            className="absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-xs font-bold shadow"
            style={{ backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
          >
            {rec.badge}
          </div>
        )}
      </div>

      <div>
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color: "#FF6B35" }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Recomendação personalizada
        </span>
        <h3
          className="mt-3 font-display font-semibold leading-[1.05]"
          style={{ color: "#FFFFFF", fontSize: "clamp(28px, 4vw, 40px)" }}
        >
          {rec.productName}
        </h3>

        {/* Selos contextuais (verde: crianças, azul: pets) */}
        {(answers.convivencia === "criancas" ||
          answers.convivencia === "pets") && (
          <div className="mt-3 flex flex-wrap gap-2">
            {answers.convivencia === "criancas" && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: "rgba(16,185,129,0.18)", color: "#34D399", border: "1px solid rgba(16,185,129,0.4)" }}
              >
                <Shield className="h-3.5 w-3.5" />
                Seguro para crianças
              </span>
            )}
            {answers.convivencia === "pets" && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: "rgba(59,130,246,0.18)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.4)" }}
              >
                <PawPrint className="h-3.5 w-3.5" />
                Resistente a pets
              </span>
            )}
          </div>
        )}

        <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
          Por que escolhemos para você:
        </p>
        <ul className="mt-3 space-y-2.5">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#F5F5F5" }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FF6B35" }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {/* Resumo das escolhas do cliente */}
        <div
          className="mt-5 rounded-2xl p-4"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.6)" }}>
            Suas escolhas no quiz
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {summary.map((s) => (
              <li
                key={s.label}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#F5F5F5", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <span style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}:</span>
                <span className="font-semibold">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {rec.mode === "direct" && rec.productPath ? (
            <Link
              to={rec.productPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-bold transition-all hover:opacity-95"
              style={{
                backgroundColor: "#FF6B35",
                color: "#FFFFFF",
                height: "52px",
                boxShadow: "0 10px 24px -6px rgba(255,107,53,0.5)",
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              Comprar produto recomendado
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-bold text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: "#25D366",
                height: "52px",
                boxShadow: "0 10px 24px -6px rgba(37,211,102,0.5)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Finalizar orçamento no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          )}

          {/* CTA para a calculadora m² já preenchida */}
          <a
            href={calcHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:bg-[rgba(255,107,53,0.12)]"
            style={{ border: "1.5px solid #FF6B35", color: "#FF6B35", backgroundColor: "transparent" }}
          >
            <Calculator className="h-4 w-4" />
            Calcular preço por m² com essa recomendação
          </a>

          {rec.mode === "direct" && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)" }}
            >
              <MessageCircle className="h-4 w-4" />
              Falar com especialista
            </a>
          )}

          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
            Compra online imediata ou atendimento especializado, conforme seu projeto.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Refazer quiz
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

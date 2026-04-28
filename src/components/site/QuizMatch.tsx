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
import quizManualImg from "@/assets/quiz-manual.jpg";
import quizMotorizadoImg from "@/assets/quiz-motorizado.jpg";
import quizQuartoInfantilImg from "@/assets/quiz-quarto-infantil.png";
import quizAmbQuartoImg from "@/assets/quiz-amb-quarto.jpg";
import quizAmbSalaImg from "@/assets/quiz-amb-sala.jpg";
import quizAmbCozinhaImg from "@/assets/quiz-amb-cozinha.jpg";
import quizAmbEscritorioImg from "@/assets/quiz-amb-escritorio.jpg";
import quizAmbCinemaImg from "@/assets/quiz-amb-cinema.jpg";

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

// Paleta editorial creme — fundo único #FAF7F2.
// Mantemos o nome `dark` para minimizar churn nas referências internas.
const dark = {
  bg: "#FAF7F2",         // creme quente da seção
  surface: "#FFFFFF",     // cards
  surface2: "#F0EBE3",    // card do assistente
  border: "#E8DDD0",      // bordas e barra de progresso (fundo)
  borderSoft: "#EFE6D8",
  borderHard: "#D4B89A",  // separador decorativo
  text: "#1A0F08",        // ink principal
  textSoft: "#5A4A3E",    // corpo de texto
  textMuted: "#B89070",   // eyebrow / labels secundárias
  textDim: "#C4AE96",     // estados desabilitados / link skip
  coral: "#FF6B35",
  coralWash: "rgba(255,107,53,0.10)",
  coralBorder: "rgba(255,107,53,0.35)",
};

// Fotos reais de ambiente para os cards (Unsplash, otimizadas)
const ambienteImages: Record<string, string> = {
  quarto: quizAmbQuartoImg,
  sala: quizAmbSalaImg,
  home: quizAmbCinemaImg,
  cozinha: quizAmbCozinhaImg,
  escritorio: quizAmbEscritorioImg,
  lavanderia: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
  infantil: quizQuartoInfantilImg,
  externa: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
};

// Fotos por etapa/opção — todos os cards usam imagens reais
const optionImages: Record<string, Record<string, string>> = {
  ambiente: ambienteImages,
  luz: {
    blackout: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    privacidade: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&q=80",
    filtrar: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    solar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
  },
  estilo: {
    moderno: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=400&q=80",
    classico: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
    rustico: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&q=80",
    industrial: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
  },
  convivencia: {
    criancas: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&q=80",
    pets: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&q=80",
    nenhum: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=400&q=80",
  },
  acionamento: {
    // Mão acionando corrente/cordão de persiana rolô — foto premium
    manual: quizManualImg,
    // Controle remoto acionando persiana — foto premium
    motorizado: quizMotorizadoImg,
  },
};

// Subtítulo (caption laranja) por etapa
const stepCaption: Record<string, string> = {
  ambiente: "Ambiente",
  luz: "Objetivo de luz",
  estilo: "Estilo",
  convivencia: "Convivência",
  acionamento: "Acionamento",
};

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
  convivencia?: Convivencia[];
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

  const conv = a.convivencia ?? [];
  const hasCriancas = conv.includes("criancas");
  const hasPets = conv.includes("pets");

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

  if (hasPets && a.ambiente !== "externa" && a.luz !== "solar" && a.luz !== "blackout") {
    productName = "Persiana Solar Screen (Pet-Friendly)";
    productPath = "/persiana-solar-screen";
    calcProductId = "rolo-solar";
    image = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Tecido resistente que não desfia — perfeito para pets.");
  }

  if (hasCriancas) {
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
  if (hasCriancas && a.acionamento === "motorizado") score += 2;
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
      `Estilo: ${a.estilo} | Convivência: ${(a.convivencia ?? []).join("+") || "—"} | Acionamento: ${a.acionamento}`;
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
    if (current.key === "convivencia") {
      // Multi-select: pode marcar crianças + pets juntos.
      // "nenhum" é exclusivo (limpa as outras e vice-versa).
      const prev = (answers.convivencia ?? []) as Convivencia[];
      const v = value as Convivencia;
      let next: Convivencia[];
      if (v === "nenhum") {
        next = prev.includes("nenhum") ? [] : ["nenhum"];
      } else {
        const without = prev.filter((x) => x !== "nenhum" && x !== v);
        next = prev.includes(v) ? without : [...without, v];
      }
      setAnswers({ ...answers, convivencia: next });
      return;
    }
    setAnswers({ ...answers, [current.key]: value as never });
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
      className="relative isolate overflow-hidden font-sans"
      style={{ backgroundColor: dark.bg, color: dark.text }}
      aria-labelledby="quiz-title"
    >
      {/* Glow ambiente quase imperceptível — coral muito sutil no topo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -10%, rgba(255,107,53,0.04), transparent 60%)",
        }}
      />
      {/* mantém referência do estado bg para evitar warning de unused */}
      <span hidden aria-hidden="true">{bgLoaded ? "" : ""}</span>

      <div
        className="mx-auto flex flex-col items-center w-full"
        style={{
          maxWidth: "1280px",
          padding: "100px 20px",
        }}
      >
        <div
          className="text-center w-full flex flex-col items-center"
          style={{ maxWidth: "700px" }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#B89070",
              fontWeight: 500,
              margin: 0,
            }}
          >
            — Assistente Inteligente —
          </p>

          {/* Título principal */}
          <h2
            id="quiz-title"
            className="font-display mt-5"
            style={{
              fontFamily: "var(--font-display)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              margin: 0,
              marginTop: "20px",
            }}
          >
            <span
              style={{
                display: "block",
                fontWeight: 300,
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                color: "#1A0F08",
                fontStyle: "normal",
              }}
            >
              Descubra a persiana ideal
            </span>
            <span
              style={{
                display: "block",
                fontWeight: 700,
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                color: "#FF6B35",
                fontStyle: "italic",
              }}
            >
              para a sua casa.
            </span>
          </h2>

          {/* Separador decorativo */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: "48px",
              height: "1px",
              backgroundColor: "#D4B89A",
              margin: "14px auto",
            }}
          />
        </div>

        <div className="w-full mt-12 sm:mt-16">
          {!isComplete ? (
            <>
              {/* Barra de progresso linear */}
              <div className="mb-8 sm:mb-10">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="uppercase font-medium"
                    style={{ color: "#B89070", fontSize: 11, letterSpacing: "0.18em" }}
                  >
                    Etapa {step + 1} de {STEPS.length}
                  </span>
                  <span
                    className="uppercase font-medium"
                    style={{ color: "#B89070", fontSize: 11, letterSpacing: "0.18em" }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso: etapa ${step + 1} de ${STEPS.length}`}
                  style={{
                    width: "100%",
                    height: 2,
                    backgroundColor: "#E8DDD0",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: "#FF6B35",
                      borderRadius: 999,
                      transition: "width 300ms ease",
                    }}
                  />
                </div>
              </div>

              {/* Card do assistente — creme com borda esquerda coral */}
              <div
                className="mb-8 flex items-start gap-3 p-4"
                style={{
                  backgroundColor: "#F0EBE3",
                  borderLeft: "3px solid #FF6B35",
                  borderRadius: "0 10px 10px 0",
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FF8A5C, #FF6B35)",
                    boxShadow: "0 4px 12px rgba(255,107,53,0.4)",
                  }}
                >
                  <Bot className="h-4 w-4 text-white" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-medium uppercase mb-1"
                    style={{ color: "#FF6B35", fontSize: 10, letterSpacing: "0.2em" }}
                  >
                    Assistente Ágil
                  </p>
                  <p
                    className="text-[14px] leading-relaxed font-light"
                    style={{ color: "#5A4A3E" }}
                    aria-live="polite"
                  >
                    {feedback || current.botMessage}
                  </p>
                </div>
              </div>

              {/* Pergunta */}
              <div
                key={`q-${step}`}
                className={`mb-8 ${direction === "back" ? "animate-quiz-back" : "animate-quiz-forward"}`}
              >
                <h3
                  className="font-display"
                  style={{
                    color: dark.text,
                    fontSize: "clamp(26px, 3.4vw, 36px)",
                    lineHeight: 1.15,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {current.title}
                </h3>
                {current.key === "convivencia" && (
                  <p
                    className="mt-2 text-[12px] uppercase font-medium"
                    style={{ color: dark.coral, letterSpacing: "0.18em" }}
                  >
                    Selecione uma ou mais opções
                  </p>
                )}
              </div>

              {/* Opções — cards com foto real, 4 colunas no desktop */}
              <div
                key={`opts-${step}`}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                role="listbox"
                aria-label={current.title}
              >
                {current.options.map((opt, i) => {
                  const selected =
                    current.key === "convivencia"
                      ? (answers.convivencia ?? []).includes(opt.value as Convivencia)
                      : (answers as Record<string, string>)[current.key] === opt.value;
                  const stepImages = optionImages[current.key] ?? {};
                  const img =
                    stepImages[opt.value] ??
                    ambienteImages.sala;
                  const caption = stepCaption[current.key] ?? "Opção";
                  // Mantém o foco no detalhe do acionamento (corrente na direita / controle ao centro)
                  const objectPosition =
                    current.key === "acionamento"
                      ? opt.value === "manual"
                        ? "72% center"
                        : "50% 55%"
                      : "center";
                  const highlightSafe =
                    current.key === "acionamento" &&
                    opt.value === "motorizado" &&
                    (answers.convivencia ?? []).includes("criancas");
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value, opt.feedback)}
                      aria-pressed={selected}
                      className="quiz-card-light group relative overflow-hidden text-left transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 animate-quiz-card"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: selected ? "1.5px solid #FF6B35" : "1px solid #E8DDD0",
                        borderRadius: 12,
                        boxShadow: selected ? "0 4px 20px rgba(255,107,53,0.15)" : "none",
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={img}
                          alt={opt.label}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition, filter: "brightness(0.72)" }}
                        />
                        {highlightSafe && (
                          <span
                            className="absolute top-2 left-2 whitespace-nowrap rounded-full px-2 py-0.5 font-medium uppercase"
                            style={{ backgroundColor: "#FF6B35", color: "#fff", fontSize: 9, letterSpacing: "0.18em" }}
                          >
                            Recomendado
                          </span>
                        )}
                        {selected && (
                          <span
                            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full"
                            style={{ backgroundColor: "#FF6B35", boxShadow: "0 2px 8px rgba(255,107,53,0.4)" }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
                          </span>
                        )}
                      </div>
                      <div className="px-3 py-2.5">
                        <p
                          className="font-display"
                          style={{ color: "#1A0F08", fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}
                        >
                          {opt.label}
                        </p>
                        <p
                          className="mt-0.5 uppercase font-medium"
                          style={{ color: "#B89070", fontSize: 9, letterSpacing: "0.16em" }}
                        >
                          {caption}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Barra de ação inferior */}
              {(() => {
                const hasAnswer =
                  current.key === "convivencia"
                    ? (answers.convivencia ?? []).length > 0
                    : !!(answers as Record<string, string>)[current.key];
                const isLast = step === STEPS.length - 1;
                return (
                  <div className="mt-10 flex items-center justify-between gap-4">
                    <Link
                      to="/catalogo"
                      aria-label="Pular o quiz e ir direto para a vitrine de produtos"
                      style={{
                        color: "#C4AE96",
                        fontSize: 13,
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                      className="transition-colors hover:text-[#5A4A3E]"
                    >
                      Pular quiz
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (hasAnswer) {
                          setDirection("forward");
                          setStep((s) => s + 1);
                          setFeedback("");
                        }
                      }}
                      disabled={!hasAnswer}
                      aria-disabled={!hasAnswer}
                      aria-label={
                        hasAnswer
                          ? isLast
                            ? "Ver minha recomendação personalizada"
                            : `Avançar para a etapa ${step + 2} de ${STEPS.length}`
                          : "Selecione uma opção para avançar"
                      }
                      style={{
                        backgroundColor: hasAnswer ? "#1A0F08" : "#E8DDD0",
                        color: hasAnswer ? "#FFFFFF" : "#C4AE96",
                        padding: "10px 8px 10px 22px",
                        borderRadius: 99,
                        border: "none",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                      className="inline-flex items-center gap-3 transition-all duration-200 disabled:cursor-not-allowed hover:opacity-95"
                    >
                      {isLast ? "Ver minha recomendação" : "Próxima etapa"}
                      <span
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 28,
                          height: 28,
                          backgroundColor: hasAnswer ? "#FF6B35" : "#D4B89A",
                        }}
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
                      </span>
                    </button>
                  </div>
                );
              })()}
              {step > 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 transition-colors hover:opacity-70"
                    style={{
                      color: "#B89070",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      fontWeight: 500,
                    }}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.4} /> Voltar
                  </button>
                </div>
              )}
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

  const convList = answers.convivencia ?? [];
  const convLabel =
    convList.length === 0
      ? "—"
      : convList
          .map((v) => convivencias.find((x) => x.value === v)?.label ?? v)
          .join(" + ");
  const hasCriancas = convList.includes("criancas");
  const hasPets = convList.includes("pets");

  // Resumo legível das escolhas
  const summary: { label: string; value: string }[] = [
    { label: "Ambiente", value: ambientes.find((x) => x.value === answers.ambiente)?.label ?? answers.ambiente },
    { label: "Objetivo de luz", value: luzes.find((x) => x.value === answers.luz)?.label ?? answers.luz },
    { label: "Estilo", value: estilos.find((x) => x.value === answers.estilo)?.label ?? answers.estilo },
    { label: "Crianças/Pets", value: convLabel },
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
    <div style={{ color: "#1A0F08" }}>
    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
      <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: "#F0EBE3", border: "1px solid #E8DDD0" }}>
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
            style={{ backgroundColor: "#1F1A15", color: "#FFFFFF" }}
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
          style={{ color: "#1A0F08", fontSize: "clamp(28px, 4vw, 40px)" }}
        >
          {rec.productName}
        </h3>

        {/* Selos contextuais (verde: crianças, azul: pets) */}
        {(hasCriancas || hasPets) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hasCriancas && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: "rgba(16,185,129,0.10)", color: "#0F8A5F", border: "1px solid rgba(16,185,129,0.35)" }}
              >
                <Shield className="h-3.5 w-3.5" />
                Seguro para crianças
              </span>
            )}
            {hasPets && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: "rgba(59,130,246,0.10)", color: "#2563EB", border: "1px solid rgba(59,130,246,0.35)" }}
              >
                <PawPrint className="h-3.5 w-3.5" />
                Resistente a pets
              </span>
            )}
          </div>
        )}

        <p className="mt-4 text-sm" style={{ color: "#B89070" }}>
          Por que escolhemos para você:
        </p>
        <ul className="mt-3 space-y-2.5">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#5A4A3E" }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FF6B35" }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {/* Resumo das escolhas do cliente */}
        <div
          className="mt-5 rounded-2xl p-4"
          style={{ backgroundColor: "#F0EBE3", border: "1px solid #E8DDD0" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#B89070" }}>
            Suas escolhas no quiz
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {summary.map((s) => (
              <li
                key={s.label}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                style={{ backgroundColor: "#FFFFFF", color: "#1A0F08", border: "1px solid #E8DDD0" }}
              >
                <span style={{ color: "#B89070" }}>{s.label}:</span>
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
                backgroundColor: "#1A7A4A",
                height: "52px",
                boxShadow: "0 10px 24px -6px rgba(26,122,74,0.5)",
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
              style={{ border: "1px solid #E8DDD0", color: "#5A4A3E" }}
            >
              <MessageCircle className="h-4 w-4" />
              Falar com especialista
            </a>
          )}

          <p className="text-xs text-center" style={{ color: "#B89070" }}>
            Compra online imediata ou atendimento especializado, conforme seu projeto.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs transition-colors hover:text-foreground"
            style={{ color: "#B89070" }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Refazer quiz
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

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

// Paleta clara "Ateliê de Decoração" — Off-white / Champagne suave.
// Coral só aparece em CTAs e indicadores de progresso.
const dark = {
  bg: "#F9F8F6",
  surface: "#FFFFFF",
  surface2: "#FFFFFF",
  border: "rgba(31,26,21,0.08)",
  borderSoft: "rgba(31,26,21,0.06)",
  borderHard: "rgba(31,26,21,0.12)",
  text: "#1F1A15",
  textSoft: "#4A4239",
  textMuted: "#8A8078",
  textDim: "#B8B0A6",
  coral: "#FF6B35",
  coralWash: "rgba(255,107,53,0.18)",
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
      {/* Glow ambiente sutil — champagne quente sobre off-white */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -10%, rgba(217,102,60,0.06), transparent 60%), radial-gradient(700px 400px at 50% 110%, rgba(239,230,216,0.5), transparent 60%)",
        }}
      />
      {/* mantém referência do estado bg para evitar warning de unused */}
      <span hidden aria-hidden="true">{bgLoaded ? "" : ""}</span>

      <div className="container mx-auto max-w-4xl flex flex-col items-center px-4 sm:px-6 py-20">
        <div className="text-center mb-8 sm:mb-12 w-full">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase"
            style={{
              border: `1px solid ${dark.coralBorder}`,
              color: dark.coral,
              letterSpacing: "0.2em",
              backgroundColor: "rgba(255,107,53,0.06)",
            }}
          >
            <Bot className="h-3.5 w-3.5" strokeWidth={1.6} />
            Assistente Inteligente
          </span>
          <h2
            id="quiz-title"
            className="mt-6 font-display tracking-tight"
            style={{
              color: dark.text,
              fontSize: "clamp(34px, 5.4vw, 58px)",
              lineHeight: 1.02,
              fontWeight: 500,
            }}
          >
            Descubra a persiana ideal
            <br className="hidden sm:block" />
            <em className="not-italic" style={{ color: dark.coral, fontStyle: "italic" }}>
              para a sua casa.
            </em>
          </h2>
          <p
            className="mt-5 text-[15px] sm:text-base max-w-xl mx-auto leading-relaxed font-light"
            style={{ color: dark.textSoft }}
          >
            Cinco perguntas curtas. Uma recomendação feita sob medida para o seu
            ambiente, estilo e rotina.
          </p>
          {!isComplete && (
            <div className="mt-7 flex justify-center">
              <Link
                to="/catalogo"
                aria-label="Pular o quiz e ir direto para a vitrine de produtos"
                className="inline-flex items-center gap-1.5 uppercase tracking-[0.22em] font-medium underline-offset-[6px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm px-1 transition-opacity hover:opacity-100"
                style={{ color: "#71717a", opacity: 1, fontSize: "12px" }}
              >
                <SkipForward className="h-3 w-3" strokeWidth={1.2} />
                Pular e ver a coleção
              </Link>
            </div>
          )}
        </div>

        <div
          className="w-full mx-auto rounded-[28px] sm:rounded-[32px] p-6 sm:p-10"
          style={{
            backgroundColor: dark.surface2,
            border: `1px solid ${dark.border}`,
            boxShadow: "0 30px 80px -40px rgba(31,26,21,0.18)",
          }}
        >
          {!isComplete ? (
            <>
              {/* Stepper de etapas — bolinhas conectadas */}
              <div className="mb-8 sm:mb-10">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="text-[10px] uppercase font-medium"
                    style={{ color: dark.coral, letterSpacing: "0.22em" }}
                  >
                    Etapa {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso: etapa ${step + 1} de ${STEPS.length}`}
                >
                  {STEPS.map((_, i) => {
                    const done = i < step;
                    const active = i === step;
                    return (
                      <div key={i} className="flex items-center flex-1 last:flex-none">
                        <span
                          className="flex items-center justify-center rounded-full transition-all duration-300"
                          style={{
                            width: 28,
                            height: 28,
                            backgroundColor: done || active ? dark.coral : dark.surface,
                            border: `1px solid ${done || active ? dark.coral : dark.borderHard}`,
                            color: done || active ? "#fff" : dark.textMuted,
                            boxShadow: active ? `0 0 0 3px ${dark.coralWash}` : "none",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {done ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} /> : i + 1}
                        </span>
                        {i < STEPS.length - 1 && (
                          <span
                            className="h-px flex-1 mx-1.5 transition-colors"
                            style={{ backgroundColor: done ? dark.coral : dark.borderHard }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bot de feedback — borda esquerda coral */}
              <div
                className="mb-8 flex items-start gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: "#FBF7F1",
                  borderLeft: `3px solid ${dark.coral}`,
                  border: `1px solid ${dark.border}`,
                  borderLeftWidth: 3,
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
                    className="text-[10px] font-medium uppercase mb-1"
                    style={{ color: dark.coral, letterSpacing: "0.2em" }}
                  >
                    Assistente Ágil
                  </p>
                  <p
                    className="text-[14px] leading-relaxed font-light"
                    style={{ color: dark.textSoft }}
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

              {/* Opções — todos os steps usam cards com foto real (3:4) */}
              <div
                key={`opts-${step}`}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
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
                      className="group relative aspect-[3/4] min-h-[160px] overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 animate-quiz-card"
                      style={{
                        border: selected ? `2px solid ${dark.coral}` : `1px solid ${dark.border}`,
                        boxShadow: selected
                          ? "0 8px 28px rgba(255,107,53,0.25)"
                          : "0 6px 18px rgba(31,26,21,0.08)",
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      <img
                        src={img}
                        alt={opt.label}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
                        }}
                      />
                      {!selected && (
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{ boxShadow: `inset 0 0 0 2px ${dark.coral}` }}
                        />
                      )}
                      {highlightSafe && (
                        <span
                          className="absolute top-3 left-3 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em]"
                          style={{ backgroundColor: dark.coral, color: "#fff" }}
                        >
                          Recomendado
                        </span>
                      )}
                      {selected && (
                        <span
                          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full"
                          style={{ backgroundColor: dark.coral, boxShadow: "0 4px 12px rgba(255,107,53,0.5)" }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2} />
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                        <p
                          className="font-display text-white"
                          style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.15 }}
                        >
                          {opt.label}
                        </p>
                        <p
                          className="mt-0.5 uppercase font-light"
                          style={{ color: dark.coral, fontSize: "10px", letterSpacing: "0.16em" }}
                        >
                          {caption}
                        </p>
                        {current.key === "luz" && (() => {
                          const positions: Record<string, number> = {
                            blackout: 0.04,
                            privacidade: 0.32,
                            filtrar: 0.7,
                            solar: 0.5,
                          };
                          const pos = positions[opt.value] ?? 0.5;
                          return (
                            <div
                              className="relative mt-2"
                              style={{
                                width: 60,
                                height: 3,
                                borderRadius: 999,
                                background: "linear-gradient(to right, #000, #fff)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                              }}
                              aria-hidden="true"
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: `${pos * 100}%`,
                                  transform: "translate(-50%, -50%)",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: dark.coral,
                                  boxShadow: "0 0 0 2px rgba(0,0,0,0.6), 0 0 6px rgba(255,107,53,0.6)",
                                }}
                              />
                            </div>
                          );
                        })()}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {(() => {
                  const hasAnswer =
                    current.key === "convivencia"
                      ? (answers.convivencia ?? []).length > 0
                      : !!(answers as Record<string, string>)[current.key];
                  return (
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
                          ? step === STEPS.length - 1
                            ? "Ver minha recomendação personalizada"
                            : `Avançar para a etapa ${step + 2} de ${STEPS.length}`
                          : "Selecione uma opção para avançar"
                      }
                      style={{
                        backgroundColor: hasAnswer ? "#FF6B35" : dark.border,
                        color: hasAnswer ? "#FFFFFF" : dark.textDim,
                        height: "52px",
                        borderRadius: "12px",
                        border: "none",
                        letterSpacing: "0.04em",
                        fontWeight: 600,
                        boxShadow: hasAnswer ? "0 14px 32px -10px rgba(255,107,53,0.55)" : "none",
                      }}
                      className="quiz-cta group inline-flex w-full items-center justify-center gap-2 px-8 text-[14px] transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      {step === STEPS.length - 1 ? "Ver minha recomendação" : "Próxima etapa"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                    </button>
                  );
                })()}
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors hover:opacity-70"
                    style={{ color: dark.textMuted }}
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
    <div
      className="-m-6 sm:-m-10 rounded-[28px] sm:rounded-[32px] p-6 sm:p-10"
      style={{ backgroundColor: "#FFFFFF", color: "#1F1A15" }}
    >
    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
      <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: "#F4EFE6", border: "1px solid rgba(31,26,21,0.06)" }}>
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
          style={{ color: "#1F1A15", fontSize: "clamp(28px, 4vw, 40px)" }}
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

        <p className="mt-4 text-sm" style={{ color: "#6B6157" }}>
          Por que escolhemos para você:
        </p>
        <ul className="mt-3 space-y-2.5">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#2A241E" }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FF6B35" }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {/* Resumo das escolhas do cliente */}
        <div
          className="mt-5 rounded-2xl p-4"
          style={{ backgroundColor: "#FBF7F1", border: "1px solid rgba(31,26,21,0.08)" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#8A8078" }}>
            Suas escolhas no quiz
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {summary.map((s) => (
              <li
                key={s.label}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                style={{ backgroundColor: "#FFFFFF", color: "#2A241E", border: "1px solid rgba(31,26,21,0.10)" }}
              >
                <span style={{ color: "#8A8078" }}>{s.label}:</span>
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
              style={{ border: "1px solid rgba(31,26,21,0.15)", color: "#2A241E" }}
            >
              <MessageCircle className="h-4 w-4" />
              Falar com especialista
            </a>
          )}

          <p className="text-xs text-center" style={{ color: "#8A8078" }}>
            Compra online imediata ou atendimento especializado, conforme seu projeto.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs transition-colors hover:text-foreground"
            style={{ color: "#8A8078" }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Refazer quiz
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

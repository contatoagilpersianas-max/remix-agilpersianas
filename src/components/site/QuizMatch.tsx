// QuizMatch — Quiz interativo "Descubra a persiana ideal em 60s"
// Componente isolado, não interfere na Lumi. Mobile-first, cards grandes.
import { useMemo, useState } from "react";
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
} from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

type OptionDef<T extends string> = {
  value: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  feedback: string;
};

type Ambiente =
  | "quarto"
  | "sala"
  | "home"
  | "cozinha"
  | "escritorio"
  | "lavanderia"
  | "infantil";
type Luz = "blackout" | "filtrar" | "privacidade" | "solar";
type Seguranca = "criancas" | "pets" | "adultos";
type Estilo = "moderno" | "classico" | "rustico" | "industrial";
type Acionamento = "manual" | "motorizado";

type Answers = {
  ambiente?: Ambiente;
  luz?: Luz;
  seguranca?: Seguranca;
  estilo?: Estilo;
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

/* ---------------- Lógica de recomendação ---------------- */

type Recommendation = {
  productName: string;
  score: number;
  reasons: string[];
  image: string;
  mode: "direct" | "consult";
  productPath?: string;
  badge?: string;
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
  let image =
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80";

  if (a.luz === "blackout") {
    productName = "Persiana Rolô Blackout Premium";
    productPath = "/persiana-rolo-blackout";
    image = "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1200&q=80";
    reasons.push(`Bloqueio total de luz — ideal para ${ambienteLabel(a.ambiente)}.`);
  } else if (a.luz === "solar") {
    productName = "Persiana Solar Screen";
    productPath = "/persiana-solar-screen";
    image = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Você enxerga a paisagem, sem deixar ninguém ver dentro.");
  } else if (a.luz === "filtrar") {
    productName = "Persiana Double Vision";
    productPath = "/persiana-double-vision";
    image = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Filtra a luz com elegância, alternando entre privacidade e claridade.");
  } else {
    if (a.estilo === "classico") {
      productName = "Persiana Horizontal Premium";
      productPath = "/persiana-horizontal";
      image = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80";
    } else {
      productName = "Persiana Vertical";
      productPath = "/persiana-vertical";
      image = "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80";
    }
    reasons.push("Privacidade ajustável sem abrir mão da iluminação natural.");
  }

  if (a.seguranca === "pets" && a.luz !== "solar" && a.luz !== "blackout") {
    productName = "Persiana Solar Screen (Pet-Friendly)";
    productPath = "/persiana-solar-screen";
    image = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80";
    reasons.push("Tecido resistente que não desfia — perfeito para pets.");
  }

  if (a.seguranca === "criancas") {
    badge = "Motorização recomendada";
    reasons.push("Sem cordões — segurança total para o quarto infantil.");
  }

  if (a.acionamento === "motorizado") {
    reasons.push("Acionamento motorizado por controle, app ou Alexa.");
    badge = badge ?? "Motorizado";
  }

  reasons.push(`Combina com decoração ${estiloLabel(a.estilo)}.`);

  let score = 88;
  if (a.luz === "blackout" && (a.ambiente === "quarto" || a.ambiente === "infantil")) score += 6;
  if (a.luz === "solar" && (a.ambiente === "sala" || a.ambiente === "home")) score += 6;
  if (a.acionamento === "motorizado") score += 2;
  if (a.seguranca === "criancas" && a.acionamento === "motorizado") score += 2;
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
  };
}

/* ---------------- Componente ---------------- */

const STEPS = [
  { key: "ambiente" as const, title: "Onde será instalada?", options: ambientes },
  { key: "luz" as const, title: "Qual seu objetivo de luz?", options: luzes },
  { key: "seguranca" as const, title: "Quem usa o ambiente?", options: segurancas },
  { key: "estilo" as const, title: "Qual seu estilo de decoração?", options: estilos },
  { key: "acionamento" as const, title: "Como prefere acionar?", options: acionamentos },
];

export function QuizMatch() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<string>("");

  const isComplete = step >= STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  const recommendation = useMemo<Recommendation | null>(() => {
    if (!isComplete) return null;
    return recommend(answers as Required<Answers>);
  }, [isComplete, answers]);

  function handleSelect(value: string, fb: string) {
    setFeedback(fb);
    const next: Answers = { ...answers, [current.key]: value as never };
    setAnswers(next);
    setTimeout(() => {
      setStep((s) => s + 1);
      setFeedback("");
    }, 450);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
    setFeedback("");
  }

  function handleReset() {
    setStep(0);
    setAnswers({});
    setFeedback("");
  }

  const progress = isComplete ? 100 : Math.round((step / STEPS.length) * 100);

  return (
    <section
      id="quiz-persiana-ideal"
      className="relative py-16 sm:py-20 bg-gradient-to-b from-sand via-background to-sand"
      aria-labelledby="quiz-title"
    >
      <div className="container max-w-5xl">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Assistente inteligente
          </span>
          <h2
            id="quiz-title"
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground font-display"
          >
            Descubra a Persiana Ideal para sua Casa em 60 Segundos
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
            Nosso assistente analisa seu ambiente, estilo e segurança para recomendar a melhor opção.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-card p-5 sm:p-8">
          {!isComplete ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                  Etapa {step + 1} de {STEPS.length}
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">{progress}%</span>
              </div>

              <div className="mb-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold text-foreground font-display">
                  {current.title}
                </h3>
                <p
                  className={`mt-2 text-sm sm:text-base transition-all duration-300 font-medium ${
                    feedback ? "text-primary" : "text-foreground/60"
                  }`}
                  aria-live="polite"
                >
                  {feedback || "Toque na opção que mais combina com você."}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {current.options.map((opt) => {
                  const Icon = opt.icon;
                  const selected =
                    (answers as Record<string, string>)[current.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value, opt.feedback)}
                      className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-4 sm:p-5 min-h-[128px] sm:min-h-[148px] transition-all hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected
                          ? "border-2 border-primary shadow-md"
                          : "border border-border shadow-sm hover:border-primary/60 hover:shadow-md"
                      }`}
                      aria-pressed={selected}
                    >
                      <span
                        className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-colors ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/12 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        }`}
                      >
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.25} />
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-center text-foreground leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if ((answers as Record<string, string>)[current.key]) {
                      setStep((s) => s + 1);
                      setFeedback("");
                    }
                  }}
                  disabled={!(answers as Record<string, string>)[current.key]}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {step === STEPS.length - 1 ? "Ver recomendação" : "Próxima etapa"}
                  <ArrowRight className="h-4 w-4" />
                </button>
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

  return (
    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
      <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-muted">
        <img
          src={rec.image}
          alt={rec.productName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground shadow">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          {rec.score}% de compatibilidade
        </div>
        {rec.badge && (
          <div className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow">
            {rec.badge}
          </div>
        )}
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Recomendação personalizada
        </span>
        <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-foreground">
          {rec.productName}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Por que escolhemos para você:
        </p>
        <ul className="mt-4 space-y-2.5">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          {rec.mode === "direct" && rec.productPath ? (
            <Link
              to={rec.productPath}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              Finalizar orçamento no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          )}

          {rec.mode === "direct" && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com especialista
            </a>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Compra online imediata ou atendimento especializado, conforme seu projeto.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Refazer quiz
          </button>
        </div>
      </div>
    </div>
  );
}

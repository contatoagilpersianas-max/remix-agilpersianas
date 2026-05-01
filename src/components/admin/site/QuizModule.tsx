import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModuleCard } from "./_shared/ModuleCard";
import { ToggleField } from "./_shared/ToggleField";
import { useSiteSetting } from "@/hooks/use-site-setting";

export type QuizConfig = {
  enabled: boolean;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  assistantIntro: string;
  steps: { key: string; title: string; botMessage: string }[];
};

export const QUIZ_DEFAULTS: QuizConfig = {
  enabled: true,
  eyebrow: "— ASSISTENTE INTELIGENTE —",
  titleLine1: "Descubra a persiana ideal",
  titleLine2: "para a sua casa.",
   assistantIntro: "Ver Catálogo",
  steps: [
    {
      key: "ambiente",
      title: "Onde será instalada?",
      botMessage:
        "Olá! Vou encontrar a solução perfeita para você. Comece pelo ambiente onde a persiana será instalada.",
    },
    {
      key: "luz",
      title: "Qual seu objetivo de luz?",
      botMessage: "Ótimo! Agora me conte: você quer escurecer totalmente, filtrar a luz ou apenas ter privacidade?",
    },
    {
      key: "estilo",
      title: "Qual seu estilo de decoração?",
      botMessage: "Vou alinhar a recomendação com a estética da sua casa — texturas, cores e acabamentos.",
    },
    {
      key: "convivencia",
      title: "Crianças ou pets em casa?",
      botMessage:
        "A segurança vem primeiro! Para crianças, recomendarei modelos sem cordão solto. Para pets, tecidos que não desfiam.",
    },
    {
      key: "acionamento",
      title: "Como prefere acionar?",
      botMessage:
        "Última pergunta! Manual é econômico; motorizado é conforto premium — abre e fecha por controle, app ou Alexa.",
    },
  ],
};

export function QuizModule() {
  const { value, setValue, save, saving } = useSiteSetting<QuizConfig>("quiz", QUIZ_DEFAULTS);
  const update = (patch: Partial<QuizConfig>) => setValue({ ...value, ...patch });
  const updateStep = (i: number, patch: Partial<QuizConfig["steps"][number]>) =>
    update({ steps: value.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

  return (
    <ModuleCard
      id="mod-quiz"
      icon={Sparkles}
      title="Quiz · Persiana ideal"
      description="Títulos, assistente e perguntas do quiz interativo. As opções de resposta seguem fixas (lógica de recomendação)."
      saveLabel="Salvar quiz"
      onSave={() => save()}
      saving={saving}
    >
      <ToggleField label="Mostrar quiz na home" checked={value.enabled} onChange={(v) => update({ enabled: v })} />
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Eyebrow (texto pequeno acima do título)</Label>
          <Input value={value.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </div>
        <div>
          <Label>Título — linha 1</Label>
          <Input value={value.titleLine1} onChange={(e) => update({ titleLine1: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Título — linha 2 (em destaque coral itálico)</Label>
          <Input value={value.titleLine2} onChange={(e) => update({ titleLine2: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Mensagem inicial do assistente</Label>
        <Textarea rows={3} value={value.assistantIntro} onChange={(e) => update({ assistantIntro: e.target.value })} />
      </div>

      <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Perguntas das etapas
        </div>
        {value.steps.map((s, i) => (
          <div key={s.key} className="rounded-lg border bg-card p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Etapa {i + 1} · {s.key}
            </div>
            <div>
              <Label>Título da pergunta</Label>
              <Input value={s.title} onChange={(e) => updateStep(i, { title: e.target.value })} />
            </div>
            <div>
              <Label>Fala do assistente</Label>
              <Textarea rows={2} value={s.botMessage} onChange={(e) => updateStep(i, { botMessage: e.target.value })} />
            </div>
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}

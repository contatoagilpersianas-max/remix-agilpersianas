import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const NAMES = [
  "Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe", "Giovana", "Henrique",
  "Isabela", "João", "Karina", "Lucas", "Mariana", "Nicolas", "Patrícia",
  "Rafael", "Sofia", "Thiago", "Vanessa", "William",
];

const CITIES = [
  "Belo Horizonte/MG",
  "Juiz de Fora/MG",
  "Rio de Janeiro/RJ",
  "São Paulo/SP",
  "Niterói/RJ",
  "Contagem/MG",
  "Petrópolis/RJ",
  "Uberlândia/MG",
];

const PRODUCTS = [
  "persiana rolô blackout",
  "persiana solar screen",
  "cortina romana",
  "persiana double vision",
  "tela mosquiteira",
  "persiana motorizada",
];

const COUNTERS = [
  "12 pessoas pediram orçamento hoje em BH",
  "8 orçamentos aprovados nas últimas 24h",
  "5 instalações concluídas esta semana em JF",
  "Mais de 32 famílias atendidas neste mês",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeMessage(): string {
  // Alterna entre evento individual e contador agregado
  if (Math.random() < 0.4) return pick(COUNTERS);
  const minutes = Math.floor(Math.random() * 28) + 2;
  return `${pick(NAMES)} de ${pick(CITIES)} pediu orçamento de ${pick(PRODUCTS)} há ${minutes} min`;
}

export function SocialProofToasts() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function schedule(delay: number) {
      const t = setTimeout(() => {
        if (cancelled) return;
        toast(makeMessage(), {
          icon: <Sparkles className="h-4 w-4 text-primary" />,
          duration: 5500,
        });
        // próximo entre 22s e 45s
        schedule(22000 + Math.random() * 23000);
      }, delay);
      timers.push(t);
    }

    // primeiro toast aparece após 12s
    schedule(12000);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

type BaseProps = {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  max: number;
  placeholder?: string;
};

function Counter({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  const over = len > max;
  const near = !over && len > max * 0.9;
  return (
    <span
      className={`text-[11px] tabular-nums ${over ? "text-destructive font-semibold" : near ? "text-amber-600" : "text-muted-foreground"}`}
    >
      {len}/{max}
    </span>
  );
}

export function CharCounterInput(props: BaseProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="mb-0">{props.label}</Label>
        <Counter value={props.value} max={props.max} />
      </div>
      <Input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export function CharCounterTextarea(props: BaseProps & { rows?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="mb-0">{props.label}</Label>
        <Counter value={props.value} max={props.max} />
      </div>
      <Textarea
        rows={props.rows ?? 3}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    </div>
  );
}
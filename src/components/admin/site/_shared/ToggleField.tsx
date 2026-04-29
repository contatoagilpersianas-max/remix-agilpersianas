import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function ToggleField({ label, description, checked, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-3">
      <div className="min-w-0">
        <Label className="mb-0 text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  buttonLabel?: string;
};

export function UrlFieldWithPreview({ label, value, onChange, placeholder, buttonLabel = "Visualizar" }: Props) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://..."}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!value}
          onClick={() => value && window.open(value, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="h-3.5 w-3.5" /> {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
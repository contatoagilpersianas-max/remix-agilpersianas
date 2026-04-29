import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
};

export function WhatsAppField({ label, value, onChange, placeholder, hint }: Props) {
  const clean = (value || "").replace(/\D/g, "");
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "5532351202810 (formato internacional, só números)"}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!clean}
          onClick={() => clean && window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer")}
        >
          <MessageCircle className="h-3.5 w-3.5" /> Testar
        </Button>
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
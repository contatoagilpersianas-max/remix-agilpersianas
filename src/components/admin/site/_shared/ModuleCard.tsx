import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  id: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  saveLabel?: string;
  onSave?: () => void;
  saving?: boolean;
  children: ReactNode;
  headerExtra?: ReactNode;
};

export function ModuleCard({
  id,
  icon: Icon,
  title,
  description,
  saveLabel,
  onSave,
  saving,
  children,
  headerExtra,
}: Props) {
  return (
    <Card id={id} className="p-6 scroll-mt-32">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-base">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {headerExtra}
      </div>
      <div className="space-y-4">{children}</div>
      {onSave && (
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} {saveLabel ?? "Salvar"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <span>
      {children} <span className="text-destructive">*</span>
    </span>
  );
}
import { Search, X } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModuleCard } from "./_shared/ModuleCard";
import { CharCounterInput, CharCounterTextarea } from "./_shared/CharCounter";
import { UrlFieldWithPreview } from "./_shared/UrlFieldWithPreview";
import { useSiteSetting } from "@/hooks/use-site-setting";

type Seo = {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage: string;
};

const DEFAULTS: Seo = {
  title: "Ágil Persianas",
  description: "Persianas e cortinas sob medida com entrega para todo Brasil.",
  keywords: ["persianas", "cortinas", "sob medida"],
  canonical: "https://agilpersianas.lovable.app",
  ogImage: "",
};

export function SeoModule() {
  const { value, setValue, save, saving } = useSiteSetting<Seo>("seo", DEFAULTS);
  const [kwDraft, setKwDraft] = useState("");

  function addKeyword(raw: string) {
    const list = raw.split(",").map((k) => k.trim()).filter(Boolean);
    if (!list.length) return;
    setValue({ ...value, keywords: Array.from(new Set([...value.keywords, ...list])) });
    setKwDraft("");
  }
  function removeKeyword(k: string) {
    setValue({ ...value, keywords: value.keywords.filter((x) => x !== k) });
  }
  function onKwKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(kwDraft);
    }
  }

  return (
    <ModuleCard
      id="mod-seo"
      icon={Search}
      title="SEO e Metadados"
      description="Configurações para o Google e redes sociais."
      saveLabel="Salvar SEO"
      onSave={() => save()}
      saving={saving}
    >
      <CharCounterInput
        label="Título da página (meta title)"
        value={value.title}
        onChange={(v) => setValue({ ...value, title: v })}
        max={60}
        placeholder="Ágil Persianas — Persianas sob medida"
      />
      <CharCounterTextarea
        label="Descrição da página (meta description)"
        value={value.description}
        onChange={(v) => setValue({ ...value, description: v })}
        max={160}
        placeholder="Persianas e cortinas sob medida com entrega para todo Brasil."
      />
      <div>
        <Label>Palavras-chave</Label>
        <div className="flex flex-wrap gap-1.5 rounded-md border bg-background p-2 min-h-[42px]">
          {value.keywords.map((k) => (
            <span key={k} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {k}
              <button type="button" onClick={() => removeKeyword(k)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <Input
            value={kwDraft}
            onChange={(e) => setKwDraft(e.target.value)}
            onKeyDown={onKwKey}
            onBlur={() => kwDraft && addKeyword(kwDraft)}
            placeholder="Digite e pressione Enter ou vírgula"
            className="flex-1 min-w-[180px] border-0 h-7 focus-visible:ring-0 p-0"
          />
        </div>
      </div>
      <UrlFieldWithPreview
        label="URL canônica"
        value={value.canonical}
        onChange={(v) => setValue({ ...value, canonical: v })}
        placeholder="https://agilpersianas.lovable.app"
      />
      <UrlFieldWithPreview
        label="Imagem Open Graph (compartilhamento WhatsApp/redes)"
        value={value.ogImage}
        onChange={(v) => setValue({ ...value, ogImage: v })}
        placeholder="https://.../og-image.png"
      />
    </ModuleCard>
  );
}
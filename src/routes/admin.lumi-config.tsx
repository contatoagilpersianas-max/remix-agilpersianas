import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, Link as LinkIcon, FileText, Image as ImageIcon, Video, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/lumi-config")({
  component: LumiConfigPage,
});

type Knowledge = {
  id: string;
  title: string;
  kind: string;
  content: string | null;
  url: string | null;
  file_path: string | null;
  tags: string[];
  active: boolean;
  position: number;
  created_at: string;
};

const KIND_META: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  text: { label: "Texto", icon: FileText, color: "bg-foreground/10 text-foreground" },
  faq: { label: "FAQ", icon: Sparkles, color: "bg-primary/10 text-primary" },
  link: { label: "Link", icon: LinkIcon, color: "bg-blue-500/10 text-blue-600" },
  file: { label: "Arquivo", icon: Upload, color: "bg-amber-500/10 text-amber-700" },
  image: { label: "Imagem", icon: ImageIcon, color: "bg-emerald-500/10 text-emerald-700" },
  video: { label: "Vídeo", icon: Video, color: "bg-purple-500/10 text-purple-700" },
};

function LumiConfigPage() {
  const [items, setItems] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    kind: "text",
    content: "",
    url: "",
    tags: "",
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("lumi_knowledge")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Knowledge[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => setForm({ title: "", kind: "text", content: "", url: "", tags: "" });

  const submit = async () => {
    if (!form.title.trim()) {
      toast.error("Informe um título.");
      return;
    }
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("lumi_knowledge").insert({
      title: form.title.trim(),
      kind: form.kind,
      content: form.content.trim() || null,
      url: form.url.trim() || null,
      tags,
    });
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Conhecimento adicionado à Lumi.");
    reset();
    load();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Máximo 20MB por arquivo.");
      return;
    }
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("lumi-files").upload(path, file);
      if (upErr) throw upErr;
      const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
      await supabase.from("lumi_knowledge").insert({
        title: file.name,
        kind,
        file_path: path,
        content: `Arquivo: ${file.name} (${Math.round(file.size / 1024)} KB)`,
        tags: ["arquivo"],
      });
      toast.success("Arquivo enviado.");
      load();
    } catch (err: unknown) {
      toast.error("Erro: " + (err instanceof Error ? err.message : "desconhecido"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("lumi_knowledge").update({ active: !active }).eq("id", id);
    load();
  };

  const remove = async (it: Knowledge) => {
    if (!confirm("Remover este conhecimento?")) return;
    if (it.file_path) await supabase.storage.from("lumi-files").remove([it.file_path]);
    await supabase.from("lumi_knowledge").delete().eq("id", it.id);
    load();
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary font-semibold inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Lumi · Base de conhecimento
        </div>
        <h1 className="font-display text-3xl mt-1">Alimentar a Lumi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tudo que adicionar aqui passa a fazer parte das respostas da Lumi no site.
          Use textos, FAQs, links de referência, fotos, vídeos ou arquivos.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        {/* Form */}
        <Card className="p-5 space-y-3 h-fit sticky top-20">
          <div className="font-semibold text-sm">Adicionar conhecimento</div>

          <div className="grid grid-cols-3 gap-2">
            {(["text", "faq", "link"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setForm((f) => ({ ...f, kind: k }))}
                className={`h-9 text-xs rounded-lg border transition ${
                  form.kind === k ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {KIND_META[k].label}
              </button>
            ))}
          </div>

          <Input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {form.kind === "link" ? (
            <Input
              placeholder="https://…"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          ) : (
            <Textarea
              placeholder={form.kind === "faq" ? "Resposta da FAQ" : "Conteúdo / contexto"}
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          )}
          <Input
            placeholder="Tags (separar por vírgula)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <Button onClick={submit} className="w-full">
            <Plus className="h-4 w-4" /> Adicionar
          </Button>

          <div className="border-t pt-3 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ou envie arquivos
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
              onChange={handleFile}
              disabled={uploading}
              className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-background hover:file:bg-foreground/90"
            />
            <p className="text-[10px] text-muted-foreground">PDF, imagens, vídeos. Máx. 20MB.</p>
          </div>
        </Card>

        {/* Lista */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading ? "Carregando…" : `${items.length} item(ns) na base`}
            </div>
          </div>

          {items.length === 0 && !loading && (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              Nenhum conhecimento ainda. Comece adicionando informações sobre seus produtos.
            </Card>
          )}

          {items.map((it) => {
            const meta = KIND_META[it.kind] ?? KIND_META.text;
            const Icon = meta.icon;
            return (
              <Card key={it.id} className={`p-4 ${!it.active ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg ${meta.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-sm">{it.title}</div>
                      <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
                      {it.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                    {it.content && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.content}</p>
                    )}
                    {it.url && (
                      <a href={it.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block break-all">
                        {it.url}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggle(it.id, it.active)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted"
                      title={it.active ? "Desativar" : "Ativar"}
                    >
                      {it.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => remove(it)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

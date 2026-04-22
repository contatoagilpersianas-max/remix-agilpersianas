import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, Package, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/catalogo")({
  component: Catalog,
});

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category_id: string | null;
  cover_image: string | null;
  price_per_sqm: number;
  min_width_cm: number;
  max_width_cm: number;
  min_height_cm: number;
  max_height_cm: number;
  min_area: number;
  motor_manual_price: number;
  motor_rf_price: number;
  motor_wifi_price: number;
  bando_price: number;
  active: boolean;
  featured: boolean;
  colors: { name: string; hex: string }[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id,name,slug").order("position"),
    ]);
    setProducts((p as Product[]) ?? []);
    setCats((c as Category[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function startNew() {
    setEditing({
      name: "",
      slug: "",
      short_description: "",
      category_id: cats[0]?.id ?? null,
      cover_image: "",
      price_per_sqm: 0,
      min_width_cm: 40,
      max_width_cm: 300,
      min_height_cm: 40,
      max_height_cm: 300,
      min_area: 1,
      motor_manual_price: 0,
      motor_rf_price: 0,
      motor_wifi_price: 0,
      bando_price: 0,
      active: true,
      featured: false,
      colors: [
        { name: "Branco", hex: "#FFFFFF" },
        { name: "Bege", hex: "#D7C4A3" },
        { name: "Cinza", hex: "#7E8794" },
      ],
    });
  }

  async function save() {
    if (!editing?.name) return toast.error("Nome obrigatório");
    setSaving(true);
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Produto salvo!");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto excluído");
    load();
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Catálogo</div>
          <h1 className="font-display text-3xl mt-1">Produtos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cadastre e gerencie os produtos exibidos na loja, incluindo preço por m² e limites de medida.
          </p>
        </div>
        <Button onClick={startNew} size="lg" className="shadow-glow">
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {loading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">Carregando...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => {
            const cat = cats.find((c) => c.id === p.category_id);
            return (
              <Card key={p.id} className="p-4 flex items-center gap-4 hover:shadow-md transition">
                <div className="h-16 w-16 rounded-lg bg-sand overflow-hidden shrink-0">
                  {p.cover_image && <img src={p.cover_image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    {p.featured && <Badge className="bg-primary/10 text-primary border-0">Destaque</Badge>}
                    {!p.active && <Badge variant="secondary">Inativo</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                    <span>{cat?.name ?? "Sem categoria"}</span>
                    <span>·</span>
                    <span>R$ {p.price_per_sqm.toFixed(2)} /m²</span>
                    <span>·</span>
                    <span>{p.min_width_cm}–{p.max_width_cm} × {p.min_height_cm}–{p.max_height_cm} cm</span>
                  </div>
                </div>
                <Link
                  to="/produto/$slug"
                  params={{ slug: p.slug }}
                  className="text-muted-foreground hover:text-primary"
                  title="Ver na loja"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setEditing(p)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Editor */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={editing.name ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Slug (URL)</Label>
                  <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Descrição curta</Label>
                <Textarea
                  value={editing.short_description ?? ""}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <select
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    value={editing.category_id ?? ""}
                    onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                  >
                    <option value="">Sem categoria</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>URL da imagem de capa</Label>
                  <Input
                    value={editing.cover_image ?? ""}
                    onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-sand/30">
                <h4 className="font-semibold text-sm mb-3">Calculadora m²</h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Preço por m² (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editing.price_per_sqm ?? 0}
                      onChange={(e) => setEditing({ ...editing, price_per_sqm: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Área mínima (m²)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editing.min_area ?? 1}
                      onChange={(e) => setEditing({ ...editing, min_area: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <Label className="text-xs">Largura mín (cm)</Label>
                    <Input type="number" value={editing.min_width_cm ?? 40} onChange={(e) => setEditing({ ...editing, min_width_cm: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Largura máx (cm)</Label>
                    <Input type="number" value={editing.max_width_cm ?? 300} onChange={(e) => setEditing({ ...editing, max_width_cm: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Altura mín (cm)</Label>
                    <Input type="number" value={editing.min_height_cm ?? 40} onChange={(e) => setEditing({ ...editing, min_height_cm: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Altura máx (cm)</Label>
                    <Input type="number" value={editing.max_height_cm ?? 300} onChange={(e) => setEditing({ ...editing, max_height_cm: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <Label className="text-xs">Manual (R$)</Label>
                    <Input type="number" step="0.01" value={editing.motor_manual_price ?? 0} onChange={(e) => setEditing({ ...editing, motor_manual_price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Motor RF (R$)</Label>
                    <Input type="number" step="0.01" value={editing.motor_rf_price ?? 0} onChange={(e) => setEditing({ ...editing, motor_rf_price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Motor Wi-Fi (R$)</Label>
                    <Input type="number" step="0.01" value={editing.motor_wifi_price ?? 0} onChange={(e) => setEditing({ ...editing, motor_wifi_price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Bandô (R$)</Label>
                    <Input type="number" step="0.01" value={editing.bando_price ?? 0} onChange={(e) => setEditing({ ...editing, bando_price: Number(e.target.value) })} />
                  </div>
                </div>
              </div>

              <ColorsEditor
                colors={editing.colors ?? []}
                onChange={(colors) => setEditing({ ...editing, colors })}
              />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                  Ativo
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
                  Destaque na home
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

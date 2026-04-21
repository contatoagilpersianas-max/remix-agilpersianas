import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog, Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/usuarios")({ component: Users });

type Profile = { user_id: string; display_name: string | null };
type Role = { user_id: string; role: "admin" | "user" };

function Users() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("user_id,display_name"),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setProfiles((p as Profile[]) ?? []);
    setRoles((r as Role[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const isAdmin = (uid: string) => roles.some((r) => r.user_id === uid && r.role === "admin");

  async function toggle(uid: string) {
    if (isAdmin(uid)) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin removido");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Promovido a admin");
    }
    load();
  }

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Equipe</div>
        <h1 className="font-display text-3xl mt-1">Usuários</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie permissões de acesso ao painel.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Carregando...</div>
      ) : profiles.length === 0 ? (
        <Card className="p-12 text-center">
          <UserCog className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left p-3">Usuário</th><th className="text-left p-3">Permissão</th><th></th></tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.user_id} className="border-t hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold uppercase">{(p.display_name ?? "?")[0]}</div>
                      <div>
                        <div className="font-medium">{p.display_name ?? "(sem nome)"}</div>
                        <div className="text-xs text-muted-foreground font-mono">{p.user_id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {isAdmin(p.user_id) ? (
                      <Badge className="bg-primary text-primary-foreground border-0"><Shield className="h-3 w-3" /> Administrador</Badge>
                    ) : (
                      <Badge variant="secondary">Usuário</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant={isAdmin(p.user_id) ? "outline" : "default"} onClick={() => toggle(p.user_id)}>
                      {isAdmin(p.user_id) ? <><ShieldOff className="h-4 w-4" /> Remover admin</> : <><Shield className="h-4 w-4" /> Tornar admin</>}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso · Ágil Persianas" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  async function handle(e: React.FormEvent, mode: "in" | "up") {
    e.preventDefault();
    setSubmitting(true);
    const fn = mode === "in" ? signIn : signUp;
    const { error } = await fn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success(mode === "in" ? "Bem-vindo!" : "Conta criada. Confirme seu e-mail se necessário.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar à loja
        </Link>
        <Card className="p-8 shadow-card">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl">Ágil Persianas</h1>
            <p className="text-sm text-muted-foreground mt-1">Acesso restrito ao painel administrativo</p>
          </div>
          <Tabs defaultValue="in">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="in">Entrar</TabsTrigger>
              <TabsTrigger value="up">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="in">
              <form onSubmit={(e) => handle(e, "in")} className="space-y-4 mt-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>Senha</Label>
                  <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="up">
              <form onSubmit={(e) => handle(e, "up")} className="space-y-4 mt-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>Senha (mín. 8 caracteres)</Label>
                  <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Criar conta
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Após criar a conta, peça ao administrador master para liberar permissões.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

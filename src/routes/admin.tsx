import { createFileRoute, Outlet, redirect, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Users,
  Package,
  Globe,
  Megaphone,
  Factory,
  Wallet,
  BarChart3,
  UserCog,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart, soon: true },
  { to: "/admin/orcamentos", label: "Orçamentos", icon: FileText, soon: true },
  { to: "/admin/leads", label: "Leads CRM", icon: Users, soon: true },
  { to: "/admin/catalogo", label: "Catálogo", icon: Package },
  { to: "/admin/site", label: "Site / Conteúdo", icon: Globe, soon: true },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone, soon: true },
  { to: "/admin/producao", label: "Produção", icon: Factory, soon: true },
  { to: "/admin/financeiro", label: "Financeiro", icon: Wallet, soon: true },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3, soon: true },
  { to: "/admin/usuarios", label: "Usuários", icon: UserCog, soon: true },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings, soon: true },
];

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Skeleton className="w-64 h-screen" />
        <div className="flex-1 p-8 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand p-6">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <UserCog className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-display text-2xl">Acesso negado</h1>
          <p className="text-muted-foreground mt-2">
            Sua conta ({user.email}) não tem permissão de administrador. Solicite ao master admin.
          </p>
          <Button variant="outline" onClick={signOut} className="mt-4">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </div>
    );
  }

  const path = location.pathname.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.003_240)] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-graphite text-graphite-foreground flex flex-col sticky top-0 h-screen">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center font-display font-bold text-lg">
            Á
          </div>
          <div>
            <div className="font-display text-base leading-tight">Ágil</div>
            <div className="text-[10px] uppercase tracking-widest text-graphite-foreground/60">Admin Suite</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map((it) => {
            const active = it.exact ? path === "/admin" : path === it.to || path.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                disabled={it.soon}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-graphite-foreground/75 hover:bg-white/5 hover:text-graphite-foreground"
                } ${it.soon ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => {
                  if (it.soon) e.preventDefault();
                }}
              >
                <it.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{it.label}</span>
                {it.soon && (
                  <span className="text-[9px] uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">em breve</span>
                )}
                {active && !it.soon && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold uppercase">
              {user.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{user.email}</div>
              <div className="text-[10px] text-graphite-foreground/60">Master admin</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-graphite-foreground/80 hover:bg-white/10 hover:text-graphite-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b bg-card sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="h-full px-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar produto, pedido, lead..."
                className="h-10 w-full rounded-full bg-muted/60 pl-10 pr-4 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="relative h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Ver loja →
            </Link>
          </div>
        </header>
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

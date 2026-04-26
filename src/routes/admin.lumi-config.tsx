// Redirect: a página foi unificada em /admin/lumi?tab=cerebro
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/lumi-config")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/lumi", search: { tab: "cerebro" } });
  },
  component: () => null,
});

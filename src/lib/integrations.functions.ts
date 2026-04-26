import { createServerFn } from "@tanstack/react-start";

/**
 * Tenta detectar a qual ambiente (sandbox/production) a ASAAS_API_KEY pertence.
 * Faz uma requisição leve (GET /myAccount) em ambos os ambientes e usa o
 * código de resposta para decidir.
 *  - 200 → ambiente correto
 *  - 401 → chave inválida para aquele ambiente
 *  - outro → erro de rede / Asaas
 */

const ENVS = {
  sandbox: "https://api-sandbox.asaas.com/v3",
  production: "https://api.asaas.com/v3",
} as const;

type Env = keyof typeof ENVS;

async function probe(env: Env, apiKey: string) {
  try {
    const res = await fetch(`${ENVS[env]}/myAccount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AgilPersianas/1.0 (admin-check)",
        access_token: apiKey,
      },
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { env, status: res.status, ok: res.ok, body };
  } catch (err) {
    return {
      env,
      status: 0,
      ok: false,
      body: { error: err instanceof Error ? err.message : "Network error" },
    };
  }
}

export type AsaasCheckResult = {
  hasKey: boolean;
  configuredEnv: string | null;
  detectedEnv: Env | null;
  matches: boolean | null;
  recommendation: string;
  details: {
    sandbox: { status: number; message: string };
    production: { status: number; message: string };
  };
  account?: {
    name?: string;
    email?: string;
    walletId?: string;
  };
  errors: string[];
};

function describe(status: number) {
  switch (status) {
    case 200:
      return "Conectado com sucesso";
    case 401:
      return "Chave não autorizada para este ambiente";
    case 0:
      return "Falha de rede ao contatar o Asaas";
    default:
      return `Resposta inesperada (HTTP ${status})`;
  }
}

export const checkAsaas = createServerFn({ method: "POST" }).handler(async () => {
  const apiKey = process.env.ASAAS_API_KEY;
  const configuredEnv = process.env.ASAAS_ENV ?? null;
  const errors: string[] = [];

  if (!apiKey) {
    return {
      hasKey: false,
      configuredEnv,
      detectedEnv: null,
      matches: null,
      recommendation:
        "Adicione a secret ASAAS_API_KEY (Configurações de Cloud) antes de continuar.",
      details: {
        sandbox: { status: 0, message: "Sem chave para testar" },
        production: { status: 0, message: "Sem chave para testar" },
      },
      errors: ["ASAAS_API_KEY não configurada"],
    } satisfies AsaasCheckResult;
  }

  const [sb, prod] = await Promise.all([probe("sandbox", apiKey), probe("production", apiKey)]);

  let detectedEnv: Env | null = null;
  if (sb.ok && !prod.ok) detectedEnv = "sandbox";
  else if (prod.ok && !sb.ok) detectedEnv = "production";
  else if (sb.ok && prod.ok) detectedEnv = "production"; // raríssimo: prefere prod

  const matches = detectedEnv ? configuredEnv?.toLowerCase() === detectedEnv : null;

  let recommendation = "";
  if (!detectedEnv) {
    recommendation =
      "Sua ASAAS_API_KEY não foi aceita em sandbox nem em produção. Verifique se copiou a chave inteira e gere uma nova em Configurações → Integrações no painel do Asaas.";
    errors.push("Chave inválida nos dois ambientes");
  } else if (!configuredEnv) {
    recommendation = `Sua chave é do ambiente "${detectedEnv}". Configure ASAAS_ENV=${detectedEnv} para ativar a integração.`;
    errors.push("ASAAS_ENV não configurada");
  } else if (!matches) {
    recommendation = `Sua ASAAS_ENV está como "${configuredEnv}", mas a chave é de "${detectedEnv}". Atualize para ASAAS_ENV=${detectedEnv}.`;
    errors.push(`ASAAS_ENV="${configuredEnv}" não bate com a chave (${detectedEnv})`);
  } else {
    recommendation = `Tudo certo! Integração Asaas conectada em ${detectedEnv === "production" ? "PRODUÇÃO (cobranças reais)" : "SANDBOX (testes)"}.`;
  }

  // Pega dados da conta do ambiente que respondeu OK
  const okBody = (sb.ok ? sb.body : prod.ok ? prod.body : null) as
    | { name?: string; email?: string; walletId?: string }
    | null;

  return {
    hasKey: true,
    configuredEnv,
    detectedEnv,
    matches,
    recommendation,
    details: {
      sandbox: { status: sb.status, message: describe(sb.status) },
      production: { status: prod.status, message: describe(prod.status) },
    },
    account: okBody
      ? { name: okBody.name, email: okBody.email, walletId: okBody.walletId }
      : undefined,
    errors,
  } satisfies AsaasCheckResult;
});

export type FrenetCheckResult = {
  hasToken: boolean;
  ok: boolean;
  status: number;
  message: string;
  recommendation: string;
};

export const checkFrenet = createServerFn({ method: "POST" }).handler(async () => {
  const token = process.env.FRENET_TOKEN;
  if (!token) {
    return {
      hasToken: false,
      ok: false,
      status: 0,
      message: "FRENET_TOKEN não configurado",
      recommendation:
        "Adicione a secret FRENET_TOKEN (gerada no painel da Frenet em Minha Conta → Token API).",
    } satisfies FrenetCheckResult;
  }

  try {
    // Cotação leve apenas para validar autenticação.
    const res = await fetch("https://api.frenet.com.br/shipping/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        SellerCEP: "30130100",
        RecipientCEP: "01310100",
        ShipmentInvoiceValue: 100,
        ShippingItemArray: [
          { Weight: 1, Length: 30, Height: 10, Width: 10, Quantity: 1, SKU: "TEST" },
        ],
        RecipientCountry: "BR",
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      Message?: string;
      ShippingSevicesArray?: unknown[];
    };

    if (!res.ok) {
      return {
        hasToken: true,
        ok: false,
        status: res.status,
        message: body?.Message || `HTTP ${res.status}`,
        recommendation:
          "A Frenet recusou o token. Confira em https://painel.frenet.com.br → Minha Conta → Token API.",
      } satisfies FrenetCheckResult;
    }

    if (body?.Message && !body.ShippingSevicesArray) {
      return {
        hasToken: true,
        ok: false,
        status: res.status,
        message: body.Message,
        recommendation:
          "Token aceito, mas a Frenet retornou aviso. Verifique se o cadastro está completo.",
      } satisfies FrenetCheckResult;
    }

    return {
      hasToken: true,
      ok: true,
      status: 200,
      message: `Conectado — ${body.ShippingSevicesArray?.length ?? 0} transportadoras retornadas no teste`,
      recommendation: "Frenet conectada com sucesso.",
    } satisfies FrenetCheckResult;
  } catch (err) {
    return {
      hasToken: true,
      ok: false,
      status: 0,
      message: err instanceof Error ? err.message : "Falha de rede",
      recommendation: "Não foi possível contatar a Frenet. Tente novamente em instantes.",
    } satisfies FrenetCheckResult;
  }
});
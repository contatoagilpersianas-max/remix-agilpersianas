## Visão geral

A expansão completa cobre 16 módulos editáveis. Para entregar com qualidade, dividi em 3 fases. Esta é a **Fase 1** (essencial) — depois de aprovar e validar, sigo para Fase 2 (conteúdo) e Fase 3 (avançado).

## Fase 1 — escopo desta entrega

**Infraestrutura compartilhada (usada por todas as 3 fases):**
1. Instalar `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` para drag-and-drop real.
2. Refatorar `src/routes/admin.site.tsx` em arquitetura modular: cada módulo vira um componente em `src/components/admin/site/` (ex.: `HeroModule.tsx`, `BannersModule.tsx`…). Mantém o arquivo da rota leve e legível.
3. Criar componentes utilitários reutilizáveis em `src/components/admin/site/_shared/`:
   - `ModuleCard.tsx` — card padrão (borda, ícone laranja, título bold, descrição cinza, botão "Salvar X" laranja à direita).
   - `UrlFieldWithPreview.tsx` — input de URL com botão "Visualizar" (abre nova aba).
   - `WhatsAppField.tsx` — input com botão "Testar" (abre `wa.me/numero`).
   - `CharCounterTextarea.tsx` / `CharCounterInput.tsx` — campos com contador em tempo real.
   - `RequiredLabel.tsx` — label com asterisco vermelho.
   - `SortableList.tsx` — wrapper genérico de drag-and-drop com handle de arrasto.
   - `ToggleField.tsx` — switch de mostrar/ocultar com label.
   - `ModulesIndex.tsx` — índice horizontal sticky no topo com âncoras + scroll suave para os 16 módulos (já preparado para Fases 2 e 3, módulos não implementados aparecem com badge "em breve").
4. Hook `useSiteSetting<T>(key, defaults)` em `src/hooks/use-site-setting.ts` para load/save padronizado em `site_settings` + toast verde "✓ Salvo com sucesso".

**Módulos implementados nesta fase (admin + integração com site):**

- **Módulo 1 — Hero (expandido):** adicionar `cta2`, `ctaUrl`, `cta2Url`, `ctaEnabled`, `cta2Enabled`. Atualizar `Hero.tsx` (`HeroBanner` + `HeroIntro`) para ler esses campos e respeitar URL/visibilidade dos botões.
- **Módulo 2 — Carrossel de banners (expandido):** schema novo `{ src, title, subtitle, cta, ctaUrl, active }[]` (até 5), drag-and-drop, botão adicionar/remover, toggle ativo. Atualizar `HeroBanner` para filtrar `active`. Migração de dados antigos preservada (mescla com defaults).
- **Módulo 3 — Faixa de benefícios (`promo_strip`):** lista até 10 itens + toggle global. Atualizar `PromoStrip.tsx` para ler de `site_settings`.
- **Módulo 14 — Informações globais de contato (`contact`):** WhatsApp principal (com botão Testar), telefone, email, endereço, horário, redes sociais (Instagram/Facebook/YouTube/TikTok). Refatorar `src/lib/site-config.ts` para hook reativo `useSiteContact()` que lê de `site_settings.contact` com fallback para defaults atuais. Footer e TopBar passam a ler do hook.
- **Módulo 15 — Footer (`footer`):** texto institucional, até 4 colunas (título + até 8 links cada + toggle por coluna), texto do rodapé final. Atualizar `Footer.tsx` para ler de `site_settings`.
- **Módulo 16 — SEO (`seo`):** title (contador 60), description (contador 160), keywords (chips por vírgula), URL canônica, OG image (com botão Visualizar). Atualizar `src/routes/__root.tsx` para ler dinamicamente — como o `head()` do root é estático no Tanstack, vou criar um pequeno componente client `<SeoHead />` montado no `RootComponent` que injeta `<meta>` em runtime via `document.head` para os campos editáveis (title, description, OG image, canonical), preservando os defaults SSR.

**Índice no topo:** sticky logo abaixo do header do admin, com scroll horizontal em mobile, links para todos os 16 módulos. Os 10 módulos das Fases 2/3 ficam com tooltip "Disponível em breve" e estilo desabilitado, mas já visíveis para a navegação parecer completa.

**Padrões aplicados a tudo:**
- Toast verde `toast.success("✓ Salvo com sucesso")` (sonner já configurado).
- Asterisco vermelho em campos obrigatórios.
- Contadores em tempo real onde houver limite.
- Drag handle visível em itens reordenáveis.
- Botão "Visualizar" em todos os campos de URL de imagem.
- Botão "Testar" em todos os campos de WhatsApp.

## Detalhes técnicos

**Schema de `site_settings` (novas keys):**
```
contact         → { whatsapp, phone, email, address, hours, instagram, facebook, youtube, tiktok }
promo_strip     → { items: string[], enabled: boolean }
footer          → { intro, columns: [{ title, enabled, links: [{ label, url }] }], copyright }
seo             → { title, description, keywords: string[], canonical, ogImage }
hero            → { title, subtitle, cta, cta2, ctaUrl, cta2Url, ctaEnabled, cta2Enabled, image }
hero_banners    → { src, title, subtitle, cta, ctaUrl, active }[]  (até 5, ordem importa)
```
RLS já permitida (admin escreve, público lê). Sem migração SQL necessária — `site_settings` aceita qualquer JSON.

**Estrutura de arquivos:**
```text
src/
  routes/admin.site.tsx                 (rota leve: índice + lista de módulos)
  components/admin/site/
    _shared/
      ModuleCard.tsx
      UrlFieldWithPreview.tsx
      WhatsAppField.tsx
      CharCounter*.tsx
      RequiredLabel.tsx
      SortableList.tsx
      ToggleField.tsx
      ModulesIndex.tsx
    HeroModule.tsx
    BannersModule.tsx
    PromoStripModule.tsx
    ContactModule.tsx
    FooterModule.tsx
    SeoModule.tsx
    MediaLibraryModule.tsx              (extraído do existente)
  hooks/use-site-setting.ts
  hooks/use-site-contact.ts
  components/site/SeoHead.tsx           (client-side meta sync)
```

**Mudanças nos componentes do site (integração ler do banco):**
- `Hero.tsx`: lê novos campos do hero + filtra banners por `active`.
- `PromoStrip.tsx`: lê `promo_strip.items` e `enabled`.
- `Footer.tsx`: lê `footer.columns/intro/copyright` e `contact.*`.
- `SiteHeader.tsx` / `TopBar.tsx`: usam `useSiteContact()` para WhatsApp.
- `__root.tsx`: monta `<SeoHead />` dentro do `RootComponent`.

## Fora desta fase (Fases 2 e 3)

- Fase 2: Quiz, Mais vendidos, Antes/Depois, Mosquiteira, Automação, Depoimentos, Produtos em destaque (módulo informativo).
- Fase 3: Cupom, Lumi (config + prompt), Social proof popup.

Cada uma será uma rodada separada para revisão. A infraestrutura compartilhada criada agora torna as fases seguintes muito mais rápidas (basicamente compor `ModuleCard` + `SortableList` + hook + atualizar o componente do site correspondente).

## Estimativa de impacto

- ~12 arquivos novos, ~6 arquivos editados, 1 dependência (`@dnd-kit`).
- `admin.site.tsx` reduz de 316 linhas para ~80 (orquestração).
- Cada módulo entre 80–250 linhas, isolado e testável.

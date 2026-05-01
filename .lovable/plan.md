## 1. Quiz · Frase do assistente

Em `src/components/site/QuizMatch.tsx`:

- Trocar o texto "Assistente Ágil" (linha 660) por **Lumini** em **negrito** e **laranja** (`color: #FF6B35`, `fontWeight: 700`, sem letter-spacing largo, fonte um pouco maior — ~12px). Manter o avatar Bot.
- Atualizar o default em `src/components/admin/site/QuizModule.tsx` (`QUIZ_DEFAULTS.assistantIntro`) removendo a frase **"Excelente escolha."** — passa a começar em "Vamos definir a solução…".
- O painel admin já permite editar essa intro; só atualizamos o default usado quando ainda não há valor salvo.

## 2. Faixa promocional laranja (PromoStrip) — fix mobile

Sintomas: no mobile não passa todas as frases e fica lenta. Causas:

- Um único trilho de animação `marquee` de 16s com `whitespace-nowrap` e items grandes — no mobile a faixa total fica enorme e a velocidade aparente cai.
- `overflow-hidden` no container, mas só renderiza um trilho (`[items, items, items]` num mesmo flex) com `transform: translateX(-50%)` aproximado pela keyframe — o loop não é "seamless" em todas as larguras.

Correções em `src/components/site/PromoStrip.tsx` + `src/styles.css`:

- Reduzir o tamanho da fonte e o gap horizontal no mobile (`mx-4 sm:mx-8`, `text-[11px]` no mobile).
- Renderizar **dois trilhos lado a lado** (cada um com a lista uma vez) animando `translateX(0 → -100%)` no primeiro e o segundo deslocado em `translateX(100%)` para entrar — animação verdadeiramente contínua.
- Acelerar a animação no mobile: `animation-duration` menor em telas pequenas (ex.: 22s mobile, 35s desktop) para sensação mais fluida.
- Adicionar `prefers-reduced-motion` para respeitar acessibilidade.

## 3. Renomear menu admin "Catálogo" → "Produtos"

Em `src/routes/admin.tsx` (NAV array): trocar o `label: "Catálogo"` por `label: "Produtos"`. Manter a rota `/admin/catalogo` (não renomear arquivo para evitar quebrar links). Trocar também o título exibido na página `src/routes/admin.catalogo.tsx` se houver heading "Catálogo".

## 4. Cadastrar 8 produtos da imagem (Rolô Blackout Pinpoint + Texturizado)

**Categorias:**
- Criar duas subcategorias filhas de "Rolô Blackout" (`rolo-blackout`):
  - `rolo-blackout-pinpoint` — "Rolô Blackout Pinpoint"
  - `rolo-blackout-texturizado` — "Rolô Blackout Texturizado"

**Imagens (8 fotos premium geradas por IA):** salvar em `src/assets/products/` e fazer upload para o bucket `product-media`. Estilo: foto realista de janela com persiana rolô blackout instalada, ambiente clean, luz natural, cor real do tecido conforme cada produto.

**Produtos (preço por m²):**

| Slug | Nome | Cor | Linha | price_per_sqm |
|---|---|---|---|---|
| cortina-rolo-blackout-pinpoint-branca | Cortina Rolô Blackout Pinpoint Branca Sob Medida | Branco | Pinpoint | 264,91 |
| cortina-rolo-blackout-pinpoint-bege | Cortina Rolô Blackout Pinpoint Bege Sob Medida | Bege | Pinpoint | 365,73 |
| cortina-rolo-blackout-pinpoint-cinza | Cortina Rolô Blackout Pinpoint Cinza Sob Medida | Cinza | Pinpoint | 379,70 |
| cortina-rolo-blackout-pinpoint-preta | Cortina Rolô Blackout Pinpoint Preta Sob Medida | Preto | Pinpoint | 378,75 |
| cortina-rolo-blackout-branca-texturizado | Cortina Rolô Blackout Branca Texturizado | Branco | Texturizado | 393,00 |
| cortina-rolo-blackout-bege-rustico-texturizado | Cortina Rolô Blackout Bege Rústico Texturizado | Bege | Texturizado | 400,52 |
| persiana-rolo-blackout-cinza-texturizada | Persiana Rolô Blackout Cinza Texturizada | Cinza | Texturizado | 336,71 |
| persiana-rolo-blackout-tecido-liso-branca | Persiana Rolô Blackout Tecido Liso Branca | Branco | Liso | 359,44 |

Campos comuns: `product_type='medida'`, `min_width_cm=40`, `max_width_cm=300`, `min_height_cm=40`, `max_height_cm=300`, `min_area=1`, `active=true`, `featured=true` para os 4 Pinpoint, vincular cada um à subcategoria correta via `product_categories`.

## 5. Mega menu — esconder item repetido quando não há netos

Em `src/components/site/CategoryNav.tsx` (linhas 217-243):

- Quando `subGrand.length === 0`, NÃO renderizar a `<ul>` com o `<li>` repetindo `{sub.name}`. O título laranja (header) já é clicável e leva à categoria.
- Manter a `<ul>` apenas quando existem netos.

Resultado: na imagem 3, "ROLÔ BLACKOUT" aparece só uma vez (laranja, clicável). O mesmo se aplica a Double Vision, Romana etc.

## Detalhes técnicos

- **Imagens IA:** usar `imagegen--generate_image` (modelo `standard`) 1024x1024, prompt template: "Premium product photo, modern bedroom window with [cor] [pinpoint/textured] roller blind blackout shade fully closed, soft natural light from sides, minimalist Scandinavian decor, photorealistic, clean white background outside, professional interior photography, 4k". Salvar em `src/assets/products/rolo-pinpoint-branco.jpg` etc.
- **Upload para storage:** as fotos vão direto em `src/assets/` e são referenciadas no `cover_image` como URL pública após `supabase.storage.from('product-media').upload(...)`. Como cadastro é one-shot via INSERT, faremos upload via script `code--exec` usando a service-role key não está disponível; alternativa: usar `imagegen--generate_image` com `target_path: src/assets/products/...` e referenciar diretamente como URL relativa não funciona em produção. **Solução adotada:** gerar imagens em `src/assets/products/`, depois usar o tool `supabase--storage_upload` (8 chamadas) para subir cada uma ao bucket `product-media` e obter URL pública, então usar `supabase--insert` para inserir os produtos com a URL pública em `cover_image`.
- **Migration:** apenas para criar as 2 subcategorias (estrutura nova precisa de INSERT em `categories` — pode ser feito via `supabase--insert`, sem migration).
- **Operações DB:** 1 INSERT em `categories` (2 linhas), 1 INSERT em `products` (8 linhas), 1 INSERT em `product_categories` (8 linhas). Tudo via `supabase--insert`.

## Arquivos alterados

- `src/components/site/QuizMatch.tsx` — Lumini em laranja+bold
- `src/components/admin/site/QuizModule.tsx` — default da intro sem "Excelente escolha."
- `src/components/site/PromoStrip.tsx` — marquee fluido com 2 trilhos
- `src/styles.css` — keyframes/duration responsivos do marquee
- `src/routes/admin.tsx` — label "Produtos"
- `src/routes/admin.catalogo.tsx` — heading "Produtos" se aplicável
- `src/components/site/CategoryNav.tsx` — esconder item repetido
- `src/assets/products/*.jpg` — 8 imagens novas

## Fora do escopo

- Não vou renomear a rota `/admin/catalogo` para `/admin/produtos` (apenas o label do menu) para não quebrar bookmarks/links existentes.
- Estoque/SKU dos novos produtos ficam padrão (estoque alto, SKU vazio) — você pode ajustar depois no admin.
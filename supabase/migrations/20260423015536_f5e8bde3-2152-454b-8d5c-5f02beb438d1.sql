-- 1) Atribuir category_id aos produtos órfãos
UPDATE public.products SET category_id = '4a5b00d8-e910-45d5-a0ec-aafbe6f76cd7'
  WHERE slug IN (
    'persiana-rolo-blackout-cinza-basic',
    'persiana-rolo-blackout-branca',
    'persiana-rolo-tela-solar-5-branca',
    'persiana-rolo-tela-solar-3-cinza',
    'persiana-rolo-blackout-off-white',
    'persiana-rolo-tela-solar-5-bege'
  );
UPDATE public.products SET category_id = '3d08c449-b7fa-4bdf-8796-94e49c8f917a'
  WHERE slug = 'persiana-romana-blackout-cinza';
UPDATE public.products SET category_id = '50863a01-f85e-4d04-9932-b0dec16bf84e'
  WHERE slug = 'tela-mosquiteira-recolhivel-branca';

-- 2) Sincronizar product_categories
INSERT INTO public.product_categories (product_id, category_id)
SELECT id, category_id FROM public.products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3) Inserir 12 produtos premium (Hunter Douglas / Unilux / Scenare inspired)
INSERT INTO public.products (
  name, slug, short_description, description, category_id, cover_image,
  price_per_sqm, min_width_cm, max_width_cm, min_height_cm, max_height_cm,
  colors, features, faq, gallery, tags, badge, featured, bestseller, active,
  rating, reviews_count, processing_days, weight_kg, motor_rf_price, motor_wifi_price, bando_price
) VALUES
('Persiana Rolô Designer Screen 5%', 'rolo-designer-screen-5',
 'Tela solar Hunter Douglas com proteção UV 95% e visão exterior preservada.',
 'Inspirada na linha Designer Roller Shades da Hunter Douglas, esta persiana rolô utiliza tecido screen 5% que bloqueia 95% dos raios UV mantendo a visibilidade externa. Acabamento premium com tubo de alumínio anodizado e cordão de segurança infantil.',
 '4a5b00d8-e910-45d5-a0ec-aafbe6f76cd7',
 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80',
 339.00, 40, 300, 40, 300,
 '[{"name":"Branco","hex":"#F8F6F2"},{"name":"Areia","hex":"#D4C4A8"},{"name":"Grafite","hex":"#3A3A3A"}]'::jsonb,
 '["Bloqueio UV 95%","Mantém visão externa","Tubo alumínio anodizado","Cordão de segurança infantil","Garantia 5 anos"]'::jsonb,
 '[{"q":"Permite ver para fora?","a":"Sim, a tela 5% mantém a visão externa preservada durante o dia."},{"q":"Funciona em ambientes com sol direto?","a":"Sim, foi projetada para reduzir calor e ofuscamento."}]'::jsonb,
 '[]'::jsonb, '{premium,solar,uv}', 'Top vendas', true, true, true,
 4.9, 187, 12, 2.5, 0, 0, 0),

('Persiana Rolô Duo Translúcida + Blackout', 'rolo-duo-translucida-blackout',
 'Sistema duplo: translúcido para o dia e blackout para a noite, no mesmo trilho.',
 'Solução premium com dois tecidos no mesmo mecanismo. Inspirada nas linhas duo da Hunter Douglas. Ideal para quartos e home office.',
 '4a5b00d8-e910-45d5-a0ec-aafbe6f76cd7',
 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80',
 489.00, 50, 280, 50, 300,
 '[{"name":"Off White","hex":"#F2EEE6"},{"name":"Bege","hex":"#C9B89A"},{"name":"Grafite","hex":"#3F3F3F"}]'::jsonb,
 '["Dois tecidos no mesmo trilho","Privacidade dia + escuridão noite","Mecanismo silencioso","Acabamento alumínio escovado","Sob medida ao centímetro"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{premium,duo,blackout}', 'Lançamento', true, false, true,
 4.8, 92, 14, 3.0, 290, 590, 120),

('Cortina Romana Vignette Off White', 'romana-vignette-off-white',
 'Romana modernizada com pregas uniformes e tecido sem cordas visíveis.',
 'Inspirada na linha Vignette da Hunter Douglas. Pregas perfeitamente uniformes e mecanismo oculto. Tecido off white texturizado em poliéster premium.',
 '3d08c449-b7fa-4bdf-8796-94e49c8f917a',
 'https://images.unsplash.com/photo-1616627781933-2c9a5f648a73?w=900&q=80',
 519.00, 50, 280, 60, 300,
 '[{"name":"Off White","hex":"#F4F0E8"},{"name":"Bege","hex":"#D9C8AB"},{"name":"Cinza","hex":"#878482"}]'::jsonb,
 '["Pregas uniformes sem cordas visíveis","Tecido poliéster premium","Mecanismo oculto","Filtra luz com elegância","Visual editorial"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{premium,romana,vignette}', 'Premium', true, true, true,
 4.9, 134, 14, 3.5, 0, 0, 0),

('Cortina Romana Linho Natural Cru', 'romana-linho-natural-cru',
 'Linho 100% natural com caimento impecável e textura artesanal.',
 'Romana confeccionada em linho natural cru de origem europeia. Caimento perfeito e tato premium.',
 '3d08c449-b7fa-4bdf-8796-94e49c8f917a',
 'https://images.unsplash.com/photo-1616627451515-df27acd3d8e6?w=900&q=80',
 569.00, 60, 280, 60, 300,
 '[{"name":"Natural Cru","hex":"#E8DDC9"},{"name":"Areia Tostada","hex":"#C7AC85"}]'::jsonb,
 '["Linho 100% natural","Origem europeia","Caimento premium","Textura artesanal","Forro opcional"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{linho,natural,romana}', null, true, false, true,
 4.9, 76, 18, 3.8, 0, 0, 150),

('Cortina Double Vision Pirouette Branca', 'doublevision-pirouette-branca',
 'Faixas horizontais que giram para controlar luz e privacidade independentemente.',
 'Inspirada na linha Pirouette da Hunter Douglas. Mecanismo permite ajuste milimétrico de luminosidade.',
 'd92c8ae4-8f5e-482c-a441-83c81595e318',
 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=80',
 459.00, 50, 280, 60, 280,
 '[{"name":"Branco","hex":"#FAFAF7"},{"name":"Cinza Pérola","hex":"#B8B5B0"},{"name":"Areia","hex":"#D2C2A4"}]'::jsonb,
 '["Faixas independentes","Controle milimétrico de luz","Mecanismo silencioso","Acabamento sob medida","Visual editorial"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{premium,double-vision,pirouette}', 'Hunter Douglas Style', true, true, true,
 4.9, 158, 14, 3.2, 320, 690, 0),

('Painel Japonês Skyline Bege Linho', 'painel-skyline-bege-linho',
 'Painéis deslizantes em linho bege para grandes vãos. Visual sofisticado.',
 'Inspirado na linha Skyline da Hunter Douglas. Painéis em linho que deslizam em trilho de alumínio. Ideal para sacadas e divisórias.',
 '1757ec0a-2b32-4665-b7de-b3b0037c8dd1',
 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=900&q=80',
 559.00, 100, 600, 80, 320,
 '[{"name":"Bege Linho","hex":"#D5C4A6"},{"name":"Branco","hex":"#F5F2EC"},{"name":"Cinza","hex":"#9C9893"}]'::jsonb,
 '["Painéis deslizantes em trilho de alumínio","Grandes vãos até 6m","Linho premium","Movimento suave","Sob medida"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{painel,skyline,linho}', 'Premium', true, false, true,
 4.8, 64, 18, 5.5, 0, 0, 0),

('Persiana Horizontal Madeira Premium 50mm Imbuia', 'horizontal-madeira-imbuia',
 'Madeira basswood maciça com acabamento imbuia e fitas decorativas em tecido.',
 'Inspirada na linha Country Wood da Hunter Douglas. Lâminas em basswood com fitas em tecido e ferragens em aço inox.',
 '28b2b46f-0e10-4c69-b6e1-2988ca92ac52',
 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=900&q=80',
 619.00, 40, 280, 40, 280,
 '[{"name":"Imbuia","hex":"#5B3A2A"},{"name":"Mel","hex":"#B98654"},{"name":"Branco","hex":"#F5F2EC"}]'::jsonb,
 '["Madeira basswood maciça","Fitas decorativas em tecido","Ferragens em aço inox","Acabamento envernizado","Garantia 5 anos"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{premium,horizontal,madeira}', 'Premium', true, true, true,
 4.9, 112, 16, 4.5, 0, 0, 0),

('Persiana Vertical Linho Off White 127mm', 'vertical-linho-offwhite',
 'Lâminas verticais largas em linho off white com peso oculto.',
 'Lâminas verticais de 127mm em linho. Mecanismo wand control com rotação 180°.',
 'a556b673-177a-4029-8294-43b3627c598e',
 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=900&q=80',
 309.00, 80, 500, 80, 320,
 '[{"name":"Off White","hex":"#F2EEE6"},{"name":"Bege","hex":"#CFB994"},{"name":"Grafite","hex":"#3D3D3D"}]'::jsonb,
 '["Lâminas largas 127mm","Tecido linho premium","Wand control","Rotação 180°","Para grandes vãos"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{vertical,linho,premium}', null, true, false, true,
 4.7, 58, 12, 4.0, 0, 0, 0),

('Tela Mosquiteira Magnética Branca', 'mosquiteira-magnetica-branca',
 'Sistema com fechamento magnético, instalação sem furos e remoção fácil.',
 'Tela com fechamento magnético, perfil em alumínio branco e fibra de vidro com proteção UV. Sem furos.',
 '50863a01-f85e-4d04-9932-b0dec16bf84e',
 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=900&q=80',
 199.00, 40, 200, 40, 250,
 '[{"name":"Branco","hex":"#FFFFFF"},{"name":"Preto","hex":"#1A1A1A"}]'::jsonb,
 '["Fechamento magnético","Sem furos na esquadria","Tela fibra de vidro","Proteção UV","Removível para limpeza"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{mosquiteira,magnetica}', null, true, true, true,
 4.8, 89, 7, 1.8, 0, 0, 0),

('Toldo Articulado Premium 4x3 Bege', 'toldo-articulado-premium-4x3',
 'Toldo articulado com tecido acrílico Sunbrella e estrutura em alumínio anodizado.',
 'Tipo cassete com Sunbrella resistente a UV e mofo. Braços em alumínio com cabos de aço inox. Manual ou motorizado.',
 '7a10098c-141d-448c-b62b-51ecf372d936',
 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=900&q=80',
 1490.00, 200, 600, 150, 350,
 '[{"name":"Bege","hex":"#D4C4A8"},{"name":"Areia Listrada","hex":"#C9B89A"},{"name":"Grafite","hex":"#4A4A4A"}]'::jsonb,
 '["Tecido acrílico Sunbrella","Estrutura alumínio anodizado","Cabos aço inox","Resistente a UV e mofo","Garantia 5 anos"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{toldo,articulado,sunbrella}', 'Premium', true, true, true,
 4.9, 47, 25, 28.0, 890, 1490, 0),

('Persiana Rolô Night & Day Listrado', 'rolo-night-day-listrado',
 'Tecido com listras alternadas que filtram ou bloqueiam a luz conforme o ajuste.',
 'Persiana rolô com tecido listrado que alterna faixas translúcidas e blackout. Ajuste milimétrico.',
 '4a5b00d8-e910-45d5-a0ec-aafbe6f76cd7',
 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80',
 379.00, 40, 280, 40, 280,
 '[{"name":"Branco","hex":"#FAFAF7"},{"name":"Cinza","hex":"#9A9A98"},{"name":"Bege","hex":"#CDB994"}]'::jsonb,
 '["Faixas alternadas translúcido + blackout","Ajuste milimétrico de luz","Visual moderno","Sob medida","Mecanismo silencioso"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{rolo,night-day,zebra}', 'Lançamento', true, true, true,
 4.8, 124, 12, 2.8, 0, 0, 0),

('Cortina Silhouette Cinza Pérola', 'silhouette-cinza-perola',
 'Lâminas suspensas em tecido translúcido entre dois véus, difusão suave da luz.',
 'Inspirada na lendária linha Silhouette da Hunter Douglas. Lâminas em tecido translúcido suspensas entre véus, criando difusão perfeita da luz natural.',
 'd92c8ae4-8f5e-482c-a441-83c81595e318',
 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80',
 729.00, 60, 280, 60, 280,
 '[{"name":"Cinza Pérola","hex":"#C2BEB7"},{"name":"Branco Neve","hex":"#FAFAF7"},{"name":"Areia","hex":"#D9C8AB"}]'::jsonb,
 '["Lâminas suspensas entre véus","Difusão etérea da luz","Filtragem UV","Acabamento premium","Visual exclusivo"]'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '{silhouette,premium,double-vision}', 'Hunter Douglas Style', true, true, true,
 5.0, 71, 18, 3.4, 0, 0, 0)
ON CONFLICT (slug) DO NOTHING;

-- 4) Sincronizar product_categories para os novos
INSERT INTO public.product_categories (product_id, category_id)
SELECT id, category_id FROM public.products
WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;
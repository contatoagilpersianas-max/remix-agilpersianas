-- Adiciona categoria "AMBIENTES" e subcategorias por cômodo
-- (estilo Fácil Persianas: Sala, Cozinha, Quarto, Escritório, Banheiro, Varanda e Sacada)

DO $$
DECLARE
  v_parent_id uuid;
BEGIN
  -- Cria/atualiza o pai "AMBIENTES"
  INSERT INTO public.categories (name, slug, parent_id, position, active, show_in_menu)
  VALUES ('AMBIENTES', 'ambientes', NULL, 8, true, true)
  ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        parent_id = NULL,
        position = EXCLUDED.position,
        active = true,
        show_in_menu = true
  RETURNING id INTO v_parent_id;

  IF v_parent_id IS NULL THEN
    SELECT id INTO v_parent_id FROM public.categories WHERE slug = 'ambientes';
  END IF;

  -- Insere subcategorias (idempotente via ON CONFLICT no slug)
  INSERT INTO public.categories (name, slug, parent_id, position, active, show_in_menu) VALUES
    ('Persianas para Sala',              'persianas-para-sala',              v_parent_id, 0, true, true),
    ('Persianas para Cozinha',           'persianas-para-cozinha',           v_parent_id, 1, true, true),
    ('Persianas para Quarto',            'persianas-para-quarto',            v_parent_id, 2, true, true),
    ('Persianas para Escritório',        'persianas-para-escritorio',        v_parent_id, 3, true, true),
    ('Persianas para Banheiro',          'persianas-para-banheiro',          v_parent_id, 4, true, true),
    ('Persianas para Varanda e Sacada',  'persianas-para-varanda-e-sacada',  v_parent_id, 5, true, true)
  ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        parent_id = EXCLUDED.parent_id,
        position = EXCLUDED.position,
        active = true,
        show_in_menu = true;
END $$;

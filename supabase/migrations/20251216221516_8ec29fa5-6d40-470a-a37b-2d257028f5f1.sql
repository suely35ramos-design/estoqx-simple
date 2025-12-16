-- Torna id_obra opcional na tabela localizacao_fisica
ALTER TABLE public.localizacao_fisica ALTER COLUMN id_obra DROP NOT NULL;
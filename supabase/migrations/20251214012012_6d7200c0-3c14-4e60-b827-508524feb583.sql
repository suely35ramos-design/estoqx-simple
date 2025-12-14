-- Create system configuration table
CREATE TABLE public.configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  valor jsonb NOT NULL DEFAULT '{}',
  descricao text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view configuracoes"
  ON public.configuracoes FOR SELECT
  USING (true);

CREATE POLICY "Admins and Gestores can manage configuracoes"
  ON public.configuracoes FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'gestor'));

-- Trigger for updated_at
CREATE TRIGGER update_configuracoes_updated_at
  BEFORE UPDATE ON public.configuracoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default configuration for mandatory OS
INSERT INTO public.configuracoes (chave, valor, descricao)
VALUES ('saida_os_obrigatoria', 'true', 'Define se a ordem de serviço é obrigatória para saída de materiais');
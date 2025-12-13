// Tipos manuais enquanto o types.ts não é atualizado pelo sistema

export interface Material {
  id: string;
  codigo: string | null;
  nome_material: string;
  descricao: string | null;
  id_unidade_padrao: string | null;
  apelidos: string[] | null;
  categoria: string | null;
  subcategoria: string | null;
  estoque_minimo: number;
  estoque_maximo: number | null;
  ficha_tecnica_url: string | null;
  imagem_url: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaterialInsert {
  codigo?: string | null;
  nome_material: string;
  descricao?: string | null;
  id_unidade_padrao?: string | null;
  apelidos?: string[] | null;
  categoria?: string | null;
  subcategoria?: string | null;
  estoque_minimo?: number;
  estoque_maximo?: number | null;
  ficha_tecnica_url?: string | null;
  imagem_url?: string | null;
  ativo?: boolean;
}

export interface MaterialUpdate extends Partial<MaterialInsert> {}

export interface UnidadeMedida {
  id: string;
  sigla: string;
  descricao: string;
  created_at: string;
}

export interface EstoqueSaldo {
  id: string;
  id_material: string;
  id_local: string;
  id_lote: string | null;
  saldo_atual: number;
  custo_medio: number;
  updated_at: string;
}

export interface LocalizacaoFisica {
  id: string;
  id_obra: string;
  nome_local: string;
  descricao: string | null;
  capacidade_m3: number | null;
  created_at: string;
  updated_at: string;
}

// View para materiais com saldo calculado
export interface MaterialComSaldo extends Material {
  unidade?: UnidadeMedida | null;
  saldo_total: number;
  custo_medio: number;
  localizacoes: string[];
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ativo_emprestimo: {
        Row: {
          created_at: string | null
          data_devolucao_prevista: string | null
          data_devolucao_real: string | null
          data_emprestimo: string | null
          id: string
          id_ativo: string
          id_usuario_responsavel: string
          observacao: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          data_devolucao_prevista?: string | null
          data_devolucao_real?: string | null
          data_emprestimo?: string | null
          id?: string
          id_ativo: string
          id_usuario_responsavel: string
          observacao?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          data_devolucao_prevista?: string | null
          data_devolucao_real?: string | null
          data_emprestimo?: string | null
          id?: string
          id_ativo?: string
          id_usuario_responsavel?: string
          observacao?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ativo_emprestimo_id_ativo_fkey"
            columns: ["id_ativo"]
            isOneToOne: false
            referencedRelation: "ativos"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_manutencao: {
        Row: {
          created_at: string | null
          custo: number | null
          data_proxima_manutencao: string | null
          data_servico: string
          descricao: string | null
          fornecedor: string | null
          id: string
          id_ativo: string
          tipo_servico: Database["public"]["Enums"]["tipo_servico_manutencao"]
        }
        Insert: {
          created_at?: string | null
          custo?: number | null
          data_proxima_manutencao?: string | null
          data_servico: string
          descricao?: string | null
          fornecedor?: string | null
          id?: string
          id_ativo: string
          tipo_servico: Database["public"]["Enums"]["tipo_servico_manutencao"]
        }
        Update: {
          created_at?: string | null
          custo?: number | null
          data_proxima_manutencao?: string | null
          data_servico?: string
          descricao?: string | null
          fornecedor?: string | null
          id?: string
          id_ativo?: string
          tipo_servico?: Database["public"]["Enums"]["tipo_servico_manutencao"]
        }
        Relationships: [
          {
            foreignKeyName: "ativo_manutencao_id_ativo_fkey"
            columns: ["id_ativo"]
            isOneToOne: false
            referencedRelation: "ativos"
            referencedColumns: ["id"]
          },
        ]
      }
      ativos: {
        Row: {
          codigo_barras: string | null
          codigo_qr: string | null
          created_at: string | null
          data_aquisicao: string | null
          descricao: string | null
          id: string
          id_local: string | null
          id_material: string | null
          imagem_url: string | null
          nome: string
          num_serial: string | null
          status: Database["public"]["Enums"]["status_ativo"] | null
          updated_at: string | null
          valor_aquisicao: number | null
          vida_util_meses: number | null
        }
        Insert: {
          codigo_barras?: string | null
          codigo_qr?: string | null
          created_at?: string | null
          data_aquisicao?: string | null
          descricao?: string | null
          id?: string
          id_local?: string | null
          id_material?: string | null
          imagem_url?: string | null
          nome: string
          num_serial?: string | null
          status?: Database["public"]["Enums"]["status_ativo"] | null
          updated_at?: string | null
          valor_aquisicao?: number | null
          vida_util_meses?: number | null
        }
        Update: {
          codigo_barras?: string | null
          codigo_qr?: string | null
          created_at?: string | null
          data_aquisicao?: string | null
          descricao?: string | null
          id?: string
          id_local?: string | null
          id_material?: string | null
          imagem_url?: string | null
          nome?: string
          num_serial?: string | null
          status?: Database["public"]["Enums"]["status_ativo"] | null
          updated_at?: string | null
          valor_aquisicao?: number | null
          vida_util_meses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ativos_id_local_fkey"
            columns: ["id_local"]
            isOneToOne: false
            referencedRelation: "localizacao_fisica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativos_id_material_fkey"
            columns: ["id_material"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      custo_unitario: {
        Row: {
          created_at: string | null
          custo_medio_ponderado: number
          data_calculo: string
          id: string
          id_material: string
          quantidade_total: number | null
          valor_total: number | null
        }
        Insert: {
          created_at?: string | null
          custo_medio_ponderado: number
          data_calculo?: string
          id?: string
          id_material: string
          quantidade_total?: number | null
          valor_total?: number | null
        }
        Update: {
          created_at?: string | null
          custo_medio_ponderado?: number
          data_calculo?: string
          id?: string
          id_material?: string
          quantidade_total?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custo_unitario_id_material_fkey"
            columns: ["id_material"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque_saldo: {
        Row: {
          custo_medio: number | null
          id: string
          id_local: string
          id_lote: string | null
          id_material: string
          saldo_atual: number
          updated_at: string | null
        }
        Insert: {
          custo_medio?: number | null
          id?: string
          id_local: string
          id_lote?: string | null
          id_material: string
          saldo_atual?: number
          updated_at?: string | null
        }
        Update: {
          custo_medio?: number | null
          id?: string
          id_local?: string
          id_lote?: string | null
          id_material?: string
          saldo_atual?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldo_id_local_fkey"
            columns: ["id_local"]
            isOneToOne: false
            referencedRelation: "localizacao_fisica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldo_id_lote_fkey"
            columns: ["id_lote"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldo_id_material_fkey"
            columns: ["id_material"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      fatores_conversao: {
        Row: {
          created_at: string | null
          fator: number
          id: string
          id_unidade_destino: string
          id_unidade_origem: string
        }
        Insert: {
          created_at?: string | null
          fator: number
          id?: string
          id_unidade_destino: string
          id_unidade_origem: string
        }
        Update: {
          created_at?: string | null
          fator?: number
          id?: string
          id_unidade_destino?: string
          id_unidade_origem?: string
        }
        Relationships: [
          {
            foreignKeyName: "fatores_conversao_id_unidade_destino_fkey"
            columns: ["id_unidade_destino"]
            isOneToOne: false
            referencedRelation: "unidades_medida"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fatores_conversao_id_unidade_origem_fkey"
            columns: ["id_unidade_origem"]
            isOneToOne: false
            referencedRelation: "unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          ativo: boolean | null
          cidade: string | null
          cnpj: string | null
          contato_nome: string | null
          contrato_url: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          inscricao_estadual: string | null
          nome_fantasia: string | null
          razao_social: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          contato_nome?: string | null
          contrato_url?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          razao_social: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          contato_nome?: string | null
          contrato_url?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          razao_social?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      localizacao_fisica: {
        Row: {
          capacidade_m3: number | null
          created_at: string | null
          descricao: string | null
          id: string
          id_obra: string
          nome_local: string
          updated_at: string | null
        }
        Insert: {
          capacidade_m3?: number | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          id_obra: string
          nome_local: string
          updated_at?: string | null
        }
        Update: {
          capacidade_m3?: number | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          id_obra?: string
          nome_local?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "localizacao_fisica_id_obra_fkey"
            columns: ["id_obra"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      log_auditoria: {
        Row: {
          acao: string
          created_at: string | null
          dados_antigos: Json | null
          dados_novos: Json | null
          id: string
          id_registro_afetado: string
          id_usuario: string | null
          tabela_afetada: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_antigos?: Json | null
          dados_novos?: Json | null
          id?: string
          id_registro_afetado: string
          id_usuario?: string | null
          tabela_afetada: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_antigos?: Json | null
          dados_novos?: Json | null
          id?: string
          id_registro_afetado?: string
          id_usuario?: string | null
          tabela_afetada?: string
        }
        Relationships: []
      }
      lotes: {
        Row: {
          created_at: string | null
          data_fabricacao: string | null
          data_validade: string | null
          id: string
          id_material: string
          num_lote: string
          quantidade_inicial: number
        }
        Insert: {
          created_at?: string | null
          data_fabricacao?: string | null
          data_validade?: string | null
          id?: string
          id_material: string
          num_lote: string
          quantidade_inicial: number
        }
        Update: {
          created_at?: string | null
          data_fabricacao?: string | null
          data_validade?: string | null
          id?: string
          id_material?: string
          num_lote?: string
          quantidade_inicial?: number
        }
        Relationships: [
          {
            foreignKeyName: "lotes_id_material_fkey"
            columns: ["id_material"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      materiais: {
        Row: {
          apelidos: string[] | null
          ativo: boolean | null
          categoria: string | null
          codigo: string | null
          created_at: string | null
          descricao: string | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          ficha_tecnica_url: string | null
          id: string
          id_unidade_padrao: string | null
          imagem_url: string | null
          nome_material: string
          subcategoria: string | null
          updated_at: string | null
        }
        Insert: {
          apelidos?: string[] | null
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string | null
          created_at?: string | null
          descricao?: string | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          ficha_tecnica_url?: string | null
          id?: string
          id_unidade_padrao?: string | null
          imagem_url?: string | null
          nome_material: string
          subcategoria?: string | null
          updated_at?: string | null
        }
        Update: {
          apelidos?: string[] | null
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string | null
          created_at?: string | null
          descricao?: string | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          ficha_tecnica_url?: string | null
          id?: string
          id_unidade_padrao?: string | null
          imagem_url?: string | null
          nome_material?: string
          subcategoria?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materiais_id_unidade_padrao_fkey"
            columns: ["id_unidade_padrao"]
            isOneToOne: false
            referencedRelation: "unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      mov_entrada_nf: {
        Row: {
          created_at: string | null
          data_emissao: string | null
          data_recebimento: string | null
          id: string
          id_fornecedor: string | null
          id_mov: string
          nf_arquivo_url: string | null
          num_nf: string | null
          serie_nf: string | null
        }
        Insert: {
          created_at?: string | null
          data_emissao?: string | null
          data_recebimento?: string | null
          id?: string
          id_fornecedor?: string | null
          id_mov: string
          nf_arquivo_url?: string | null
          num_nf?: string | null
          serie_nf?: string | null
        }
        Update: {
          created_at?: string | null
          data_emissao?: string | null
          data_recebimento?: string | null
          id?: string
          id_fornecedor?: string | null
          id_mov?: string
          nf_arquivo_url?: string | null
          num_nf?: string | null
          serie_nf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mov_entrada_nf_id_mov_fkey"
            columns: ["id_mov"]
            isOneToOne: false
            referencedRelation: "movimentacao"
            referencedColumns: ["id"]
          },
        ]
      }
      mov_saida_os: {
        Row: {
          assinatura_url: string | null
          created_at: string | null
          id: string
          id_mov: string
          id_os: string | null
          id_responsavel_retirada: string | null
          tipo_baixa: Database["public"]["Enums"]["tipo_baixa"] | null
        }
        Insert: {
          assinatura_url?: string | null
          created_at?: string | null
          id?: string
          id_mov: string
          id_os?: string | null
          id_responsavel_retirada?: string | null
          tipo_baixa?: Database["public"]["Enums"]["tipo_baixa"] | null
        }
        Update: {
          assinatura_url?: string | null
          created_at?: string | null
          id?: string
          id_mov?: string
          id_os?: string | null
          id_responsavel_retirada?: string | null
          tipo_baixa?: Database["public"]["Enums"]["tipo_baixa"] | null
        }
        Relationships: [
          {
            foreignKeyName: "mov_saida_os_id_mov_fkey"
            columns: ["id_mov"]
            isOneToOne: false
            referencedRelation: "movimentacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mov_saida_os_id_os_fkey"
            columns: ["id_os"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacao: {
        Row: {
          created_at: string | null
          custo_unitario: number | null
          data_mov: string | null
          id: string
          id_local_destino: string | null
          id_local_origem: string | null
          id_lote: string | null
          id_material: string
          id_usuario: string
          observacao: string | null
          quantidade: number
          tipo_mov: Database["public"]["Enums"]["tipo_movimentacao"]
        }
        Insert: {
          created_at?: string | null
          custo_unitario?: number | null
          data_mov?: string | null
          id?: string
          id_local_destino?: string | null
          id_local_origem?: string | null
          id_lote?: string | null
          id_material: string
          id_usuario: string
          observacao?: string | null
          quantidade: number
          tipo_mov: Database["public"]["Enums"]["tipo_movimentacao"]
        }
        Update: {
          created_at?: string | null
          custo_unitario?: number | null
          data_mov?: string | null
          id?: string
          id_local_destino?: string | null
          id_local_origem?: string | null
          id_lote?: string | null
          id_material?: string
          id_usuario?: string
          observacao?: string | null
          quantidade?: number
          tipo_mov?: Database["public"]["Enums"]["tipo_movimentacao"]
        }
        Relationships: [
          {
            foreignKeyName: "movimentacao_id_local_destino_fkey"
            columns: ["id_local_destino"]
            isOneToOne: false
            referencedRelation: "localizacao_fisica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacao_id_local_origem_fkey"
            columns: ["id_local_origem"]
            isOneToOne: false
            referencedRelation: "localizacao_fisica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacao_id_lote_fkey"
            columns: ["id_lote"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacao_id_material_fkey"
            columns: ["id_material"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          cep: string | null
          cidade: string | null
          created_at: string | null
          data_inicio: string | null
          data_previsao_fim: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome_obra: string
          status: Database["public"]["Enums"]["status_obra"] | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          data_inicio?: string | null
          data_previsao_fim?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_obra: string
          status?: Database["public"]["Enums"]["status_obra"] | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          data_inicio?: string | null
          data_previsao_fim?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_obra?: string
          status?: Database["public"]["Enums"]["status_obra"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          codigo: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string
          equipe_responsavel: string | null
          id: string
          id_obra: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao: string
          equipe_responsavel?: string | null
          id?: string
          id_obra: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string
          equipe_responsavel?: string | null
          id?: string
          id_obra?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_id_obra_fkey"
            columns: ["id_obra"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          id_obra: string | null
          matricula: string | null
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          id_obra?: string | null
          matricula?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          id_obra?: string | null
          matricula?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_obra_fkey"
            columns: ["id_obra"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_medida: {
        Row: {
          created_at: string | null
          descricao: string
          id: string
          sigla: string
        }
        Insert: {
          created_at?: string | null
          descricao: string
          id?: string
          sigla: string
        }
        Update: {
          created_at?: string | null
          descricao?: string
          id?: string
          sigla?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gestor" | "almoxarife" | "encarregado" | "operador"
      status_ativo: "disponivel" | "emprestado" | "manutencao" | "baixado"
      status_obra: "ativa" | "pausada" | "concluida" | "cancelada"
      tipo_baixa: "consumo" | "perda" | "extravio" | "devolucao"
      tipo_movimentacao: "entrada" | "saida" | "devolucao" | "transferencia"
      tipo_servico_manutencao:
        | "calibracao"
        | "reparo"
        | "manutencao_preventiva"
        | "manutencao_corretiva"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gestor", "almoxarife", "encarregado", "operador"],
      status_ativo: ["disponivel", "emprestado", "manutencao", "baixado"],
      status_obra: ["ativa", "pausada", "concluida", "cancelada"],
      tipo_baixa: ["consumo", "perda", "extravio", "devolucao"],
      tipo_movimentacao: ["entrada", "saida", "devolucao", "transferencia"],
      tipo_servico_manutencao: [
        "calibracao",
        "reparo",
        "manutencao_preventiva",
        "manutencao_corretiva",
      ],
    },
  },
} as const

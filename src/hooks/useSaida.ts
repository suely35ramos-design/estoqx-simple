import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ExitItem {
  id: string;
  materialId: string;
  materialName: string;
  requested: number;
  available: number;
  unit: string;
  lot?: string;
  loteId?: string;
}

export interface SaidaFormData {
  osId?: string;
  exitDate: string;
  tipoBaixa: "consumo" | "perda" | "extravio" | "devolucao";
  responsavelId?: string;
  observacao?: string;
  items: ExitItem[];
  locationId: string;
}

export function useOrdensServico() {
  return useQuery({
    queryKey: ["ordens-servico"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select(`
          id,
          codigo,
          descricao,
          equipe_responsavel,
          status,
          obras:id_obra (
            id,
            nome_obra
          )
        `)
        .eq("status", "ativa")
        .order("codigo", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useEstoqueDisponivel(locationId: string | null) {
  return useQuery({
    queryKey: ["estoque-disponivel", locationId],
    enabled: !!locationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estoque_saldo")
        .select(`
          id,
          saldo_atual,
          custo_medio,
          id_lote,
          materiais:id_material (
            id,
            codigo,
            nome_material,
            unidades_medida:id_unidade_padrao (
              id,
              sigla
            )
          ),
          lotes:id_lote (
            id,
            num_lote,
            data_validade
          )
        `)
        .eq("id_local", locationId!)
        .gt("saldo_atual", 0)
        .order("id_material");

      if (error) throw error;
      return data;
    },
  });
}

export function useResponsaveis() {
  return useQuery({
    queryKey: ["responsaveis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome, matricula")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });
}

export function useRegistrarSaida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: SaidaFormData) => {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("Usuário não autenticado");
      }

      const results = [];

      // Process each item
      for (const item of formData.items) {
        if (!item.materialId || item.requested <= 0) continue;

        // Check stock availability
        if (item.requested > item.available) {
          throw new Error(`Estoque insuficiente para ${item.materialName}. Disponível: ${item.available}`);
        }

        // 1. Create movement record
        const { data: movData, error: movError } = await supabase
          .from("movimentacao")
          .insert({
            tipo_mov: "saida",
            id_material: item.materialId,
            quantidade: item.requested,
            id_local_origem: formData.locationId,
            id_lote: item.loteId || null,
            id_usuario: user.id,
            observacao: formData.observacao || null,
          })
          .select("id")
          .single();

        if (movError) {
          throw new Error(`Erro ao registrar movimento: ${movError.message}`);
        }

        // 2. Create OS exit link
        const { error: osError } = await supabase
          .from("mov_saida_os")
          .insert({
            id_mov: movData.id,
            id_os: formData.osId || null,
            tipo_baixa: formData.tipoBaixa,
            id_responsavel_retirada: formData.responsavelId || null,
          });

        if (osError) {
          console.error("Erro ao vincular OS:", osError);
        }

        // 3. Update stock balance
        const { data: existingStock } = await supabase
          .from("estoque_saldo")
          .select("id, saldo_atual")
          .eq("id_material", item.materialId)
          .eq("id_local", formData.locationId)
          .maybeSingle();

        if (existingStock) {
          const newBalance = Number(existingStock.saldo_atual) - item.requested;
          
          const { error: updateError } = await supabase
            .from("estoque_saldo")
            .update({
              saldo_atual: Math.max(0, newBalance),
            })
            .eq("id", existingStock.id);

          if (updateError) {
            console.error("Erro ao atualizar estoque:", updateError);
          }
        }

        results.push(movData);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      queryClient.invalidateQueries({ queryKey: ["estoque-disponivel"] });
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
      toast({
        title: "Saída registrada!",
        description: "Os materiais foram baixados do estoque com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar saída",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

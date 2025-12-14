import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EntryItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  lot?: string;
  expiryDate?: string;
}

export interface EntradaFormData {
  nfNumber: string;
  nfDate: string;
  supplierId: string;
  locationId: string;
  items: EntryItem[];
  observacao?: string;
}

export function useFornecedores() {
  return useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("id, razao_social, nome_fantasia, cnpj")
        .eq("ativo", true)
        .order("razao_social");

      if (error) throw error;
      return data;
    },
  });
}

export function useLocalizacoes() {
  return useQuery({
    queryKey: ["localizacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("localizacao_fisica")
        .select("id, nome_local, descricao, id_obra")
        .order("nome_local");

      if (error) throw error;
      return data;
    },
  });
}

export function useMateriaisParaEntrada() {
  return useQuery({
    queryKey: ["materiais-entrada"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materiais")
        .select(`
          id,
          codigo,
          nome_material,
          id_unidade_padrao,
          unidades_medida:id_unidade_padrao (
            id,
            sigla,
            descricao
          )
        `)
        .eq("ativo", true)
        .order("nome_material");

      if (error) throw error;
      return data;
    },
  });
}

export function useRegistrarEntrada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: EntradaFormData) => {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("Usuário não autenticado");
      }

      const results = [];

      // Process each item
      for (const item of formData.items) {
        if (!item.materialId || item.quantity <= 0) continue;

        // 1. Create lot if provided
        let loteId: string | null = null;
        if (item.lot) {
          const { data: loteData, error: loteError } = await supabase
            .from("lotes")
            .insert({
              id_material: item.materialId,
              num_lote: item.lot,
              quantidade_inicial: item.quantity,
              data_validade: item.expiryDate || null,
            })
            .select("id")
            .single();

          if (loteError) {
            console.error("Erro ao criar lote:", loteError);
          } else {
            loteId = loteData.id;
          }
        }

        // 2. Create movement record
        const { data: movData, error: movError } = await supabase
          .from("movimentacao")
          .insert({
            tipo_mov: "entrada",
            id_material: item.materialId,
            quantidade: item.quantity,
            custo_unitario: item.unitCost,
            id_local_destino: formData.locationId,
            id_lote: loteId,
            id_usuario: user.id,
            observacao: formData.observacao || null,
          })
          .select("id")
          .single();

        if (movError) {
          throw new Error(`Erro ao registrar movimento: ${movError.message}`);
        }

        // 3. Create NF entry link
        const { error: nfError } = await supabase
          .from("mov_entrada_nf")
          .insert({
            id_mov: movData.id,
            num_nf: formData.nfNumber,
            data_recebimento: formData.nfDate,
            id_fornecedor: formData.supplierId || null,
          });

        if (nfError) {
          console.error("Erro ao vincular NF:", nfError);
        }

        // 4. Update stock balance (upsert)
        const { data: existingStock } = await supabase
          .from("estoque_saldo")
          .select("id, saldo_atual, custo_medio")
          .eq("id_material", item.materialId)
          .eq("id_local", formData.locationId)
          .maybeSingle();

        if (existingStock) {
          // Calculate new weighted average cost
          const currentQty = Number(existingStock.saldo_atual) || 0;
          const currentCost = Number(existingStock.custo_medio) || 0;
          const newQty = item.quantity;
          const newCost = item.unitCost;
          
          const totalQty = currentQty + newQty;
          const newAvgCost = totalQty > 0 
            ? ((currentQty * currentCost) + (newQty * newCost)) / totalQty 
            : newCost;

          const { error: updateError } = await supabase
            .from("estoque_saldo")
            .update({
              saldo_atual: totalQty,
              custo_medio: newAvgCost,
            })
            .eq("id", existingStock.id);

          if (updateError) {
            console.error("Erro ao atualizar estoque:", updateError);
          }
        } else {
          // Create new stock record
          const { error: insertError } = await supabase
            .from("estoque_saldo")
            .insert({
              id_material: item.materialId,
              id_local: formData.locationId,
              id_lote: loteId,
              saldo_atual: item.quantity,
              custo_medio: item.unitCost,
            });

          if (insertError) {
            console.error("Erro ao criar estoque:", insertError);
          }
        }

        results.push(movData);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
      toast({
        title: "Entrada registrada!",
        description: "Os materiais foram adicionados ao estoque com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar entrada",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

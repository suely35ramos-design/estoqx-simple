import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Material, MaterialInsert, MaterialUpdate, UnidadeMedida } from "@/types/database";
import { toast } from "sonner";

// Fetch all materials with stock info
export function useMateriais() {
  return useQuery({
    queryKey: ["materiais"],
    queryFn: async () => {
      // Fetch materials
      const { data: materiais, error: materiaisError } = await supabase
        .from("materiais")
        .select("*")
        .eq("ativo", true)
        .order("nome_material");

      if (materiaisError) throw materiaisError;

      // Fetch stock balances
      const { data: saldos, error: saldosError } = await supabase
        .from("estoque_saldo")
        .select("id_material, saldo_atual, custo_medio, id_local");

      if (saldosError) throw saldosError;

      // Fetch units
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_medida")
        .select("*");

      if (unidadesError) throw unidadesError;

      // Fetch locations
      const { data: locais, error: locaisError } = await supabase
        .from("localizacao_fisica")
        .select("*");

      if (locaisError) throw locaisError;

      // Create lookup maps
      const unidadesMap = new Map(unidades?.map((u: UnidadeMedida) => [u.id, u]));
      const locaisMap = new Map(locais?.map((l: any) => [l.id, l.nome_local]));

      // Combine materials with their stock info
      const materiaisComSaldo = materiais?.map((material: Material) => {
        const materialSaldos = saldos?.filter((s: any) => s.id_material === material.id) || [];
        const saldoTotal = materialSaldos.reduce((acc: number, s: any) => acc + Number(s.saldo_atual || 0), 0);
        const custoMedio = materialSaldos.length > 0 
          ? materialSaldos.reduce((acc: number, s: any) => acc + Number(s.custo_medio || 0), 0) / materialSaldos.length 
          : 0;
        const localizacoes = [...new Set(materialSaldos.map((s: any) => locaisMap.get(s.id_local) || ""))].filter(Boolean);

        return {
          ...material,
          unidade: material.id_unidade_padrao ? unidadesMap.get(material.id_unidade_padrao) : null,
          saldo_total: saldoTotal,
          custo_medio: custoMedio,
          localizacoes,
        };
      });

      return materiaisComSaldo || [];
    },
  });
}

// Fetch single material
export function useMaterial(id: string | null) {
  return useQuery({
    queryKey: ["material", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("materiais")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Material | null;
    },
    enabled: !!id,
  });
}

// Fetch unidades de medida
export function useUnidadesMedida() {
  return useQuery({
    queryKey: ["unidades_medida"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_medida")
        .select("*")
        .order("sigla");

      if (error) throw error;
      return data as UnidadeMedida[];
    },
  });
}

// Create material
export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (material: MaterialInsert) => {
      const { data, error } = await supabase
        .from("materiais")
        .insert(material)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      toast.success("Material criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar material: ${error.message}`);
    },
  });
}

// Update material
export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MaterialUpdate }) => {
      const { data: updated, error } = await supabase
        .from("materiais")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      toast.success("Material atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar material: ${error.message}`);
    },
  });
}

// Delete (soft delete) material
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("materiais")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      toast.success("Material removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover material: ${error.message}`);
    },
  });
}

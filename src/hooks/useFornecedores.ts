import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Fornecedor {
  id: string;
  razao_social: string;
  cnpj: string | null;
  contato_nome: string | null;
  telefone: string | null;
  email: string | null;
  nome_fantasia: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FornecedorInsert {
  razao_social: string;
  cnpj?: string | null;
  contato_nome?: string | null;
  telefone?: string | null;
  email?: string | null;
  nome_fantasia?: string | null;
  ativo?: boolean;
}

export function useFornecedoresList() {
  return useQuery({
    queryKey: ["fornecedores-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("razao_social");

      if (error) throw error;
      return data as Fornecedor[];
    },
  });
}

export function useCreateFornecedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fornecedor: FornecedorInsert) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .insert(fornecedor)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores-list"] });
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Fornecedor cadastrado",
        description: "O fornecedor foi cadastrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFornecedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Fornecedor> & { id: string }) => {
      const { data: updated, error } = await supabase
        .from("fornecedores")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores-list"] });
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Fornecedor atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFornecedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores-list"] });
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Fornecedor removido",
        description: "O fornecedor foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

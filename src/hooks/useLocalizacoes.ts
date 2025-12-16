import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Localizacao {
  id: string;
  nome_local: string;
  descricao: string | null;
  capacidade_m3: number | null;
  id_obra: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalizacaoInsert {
  nome_local: string;
  descricao?: string | null;
  capacidade_m3?: number | null;
  id_obra?: string | null;
}

export function useLocalizacoesList() {
  return useQuery({
    queryKey: ["localizacoes-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("localizacao_fisica")
        .select("*")
        .order("nome_local");

      if (error) throw error;
      return data as Localizacao[];
    },
  });
}

export function useObras() {
  return useQuery({
    queryKey: ["obras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("id, nome_obra")
        .order("nome_obra");

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateLocalizacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (localizacao: LocalizacaoInsert) => {
      const { data, error } = await supabase
        .from("localizacao_fisica")
        .insert(localizacao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["localizacoes-list"] });
      queryClient.invalidateQueries({ queryKey: ["localizacoes"] });
      toast({
        title: "Local cadastrado",
        description: "O local de armazenamento foi cadastrado com sucesso.",
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

export function useUpdateLocalizacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Localizacao> & { id: string }) => {
      const { data: updated, error } = await supabase
        .from("localizacao_fisica")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["localizacoes-list"] });
      queryClient.invalidateQueries({ queryKey: ["localizacoes"] });
      toast({
        title: "Local atualizado",
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

export function useDeleteLocalizacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("localizacao_fisica")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["localizacoes-list"] });
      queryClient.invalidateQueries({ queryKey: ["localizacoes"] });
      toast({
        title: "Local removido",
        description: "O local de armazenamento foi removido com sucesso.",
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

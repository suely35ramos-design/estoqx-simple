import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Configuracao {
  id: string;
  chave: string;
  valor: unknown;
  descricao: string | null;
}

export function useConfiguracoes() {
  return useQuery({
    queryKey: ["configuracoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*");

      if (error) throw error;
      return data as Configuracao[];
    },
  });
}

export function useConfiguracao(chave: string) {
  return useQuery({
    queryKey: ["configuracao", chave],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .eq("chave", chave)
        .maybeSingle();

      if (error) throw error;
      return data as Configuracao | null;
    },
  });
}

export function useUpdateConfiguracao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chave, valor }: { chave: string; valor: unknown }) => {
      const { data, error } = await supabase
        .from("configuracoes")
        .update({ valor: JSON.stringify(valor) })
        .eq("chave", chave)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      queryClient.invalidateQueries({ queryKey: ["configuracao", variables.chave] });
      toast({
        title: "Configuração salva!",
        description: "A configuração foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

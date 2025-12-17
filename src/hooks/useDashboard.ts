import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Total de materiais ativos
      const { count: totalMateriais } = await supabase
        .from("materiais")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true);

      // Total em estoque (soma de saldos)
      const { data: saldoData } = await supabase
        .from("estoque_saldo")
        .select("saldo_atual, custo_medio");

      const totalEstoqueValor = saldoData?.reduce((acc, item) => {
        return acc + (item.saldo_atual * (item.custo_medio || 0));
      }, 0) || 0;

      const totalItens = saldoData?.reduce((acc, item) => acc + item.saldo_atual, 0) || 0;

      // Entradas hoje
      const { data: entradasHoje } = await supabase
        .from("movimentacao")
        .select("quantidade, custo_unitario")
        .eq("tipo_mov", "entrada")
        .gte("data_mov", todayISO);

      const totalEntradasHoje = entradasHoje?.length || 0;
      const valorEntradasHoje = entradasHoje?.reduce((acc, item) => {
        return acc + (item.quantidade * (item.custo_unitario || 0));
      }, 0) || 0;

      // Saídas hoje
      const { data: saidasHoje } = await supabase
        .from("movimentacao")
        .select("id")
        .eq("tipo_mov", "saida")
        .gte("data_mov", todayISO);

      const totalSaidasHoje = saidasHoje?.length || 0;

      // Ordens de serviço ativas
      const { count: osAtivas } = await supabase
        .from("ordens_servico")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativa");

      // Alertas - materiais abaixo do estoque mínimo
      const { data: alertasData } = await supabase
        .from("materiais")
        .select(`
          id,
          nome_material,
          estoque_minimo,
          estoque_saldo (saldo_atual)
        `)
        .eq("ativo", true)
        .not("estoque_minimo", "is", null);

      const alertasCriticos = alertasData?.filter(m => {
        const saldoTotal = m.estoque_saldo?.reduce((acc: number, s: any) => acc + s.saldo_atual, 0) || 0;
        return saldoTotal < (m.estoque_minimo || 0) * 0.25;
      }).length || 0;

      const alertasAtencao = alertasData?.filter(m => {
        const saldoTotal = m.estoque_saldo?.reduce((acc: number, s: any) => acc + s.saldo_atual, 0) || 0;
        return saldoTotal >= (m.estoque_minimo || 0) * 0.25 && saldoTotal < (m.estoque_minimo || 0);
      }).length || 0;

      return {
        totalEstoqueValor,
        totalItens: Math.round(totalItens),
        totalMateriais: totalMateriais || 0,
        totalEntradasHoje,
        valorEntradasHoje,
        totalSaidasHoje,
        osAtivas: osAtivas || 0,
        alertasCriticos,
        alertasAtencao,
        totalAlertas: alertasCriticos + alertasAtencao,
      };
    },
  });
}

export function useRecentMovements() {
  return useQuery({
    queryKey: ["recent-movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movimentacao")
        .select(`
          id,
          tipo_mov,
          quantidade,
          data_mov,
          observacao,
          id_usuario,
          materiais (
            nome_material,
            unidades_medida (sigla)
          )
        `)
        .order("data_mov", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Buscar nomes dos usuários separadamente
      const userIds = [...new Set(data?.map(m => m.id_usuario).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nome")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.nome]) || []);

      return data?.map(mov => ({
        id: mov.id,
        type: mov.tipo_mov as "entrada" | "saida" | "devolucao" | "transferencia",
        material: mov.materiais?.nome_material || "Material desconhecido",
        quantity: mov.quantidade,
        unit: mov.materiais?.unidades_medida?.sigla || "UN",
        reference: mov.observacao || "-",
        user: profileMap.get(mov.id_usuario) || "Usuário",
        time: formatTimeAgo(mov.data_mov),
      })) || [];
    },
  });
}

export function useLowStockItems() {
  return useQuery({
    queryKey: ["low-stock-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materiais")
        .select(`
          id,
          nome_material,
          estoque_minimo,
          unidades_medida (sigla),
          estoque_saldo (saldo_atual)
        `)
        .eq("ativo", true)
        .not("estoque_minimo", "is", null);

      if (error) throw error;

      const lowStockItems = data
        ?.map(m => {
          const saldoTotal = m.estoque_saldo?.reduce((acc: number, s: any) => acc + s.saldo_atual, 0) || 0;
          const minimo = m.estoque_minimo || 0;
          
          if (saldoTotal < minimo) {
            return {
              id: m.id,
              name: m.nome_material,
              current: saldoTotal,
              minimum: minimo,
              unit: m.unidades_medida?.sigla || "UN",
              percentage: minimo > 0 ? Math.round((saldoTotal / minimo) * 100) : 0,
            };
          }
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => (a?.percentage || 0) - (b?.percentage || 0))
        .slice(0, 5);

      return lowStockItems || [];
    },
  });
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("pt-BR");
}

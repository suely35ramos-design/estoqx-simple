import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentMovements } from "@/components/dashboard/RecentMovements";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";

export default function Index() {
  const { data: stats, isLoading } = useDashboardStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Bem-vindo de volta! Aqui está o resumo do seu estoque."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <StatCard
              title="Total em Estoque"
              value={formatCurrency(stats?.totalEstoqueValor || 0)}
              subtitle={`${stats?.totalItens?.toLocaleString("pt-BR") || 0} itens em ${stats?.totalMateriais || 0} materiais`}
              icon={Package}
              variant="default"
            />
            <StatCard
              title="Entradas Hoje"
              value={stats?.totalEntradasHoje || 0}
              subtitle={`${formatCurrency(stats?.valorEntradasHoje || 0)} em materiais`}
              icon={ArrowDownToLine}
              variant="success"
            />
            <StatCard
              title="Saídas Hoje"
              value={stats?.totalSaidasHoje || 0}
              subtitle={`${stats?.osAtivas || 0} Ordens de Serviço ativas`}
              icon={ArrowUpFromLine}
              variant="accent"
            />
            <StatCard
              title="Alertas Ativos"
              value={stats?.totalAlertas || 0}
              subtitle={`${stats?.alertasCriticos || 0} críticos, ${stats?.alertasAtencao || 0} atenção`}
              icon={AlertTriangle}
              variant="warning"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Movements */}
        <div className="lg:col-span-2">
          <RecentMovements />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <LowStockAlert />
        </div>
      </div>
    </MainLayout>
  );
}

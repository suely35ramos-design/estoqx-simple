import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentMovements } from "@/components/dashboard/RecentMovements";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Package, TrendingUp, AlertTriangle, Users, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function Index() {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Bem-vindo de volta! Aqui está o resumo do seu estoque."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total em Estoque"
          value="R$ 847.520"
          subtitle="2.847 itens ativos"
          icon={Package}
          trend={{ value: 12.5, label: "vs. mês anterior" }}
          variant="default"
        />
        <StatCard
          title="Entradas Hoje"
          value="24"
          subtitle="R$ 45.890 em materiais"
          icon={ArrowDownToLine}
          variant="success"
        />
        <StatCard
          title="Saídas Hoje"
          value="18"
          subtitle="5 Ordens de Serviço"
          icon={ArrowUpFromLine}
          variant="accent"
        />
        <StatCard
          title="Alertas Ativos"
          value="7"
          subtitle="3 críticos, 4 atenção"
          icon={AlertTriangle}
          variant="warning"
        />
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

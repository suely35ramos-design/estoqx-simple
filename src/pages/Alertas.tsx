import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Package,
  Clock,
  Wrench,
  TrendingUp,
  CheckCircle,
  X,
  Bell,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "stock" | "expiry" | "maintenance" | "efficiency";
type AlertLevel = "critical" | "warning" | "info";

interface Alert {
  id: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  description: string;
  timestamp: string;
  actionLabel?: string;
  read: boolean;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "stock",
    level: "critical",
    title: "Estoque Crítico: Cimento CP-II",
    description: "Apenas 45 sacos restantes. Consumo médio: 25 SC/dia. Estimativa: 2 dias.",
    timestamp: "10 minutos atrás",
    actionLabel: "Gerar Requisição",
    read: false,
  },
  {
    id: "2",
    type: "expiry",
    level: "critical",
    title: "Validade Crítica: Argamassa AC-III",
    description: "Lote L2024-045 vence em 5 dias. 32 sacos disponíveis.",
    timestamp: "1 hora atrás",
    actionLabel: "Priorizar Uso",
    read: false,
  },
  {
    id: "3",
    type: "maintenance",
    level: "warning",
    title: "Manutenção Preventiva: Betoneira 400L",
    description: "Calibração programada para 18/12/2024. Agendar com fornecedor.",
    timestamp: "3 horas atrás",
    actionLabel: "Ver Detalhes",
    read: false,
  },
  {
    id: "4",
    type: "stock",
    level: "warning",
    title: "Ponto de Pedido: Vergalhão CA-50 8mm",
    description: "Estoque em 180 barras. Mínimo configurado: 200 barras.",
    timestamp: "5 horas atrás",
    actionLabel: "Gerar Requisição",
    read: true,
  },
  {
    id: "5",
    type: "efficiency",
    level: "info",
    title: "Desvio de Consumo: OS-2024-089",
    description: "Consumo de areia 15% acima do orçado. Verificar aplicação.",
    timestamp: "1 dia atrás",
    actionLabel: "Analisar",
    read: true,
  },
  {
    id: "6",
    type: "maintenance",
    level: "info",
    title: "Ferramenta Devolvida com Atraso",
    description: "Furadeira Bosch (FER-001) devolvida 2 dias após prazo por João Silva.",
    timestamp: "2 dias atrás",
    read: true,
  },
];

const typeConfig = {
  stock: { icon: Package, label: "Estoque" },
  expiry: { icon: Clock, label: "Validade" },
  maintenance: { icon: Wrench, label: "Manutenção" },
  efficiency: { icon: TrendingUp, label: "Eficiência" },
};

const levelConfig = {
  critical: {
    bg: "bg-destructive/10 border-destructive/30",
    icon: "text-destructive",
    badge: "bg-destructive text-destructive-foreground",
  },
  warning: {
    bg: "bg-warning/10 border-warning/30",
    icon: "text-warning",
    badge: "bg-warning text-warning-foreground",
  },
  info: {
    bg: "bg-info/10 border-info/30",
    icon: "text-info",
    badge: "bg-info text-info-foreground",
  },
};

export default function Alertas() {
  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.level === "critical").length;

  return (
    <MainLayout
      title="Alertas e Notificações"
      subtitle="Acompanhe pontos de atenção que exigem ação"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Críticos</p>
              <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-destructive/50" />
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning">Atenção</p>
              <p className="text-3xl font-bold text-warning">
                {alerts.filter((a) => a.level === "warning").length}
              </p>
            </div>
            <Bell className="w-10 h-10 text-warning/50" />
          </div>
        </div>

        <div className="bg-info/10 border border-info/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info">Informativos</p>
              <p className="text-3xl font-bold text-info">
                {alerts.filter((a) => a.level === "info").length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-info/50" />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Todos os Alertas
            </h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount} não lidos
            </p>
          </div>
          <Button variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar todos como lidos
          </Button>
        </div>

        <div className="divide-y divide-border">
          {alerts.map((alert, index) => {
            const type = typeConfig[alert.type];
            const level = levelConfig[alert.level];
            const TypeIcon = type.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 transition-colors animate-fade-in",
                  !alert.read && "bg-muted/30"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      level.bg
                    )}
                  >
                    <TypeIcon className={cn("w-6 h-6", level.icon)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-xs font-semibold uppercase",
                              level.badge
                            )}
                          >
                            {alert.level === "critical"
                              ? "Crítico"
                              : alert.level === "warning"
                              ? "Atenção"
                              : "Info"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {type.label}
                          </span>
                          {!alert.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <h4 className="font-semibold text-foreground">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {alert.timestamp}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {alert.actionLabel && (
                          <Button variant="default" size="sm">
                            {alert.actionLabel}
                          </Button>
                        )}
                        <Button variant="ghost" size="icon-sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

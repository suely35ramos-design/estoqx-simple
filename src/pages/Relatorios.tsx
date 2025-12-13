import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  lastGenerated?: string;
}

const reports: ReportCard[] = [
  {
    id: "1",
    name: "Curva ABC de Materiais",
    description: "Classificação de itens por valor de consumo (A=80%, B=15%, C=5%)",
    icon: PieChart,
    category: "Estratégico",
    lastGenerated: "Há 2 dias",
  },
  {
    id: "2",
    name: "Consumo por OS",
    description: "Materiais utilizados por Ordem de Serviço no período selecionado",
    icon: BarChart3,
    category: "Operacional",
    lastGenerated: "Hoje",
  },
  {
    id: "3",
    name: "Tempo Médio de Entrega (TME)",
    description: "Análise do tempo entre requisição e recebimento por fornecedor",
    icon: TrendingUp,
    category: "Fornecedores",
  },
  {
    id: "4",
    name: "Desvio de Consumo",
    description: "Comparativo entre consumo real vs. orçado por frente de trabalho",
    icon: BarChart3,
    category: "Eficiência",
    lastGenerated: "Há 1 semana",
  },
  {
    id: "5",
    name: "Inventário Atual",
    description: "Posição de estoque com custo médio ponderado e valor total",
    icon: FileText,
    category: "Financeiro",
    lastGenerated: "Ontem",
  },
  {
    id: "6",
    name: "Movimentações do Período",
    description: "Histórico completo de entradas, saídas e transferências",
    icon: FileText,
    category: "Auditoria",
    lastGenerated: "Hoje",
  },
];

const categoryColors: Record<string, string> = {
  Estratégico: "bg-primary/10 text-primary",
  Operacional: "bg-accent/10 text-accent",
  Fornecedores: "bg-info/10 text-info",
  Eficiência: "bg-warning/10 text-warning",
  Financeiro: "bg-success/10 text-success",
  Auditoria: "bg-muted text-muted-foreground",
};

export default function Relatorios() {
  return (
    <MainLayout
      title="Relatórios"
      subtitle="Gere análises e relatórios para tomada de decisão"
    >
      {/* Quick Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
          <Button variant="secondary" size="sm" className="rounded-md">
            Últimos 7 dias
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md">
            Últimos 30 dias
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md">
            Este mês
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md">
            Personalizado
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Selecionar Data
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, index) => {
          const Icon = report.icon;

          return (
            <div
              key={report.id}
              className="bg-card rounded-xl border shadow-card p-5 hover:shadow-elevated transition-all duration-300 cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    categoryColors[report.category]
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    categoryColors[report.category]
                  )}
                >
                  {report.category}
                </span>
              </div>

              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {report.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {report.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {report.lastGenerated ? (
                    <span>Última geração: {report.lastGenerated}</span>
                  ) : (
                    <span>Nunca gerado</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                >
                  Gerar
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-card rounded-xl border shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Resumo Rápido
            </h3>
            <p className="text-sm text-muted-foreground">
              Indicadores principais dos últimos 30 dias
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Resumo
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              Acuracidade de Estoque
            </p>
            <p className="text-2xl font-bold text-foreground">97.8%</p>
            <p className="text-xs text-success">+2.3% vs. mês anterior</p>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              Valor Total em Estoque
            </p>
            <p className="text-2xl font-bold text-foreground">R$ 847K</p>
            <p className="text-xs text-success">+12.5% vs. mês anterior</p>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              TME (Tempo Médio Entrega)
            </p>
            <p className="text-2xl font-bold text-foreground">4.2 dias</p>
            <p className="text-xs text-destructive">+0.5 dias vs. mês anterior</p>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              Itens Classe A (Curva ABC)
            </p>
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">
              80% do valor consumido
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

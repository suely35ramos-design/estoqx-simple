import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Wrench,
  QrCode,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  code: string;
  name: string;
  category: string;
  status: "available" | "borrowed" | "maintenance";
  borrowedBy?: string;
  borrowedDate?: string;
  dueDate?: string;
  nextMaintenance?: string;
}

const tools: Tool[] = [
  {
    id: "1",
    code: "FER-001",
    name: "Furadeira Bosch GSB 13RE",
    category: "Elétrica",
    status: "borrowed",
    borrowedBy: "João Silva",
    borrowedDate: "2024-12-10",
    dueDate: "2024-12-15",
  },
  {
    id: "2",
    code: "FER-002",
    name: "Martelete Dewalt D25133K",
    category: "Elétrica",
    status: "available",
    nextMaintenance: "2024-12-20",
  },
  {
    id: "3",
    code: "FER-003",
    name: "Serra Circular Makita 5007N",
    category: "Elétrica",
    status: "maintenance",
  },
  {
    id: "4",
    code: "FER-004",
    name: "Nível a Laser Bosch GLL 2-12",
    category: "Medição",
    status: "available",
  },
  {
    id: "5",
    code: "FER-005",
    name: "Betoneira 400L",
    category: "Pesada",
    status: "borrowed",
    borrowedBy: "Carlos Souza",
    borrowedDate: "2024-12-08",
    dueDate: "2024-12-12",
  },
  {
    id: "6",
    code: "FER-006",
    name: "Compactador de Solo",
    category: "Pesada",
    status: "available",
    nextMaintenance: "2024-12-18",
  },
];

const statusConfig = {
  available: {
    label: "Disponível",
    icon: CheckCircle,
    class: "bg-success/15 text-success",
  },
  borrowed: {
    label: "Emprestado",
    icon: User,
    class: "bg-warning/15 text-warning",
  },
  maintenance: {
    label: "Em Manutenção",
    icon: Wrench,
    class: "bg-info/15 text-info",
  },
};

export default function Ferramentas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredTools = tools.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !selectedFilter || t.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    available: tools.filter((t) => t.status === "available").length,
    borrowed: tools.filter((t) => t.status === "borrowed").length,
    maintenance: tools.filter((t) => t.status === "maintenance").length,
  };

  return (
    <MainLayout
      title="Ferramentas e Equipamentos"
      subtitle="Controle de empréstimo, manutenção e rastreamento de ativos"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = stats[key as keyof typeof stats];
          const isActive = selectedFilter === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedFilter(isActive ? null : key)}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("w-5 h-5", !isActive && config.class.split(" ")[1])} />
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <p className={cn("text-sm font-medium", !isActive && "text-muted-foreground")}>
                {config.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ferramenta ou código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="w-4 h-4 mr-2" />
            Escanear QR
          </Button>
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-2" />
            Nova Ferramenta
          </Button>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, index) => {
          const status = statusConfig[tool.status];
          const StatusIcon = status.icon;
          const isOverdue =
            tool.status === "borrowed" &&
            tool.dueDate &&
            new Date(tool.dueDate) < new Date();

          return (
            <div
              key={tool.id}
              className="bg-card rounded-xl border shadow-card p-5 hover:shadow-elevated transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {tool.code}
                    </p>
                    <h4 className="font-semibold text-foreground line-clamp-1">
                      {tool.name}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {tool.category}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                      status.class
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>

                {tool.status === "borrowed" && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{tool.borrowedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className={cn(isOverdue && "text-destructive font-medium")}>
                        {isOverdue && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        Devolução: {new Date(tool.dueDate!).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                )}

                {tool.status === "available" && tool.nextMaintenance && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Próx. manutenção:{" "}
                      {new Date(tool.nextMaintenance).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {tool.status === "available" ? (
                    <Button variant="accent" size="sm" className="flex-1">
                      Emprestar
                    </Button>
                  ) : tool.status === "borrowed" ? (
                    <Button variant="default" size="sm" className="flex-1">
                      Devolver
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1">
                      Finalizar Manutenção
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Detalhes
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}

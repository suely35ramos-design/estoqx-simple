import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LowStockItem {
  id: string;
  name: string;
  current: number;
  minimum: number;
  unit: string;
  daysToStockout: number;
}

const lowStockItems: LowStockItem[] = [
  {
    id: "1",
    name: "Cimento CP-II 50kg",
    current: 45,
    minimum: 100,
    unit: "SC",
    daysToStockout: 2,
  },
  {
    id: "2",
    name: "Vergalhão CA-50 8mm",
    current: 80,
    minimum: 200,
    unit: "BR",
    daysToStockout: 5,
  },
  {
    id: "3",
    name: "Areia Média",
    current: 12,
    minimum: 30,
    unit: "M³",
    daysToStockout: 3,
  },
];

export function LowStockAlert() {
  return (
    <div className="bg-card rounded-xl border shadow-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Estoque Crítico
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Materiais abaixo do ponto de pedido
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning text-xs font-semibold">
          {lowStockItems.length} itens
        </span>
      </div>

      <div className="divide-y divide-border">
        {lowStockItems.map((item, index) => {
          const percentage = Math.round((item.current / item.minimum) * 100);
          const isUrgent = item.daysToStockout <= 2;

          return (
            <div
              key={item.id}
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.current} / {item.minimum} {item.unit}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-semibold",
                    isUrgent
                      ? "bg-destructive/15 text-destructive"
                      : "bg-warning/15 text-warning"
                  )}
                >
                  {item.daysToStockout}d para acabar
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    percentage < 25
                      ? "bg-destructive"
                      : percentage < 50
                      ? "bg-warning"
                      : "bg-success"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="warning" className="w-full" size="sm">
          Gerar Requisição de Compra
        </Button>
      </div>
    </div>
  );
}

import { AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLowStockItems } from "@/hooks/useDashboard";
import { Link } from "react-router-dom";

export function LowStockAlert() {
  const { data: lowStockItems, isLoading } = useLowStockItems();

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
        {lowStockItems && lowStockItems.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning text-xs font-semibold">
            {lowStockItems.length} itens
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : lowStockItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <CheckCircle2 className="w-10 h-10 mb-2 text-success" />
          <p className="text-sm">Todos os materiais em níveis adequados</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {lowStockItems?.map((item, index) => {
            const isUrgent = (item?.percentage || 0) < 25;

            return (
              <div
                key={item?.id}
                className="p-4 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{item?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item?.current} / {item?.minimum} {item?.unit}
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
                    {item?.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      (item?.percentage || 0) < 25
                        ? "bg-destructive"
                        : (item?.percentage || 0) < 50
                        ? "bg-warning"
                        : "bg-success"
                    )}
                    style={{ width: `${item?.percentage || 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-4 border-t border-border">
        <Link to="/alertas">
          <Button variant="warning" className="w-full" size="sm">
            Ver Todos os Alertas
          </Button>
        </Link>
      </div>
    </div>
  );
}

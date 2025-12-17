import { ArrowDownToLine, ArrowUpFromLine, RotateCcw, MoveRight, Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecentMovements } from "@/hooks/useDashboard";
import { Link } from "react-router-dom";

type MovementType = "entrada" | "saida" | "devolucao" | "transferencia";

const typeConfig = {
  entrada: {
    icon: ArrowDownToLine,
    label: "Entrada",
    color: "text-success",
    bg: "bg-success/10",
  },
  saida: {
    icon: ArrowUpFromLine,
    label: "Saída",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  devolucao: {
    icon: RotateCcw,
    label: "Devolução",
    color: "text-info",
    bg: "bg-info/10",
  },
  transferencia: {
    icon: MoveRight,
    label: "Transferência",
    color: "text-warning",
    bg: "bg-warning/10",
  },
};

export function RecentMovements() {
  const { data: movements, isLoading } = useRecentMovements();

  return (
    <div className="bg-card rounded-xl border shadow-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-lg text-foreground">
          Movimentações Recentes
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Últimas entradas, saídas e transferências
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : movements?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Package className="w-10 h-10 mb-2" />
          <p>Nenhuma movimentação registrada</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {movements?.map((movement, index) => {
            const config = typeConfig[movement.type];
            const Icon = config.icon;

            return (
              <div
                key={movement.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {movement.material}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {movement.reference} • {movement.user}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={cn("font-semibold tabular-nums", config.color)}>
                    {movement.type === "saida" ? "-" : "+"}
                    {movement.quantity} {movement.unit}
                  </p>
                  <p className="text-xs text-muted-foreground">{movement.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-4 border-t border-border">
        <Link 
          to="/entrada" 
          className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors block"
        >
          Ver todas as movimentações →
        </Link>
      </div>
    </div>
  );
}

import { ArrowDownToLine, ArrowUpFromLine, RotateCcw, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MovementType = "entrada" | "saida" | "devolucao" | "transferencia";

interface Movement {
  id: string;
  type: MovementType;
  material: string;
  quantity: number;
  unit: string;
  reference: string;
  user: string;
  time: string;
}

const movements: Movement[] = [
  {
    id: "1",
    type: "entrada",
    material: "Cimento CP-II 50kg",
    quantity: 200,
    unit: "SC",
    reference: "NF 45892",
    user: "João Silva",
    time: "10 min",
  },
  {
    id: "2",
    type: "saida",
    material: "Vergalhão CA-50 10mm",
    quantity: 150,
    unit: "BR",
    reference: "OS-2024-089",
    user: "Carlos Souza",
    time: "25 min",
  },
  {
    id: "3",
    type: "devolucao",
    material: "Argamassa AC-III 20kg",
    quantity: 12,
    unit: "SC",
    reference: "OS-2024-085",
    user: "Maria Santos",
    time: "45 min",
  },
  {
    id: "4",
    type: "transferencia",
    material: "Bloco Cerâmico 9x19x19",
    quantity: 500,
    unit: "UN",
    reference: "Pátio 1 → Almox A",
    user: "Pedro Lima",
    time: "1h",
  },
  {
    id: "5",
    type: "saida",
    material: "Areia Média",
    quantity: 8,
    unit: "M³",
    reference: "OS-2024-091",
    user: "Ana Costa",
    time: "2h",
  },
];

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

      <div className="divide-y divide-border">
        {movements.map((movement, index) => {
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

      <div className="p-4 border-t border-border">
        <button className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todas as movimentações →
        </button>
      </div>
    </div>
  );
}

import { ArrowDownToLine, ArrowUpFromLine, Package, QrCode, ClipboardList, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  variant: "primary" | "accent" | "secondary";
}

const quickActions: QuickAction[] = [
  {
    id: "1",
    name: "Entrada de Material",
    description: "Registrar NF de entrada",
    icon: ArrowDownToLine,
    href: "/entrada",
    variant: "primary",
  },
  {
    id: "2",
    name: "Baixa de Material",
    description: "Vincular saída à OS",
    icon: ArrowUpFromLine,
    href: "/saida",
    variant: "accent",
  },
  {
    id: "3",
    name: "Inventário",
    description: "Contagem de estoque",
    icon: ClipboardList,
    href: "/inventario",
    variant: "secondary",
  },
  {
    id: "4",
    name: "Consulta Rápida",
    description: "Buscar por QR Code",
    icon: QrCode,
    href: "/consulta",
    variant: "secondary",
  },
];

const variantStyles = {
  primary:
    "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:shadow-lg",
  accent:
    "bg-gradient-to-br from-accent to-amber-400 text-accent-foreground hover:shadow-lg",
  secondary: "bg-card border border-border hover:border-primary/50 hover:shadow-md",
};

export function QuickActions() {
  return (
    <div className="bg-card rounded-xl border shadow-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-lg text-foreground">Ações Rápidas</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Operações do dia a dia
        </p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const isPrimary = action.variant !== "secondary";

          return (
            <a
              key={action.id}
              href={action.href}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 cursor-pointer group animate-scale-in",
                variantStyles[action.variant]
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110",
                  isPrimary
                    ? "bg-foreground/10"
                    : "bg-primary/10"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    isPrimary ? "" : "text-primary"
                  )}
                />
              </div>
              <span
                className={cn(
                  "font-semibold text-sm text-center",
                  !isPrimary && "text-foreground"
                )}
              >
                {action.name}
              </span>
              <span
                className={cn(
                  "text-xs text-center mt-1",
                  isPrimary ? "opacity-80" : "text-muted-foreground"
                )}
              >
                {action.description}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

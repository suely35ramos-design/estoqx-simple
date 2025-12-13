import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "accent" | "success" | "warning" | "destructive";
}

const variantStyles = {
  default: "bg-card",
  accent: "bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30",
  success: "bg-gradient-to-br from-success/20 to-success/5 border-success/30",
  warning: "bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30",
  destructive: "bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/30",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-accent",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trend.value >= 0 ? "text-success" : "text-destructive"
              )}
            >
              <span>
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl",
            iconStyles[variant]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

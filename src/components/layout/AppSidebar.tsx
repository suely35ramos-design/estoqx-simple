import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wrench,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Box,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Materiais", href: "/materiais", icon: Package },
  { name: "Entrada", href: "/entrada", icon: ArrowDownToLine },
  { name: "Saída", href: "/saida", icon: ArrowUpFromLine },
  { name: "Ferramentas", href: "/ferramentas", icon: Wrench },
  { name: "Alertas", href: "/alertas", icon: AlertTriangle },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

const secondaryNav = [
  { name: "Configurações", href: "/config", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out h-screen sticky top-0",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Box className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold tracking-tight">ESTOQX</h1>
              <p className="text-xs text-sidebar-foreground/60">Gestão de Estoque</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                {!collapsed && (
                  <span className="font-medium text-sm animate-fade-in">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-sidebar-border">
          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-transform duration-200",
                      !isActive && "group-hover:scale-110"
                    )}
                  />
                  {!collapsed && (
                    <span className="font-medium text-sm animate-fade-in">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}

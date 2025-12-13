import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar materiais, OS, NF..."
                className="pl-10 bg-muted/50 border-transparent focus:border-primary h-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </Button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

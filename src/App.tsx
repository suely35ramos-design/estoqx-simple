import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Materiais from "./pages/Materiais";
import Entrada from "./pages/Entrada";
import Saida from "./pages/Saida";
import Ferramentas from "./pages/Ferramentas";
import Alertas from "./pages/Alertas";
import Relatorios from "./pages/Relatorios";
import Config from "./pages/Config";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/entrada" element={<Entrada />} />
          <Route path="/saida" element={<Saida />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/config" element={<Config />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

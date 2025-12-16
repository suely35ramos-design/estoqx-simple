import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Materiais from "./pages/Materiais";
import Fornecedores from "./pages/Fornecedores";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/materiais" element={<ProtectedRoute><Materiais /></ProtectedRoute>} />
          <Route path="/fornecedores" element={<ProtectedRoute><Fornecedores /></ProtectedRoute>} />
          <Route path="/entrada" element={<ProtectedRoute><Entrada /></ProtectedRoute>} />
          <Route path="/saida" element={<ProtectedRoute><Saida /></ProtectedRoute>} />
          <Route path="/ferramentas" element={<ProtectedRoute><Ferramentas /></ProtectedRoute>} />
          <Route path="/alertas" element={<ProtectedRoute><Alertas /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
          <Route path="/config" element={<ProtectedRoute><Config /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

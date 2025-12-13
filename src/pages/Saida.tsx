import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Package,
  ClipboardList,
  CheckCircle2,
  Search,
  AlertTriangle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExitItem {
  id: string;
  materialId: string;
  materialName: string;
  requested: number;
  available: number;
  unit: string;
  lot?: string;
}

export default function Saida() {
  const [items, setItems] = useState<ExitItem[]>([
    {
      id: "1",
      materialId: "CIM-001",
      materialName: "Cimento CP-II 50kg",
      requested: 50,
      available: 245,
      unit: "SC",
      lot: "L2024-089",
    },
    {
      id: "2",
      materialId: "ARE-001",
      materialName: "Areia Média",
      requested: 5,
      available: 25,
      unit: "M³",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        materialId: "",
        materialName: "",
        requested: 0,
        available: 0,
        unit: "UN",
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <MainLayout
      title="Saída de Material"
      subtitle="Registre a baixa de materiais vinculando à Ordem de Serviço"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* OS Info Card */}
          <div className="bg-card rounded-xl border shadow-card p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-accent" />
              Dados da Ordem de Serviço
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="os-number">Número da OS *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a OS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="os-089">OS-2024-089 - Fundação Bloco A</SelectItem>
                    <SelectItem value="os-090">OS-2024-090 - Alvenaria Térreo</SelectItem>
                    <SelectItem value="os-091">OS-2024-091 - Estrutura 2º Pavimento</SelectItem>
                    <SelectItem value="os-092">OS-2024-092 - Instalações Hidráulicas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit-date">Data da Saída *</Label>
                <Input id="exit-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Equipe/Encarregado *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">João Silva - Fundações</SelectItem>
                    <SelectItem value="2">Carlos Souza - Alvenaria</SelectItem>
                    <SelectItem value="3">Pedro Lima - Estrutura</SelectItem>
                    <SelectItem value="4">Maria Santos - Acabamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit-type">Tipo de Baixa *</Label>
                <Select defaultValue="consumo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumo">Consumo</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="perda">Perda/Avaria</SelectItem>
                    <SelectItem value="amostra">Amostra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  placeholder="Informações adicionais sobre a saída..."
                />
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-card rounded-xl border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Materiais para Baixa
              </h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const isOverRequest = item.requested > item.available;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-lg border animate-scale-in",
                      isOverRequest
                        ? "bg-destructive/5 border-destructive/30"
                        : "bg-muted/30 border-border"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Item {index + 1}
                        </span>
                        {isOverRequest && (
                          <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            Estoque insuficiente
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Material *</Label>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar material..."
                            className="pl-8 h-9"
                            defaultValue={item.materialName}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Quantidade *</Label>
                        <Input
                          type="number"
                          className={cn("h-9", isOverRequest && "border-destructive")}
                          defaultValue={item.requested}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Disponível</Label>
                        <div className="h-9 px-3 flex items-center bg-muted rounded-md text-sm">
                          <span
                            className={cn(
                              "font-medium",
                              item.available < 50
                                ? "text-warning"
                                : "text-success"
                            )}
                          >
                            {item.available} {item.unit}
                          </span>
                        </div>
                      </div>

                      {item.lot && (
                        <div className="col-span-2 md:col-span-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-info/10 text-info text-xs font-medium">
                            <Package className="w-3 h-3" />
                            Lote: {item.lot} (FIFO)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border shadow-card p-6 sticky top-24">
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Resumo da Saída
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total de Itens</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Qtd. Total</span>
                <span className="font-medium">
                  {items.reduce((acc, i) => acc + i.requested, 0)} unidades
                </span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">OS Vinculada</p>
                <p className="font-semibold text-sm">OS-2024-089</p>
                <p className="text-xs text-muted-foreground">Fundação Bloco A</p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mb-6">
              <Label className="text-sm mb-2 block">Assinatura do Encarregado</Label>
              <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <User className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Toque para assinar
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="gradient-accent" className="w-full" size="lg">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirmar Saída
              </Button>
              <Button variant="outline" className="w-full">
                Salvar Rascunho
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              O estoque será baixado automaticamente após a confirmação.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

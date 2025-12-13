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
  Upload,
  Plus,
  Trash2,
  Package,
  FileText,
  CheckCircle2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EntryItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  lot?: string;
  expiryDate?: string;
}

export default function Entrada() {
  const [items, setItems] = useState<EntryItem[]>([
    {
      id: "1",
      materialId: "CIM-001",
      materialName: "Cimento CP-II 50kg",
      quantity: 100,
      unit: "SC",
      unitCost: 34.5,
      lot: "L2024-089",
      expiryDate: "2025-06-15",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        materialId: "",
        materialName: "",
        quantity: 0,
        unit: "UN",
        unitCost: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalValue = items.reduce(
    (acc, item) => acc + item.quantity * item.unitCost,
    0
  );

  return (
    <MainLayout
      title="Entrada de Material"
      subtitle="Registre a entrada de materiais vinculando à Nota Fiscal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* NF Info Card */}
          <div className="bg-card rounded-xl border shadow-card p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Dados da Nota Fiscal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nf-number">Número da NF *</Label>
                <Input id="nf-number" placeholder="Ex: 45892" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nf-date">Data de Recebimento *</Label>
                <Input id="nf-date" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Votorantim Cimentos</SelectItem>
                    <SelectItem value="2">ArcelorMittal</SelectItem>
                    <SelectItem value="3">Quartzolit</SelectItem>
                    <SelectItem value="4">Cerâmica Paulista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local de Armazenamento *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="almox-a">Almoxarifado A</SelectItem>
                    <SelectItem value="almox-b">Almoxarifado B</SelectItem>
                    <SelectItem value="patio-1">Pátio 1</SelectItem>
                    <SelectItem value="patio-2">Pátio 2</SelectItem>
                    <SelectItem value="patio-3">Pátio 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Upload da NF (PDF/Imagem)</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Arraste o arquivo ou{" "}
                    <span className="text-primary font-medium">clique para selecionar</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG ou JPG até 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-card rounded-xl border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Itens da Entrada
              </h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      Item {index + 1}
                    </span>
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
                        className="h-9"
                        defaultValue={item.quantity}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Custo Unit. *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        className="h-9"
                        defaultValue={item.unitCost}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Lote</Label>
                      <Input
                        className="h-9"
                        defaultValue={item.lot}
                        placeholder="Opcional"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Validade</Label>
                      <Input
                        type="date"
                        className="h-9"
                        defaultValue={item.expiryDate}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border shadow-card p-6 sticky top-24">
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Resumo da Entrada
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total de Itens</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Qtd. Total</span>
                <span className="font-medium">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} unidades
                </span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Total</span>
                <span className="text-xl font-bold text-foreground">
                  R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="gradient-accent" className="w-full" size="lg">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirmar Entrada
              </Button>
              <Button variant="outline" className="w-full">
                Salvar Rascunho
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              O estoque será atualizado automaticamente após a confirmação.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

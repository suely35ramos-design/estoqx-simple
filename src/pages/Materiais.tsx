import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Package,
  MoreVertical,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  avgCost: number;
  location: string;
  status: "normal" | "low" | "critical";
}

const materials: Material[] = [
  {
    id: "1",
    code: "CIM-001",
    name: "Cimento CP-II 50kg",
    category: "Cimento",
    unit: "SC",
    stock: 245,
    minStock: 100,
    avgCost: 34.5,
    location: "Almox A",
    status: "normal",
  },
  {
    id: "2",
    code: "VER-008",
    name: "Vergalhão CA-50 10mm",
    category: "Aço",
    unit: "BR",
    stock: 180,
    minStock: 200,
    avgCost: 45.0,
    location: "Pátio 1",
    status: "low",
  },
  {
    id: "3",
    code: "ARG-002",
    name: "Argamassa AC-III 20kg",
    category: "Argamassa",
    unit: "SC",
    stock: 15,
    minStock: 50,
    avgCost: 28.9,
    location: "Almox A",
    status: "critical",
  },
  {
    id: "4",
    code: "BLC-010",
    name: "Bloco Cerâmico 9x19x19",
    category: "Alvenaria",
    unit: "UN",
    stock: 4500,
    minStock: 2000,
    avgCost: 1.85,
    location: "Pátio 2",
    status: "normal",
  },
  {
    id: "5",
    code: "ARE-001",
    name: "Areia Média",
    category: "Agregados",
    unit: "M³",
    stock: 25,
    minStock: 30,
    avgCost: 120.0,
    location: "Pátio 3",
    status: "low",
  },
  {
    id: "6",
    code: "BRT-005",
    name: "Brita 1",
    category: "Agregados",
    unit: "M³",
    stock: 45,
    minStock: 25,
    avgCost: 95.0,
    location: "Pátio 3",
    status: "normal",
  },
];

const statusConfig = {
  normal: { label: "Normal", class: "bg-success/15 text-success" },
  low: { label: "Baixo", class: "bg-warning/15 text-warning" },
  critical: { label: "Crítico", class: "bg-destructive/15 text-destructive" },
};

export default function Materiais() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout
      title="Materiais"
      subtitle="Gerencie o cadastro de materiais e consulte o estoque atual"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, código ou apelido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="default">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-2" />
            Novo Material
          </Button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    className="rounded border-input"
                    onChange={() => {}}
                  />
                </th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Código
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                  Material
                </th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                  Categoria
                </th>
                <th className="text-right p-4 font-semibold text-sm text-muted-foreground">
                  Estoque
                </th>
                <th className="text-right p-4 font-semibold text-sm text-muted-foreground">
                  Custo Médio
                </th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                  Local
                </th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground">
                  Status
                </th>
                <th className="w-12 p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMaterials.map((material, index) => {
                const status = statusConfig[material.status];
                const isSelected = selectedMaterials.includes(material.id);

                return (
                  <tr
                    key={material.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors animate-fade-in",
                      isSelected && "bg-primary/5"
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={isSelected}
                        onChange={() => toggleSelect(material.id)}
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-medium text-primary">
                        {material.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">
                          {material.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {material.category}
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold tabular-nums">
                        {material.stock.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {material.unit}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-sm">
                      R$ {material.avgCost.toFixed(2)}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {material.location}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold",
                            status.class
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando <strong>{filteredMaterials.length}</strong> de{" "}
            <strong>{materials.length}</strong> materiais
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

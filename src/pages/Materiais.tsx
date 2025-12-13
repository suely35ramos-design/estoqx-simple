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
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMateriais, useDeleteMaterial } from "@/hooks/useMateriais";
import { MaterialDialog } from "@/components/materiais/MaterialDialog";
import { Material, MaterialComSaldo } from "@/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StockStatus = "normal" | "low" | "critical";

const statusConfig: Record<StockStatus, { label: string; class: string }> = {
  normal: { label: "Normal", class: "bg-success/15 text-success" },
  low: { label: "Baixo", class: "bg-warning/15 text-warning" },
  critical: { label: "Crítico", class: "bg-destructive/15 text-destructive" },
};

function getStockStatus(saldo: number, minimo: number): StockStatus {
  if (saldo <= 0 || saldo < minimo * 0.3) return "critical";
  if (saldo < minimo) return "low";
  return "normal";
}

export default function Materiais() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  const { data: materiais, isLoading, error } = useMateriais();
  const deleteMaterial = useDeleteMaterial();

  const filteredMaterials = (materiais || []).filter(
    (m: MaterialComSaldo) =>
      m.nome_material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.codigo?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (m.apelidos?.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) || false)
  );

  const toggleSelect = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMaterialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (materialToDelete) {
      await deleteMaterial.mutateAsync(materialToDelete);
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  const handleNewMaterial = () => {
    setEditingMaterial(null);
    setDialogOpen(true);
  };

  if (error) {
    return (
      <MainLayout title="Materiais" subtitle="Erro ao carregar materiais">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Erro: {(error as Error).message}</p>
        </div>
      </MainLayout>
    );
  }

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
          <Button variant="accent" onClick={handleNewMaterial}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Material
          </Button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        {searchQuery ? "Nenhum material encontrado" : "Nenhum material cadastrado"}
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((material: MaterialComSaldo, index: number) => {
                      const stockStatus = getStockStatus(material.saldo_total, material.estoque_minimo);
                      const status = statusConfig[stockStatus];
                      const isSelected = selectedMaterials.includes(material.id);
                      const unidadeSigla = material.unidade?.sigla || "UN";

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
                              {material.codigo || "-"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <span className="font-medium text-foreground">
                                {material.nome_material}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {material.categoria || "-"}
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-semibold tabular-nums">
                              {material.saldo_total.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              {unidadeSigla}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono text-sm">
                            R$ {material.custo_medio.toFixed(2)}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {material.localizacoes.length > 0 
                              ? material.localizacoes.join(", ") 
                              : "-"}
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(material)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(material.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando <strong>{filteredMaterials.length}</strong> de{" "}
                <strong>{materiais?.length || 0}</strong> materiais
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próximo
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Material Dialog */}
      <MaterialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        material={editingMaterial}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

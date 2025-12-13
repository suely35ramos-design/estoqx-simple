import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Material, MaterialInsert } from "@/types/database";
import { useUnidadesMedida, useCreateMaterial, useUpdateMaterial } from "@/hooks/useMateriais";
import { Loader2 } from "lucide-react";

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: Material | null;
}

const categorias = [
  "Cimento",
  "Argamassa",
  "Aço",
  "Agregados",
  "Alvenaria",
  "Hidráulica",
  "Elétrica",
  "Pintura",
  "Madeira",
  "Outros",
];

export function MaterialDialog({ open, onOpenChange, material }: MaterialDialogProps) {
  const { data: unidades, isLoading: loadingUnidades } = useUnidadesMedida();
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();

  const [formData, setFormData] = useState<MaterialInsert>({
    codigo: "",
    nome_material: "",
    descricao: "",
    categoria: "",
    subcategoria: "",
    id_unidade_padrao: "",
    estoque_minimo: 0,
    estoque_maximo: null,
  });

  useEffect(() => {
    if (material) {
      setFormData({
        codigo: material.codigo || "",
        nome_material: material.nome_material,
        descricao: material.descricao || "",
        categoria: material.categoria || "",
        subcategoria: material.subcategoria || "",
        id_unidade_padrao: material.id_unidade_padrao || "",
        estoque_minimo: material.estoque_minimo || 0,
        estoque_maximo: material.estoque_maximo,
      });
    } else {
      setFormData({
        codigo: "",
        nome_material: "",
        descricao: "",
        categoria: "",
        subcategoria: "",
        id_unidade_padrao: "",
        estoque_minimo: 0,
        estoque_maximo: null,
      });
    }
  }, [material, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      id_unidade_padrao: formData.id_unidade_padrao || null,
    };

    if (material) {
      await updateMaterial.mutateAsync({ id: material.id, data: dataToSave });
    } else {
      await createMaterial.mutateAsync(dataToSave);
    }
    
    onOpenChange(false);
  };

  const isLoading = createMaterial.isPending || updateMaterial.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {material ? "Editar Material" : "Novo Material"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                placeholder="Ex: CIM-001"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria || ""}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_material">Nome do Material *</Label>
            <Input
              id="nome_material"
              placeholder="Ex: Cimento CP-II 50kg"
              required
              value={formData.nome_material}
              onChange={(e) => setFormData({ ...formData, nome_material: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição detalhada do material..."
              rows={3}
              value={formData.descricao || ""}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade de Medida</Label>
              <Select
                value={formData.id_unidade_padrao || ""}
                onValueChange={(value) => setFormData({ ...formData, id_unidade_padrao: value })}
                disabled={loadingUnidades}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {unidades?.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id}>
                      {unidade.sigla} - {unidade.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                min="0"
                step="0.001"
                value={formData.estoque_minimo || 0}
                onChange={(e) => setFormData({ ...formData, estoque_minimo: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_maximo">Estoque Máximo</Label>
              <Input
                id="estoque_maximo"
                type="number"
                min="0"
                step="0.001"
                value={formData.estoque_maximo || ""}
                onChange={(e) => setFormData({ ...formData, estoque_maximo: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="accent" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {material ? "Salvar Alterações" : "Criar Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

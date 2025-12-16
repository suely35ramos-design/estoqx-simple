import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Warehouse,
} from "lucide-react";
import {
  useLocalizacoesList,
  useCreateLocalizacao,
  useUpdateLocalizacao,
  useDeleteLocalizacao,
  type Localizacao,
  type LocalizacaoInsert,
} from "@/hooks/useLocalizacoes";

export function LocalArmazenamentoSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocal, setEditingLocal] = useState<Localizacao | null>(null);
  const [formData, setFormData] = useState<Omit<LocalizacaoInsert, 'id_obra'>>({
    nome_local: "",
    descricao: "",
    capacidade_m3: null,
  });

  const { data: localizacoes, isLoading } = useLocalizacoesList();
  const createLocalizacao = useCreateLocalizacao();
  const updateLocalizacao = useUpdateLocalizacao();
  const deleteLocalizacao = useDeleteLocalizacao();

  const openNewDialog = () => {
    setEditingLocal(null);
    setFormData({
      nome_local: "",
      descricao: "",
      capacidade_m3: null,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (local: Localizacao) => {
    setEditingLocal(local);
    setFormData({
      nome_local: local.nome_local,
      descricao: local.descricao || "",
      capacidade_m3: local.capacidade_m3,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome_local) return;

    if (editingLocal) {
      await updateLocalizacao.mutateAsync({
        id: editingLocal.id,
        ...formData,
      });
    } else {
      await createLocalizacao.mutateAsync(formData as LocalizacaoInsert);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este local?")) {
      await deleteLocalizacao.mutateAsync(id);
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Locais de Armazenamento
            </h3>
            <p className="text-sm text-muted-foreground">
              Cadastre almoxarifados, pátios e depósitos
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Local
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : localizacoes?.length === 0 ? (
        <div className="text-center py-8">
          <Warehouse className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Nenhum local de armazenamento cadastrado
          </p>
          <Button variant="link" onClick={openNewDialog} className="mt-2">
            Cadastrar primeiro local
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Capacidade (m³)</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localizacoes?.map((local) => (
              <TableRow key={local.id}>
                <TableCell className="font-medium">{local.nome_local}</TableCell>
                <TableCell>{local.descricao || "-"}</TableCell>
                <TableCell>
                  {local.capacidade_m3
                    ? `${local.capacidade_m3.toLocaleString("pt-BR")} m³`
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditDialog(local)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(local.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocal ? "Editar Local" : "Novo Local de Armazenamento"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome_local">Nome do Local *</Label>
              <Input
                id="nome_local"
                value={formData.nome_local}
                onChange={(e) =>
                  setFormData({ ...formData, nome_local: e.target.value })
                }
                placeholder="Ex: Almoxarifado Central"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descrição do local"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade (m³)</Label>
              <Input
                id="capacidade"
                type="number"
                value={formData.capacidade_m3 || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacidade_m3: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="Capacidade em metros cúbicos"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="gradient-accent"
              onClick={handleSubmit}
              disabled={
                !formData.nome_local ||
                createLocalizacao.isPending ||
                updateLocalizacao.isPending
              }
            >
              {createLocalizacao.isPending || updateLocalizacao.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : editingLocal ? (
                "Salvar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

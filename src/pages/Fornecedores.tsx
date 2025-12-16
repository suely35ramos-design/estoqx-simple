import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Building2,
} from "lucide-react";
import {
  useFornecedoresList,
  useCreateFornecedor,
  useUpdateFornecedor,
  useDeleteFornecedor,
  type Fornecedor,
  type FornecedorInsert,
} from "@/hooks/useFornecedores";

export default function Fornecedores() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [formData, setFormData] = useState<FornecedorInsert>({
    razao_social: "",
    cnpj: "",
    contato_nome: "",
    telefone: "",
    email: "",
    nome_fantasia: "",
  });

  const { data: fornecedores, isLoading } = useFornecedoresList();
  const createFornecedor = useCreateFornecedor();
  const updateFornecedor = useUpdateFornecedor();
  const deleteFornecedor = useDeleteFornecedor();

  const filteredFornecedores = fornecedores?.filter((f) =>
    f.razao_social.toLowerCase().includes(search.toLowerCase()) ||
    f.cnpj?.includes(search) ||
    f.contato_nome?.toLowerCase().includes(search.toLowerCase())
  );

  const openNewDialog = () => {
    setEditingFornecedor(null);
    setFormData({
      razao_social: "",
      cnpj: "",
      contato_nome: "",
      telefone: "",
      email: "",
      nome_fantasia: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setFormData({
      razao_social: fornecedor.razao_social,
      cnpj: fornecedor.cnpj || "",
      contato_nome: fornecedor.contato_nome || "",
      telefone: fornecedor.telefone || "",
      email: fornecedor.email || "",
      nome_fantasia: fornecedor.nome_fantasia || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.razao_social) return;

    if (editingFornecedor) {
      await updateFornecedor.mutateAsync({
        id: editingFornecedor.id,
        ...formData,
      });
    } else {
      await createFornecedor.mutateAsync(formData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      await deleteFornecedor.mutateAsync(id);
    }
  };

  const formatCNPJ = (cnpj: string | null) => {
    if (!cnpj) return "-";
    const cleaned = cnpj.replace(/\D/g, "");
    if (cleaned.length !== 14) return cnpj;
    return cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  return (
    <MainLayout
      title="Fornecedores"
      subtitle="Gerencie o cadastro de fornecedores"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CNPJ ou contato..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="gradient-accent" onClick={openNewDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFornecedores?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Nenhum fornecedor encontrado
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFornecedores?.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell className="font-medium">
                        {fornecedor.razao_social}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatCNPJ(fornecedor.cnpj)}
                      </TableCell>
                      <TableCell>{fornecedor.contato_nome || "-"}</TableCell>
                      <TableCell>{fornecedor.telefone || "-"}</TableCell>
                      <TableCell>{fornecedor.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={fornecedor.ativo ? "default" : "secondary"}>
                          {fornecedor.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(fornecedor)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(fornecedor.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="razao_social">Nome / Razão Social *</Label>
              <Input
                id="razao_social"
                value={formData.razao_social}
                onChange={(e) =>
                  setFormData({ ...formData, razao_social: e.target.value })
                }
                placeholder="Nome do fornecedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: e.target.value })
                }
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato_nome">Nome do Contato</Label>
              <Input
                id="contato_nome"
                value={formData.contato_nome || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contato_nome: e.target.value })
                }
                placeholder="Pessoa de contato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="nome_fantasia">Observações</Label>
              <Input
                id="nome_fantasia"
                value={formData.nome_fantasia || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nome_fantasia: e.target.value })
                }
                placeholder="Observações adicionais"
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
                !formData.razao_social ||
                createFornecedor.isPending ||
                updateFornecedor.isPending
              }
            >
              {createFornecedor.isPending || updateFornecedor.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : editingFornecedor ? (
                "Salvar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

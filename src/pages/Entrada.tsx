import { useState, useMemo } from "react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Upload,
  Plus,
  Trash2,
  Package,
  FileText,
  CheckCircle2,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useFornecedores,
  useLocalizacoes,
  useMateriaisParaEntrada,
  useRegistrarEntrada,
  type EntryItem,
} from "@/hooks/useEntrada";

export default function Entrada() {
  const [nfNumber, setNfNumber] = useState("");
  const [nfDate, setNfDate] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [items, setItems] = useState<EntryItem[]>([
    {
      id: Date.now().toString(),
      materialId: "",
      materialName: "",
      quantity: 0,
      unit: "UN",
      unitCost: 0,
    },
  ]);

  const { data: fornecedores, isLoading: loadingFornecedores } = useFornecedores();
  const { data: localizacoes, isLoading: loadingLocalizacoes } = useLocalizacoes();
  const { data: materiais, isLoading: loadingMateriais } = useMateriaisParaEntrada();
  const registrarEntrada = useRegistrarEntrada();

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
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, updates: Partial<EntryItem>) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const selectMaterial = (itemId: string, materialId: string) => {
    const material = materiais?.find((m) => m.id === materialId);
    if (material) {
      updateItem(itemId, {
        materialId: material.id,
        materialName: material.nome_material,
        unit: material.unidades_medida?.sigla || "UN",
      });
    }
  };

  const totalValue = useMemo(() => 
    items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0),
    [items]
  );

  const totalQuantity = useMemo(() => 
    items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const validItems = useMemo(() => 
    items.filter((item) => item.materialId && item.quantity > 0),
    [items]
  );

  const canSubmit = nfNumber && nfDate && locationId && validItems.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await registrarEntrada.mutateAsync({
      nfNumber,
      nfDate,
      supplierId,
      locationId,
      items: validItems,
    });

    // Reset form on success
    setNfNumber("");
    setNfDate("");
    setSupplierId("");
    setLocationId("");
    setItems([{
      id: Date.now().toString(),
      materialId: "",
      materialName: "",
      quantity: 0,
      unit: "UN",
      unitCost: 0,
    }]);
  };

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
                <Input 
                  id="nf-number" 
                  placeholder="Ex: 45892" 
                  value={nfNumber}
                  onChange={(e) => setNfNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nf-date">Data de Recebimento *</Label>
                <Input 
                  id="nf-date" 
                  type="date" 
                  value={nfDate}
                  onChange={(e) => setNfDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFornecedores ? "Carregando..." : "Selecione o fornecedor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores?.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome_fantasia || f.razao_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local de Armazenamento *</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingLocalizacoes ? "Carregando..." : "Selecione o local"} />
                  </SelectTrigger>
                  <SelectContent>
                    {localizacoes?.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.nome_local}
                      </SelectItem>
                    ))}
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
                <EntryItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  materiais={materiais || []}
                  loadingMateriais={loadingMateriais}
                  onUpdate={(updates) => updateItem(item.id, updates)}
                  onSelectMaterial={(materialId) => selectMaterial(item.id, materialId)}
                  onRemove={() => removeItem(item.id)}
                  canRemove={items.length > 1}
                />
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
                <span className="font-medium">{validItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Qtd. Total</span>
                <span className="font-medium">
                  {totalQuantity.toLocaleString("pt-BR")} unidades
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
              <Button 
                variant="gradient-accent" 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit || registrarEntrada.isPending}
              >
                {registrarEntrada.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirmar Entrada
                  </>
                )}
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

interface EntryItemRowProps {
  item: EntryItem;
  index: number;
  materiais: Array<{
    id: string;
    codigo: string | null;
    nome_material: string;
    unidades_medida: { id: string; sigla: string; descricao: string } | null;
  }>;
  loadingMateriais: boolean;
  onUpdate: (updates: Partial<EntryItem>) => void;
  onSelectMaterial: (materialId: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function EntryItemRow({
  item,
  index,
  materiais,
  loadingMateriais,
  onUpdate,
  onSelectMaterial,
  onRemove,
  canRemove,
}: EntryItemRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="p-4 bg-muted/30 rounded-lg border border-border animate-scale-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">
          Item {index + 1}
        </span>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Material *</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-9 font-normal"
              >
                {item.materialName || (loadingMateriais ? "Carregando..." : "Selecionar material...")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar material..." />
                <CommandList>
                  <CommandEmpty>Nenhum material encontrado.</CommandEmpty>
                  <CommandGroup>
                    {materiais.map((material) => (
                      <CommandItem
                        key={material.id}
                        value={material.nome_material}
                        onSelect={() => {
                          onSelectMaterial(material.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.materialId === material.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{material.nome_material}</span>
                          {material.codigo && (
                            <span className="text-xs text-muted-foreground">
                              {material.codigo}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Quantidade *</Label>
          <Input
            type="number"
            className="h-9"
            value={item.quantity || ""}
            onChange={(e) => onUpdate({ quantity: Number(e.target.value) || 0 })}
            min={0}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Custo Unit. *</Label>
          <Input
            type="number"
            step="0.01"
            className="h-9"
            value={item.unitCost || ""}
            onChange={(e) => onUpdate({ unitCost: Number(e.target.value) || 0 })}
            min={0}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Lote</Label>
          <Input
            className="h-9"
            value={item.lot || ""}
            onChange={(e) => onUpdate({ lot: e.target.value })}
            placeholder="Opcional"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Validade</Label>
          <Input
            type="date"
            className="h-9"
            value={item.expiryDate || ""}
            onChange={(e) => onUpdate({ expiryDate: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Subtotal</Label>
          <div className="h-9 px-3 flex items-center bg-muted rounded-md text-sm font-medium">
            R$ {(item.quantity * item.unitCost).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}

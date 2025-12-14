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
  Plus,
  Trash2,
  Package,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useOrdensServico,
  useEstoqueDisponivel,
  useRegistrarSaida,
  type ExitItem,
} from "@/hooks/useSaida";
import { useLocalizacoes } from "@/hooks/useEntrada";
import { useConfiguracao } from "@/hooks/useConfiguracoes";

export default function Saida() {
  const [osId, setOsId] = useState("");
  const [exitDate, setExitDate] = useState(new Date().toISOString().split("T")[0]);
  const [tipoBaixa, setTipoBaixa] = useState<"consumo" | "perda" | "extravio" | "devolucao">("consumo");
  const [locationId, setLocationId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [items, setItems] = useState<ExitItem[]>([
    {
      id: Date.now().toString(),
      materialId: "",
      materialName: "",
      requested: 0,
      available: 0,
      unit: "UN",
    },
  ]);

  const { data: ordensServico, isLoading: loadingOS } = useOrdensServico();
  const { data: localizacoes, isLoading: loadingLocalizacoes } = useLocalizacoes();
  const { data: estoqueDisponivel, isLoading: loadingEstoque } = useEstoqueDisponivel(locationId || null);
  const { data: configOsObrigatoria } = useConfiguracao("saida_os_obrigatoria");
  const registrarSaida = useRegistrarSaida();

  const osObrigatoria = configOsObrigatoria?.valor === "true" || configOsObrigatoria?.valor === true;

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
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, updates: Partial<ExitItem>) => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const selectMaterial = (itemId: string, estoqueId: string) => {
    const estoque = estoqueDisponivel?.find((e) => e.id === estoqueId);
    if (estoque && estoque.materiais) {
      const material = estoque.materiais as {
        id: string;
        codigo: string | null;
        nome_material: string;
        unidades_medida: { id: string; sigla: string } | null;
      };
      const lote = estoque.lotes as { id: string; num_lote: string } | null;
      
      updateItem(itemId, {
        materialId: material.id,
        materialName: material.nome_material,
        available: Number(estoque.saldo_atual),
        unit: material.unidades_medida?.sigla || "UN",
        lot: lote?.num_lote,
        loteId: lote?.id,
      });
    }
  };

  const totalQuantity = useMemo(
    () => items.reduce((acc, item) => acc + item.requested, 0),
    [items]
  );

  const validItems = useMemo(
    () => items.filter((item) => item.materialId && item.requested > 0),
    [items]
  );

  const hasStockError = useMemo(
    () => items.some((item) => item.requested > item.available && item.materialId),
    [items]
  );

  const selectedOS = ordensServico?.find((os) => os.id === osId);

  const canSubmit =
    exitDate &&
    locationId &&
    validItems.length > 0 &&
    !hasStockError &&
    (!osObrigatoria || osId);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await registrarSaida.mutateAsync({
      osId: osId || undefined,
      exitDate,
      tipoBaixa,
      locationId,
      observacao,
      items: validItems,
    });

    // Reset form on success
    setOsId("");
    setExitDate(new Date().toISOString().split("T")[0]);
    setTipoBaixa("consumo");
    setObservacao("");
    setItems([
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
              {osObrigatoria && (
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                  Obrigatória
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="os-number">
                  Ordem de Serviço {osObrigatoria && "*"}
                </Label>
                <Select value={osId} onValueChange={setOsId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={loadingOS ? "Carregando..." : "Selecione a OS"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {ordensServico?.map((os) => (
                      <SelectItem key={os.id} value={os.id}>
                        {os.codigo} - {os.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit-date">Data da Saída *</Label>
                <Input
                  id="exit-date"
                  type="date"
                  value={exitDate}
                  onChange={(e) => setExitDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local de Origem *</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingLocalizacoes ? "Carregando..." : "Selecione o local"
                      }
                    />
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

              <div className="space-y-2">
                <Label htmlFor="exit-type">Tipo de Baixa *</Label>
                <Select
                  value={tipoBaixa}
                  onValueChange={(v) =>
                    setTipoBaixa(v as "consumo" | "perda" | "extravio" | "devolucao")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumo">Consumo</SelectItem>
                    <SelectItem value="perda">Perda/Avaria</SelectItem>
                    <SelectItem value="extravio">Extravio</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  placeholder="Informações adicionais sobre a saída..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
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

            {!locationId && (
              <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                Selecione um local de origem para ver os materiais disponíveis
              </div>
            )}

            {locationId && (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <ExitItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    estoqueDisponivel={estoqueDisponivel || []}
                    loadingEstoque={loadingEstoque}
                    onUpdate={(updates) => updateItem(item.id, updates)}
                    onSelectMaterial={(estoqueId) => selectMaterial(item.id, estoqueId)}
                    onRemove={() => removeItem(item.id)}
                    canRemove={items.length > 1}
                  />
                ))}
              </div>
            )}
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
                <span className="font-medium">{validItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Qtd. Total</span>
                <span className="font-medium">
                  {totalQuantity.toLocaleString("pt-BR")} unidades
                </span>
              </div>
              <div className="h-px bg-border my-3" />
              {selectedOS && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">OS Vinculada</p>
                  <p className="font-semibold text-sm">{selectedOS.codigo}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOS.descricao}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                variant="gradient-accent"
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit || registrarSaida.isPending}
              >
                {registrarSaida.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirmar Saída
                  </>
                )}
              </Button>
            </div>

            {osObrigatoria && !osId && (
              <p className="text-xs text-warning text-center mt-4">
                A ordem de serviço é obrigatória para registrar saídas.
              </p>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              O estoque será baixado automaticamente após a confirmação.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface ExitItemRowProps {
  item: ExitItem;
  index: number;
  estoqueDisponivel: Array<{
    id: string;
    saldo_atual: number;
    materiais: unknown;
    lotes: unknown;
  }>;
  loadingEstoque: boolean;
  onUpdate: (updates: Partial<ExitItem>) => void;
  onSelectMaterial: (estoqueId: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function ExitItemRow({
  item,
  index,
  estoqueDisponivel,
  loadingEstoque,
  onUpdate,
  onSelectMaterial,
  onRemove,
  canRemove,
}: ExitItemRowProps) {
  const [open, setOpen] = useState(false);
  const isOverRequest = item.requested > item.available && item.materialId;

  return (
    <div
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
                {item.materialName ||
                  (loadingEstoque ? "Carregando..." : "Selecionar material...")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar material..." />
                <CommandList>
                  <CommandEmpty>Nenhum material em estoque.</CommandEmpty>
                  <CommandGroup>
                    {estoqueDisponivel.map((estoque) => {
                      const material = estoque.materiais as {
                        id: string;
                        codigo: string | null;
                        nome_material: string;
                      };
                      const lote = estoque.lotes as {
                        num_lote: string;
                      } | null;

                      return (
                        <CommandItem
                          key={estoque.id}
                          value={`${material.nome_material} ${material.codigo || ""}`}
                          onSelect={() => {
                            onSelectMaterial(estoque.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.materialId === material.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col flex-1">
                            <span>{material.nome_material}</span>
                            <span className="text-xs text-muted-foreground">
                              {material.codigo && `${material.codigo} • `}
                              Disp: {estoque.saldo_atual}
                              {lote && ` • Lote: ${lote.num_lote}`}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
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
            className={cn("h-9", isOverRequest && "border-destructive")}
            value={item.requested || ""}
            onChange={(e) => onUpdate({ requested: Number(e.target.value) || 0 })}
            min={0}
            max={item.available}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Disponível</Label>
          <div className="h-9 px-3 flex items-center bg-muted rounded-md text-sm">
            <span
              className={cn(
                "font-medium",
                item.available < 50 ? "text-warning" : "text-success"
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
}

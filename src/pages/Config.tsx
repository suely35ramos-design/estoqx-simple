import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Users,
  MapPin,
  Bell,
  Shield,
  Database,
  Save,
  Loader2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfiguracoes, useUpdateConfiguracao } from "@/hooks/useConfiguracoes";
import { toast } from "@/hooks/use-toast";
import { LocalArmazenamentoSection } from "@/components/config/LocalArmazenamentoSection";

interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const sections: SettingsSection[] = [
  {
    id: "obra",
    name: "Dados da Obra",
    description: "Informações do canteiro e endereço",
    icon: Building2,
  },
  {
    id: "movimentacao",
    name: "Movimentação",
    description: "Configurações de entrada e saída",
    icon: Package,
  },
  {
    id: "usuarios",
    name: "Usuários e Acessos",
    description: "Gerenciar usuários e permissões RBAC",
    icon: Users,
  },
  {
    id: "locais",
    name: "Locais de Armazenamento",
    description: "Cadastro de almoxarifados e pátios",
    icon: MapPin,
  },
  {
    id: "alertas",
    name: "Configuração de Alertas",
    description: "Regras de notificação e pontos de pedido",
    icon: Bell,
  },
  {
    id: "seguranca",
    name: "Segurança",
    description: "Backup, logs e auditoria",
    icon: Shield,
  },
  {
    id: "integracao",
    name: "Integrações",
    description: "Conexão com ERP e sistemas externos",
    icon: Database,
  },
];

export default function Config() {
  const [activeSection, setActiveSection] = useState("obra");
  const [osObrigatoria, setOsObrigatoria] = useState(true);

  const { data: configuracoes, isLoading } = useConfiguracoes();
  const updateConfiguracao = useUpdateConfiguracao();

  useEffect(() => {
    if (configuracoes) {
      const configOS = configuracoes.find((c) => c.chave === "saida_os_obrigatoria");
      if (configOS) {
        setOsObrigatoria(configOS.valor === "true" || configOS.valor === true);
      }
    }
  }, [configuracoes]);

  const handleSaveMovimentacao = async () => {
    await updateConfiguracao.mutateAsync({
      chave: "saida_os_obrigatoria",
      valor: osObrigatoria,
    });
  };

  return (
    <MainLayout
      title="Configurações"
      subtitle="Gerencie as configurações do sistema GranRedes"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{section.name}</p>
                    <p
                      className={cn(
                        "text-xs",
                        isActive ? "opacity-80" : "text-muted-foreground"
                      )}
                    >
                      {section.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Dados da Obra */}
          {activeSection === "obra" && (
            <div className="bg-card rounded-xl border shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Dados da Obra
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Informações do canteiro principal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="obra-name">Nome da Obra</Label>
                  <Input
                    id="obra-name"
                    defaultValue="Edifício Residencial Aurora"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obra-code">Código Interno</Label>
                  <Input id="obra-code" defaultValue="OBRA-2024-015" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="obra-address">Endereço Completo</Label>
                  <Input
                    id="obra-address"
                    defaultValue="Av. Paulista, 1500 - Bela Vista, São Paulo - SP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obra-manager">Responsável Técnico</Label>
                  <Input id="obra-manager" defaultValue="Eng. Carlos Silva" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obra-phone">Telefone</Label>
                  <Input id="obra-phone" defaultValue="(11) 99999-8888" />
                </div>
              </div>
            </div>
          )}

          {/* Movimentação */}
          {activeSection === "movimentacao" && (
            <div className="bg-card rounded-xl border shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Configurações de Movimentação
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Regras para entrada e saída de materiais
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Ordem de Serviço Obrigatória na Saída
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Exige vinculação de OS para registrar saída de materiais
                      </p>
                    </div>
                    <Switch
                      checked={osObrigatoria}
                      onCheckedChange={setOsObrigatoria}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Controle por Lote (FIFO)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sugerir automaticamente lotes mais antigos
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Permitir Saída Acima do Estoque
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bloquear saídas que excedam o saldo disponível
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Assinatura Digital Obrigatória
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Exigir assinatura do responsável pela retirada
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <Button
                  variant="gradient-accent"
                  size="lg"
                  onClick={handleSaveMovimentacao}
                  disabled={updateConfiguracao.isPending}
                >
                  {updateConfiguracao.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeSection === "alertas" && (
            <div className="bg-card rounded-xl border shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Preferências de Notificação
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure quando e como receber alertas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Alerta de Estoque Crítico
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando atingir ponto de pedido
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Validade Próxima</p>
                    <p className="text-sm text-muted-foreground">
                      Alertar 15 dias antes do vencimento
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Manutenção Preventiva
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lembrar sobre calibração e revisões
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Desvio de Consumo</p>
                    <p className="text-sm text-muted-foreground">
                      Alertar variação acima de 10% do orçado
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Resumo Diário</p>
                    <p className="text-sm text-muted-foreground">
                      Receber resumo de movimentações às 18h
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {/* Locais de Armazenamento */}
          {activeSection === "locais" && <LocalArmazenamentoSection />}

          {/* Placeholder for other sections */}
          {!["obra", "movimentacao", "alertas", "locais"].includes(activeSection) && (
            <div className="bg-card rounded-xl border shadow-card p-6">
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">Em desenvolvimento</p>
                <p className="text-sm mt-1">
                  Esta seção estará disponível em breve.
                </p>
              </div>
            </div>
          )}

          {/* Save Button for obra section */}
          {activeSection === "obra" && (
            <div className="flex justify-end">
              <Button variant="gradient-accent" size="lg">
                <Save className="w-5 h-5 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

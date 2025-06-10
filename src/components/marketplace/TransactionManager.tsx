
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Shield, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";

const TransactionManager = () => {
  const activeTransactions = [
    {
      id: "TXN-001",
      title: "Validação de Método HPLC",
      vendor: "LabAnalítica SP",
      client: "FarmaTech Ltda",
      value: "R$ 35.000",
      status: "contract_review",
      progress: 60,
      nextStep: "Assinatura do contrato",
      dueDate: "2024-06-15"
    },
    {
      id: "TXN-002", 
      title: "Consultoria Regulatória",
      vendor: "Dr. Carlos Mendes",
      client: "BioNova S.A.",
      value: "R$ 18.000",
      status: "in_progress",
      progress: 30,
      nextStep: "Entrega do relatório preliminar",
      dueDate: "2024-06-20"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "contract_review":
        return { label: "Revisão Contratual", color: "bg-yellow-100 text-yellow-800", icon: FileText };
      case "in_progress":
        return { label: "Em Andamento", color: "bg-blue-100 text-blue-800", icon: Clock };
      case "completed":
        return { label: "Concluído", color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "dispute":
        return { label: "Disputa", color: "bg-red-100 text-red-800", icon: AlertCircle };
      default:
        return { label: "Pendente", color: "bg-gray-100 text-gray-800", icon: Clock };
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Gerenciamento de Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">R$ 2.4M</p>
              <p className="text-sm text-blue-600">Volume Mensal</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">94%</p>
              <p className="text-sm text-green-600">Taxa de Sucesso</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-900">7.2</p>
              <p className="text-sm text-yellow-600">Dias Médios</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">100%</p>
              <p className="text-sm text-purple-600">Protegido</p>
            </div>
          </div>

          {/* Active Transactions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Transações Ativas</h4>
            {activeTransactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={transaction.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-900">{transaction.title}</h5>
                        <p className="text-sm text-gray-600">{transaction.vendor} → {transaction.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">{transaction.value}</p>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>{transaction.progress}%</span>
                        </div>
                        <Progress value={transaction.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Próximo: {transaction.nextStep}</span>
                        <span className="text-gray-600">Prazo: {new Date(transaction.dueDate).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Contrato
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Shield className="h-4 w-4 mr-1" />
                          Suporte Escrow
                        </Button>
                        <Button size="sm" className="flex-1">
                          Atualizar Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Security Features */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Recursos de Segurança</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Escrow automático para transações > R$ 10k</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Verificação de compliance e certificações</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Assinatura eletrônica integrada</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Auditoria completa de transações</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Seguro contra não conformidade</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Sistema de rating e reputação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionManager;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

const ComplianceChecker = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const checklistItems = [
    { id: "gmp", label: "Certificação GMP atualizada", category: "Qualidade" },
    { id: "anvisa", label: "Licença ANVISA válida", category: "Regulatório" },
    { id: "iso", label: "ISO 9001 implementada", category: "Qualidade" },
    { id: "validation", label: "Métodos analíticos validados", category: "Técnico" },
    { id: "stability", label: "Programa de estabilidade ativo", category: "Técnico" },
    { id: "deviation", label: "Sistema de desvios funcional", category: "Qualidade" },
    { id: "training", label: "Programa de treinamento atualizado", category: "RH" },
    { id: "calibration", label: "Equipamentos calibrados", category: "Técnico" }
  ];

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateCompliance = () => {
    const percentage = (checkedItems.length / checklistItems.length) * 100;
    return Math.round(percentage);
  };

  const getComplianceLevel = () => {
    const percentage = calculateCompliance();
    if (percentage >= 90) return { level: "Excelente", color: "bg-green-500", icon: CheckCircle };
    if (percentage >= 70) return { level: "Bom", color: "bg-yellow-500", icon: AlertTriangle };
    return { level: "Crítico", color: "bg-red-500", icon: AlertTriangle };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Compliance Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Checkbox
                id={item.id}
                checked={checkedItems.includes(item.id)}
                onCheckedChange={() => handleCheck(item.id)}
              />
              <label htmlFor={item.id} className="flex-1 text-sm cursor-pointer">
                {item.label}
              </label>
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            </div>
          ))}
        </div>
        
        <Button onClick={() => setShowResults(true)} className="w-full">
          Avaliar Compliance
        </Button>
        
        {showResults && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-gray-900">
                {calculateCompliance()}%
              </div>
              <p className="text-sm text-gray-600">Nível de Compliance</p>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              {(() => {
                const { level, color, icon: Icon } = getComplianceLevel();
                return (
                  <>
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="font-medium">{level}</span>
                    <Icon className="h-4 w-4" />
                  </>
                );
              })()}
            </div>
            
            <div className="mt-3 text-xs text-gray-600 text-center">
              <p>Itens implementados: {checkedItems.length}/{checklistItems.length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceChecker;

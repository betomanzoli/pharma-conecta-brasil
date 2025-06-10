
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign } from "lucide-react";

const ROICalculator = () => {
  const [projectCost, setProjectCost] = useState("");
  const [timeReduction, setTimeReduction] = useState("");
  const [resourceSavings, setResourceSavings] = useState("");
  const [roi, setROI] = useState<number | null>(null);

  const calculateROI = () => {
    const cost = parseFloat(projectCost);
    const savings = parseFloat(resourceSavings);
    const timeValue = parseFloat(timeReduction) * 10000; // Assumindo R$ 10k por mês economizado
    
    if (cost > 0) {
      const totalBenefit = savings + timeValue;
      const calculatedROI = ((totalBenefit - cost) / cost) * 100;
      setROI(calculatedROI);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Calculadora ROI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cost">Custo do Projeto (R$)</Label>
          <Input
            id="cost"
            type="number"
            value={projectCost}
            onChange={(e) => setProjectCost(e.target.value)}
            placeholder="Ex: 50000"
          />
        </div>
        
        <div>
          <Label htmlFor="time">Redução de Tempo (meses)</Label>
          <Input
            id="time"
            type="number"
            value={timeReduction}
            onChange={(e) => setTimeReduction(e.target.value)}
            placeholder="Ex: 3"
          />
        </div>
        
        <div>
          <Label htmlFor="savings">Economia de Recursos (R$)</Label>
          <Input
            id="savings"
            type="number"
            value={resourceSavings}
            onChange={(e) => setResourceSavings(e.target.value)}
            placeholder="Ex: 25000"
          />
        </div>
        
        <Button onClick={calculateROI} className="w-full">
          Calcular ROI
        </Button>
        
        {roi !== null && (
          <div className="p-4 bg-primary-50 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-primary mr-1" />
              <span className="text-lg font-bold text-primary">
                ROI: {roi.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {roi > 0 ? "Projeto viável!" : "Revisar investimento"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ROICalculator;

import React, { useReducer, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Calculator, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface CostFormData {
  productType: string;
  developmentPhase: string;
  teamSize: string;
  duration: string;
  complexity: string;
  regulatoryPath: string;
}

const initialFormData: CostFormData = {
  productType: '',
  developmentPhase: '',
  teamSize: '',
  duration: '',
  complexity: '',
  regulatoryPath: ''
};

type FormAction = 
  | { type: 'UPDATE_FIELD'; field: keyof CostFormData; value: string }
  | { type: 'RESET_FORM' };

const formReducer = (state: CostFormData, action: FormAction): CostFormData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return initialFormData;
    default:
      return state;
  }
};

const CostCalculator: React.FC = () => {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [result, setResult] = useState<any>(null);

  const handleFieldChange = (field: keyof CostFormData, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== '');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Calculadora de Custos de Desenvolvimento
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estime custos de desenvolvimento, regulatório e produção para seu projeto farmacêutico.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta calculadora está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <TrendingDown className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Nossa equipe está finalizando os algoritmos de cálculo de custos baseados em benchmarks da indústria.
          </p>
          <Button disabled>
            Aguarde - Em Breve
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostCalculator;
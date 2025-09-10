import React, { useReducer, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { costFormSchema } from './cost/costValidation';
import { calculateCost } from './cost/costCalculations';
import { CostFormData, CostResults } from './cost/types';
import CostForm from './cost/CostForm';
import CostResultsComponent from './cost/CostResults';

type CostAction = 
  | { type: 'UPDATE_FIELD'; field: keyof CostFormData; value: string }
  | { type: 'RESET' };

const initialFormData: CostFormData = {
  productType: '',
  developmentPhase: '',
  teamSize: '',
  duration: '',
  complexity: '',
  regulatoryPath: '',
};

function costReducer(state: CostFormData, action: CostAction): CostFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialFormData;
    default:
      return state;
  }
}

const CostCalculator: React.FC = () => {
  const [formData, dispatch] = useReducer(costReducer, initialFormData);
  const [results, setResults] = useState<CostResults | null>(null);

  const handleFieldChange = (field: keyof CostFormData, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const isFormValid = () => {
    try {
      costFormSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  };

  const handleCalculate = () => {
    if (!isFormValid()) return;
    
    const calculatedResults = calculateCost(formData);
    setResults(calculatedResults);
  };

  const handleRecalculate = () => {
    setResults(null);
    dispatch({ type: 'RESET' });
  };

  if (results) {
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
            Calculadora de Custos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Resultado da análise de custos do seu projeto farmacêutico.
          </p>
        </motion.div>
        <CostResultsComponent results={results} onRecalculate={handleRecalculate} />
      </div>
    );
  }

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
          Calculadora de Custos
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estime custos de desenvolvimento, regulatório e produção do seu projeto farmacêutico.
        </p>
      </motion.div>
      <CostForm
        formData={formData}
        onChange={handleFieldChange}
        onSubmit={handleCalculate}
        isValid={isFormValid()}
      />
    </div>
  );
};

export default CostCalculator;
import React, { useReducer, useState } from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { regulatoryFormSchema } from './regulatory-risk/regulatoryValidation';
import { calculateRegulatoryRisk } from './regulatory-risk/regulatoryCalculations';
import { RegulatoryFormData, RegulatoryResults } from './regulatory-risk/types';
import RegulatoryForm from './regulatory-risk/RegulatoryForm';
import RegulatoryResultsComponent from './regulatory-risk/RegulatoryResults';

type RegulatoryAction = 
  | { type: 'UPDATE_FIELD'; field: keyof RegulatoryFormData; value: string }
  | { type: 'RESET' };

const initialFormData: RegulatoryFormData = {
  productCategory: '',
  novelty: '',
  targetMarkets: '',
  clinicalEvidence: '',
  manufacturingComplexity: '',
  priorApprovals: '',
};

function regulatoryReducer(state: RegulatoryFormData, action: RegulatoryAction): RegulatoryFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialFormData;
    default:
      return state;
  }
}

const RegulatoryRiskCalculator: React.FC = () => {
  const [formData, dispatch] = useReducer(regulatoryReducer, initialFormData);
  const [results, setResults] = useState<RegulatoryResults | null>(null);

  const handleFieldChange = (field: keyof RegulatoryFormData, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const isFormValid = () => {
    try {
      regulatoryFormSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  };

  const handleCalculate = () => {
    if (!isFormValid()) return;
    
    const calculatedResults = calculateRegulatoryRisk(formData);
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
            <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Avaliador de Risco Regulatório
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Resultado da análise de risco regulatório do seu projeto.
          </p>
        </motion.div>
        <RegulatoryResultsComponent results={results} onRecalculate={handleRecalculate} />
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
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Avaliador de Risco Regulatório
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Análise de complexidade e probabilidade de aprovação ANVISA.
        </p>
      </motion.div>
      <RegulatoryForm
        formData={formData}
        onChange={handleFieldChange}
        onSubmit={handleCalculate}
        isValid={isFormValid()}
      />
    </div>
  );
};

export default RegulatoryRiskCalculator;
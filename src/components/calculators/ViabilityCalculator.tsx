import React, { useReducer, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ViabilityForm from "./viability/ViabilityForm";
import ViabilityResults from "./viability/ViabilityResults";
import { calculateViability } from "./viability/viabilityCalculations";
import { ViabilityFormData, ViabilityResult } from "./viability/types";
import { viabilityFormSchema } from "./viability/viabilityValidation";

const initialFormData: ViabilityFormData = {
  productType: '',
  developmentCost: '',
  timeToMarket: '',
  marketSize: '',
  competition: '',
  regulatoryComplexity: ''
};

type FormAction = 
  | { type: 'UPDATE_FIELD'; field: keyof ViabilityFormData; value: string }
  | { type: 'RESET_FORM' };

const formReducer = (state: ViabilityFormData, action: FormAction): ViabilityFormData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return initialFormData;
    default:
      return state;
  }
};

const ViabilityCalculator: React.FC = () => {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [result, setResult] = useState<ViabilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleFieldChange = (field: keyof ViabilityFormData, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleCalculate = async () => {
    try {
      // Validate form data
      const validatedData = viabilityFormSchema.parse(formData);
      
      setIsCalculating(true);
      
      // Simulate API call delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const calculatedResult = calculateViability(validatedData);
      setResult(calculatedResult);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_FORM' });
    setResult(null);
  };

  const isFormValid = () => {
    try {
      viabilityFormSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Calculadora de Viabilidade de Projeto
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Avalie a viabilidade técnica e comercial do seu projeto farmacêutico usando algoritmos 
          ponderados baseados em benchmarks da indústria.
        </p>
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHowItWorks(!showHowItWorks)}
          >
            {showHowItWorks ? 'Ocultar' : 'Como Calculamos?'}
          </Button>
        </div>
      </motion.div>

      {/* How It Works */}
      {showHowItWorks && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Metodologia de Cálculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Pesos dos Fatores:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Tamanho de Mercado: 22%</li>
                    <li>• Tipo de Produto: 20%</li>
                    <li>• Custo de Desenvolvimento: 18%</li>
                    <li>• Tempo até o Mercado: 15%</li>
                    <li>• Nível de Competição: 15%</li>
                    <li>• Complexidade Regulatória: 10%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Níveis de Viabilidade:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Muito Alta: 85+ pontos</li>
                    <li>• Alta: 70-84 pontos</li>
                    <li>• Média-Alta: 55-69 pontos</li>
                    <li>• Média: 40-54 pontos</li>
                    <li>• Baixa: &lt;40 pontos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Dados do Projeto
              </CardTitle>
              <CardDescription>
                Preencha todas as informações para obter uma análise precisa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ViabilityForm 
                formData={formData}
                onFieldChange={handleFieldChange}
              />
              
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleCalculate}
                  disabled={!isFormValid() || isCalculating}
                  className="flex-1"
                >
                  {isCalculating ? 
                    <>Calculando...</> : 
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular Viabilidade
                    </>
                  }
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                >
                  Limpar
                </Button>
              </div>
              
              {!isFormValid() && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Preencha todos os campos para calcular
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {result ? (
            <ViabilityResults result={result} />
          ) : (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Resultados
                </CardTitle>
                <CardDescription>
                  Os resultados aparecerão aqui após o cálculo
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Preencha o formulário e clique em "Calcular" para ver os resultados</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Disclaimer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Aviso Importante
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  Esta calculadora fornece estimativas baseadas em modelos matemáticos e benchmarks 
                  da indústria farmacêutica. Os resultados são para fins informativos e não substituem 
                  análise técnica detalhada por especialistas. Para decisões críticas de investimento, 
                  recomendamos consultoria especializada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ViabilityCalculator;
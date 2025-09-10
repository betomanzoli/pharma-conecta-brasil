import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle,
  PieChart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CostResults } from './types';
import { getCostLevel } from './costCalculations';
import WhatsAppContactModal from '../shared/WhatsAppContactModal';

interface CostResultsProps {
  results: CostResults;
  onRecalculate: () => void;
}

const CostResultsComponent: React.FC<CostResultsProps> = ({ results, onRecalculate }) => {
  const [showWhatsApp, setShowWhatsApp] = React.useState(false);
  const costLevel = getCostLevel(results.totalCost);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = [
    { name: 'Desenvolvimento', value: results.breakdown.development, amount: results.developmentCost },
    { name: 'Regulatório', value: results.breakdown.regulatory, amount: results.regulatoryCost },
    { name: 'Qualidade', value: results.breakdown.quality, amount: results.qualityCost },
    { name: 'Produção', value: results.breakdown.production, amount: results.productionCost },
  ];

  return (
    <div className="space-y-6">
      {/* Resultado Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Custo Total Estimado</CardTitle>
            <div className="text-4xl font-bold text-primary mb-2">
              {formatCurrency(results.totalCost)}
            </div>
            <Badge variant="secondary" className={costLevel.color}>
              {costLevel.level} - {costLevel.range}
            </Badge>
            <CardDescription className="mt-2">
              {costLevel.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Breakdown de Custos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribuição dos Custos
            </CardTitle>
            <CardDescription>
              Timeline estimado: {results.timeline} meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.amount)} ({item.value}%)
                    </span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Timeline Total</span>
                </div>
                <span className="text-sm font-bold">{results.timeline} meses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recomendações */}
      {results.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recomendações Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Fatores de Risco */}
      {results.riskFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Fatores de Risco Identificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Ações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button onClick={onRecalculate} variant="outline" className="flex-1">
          Recalcular
        </Button>
        <Button 
          onClick={() => setShowWhatsApp(true)}
          className="flex-1 flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Consultoria Especializada
        </Button>
      </motion.div>

      <WhatsAppContactModal 
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        calculatorName="Calculadora de Custos"
        contextualSummary={`Custo Total: ${formatCurrency(results.totalCost)} | Nível: ${costLevel.level} | Timeline: ${results.timeline} meses`}
      />
    </div>
  );
};

export default CostResultsComponent;
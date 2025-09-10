import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle,
  FileText,
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegulatoryResults } from './types';
import { RISK_LEVELS } from './regulatoryConstants';
import WhatsAppContactModal from '../shared/WhatsAppContactModal';

interface RegulatoryResultsProps {
  results: RegulatoryResults;
  onRecalculate: () => void;
}

const RegulatoryResultsComponent: React.FC<RegulatoryResultsProps> = ({ results, onRecalculate }) => {
  const [showWhatsApp, setShowWhatsApp] = React.useState(false);
  
  const getRiskLevelColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-600 bg-green-50';
    if (riskScore < 50) return 'text-yellow-600 bg-yellow-50';
    if (riskScore < 70) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getApprovalColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

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
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Análise de Risco Regulatório</CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {results.riskScore}%
                </div>
                <Badge variant="secondary" className={getRiskLevelColor(results.riskScore)}>
                  Risco {results.riskLevel}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-1 ${getApprovalColor(results.approvalProbability)}`}>
                  {results.approvalProbability}%
                </div>
                <Badge variant="outline">
                  Probabilidade de Aprovação
                </Badge>
              </div>
            </div>
            
            <CardDescription className="mt-4">
              Timeline estimado: {results.timelineEstimate} meses | Via: {results.regulatoryPath}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Métricas Detalhadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Métricas de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Nível de Risco</span>
                  <span className="text-muted-foreground">{results.riskScore}%</span>
                </div>
                <Progress value={results.riskScore} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Probabilidade de Aprovação</span>
                  <span className="text-muted-foreground">{results.approvalProbability}%</span>
                </div>
                <Progress value={results.approvalProbability} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Timeline ANVISA</span>
                </div>
                <span className="text-sm font-bold">{results.timelineEstimate} meses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fatores Críticos */}
      {results.criticalFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Fatores Críticos Identificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.criticalFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Estratégias de Mitigação */}
      {results.mitigationStrategies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Estratégias de Mitigação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.mitigationStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Requisitos ANVISA */}
      {results.anvisaRequirements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Requisitos ANVISA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.anvisaRequirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{req}</span>
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
        transition={{ duration: 0.6, delay: 0.5 }}
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
          Consultoria Regulatória
        </Button>
      </motion.div>

      <WhatsAppContactModal 
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        calculatorName="Avaliador de Risco Regulatório"
        contextualSummary={`Risco: ${results.riskScore}% (${results.riskLevel}) | Probabilidade Aprovação: ${results.approvalProbability}% | Timeline: ${results.timelineEstimate} meses`}
      />
    </div>
  );
};

export default RegulatoryResultsComponent;
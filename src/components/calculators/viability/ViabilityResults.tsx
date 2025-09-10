import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  MessageCircle, 
  TrendingUp,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { ViabilityResult } from "./types";
import WhatsAppContactModal from "../shared/WhatsAppContactModal";

interface ViabilityResultsProps {
  result: ViabilityResult;
}

const ViabilityResults: React.FC<ViabilityResultsProps> = ({ result }) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getIcon = () => {
    if (result.percentage >= 70) return <CheckCircle className="w-8 h-8 text-emerald-600" />;
    if (result.percentage >= 55) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  const getProgressColor = () => {
    if (result.percentage >= 70) return "bg-emerald-500";
    if (result.percentage >= 55) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleWhatsAppContact = () => {
    setShowWhatsAppModal(true);
  };

  const contextualSummary = `Calculadora de Viabilidade - Resultado: ${result.percentage}% (${result.viabilityLevel})`;

  return (
    <>
      <div className="space-y-6">
        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${result.color.includes('emerald') ? 'bg-emerald-50 border-emerald-200' : 
                          result.color.includes('yellow') ? 'bg-yellow-50 border-yellow-200' : 
                          'bg-red-50 border-red-200'}`}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {getIcon()}
              </div>
              <CardTitle className="text-2xl">
                Viabilidade: {result.viabilityLevel}
              </CardTitle>
              <div className="text-4xl font-bold mb-2 text-foreground">
                {result.percentage}%
              </div>
              <Progress 
                value={result.percentage} 
                className="w-full h-3"
                style={{
                  // @ts-ignore
                  '--progress-background': getProgressColor()
                }}
              />
            </CardHeader>
          </Card>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Análise Detalhada
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                >
                  {showBreakdown ? 'Ocultar' : 'Ver Breakdown'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showBreakdown ? (
                <div className="space-y-4">
                  {result.breakdown.map((item, index) => (
                    <motion.div 
                      key={item.factor}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize">
                            {item.factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Peso: {item.weight.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={item.score} className="flex-1 h-2" />
                          <span className="text-sm font-medium w-12">
                            {item.score.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(result.scores).map(([key, score]) => (
                    <div key={key} className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-lg font-semibold">
                        {score.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recomendações Estratégicas
              </CardTitle>
              <CardDescription>
                Sugestões baseadas na análise dos fatores de viabilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button 
            onClick={handleWhatsAppContact}
            className="flex-1"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Falar com Especialista
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="flex-1"
            onClick={() => window.print()}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Salvar Resultado
          </Button>
        </motion.div>
      </div>

      <WhatsAppContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        calculatorName="Viabilidade de Projeto"
        contextualSummary={contextualSummary}
      />
    </>
  );
};

export default ViabilityResults;
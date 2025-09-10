import React from "react";
import { Calculator, DollarSign, Shield, TrendingUp, Clock, Beaker, CheckCircle, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ViabilityCalculator from "@/components/calculators/ViabilityCalculator";
import CostCalculator from "@/components/calculators/CostCalculator";
import RegulatoryRiskCalculator from "@/components/calculators/RegulatoryRiskCalculator";
import QbDComplexityEvaluator from "@/components/calculators/QbDComplexityEvaluator";
import TimelineEstimator from "@/components/calculators/TimelineEstimator";
import DoEPlanner from "@/components/calculators/DoEPlanner";
import ProcessRobustness from "@/components/calculators/ProcessRobustness";
import RSMOptimizer from "@/components/calculators/RSMOptimizer";

const ToolsPage: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = React.useState<string | null>(null);

  const calculators = [
    {
      id: 'viability',
      title: 'Calculadora de Viabilidade',
      description: 'Avalie a viabilidade técnica e comercial do seu projeto farmacêutico',
      icon: Calculator,
      color: 'bg-blue-500',
      available: true,
      component: ViabilityCalculator
    },
    {
      id: 'costs',
      title: 'Calculadora de Custos',
      description: 'Estime custos de desenvolvimento, regulatório e produção',
      icon: DollarSign,
      color: 'bg-green-500',
      available: true,
      component: CostCalculator
    },
    {
      id: 'regulatory-risk',
      title: 'Avaliador Risco Regulatório',
      description: 'Análise de complexidade e probabilidade de aprovação ANVISA',
      icon: Shield,
      color: 'bg-red-500',
      available: true,
      component: RegulatoryRiskCalculator
    },
    {
      id: 'qbd-complexity',
      title: 'Avaliador Complexidade QbD',
      description: 'Avalie a complexidade do desenvolvimento por Quality by Design',
      icon: TrendingUp,
      color: 'bg-purple-500',
      available: true,
      component: QbDComplexityEvaluator
    },
    {
      id: 'timeline',
      title: 'Estimador de Cronograma',
      description: 'Estime timeline de desenvolvimento até aprovação regulatória',
      icon: Clock,
      color: 'bg-orange-500',
      available: true,
      component: TimelineEstimator
    },
    {
      id: 'doe-planner',
      title: 'Planejador DoE',
      description: 'Planeje experimentos de desenvolvimento farmacêutico',
      icon: Beaker,
      color: 'bg-cyan-500',
      available: true,
      component: DoEPlanner
    },
    {
      id: 'process-robustness',
      title: 'Análise de Robustez',
      description: 'Avalie robustez e controle de processos farmacêuticos',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      available: true,
      component: ProcessRobustness
    },
    {
      id: 'rsm-optimizer',
      title: 'Otimizador RSM',
      description: 'Otimização de formulações usando Response Surface Methodology',
      icon: Zap,
      color: 'bg-yellow-500',
      available: true,
      component: RSMOptimizer
    }
  ];

  const comingSoonTools = [
    { title: 'ROI Farmacêutico', description: 'Análise de retorno sobre investimento', icon: TrendingUp },
    { title: 'Scale-up Calculator', description: 'Fatores de escala de produção', icon: TrendingUp },
    { title: 'Stability Studies Planner', description: 'Planejamento de estudos de estabilidade', icon: Clock },
    { title: 'Validation Planner', description: 'Matriz de validação e recursos', icon: CheckCircle }
  ];

  if (activeCalculator) {
    const calculator = calculators.find(c => c.id === activeCalculator);
    if (calculator && calculator.component) {
      const Component = calculator.component;
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveCalculator(null)}
                className="mb-4"
              >
                ← Voltar às Ferramentas
              </Button>
            </div>
            <Component />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ferramentas Interativas
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Calculadoras especializadas para acelerar seu desenvolvimento farmacêutico. 
              Análises técnicas baseadas em benchmarks da indústria e regulamentações vigentes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">8 Calculadoras Disponíveis</Badge>
              <Badge variant="secondary">Algoritmos Avançados</Badge>
              <Badge variant="secondary">Recomendações Inteligentes</Badge>
              <Badge variant="secondary">Integração WhatsApp</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Calculadoras Disponíveis */}
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Calculadoras Disponíveis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ferramentas validadas por especialistas da indústria farmacêutica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calculators.map((calculator, index) => {
              const Icon = calculator.icon;
              return (
                <motion.div
                  key={calculator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-lg ${calculator.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{calculator.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {calculator.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setActiveCalculator(calculator.id)}
                        className="w-full"
                        disabled={!calculator.available}
                      >
                        {calculator.available ? 'Usar Calculadora' : 'Em Breve'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Em Breve */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Próximas Ferramentas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expandindo continuamente nosso arsenal de ferramentas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + (0.1 * index) }}
                >
                  <Card className="h-full opacity-60">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="w-full justify-center">
                        Em Desenvolvimento
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-6 bg-muted/30 rounded-lg border"
        >
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">Aviso Importante</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As calculadoras fornecem estimativas baseadas em modelos matemáticos e benchmarks da indústria. 
              Os resultados são para fins informativos e não substituem consultoria especializada. 
              Para análises detalhadas e decisões críticas, consulte nossos especialistas.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolsPage;
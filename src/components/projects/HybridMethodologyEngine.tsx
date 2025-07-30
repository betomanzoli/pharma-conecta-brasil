
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Target, 
  Layers, 
  RefreshCw, 
  BarChart3, 
  Clock, 
  Users, 
  CheckCircle,
  TrendingUp,
  Settings,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MethodologyMix {
  pmbok: number;
  agile: number;
  lean: number;
  design_thinking: number;
}

interface PhaseConfiguration {
  name: string;
  methodology_mix: MethodologyMix;
  duration: string;
  key_practices: string[];
  success_criteria: string[];
  governance_level: 'low' | 'medium' | 'high';
  team_autonomy: number;
  documentation_level: number;
  change_tolerance: number;
}

interface HybridMethodologyEngineProps {
  projectType?: string;
  teamSize?: number;
  complexity?: 'low' | 'medium' | 'high';
  onMethodologyConfigured: (config: PhaseConfiguration[]) => void;
}

const HybridMethodologyEngine: React.FC<HybridMethodologyEngineProps> = ({
  projectType = 'pharmaceutical',
  teamSize = 8,
  complexity = 'medium',
  onMethodologyConfigured
}) => {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState(0);
  const [autoOptimize, setAutoOptimize] = useState(false);
  
  const [phases, setPhases] = useState<PhaseConfiguration[]>([
    {
      name: 'Iniciação e Discovery',
      methodology_mix: { pmbok: 40, agile: 20, lean: 20, design_thinking: 20 },
      duration: '2-4 semanas',
      key_practices: [
        'Charter de Projeto (PMBOK)',
        'Design Thinking Workshops',
        'Stakeholder Mapping',
        'Value Stream Analysis (Lean)'
      ],
      success_criteria: [
        'Escopo bem definido',
        'Stakeholders alinhados',
        'Riscos identificados',
        'Time formado'
      ],
      governance_level: 'high',
      team_autonomy: 30,
      documentation_level: 80,
      change_tolerance: 40
    },
    {
      name: 'Planejamento Adaptativo',
      methodology_mix: { pmbok: 50, agile: 30, lean: 15, design_thinking: 5 },
      duration: '3-6 semanas',
      key_practices: [
        'WBS e Cronograma (PMBOK)',
        'Sprint Planning (Agile)',
        'Kanban Board Setup',
        'Risk Register'
      ],
      success_criteria: [
        'Plano detalhado aprovado',
        'Sprints definidos',
        'Recursos alocados',
        'Baseline estabelecida'
      ],
      governance_level: 'high',
      team_autonomy: 40,
      documentation_level: 90,
      change_tolerance: 30
    },
    {
      name: 'Execução Ágil',
      methodology_mix: { pmbok: 20, agile: 60, lean: 15, design_thinking: 5 },
      duration: '8-16 semanas',
      key_practices: [
        'Daily Standups',
        'Sprint Reviews',
        'Continuous Integration',
        'Kaizen Events (Lean)'
      ],
      success_criteria: [
        'Entregas incrementais',
        'Velocity estável',
        'Quality gates passed',
        'Stakeholder satisfaction'
      ],
      governance_level: 'medium',
      team_autonomy: 80,
      documentation_level: 40,
      change_tolerance: 90
    },
    {
      name: 'Monitoramento e Controle',
      methodology_mix: { pmbok: 60, agile: 25, lean: 10, design_thinking: 5 },
      duration: 'Contínuo',
      key_practices: [
        'Earned Value Management',
        'Burndown Charts',
        'Risk Monitoring',
        'Quality Metrics'
      ],
      success_criteria: [
        'Métricas em dia',
        'Riscos controlados',
        'Orçamento no track',
        'Qualidade assegurada'
      ],
      governance_level: 'high',
      team_autonomy: 50,
      documentation_level: 70,
      change_tolerance: 50
    },
    {
      name: 'Entrega e Encerramento',
      methodology_mix: { pmbok: 70, agile: 15, lean: 10, design_thinking: 5 },
      duration: '2-4 semanas',
      key_practices: [
        'Final Deliverable Review',
        'Lessons Learned',
        'Project Closure',
        'Knowledge Transfer'
      ],
      success_criteria: [
        'Entregas aceitas',
        'Documentação completa',
        'Time liberado',
        'Conhecimento transferido'
      ],
      governance_level: 'high',
      team_autonomy: 30,
      documentation_level: 95,
      change_tolerance: 20
    }
  ]);

  const updatePhaseMethodology = (phaseIndex: number, methodology: keyof MethodologyMix, value: number) => {
    const updatedPhases = [...phases];
    const phase = updatedPhases[phaseIndex];
    
    // Update the specific methodology
    phase.methodology_mix[methodology] = value;
    
    // Auto-balance other methodologies to maintain 100%
    const total = Object.values(phase.methodology_mix).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      const difference = 100 - total;
      const otherMethodologies = Object.keys(phase.methodology_mix).filter(m => m !== methodology) as (keyof MethodologyMix)[];
      const adjustment = Math.floor(difference / otherMethodologies.length);
      
      otherMethodologies.forEach((method, index) => {
        if (index === otherMethodologies.length - 1) {
          // Last methodology gets the remainder
          phase.methodology_mix[method] = Math.max(0, phase.methodology_mix[method] + (difference - adjustment * (otherMethodologies.length - 1)));
        } else {
          phase.methodology_mix[method] = Math.max(0, phase.methodology_mix[method] + adjustment);
        }
      });
    }
    
    setPhases(updatedPhases);
  };

  const optimizeMethodologyAI = () => {
    setAutoOptimize(true);
    toast({
      title: "IA Otimizando Metodologia",
      description: "Analisando seu projeto para sugerir a melhor combinação metodológica..."
    });

    // Simulate AI optimization
    setTimeout(() => {
      const optimizedPhases = phases.map((phase, index) => {
        // AI suggestions based on project characteristics
        if (projectType === 'pharmaceutical' && complexity === 'high') {
          return {
            ...phase,
            methodology_mix: {
              pmbok: Math.max(30, phase.methodology_mix.pmbok + 10),
              agile: Math.min(50, phase.methodology_mix.agile),
              lean: phase.methodology_mix.lean + 5,
              design_thinking: Math.max(5, phase.methodology_mix.design_thinking)
            }
          };
        }
        return phase;
      });
      
      setPhases(optimizedPhases);
      setAutoOptimize(false);
      
      toast({
        title: "Otimização Concluída",
        description: "Metodologia otimizada com base nas melhores práticas para projetos farmacêuticos complexos."
      });
    }, 3000);
  };

  const getMethodologyColor = (methodology: string) => {
    const colors = {
      pmbok: 'bg-blue-500',
      agile: 'bg-green-500',
      lean: 'bg-orange-500',
      design_thinking: 'bg-purple-500'
    };
    return colors[methodology] || 'bg-gray-500';
  };

  const getGovernanceColor = (level: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };

  const calculateOverallMethodologyMix = () => {
    const overall = { pmbok: 0, agile: 0, lean: 0, design_thinking: 0 };
    phases.forEach(phase => {
      overall.pmbok += phase.methodology_mix.pmbok;
      overall.agile += phase.methodology_mix.agile;
      overall.lean += phase.methodology_mix.lean;
      overall.design_thinking += phase.methodology_mix.design_thinking;
    });
    
    // Average across phases
    Object.keys(overall).forEach(key => {
      overall[key] = Math.round(overall[key] / phases.length);
    });
    
    return overall;
  };

  const overall = calculateOverallMethodologyMix();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Layers className="h-6 w-6 text-primary" />
            <span>Engine de Metodologia Híbrida</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Configure a combinação metodológica ideal para cada fase do projeto
          </p>
        </div>
        
        <Button onClick={optimizeMethodologyAI} disabled={autoOptimize}>
          {autoOptimize ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Otimizando...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Otimizar com IA
            </>
          )}
        </Button>
      </div>

      {/* Overall Methodology Mix Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Visão Geral da Metodologia</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(overall).map(([methodology, percentage]) => (
              <div key={methodology} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(percentage * 188) / 100} 188`}
                      className={getMethodologyColor(methodology).replace('bg-', 'text-')}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{percentage}%</span>
                  </div>
                </div>
                <p className="text-sm font-medium capitalize">{methodology.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase Configuration */}
      <Tabs value={activePhase.toString()} onValueChange={(value) => setActivePhase(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-5">
          {phases.map((phase, index) => (
            <TabsTrigger key={index} value={index.toString()} className="text-xs">
              {phase.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {phases.map((phase, phaseIndex) => (
          <TabsContent key={phaseIndex} value={phaseIndex.toString()}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>{phase.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{phase.duration}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Methodology Mix Sliders */}
                <div>
                  <h4 className="font-semibold mb-4">Combinação Metodológica</h4>
                  <div className="space-y-4">
                    {Object.entries(phase.methodology_mix).map(([methodology, value]) => (
                      <div key={methodology} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium capitalize">
                            {methodology.replace('_', ' ')}
                          </label>
                          <span className="text-sm text-gray-600">{value}%</span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(newValue) => 
                            updatePhaseMethodology(phaseIndex, methodology as keyof MethodologyMix, newValue[0])
                          }
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className={`h-2 rounded-full ${getMethodologyColor(methodology)}`} 
                             style={{ width: `${value}%` }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nível de Governança</label>
                    <Select 
                      value={phase.governance_level}
                      onValueChange={(value: 'low' | 'medium' | 'high') => {
                        const updatedPhases = [...phases];
                        updatedPhases[phaseIndex].governance_level = value;
                        setPhases(updatedPhases);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixo</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="high">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Autonomia da Equipe: {phase.team_autonomy}%
                    </label>
                    <Slider
                      value={[phase.team_autonomy]}
                      onValueChange={(value) => {
                        const updatedPhases = [...phases];
                        updatedPhases[phaseIndex].team_autonomy = value[0];
                        setPhases(updatedPhases);
                      }}
                      max={100}
                      step={10}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nível de Documentação: {phase.documentation_level}%
                    </label>
                    <Slider
                      value={[phase.documentation_level]}
                      onValueChange={(value) => {
                        const updatedPhases = [...phases];
                        updatedPhases[phaseIndex].documentation_level = value[0];
                        setPhases(updatedPhases);
                      }}
                      max={100}
                      step={10}
                    />
                  </div>
                </div>

                {/* Key Practices and Success Criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Práticas Principais</h4>
                    <div className="space-y-2">
                      {phase.key_practices.map((practice, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Critérios de Sucesso</h4>
                    <div className="space-y-2">
                      {phase.success_criteria.map((criteria, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                {autoOptimize && (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recomendação IA:</strong> Para projetos farmacêuticos complexos, 
                      recomenda-se aumentar o componente PMBOK para 50% nesta fase para melhor controle de riscos.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Salvar Template
        </Button>
        <Button onClick={() => onMethodologyConfigured(phases)}>
          <Zap className="h-4 w-4 mr-2" />
          Aplicar Metodologia
        </Button>
      </div>
    </div>
  );
};

export default HybridMethodologyEngine;

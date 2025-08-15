
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Brain, 
  Shield,
  BarChart3,
  Lightbulb,
  Network
} from 'lucide-react';
import { StrategicProject, SharedValueMetrics } from '@/types/strategic-plan';
import Phase1AIMatching from './phases/Phase1AIMatching';
import Phase2Governance from './phases/Phase2Governance';
import Phase3SharedValue from './phases/Phase3SharedValue';
import Phase4GomesCasseres from './phases/Phase4GomesCasseres';
import Phase5PredictiveAnalysis from './phases/Phase5PredictiveAnalysis';
import PredictiveAnalytics from '../analytics/PredictiveAnalytics';

const StrategicPlanDashboard = () => {
  const [activePhase, setActivePhase] = useState('phase1');
  const [projects, setProjects] = useState<StrategicProject[]>([]);
  const [sharedValue, setSharedValue] = useState<SharedValueMetrics>({
    economicValue: 0,
    socialValue: 0,
    environmentalValue: 0,
    stakeholderValue: 0,
    innovationValue: 0,
    totalSharedValue: 0
  });

  useEffect(() => {
    // Simular carregamento de dados
    const mockProjects: StrategicProject[] = [
      {
        id: '1',
        name: 'Integração AI Matching Avançado',
        description: 'Implementação de sistema de matching inteligente com ML',
        phase: 'execution',
        priority: 'high',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15'),
        budget: 150000,
        partners: ['BioTech Labs', 'PharmaCorp', 'AI Solutions'],
        aiMatchingScore: 0.87,
        riskLevel: 'medium',
        expectedValue: 500000,
        actualValue: 320000,
        status: 'active',
        kpis: [],
        milestones: [],
        collaborativeGovernance: {
          decisionMakingSpeed: 8.5,
          stakeholderEngagement: 9.2,
          conflictResolution: 7.8,
          transparencyScore: 8.9,
          complianceLevel: 9.5,
          collaborationIndex: 8.7
        },
        predictiveAnalysis: {
          successProbability: 0.82,
          riskFactors: [],
          marketTrends: [],
          competitiveAnalysis: [],
          recommendations: []
        }
      }
    ];

    const mockSharedValue: SharedValueMetrics = {
      economicValue: 1250000,
      socialValue: 850000,
      environmentalValue: 450000,
      stakeholderValue: 920000,
      innovationValue: 780000,
      totalSharedValue: 4250000
    };

    setProjects(mockProjects);
    setSharedValue(mockSharedValue);
  }, []);

  const phases = [
    {
      id: 'phase1',
      title: 'Fase 1: AI Matching + Projetos',
      icon: Brain,
      color: 'bg-blue-500',
      progress: 75,
      status: 'active'
    },
    {
      id: 'phase2',
      title: 'Fase 2: Governança Colaborativa',
      icon: Users,
      color: 'bg-green-500',
      progress: 45,
      status: 'active'
    },
    {
      id: 'phase3',
      title: 'Fase 3: Métricas Valor Compartilhado',
      icon: TrendingUp,
      color: 'bg-purple-500',
      progress: 30,
      status: 'planning'
    },
    {
      id: 'phase4',
      title: 'Fase 4: Leis Gomes-Casseres',
      icon: Shield,
      color: 'bg-orange-500',
      progress: 15,
      status: 'planning'
    },
    {
      id: 'phase5',
      title: 'Fase 5: Análise Preditiva',
      icon: BarChart3,
      color: 'bg-red-500',
      progress: 5,
      status: 'planning'
    },
    {
      id: 'predictive',
      title: 'Analytics Preditivo',
      icon: Lightbulb,
      color: 'bg-indigo-500',
      progress: 60,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plano de Melhorias Estratégicas</h1>
          <p className="text-gray-600 mt-2">
            Implementação completa das 5 fases do plano estratégico com análise preditiva
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Network className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">
            Valor Compartilhado: R$ {sharedValue.totalSharedValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visão Geral das Fases */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {phases.map((phase) => {
          const IconComponent = phase.icon;
          return (
            <Card 
              key={phase.id} 
              className={`cursor-pointer transition-all ${activePhase === phase.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActivePhase(phase.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${phase.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-2">{phase.title}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progresso</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Projetos Ativos</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">ROI Médio</p>
                <p className="text-2xl font-bold">284%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Parceiros Ativos</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Inovações</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo das Fases */}
      <div className="mt-8">
        {activePhase === 'phase1' && (
          <Phase1AIMatching 
            projects={projects.filter(p => p.phase === 'execution')}
            onProjectUpdate={setProjects}
          />
        )}
        {activePhase === 'phase2' && (
          <Phase2Governance 
            projects={projects}
            onProjectUpdate={setProjects}
          />
        )}
        {activePhase === 'phase3' && (
          <Phase3SharedValue 
            sharedValue={sharedValue}
            projects={projects}
            onValueUpdate={setSharedValue}
          />
        )}
        {activePhase === 'phase4' && (
          <Phase4GomesCasseres 
            projects={projects}
            onProjectUpdate={setProjects}
          />
        )}
        {activePhase === 'phase5' && (
          <Phase5PredictiveAnalysis 
            projects={projects}
            onProjectUpdate={setProjects}
          />
        )}
        {activePhase === 'predictive' && (
          <PredictiveAnalytics />
        )}
      </div>
    </div>
  );
};

export default StrategicPlanDashboard;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Settings, Users, Calendar, Target, Zap, Brain, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdaptiveTemplate {
  id: string;
  name: string;
  methodology: 'pmbok' | 'agile' | 'hybrid' | 'lean';
  industry_focus: string[];
  complexity_level: 'low' | 'medium' | 'high';
  duration_range: string;
  team_size_range: string;
  ai_features: string[];
  governance_structure: any;
  phases: any[];
  success_metrics: string[];
  risk_factors: string[];
}

interface AdaptiveProjectTemplatesProps {
  onTemplateSelected: (template: AdaptiveTemplate) => void;
}

const AdaptiveProjectTemplates: React.FC<AdaptiveProjectTemplatesProps> = ({ onTemplateSelected }) => {
  const { toast } = useToast();
  const [selectedFilters, setSelectedFilters] = useState({
    methodology: '',
    complexity: '',
    industry: '',
    team_size: ''
  });
  const [customization, setCustomization] = useState({
    project_goals: '',
    specific_requirements: '',
    compliance_needs: '',
    stakeholder_preferences: ''
  });

  const adaptiveTemplates: AdaptiveTemplate[] = [
    {
      id: 'hybrid-pharma-rd',
      name: 'P&D Farmacêutico Híbrido',
      methodology: 'hybrid',
      industry_focus: ['farmaceutico', 'biotecnologia'],
      complexity_level: 'high',
      duration_range: '12-24 meses',
      team_size_range: '8-15 pessoas',
      ai_features: [
        'Análise preditiva de eficácia',
        'Otimização de cronograma adaptativo',
        'Monitoramento regulatório automático',
        'Gestão de riscos clínicos'
      ],
      governance_structure: {
        decision_levels: ['Steering Committee', 'Project Board', 'Operational Team'],
        review_cycles: ['Sprint Reviews', 'Milestone Gates', 'Regulatory Checkpoints'],
        escalation_matrix: ['Low: Team Lead', 'Medium: Project Manager', 'High: Steering Committee']
      },
      phases: [
        {
          name: 'Discovery & Planning',
          methodology_blend: '60% PMBOK + 40% Design Thinking',
          duration: '2-3 meses',
          key_activities: ['Feasibility Study', 'Regulatory Mapping', 'Team Formation']
        },
        {
          name: 'Development Sprints',
          methodology_blend: '30% PMBOK + 70% Agile',
          duration: '8-12 meses',
          key_activities: ['Iterative Development', 'Continuous Testing', 'Regulatory Updates']
        },
        {
          name: 'Validation & Closure',
          methodology_blend: '80% PMBOK + 20% Lean',
          duration: '2-4 meses',
          key_activities: ['Final Validation', 'Documentation', 'Knowledge Transfer']
        }
      ],
      success_metrics: [
        'Time to Market Reduction: 15-25%',
        'Regulatory Compliance Score: >95%',
        'Team Satisfaction: >4.5/5',
        'Budget Variance: <10%'
      ],
      risk_factors: [
        'Mudanças regulatórias durante desenvolvimento',
        'Complexidade técnica subestimada',
        'Dependências externas críticas'
      ]
    },
    {
      id: 'agile-supplement-launch',
      name: 'Lançamento de Suplemento Ágil',
      methodology: 'agile',
      industry_focus: ['suplementos', 'nutriceuticos'],
      complexity_level: 'medium',
      duration_range: '6-9 meses',
      team_size_range: '5-8 pessoas',
      ai_features: [
        'Market trend analysis',
        'Consumer sentiment tracking',
        'Supply chain optimization',
        'Launch readiness assessment'
      ],
      governance_structure: {
        decision_levels: ['Product Owner', 'Scrum Master', 'Development Team'],
        review_cycles: ['Daily Standups', 'Sprint Reviews', 'Release Planning'],
        escalation_matrix: ['Low: Scrum Master', 'Medium: Product Owner', 'High: Business Sponsor']
      },
      phases: [
        {
          name: 'Product Discovery',
          methodology_blend: '20% PMBOK + 80% Agile',
          duration: '1 mês',
          key_activities: ['Market Research', 'User Stories', 'MVP Definition']
        },
        {
          name: 'Iterative Development',
          methodology_blend: '10% PMBOK + 90% Agile',
          duration: '4-6 meses',
          key_activities: ['Sprint Development', 'Continuous Testing', 'Stakeholder Feedback']
        },
        {
          name: 'Launch Preparation',
          methodology_blend: '50% PMBOK + 50% Agile',
          duration: '1-2 meses',
          key_activities: ['Final Testing', 'Marketing Preparation', 'Launch Execution']
        }
      ],
      success_metrics: [
        'Time to Market: <9 meses',
        'Customer Satisfaction: >4.0/5',
        'Market Share Target: Achieved',
        'Cost Efficiency: >90%'
      ],
      risk_factors: [
        'Mudanças nas preferências do consumidor',
        'Competição acirrada no mercado',
        'Desafios na cadeia de suprimentos'
      ]
    },
    {
      id: 'lean-process-optimization',
      name: 'Otimização de Processo Lean',
      methodology: 'lean',
      industry_focus: ['producao', 'qualidade'],
      complexity_level: 'medium',
      duration_range: '3-6 meses',
      team_size_range: '4-6 pessoas',
      ai_features: [
        'Process mining e analysis',
        'Waste identification automation',
        'Performance prediction',
        'Continuous improvement suggestions'
      ],
      governance_structure: {
        decision_levels: ['Improvement Leader', 'Process Owner', 'Implementation Team'],
        review_cycles: ['Weekly Gemba Walks', 'Monthly Reviews', 'Quarterly Assessments'],
        escalation_matrix: ['Low: Team Member', 'Medium: Process Owner', 'High: Improvement Leader']
      },
      phases: [
        {
          name: 'Current State Analysis',
          methodology_blend: '30% PMBOK + 70% Lean',
          duration: '2-4 semanas',
          key_activities: ['Value Stream Mapping', 'Waste Identification', 'Root Cause Analysis']
        },
        {
          name: 'Solution Design',
          methodology_blend: '20% PMBOK + 80% Lean',
          duration: '4-6 semanas',
          key_activities: ['Future State Design', 'Pilot Planning', 'Change Management']
        },
        {
          name: 'Implementation & Standardization',
          methodology_blend: '40% PMBOK + 60% Lean',
          duration: '2-4 meses',
          key_activities: ['Pilot Implementation', 'Full Rollout', 'Standardization']
        }
      ],
      success_metrics: [
        'Process Efficiency Gain: >20%',
        'Waste Reduction: >30%',
        'Employee Engagement: >4.0/5',
        'Cost Savings: Measurable ROI'
      ],
      risk_factors: [
        'Resistência à mudança organizacional',
        'Suporte insuficiente da liderança',
        'Complexidade técnica subestimada'
      ]
    },
    {
      id: 'pmbok-regulatory-compliance',
      name: 'Conformidade Regulatória PMBOK',
      methodology: 'pmbok',
      industry_focus: ['regulatorio', 'qualidade'],
      complexity_level: 'high',
      duration_range: '9-15 meses',
      team_size_range: '6-12 pessoas',
      ai_features: [
        'Regulatory change monitoring',
        'Compliance gap analysis',
        'Documentation automation',
        'Audit readiness assessment'
      ],
      governance_structure: {
        decision_levels: ['Project Sponsor', 'Project Manager', 'Technical Leads', 'Quality Assurance'],
        review_cycles: ['Weekly Status', 'Monthly Steering', 'Quarterly Gates'],
        escalation_matrix: ['Low: Team Lead', 'Medium: Project Manager', 'High: Project Sponsor']
      },
      phases: [
        {
          name: 'Initiation & Planning',
          methodology_blend: '90% PMBOK + 10% Lean',
          duration: '2-3 meses',
          key_activities: ['Scope Definition', 'Risk Assessment', 'Compliance Mapping']
        },
        {
          name: 'Execution & Monitoring',
          methodology_blend: '80% PMBOK + 20% Agile',
          duration: '5-9 meses',
          key_activities: ['Process Implementation', 'Documentation', 'Quality Assurance']
        },
        {
          name: 'Validation & Closure',
          methodology_blend: '95% PMBOK + 5% Lean',
          duration: '2-3 meses',
          key_activities: ['Final Validation', 'Audit Preparation', 'Project Closure']
        }
      ],
      success_metrics: [
        'Regulatory Compliance: 100%',
        'Audit Readiness: Complete',
        'Documentation Quality: >95%',
        'Process Adherence: >90%'
      ],
      risk_factors: [
        'Mudanças regulatórias durante execução',
        'Complexidade da documentação',
        'Recursos especializados limitados'
      ]
    }
  ];

  const getMethodologyColor = (methodology: string) => {
    const colors = {
      pmbok: 'bg-blue-100 text-blue-800',
      agile: 'bg-green-100 text-green-800',
      hybrid: 'bg-purple-100 text-purple-800',
      lean: 'bg-orange-100 text-orange-800'
    };
    return colors[methodology] || 'bg-gray-100 text-gray-800';
  };

  const getComplexityColor = (complexity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[complexity] || 'bg-gray-100 text-gray-800';
  };

  const filteredTemplates = adaptiveTemplates.filter(template => {
    return (!selectedFilters.methodology || template.methodology === selectedFilters.methodology) &&
           (!selectedFilters.complexity || template.complexity_level === selectedFilters.complexity);
  });

  const handleTemplateSelect = (template: AdaptiveTemplate) => {
    onTemplateSelected(template);
    toast({
      title: "Template Selecionado",
      description: `${template.name} foi configurado para seu projeto`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <Settings className="h-6 w-6 text-primary" />
          <span>Templates Adaptativos Inteligentes</span>
        </h2>
        <p className="text-gray-600">
          Templates que se adaptam automaticamente às necessidades do seu projeto
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personalização Inteligente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Select onValueChange={(value) => setSelectedFilters({...selectedFilters, methodology: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Metodologia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pmbok">PMBOK</SelectItem>
                <SelectItem value="agile">Agile</SelectItem>
                <SelectItem value="hybrid">Híbrido</SelectItem>
                <SelectItem value="lean">Lean</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSelectedFilters({...selectedFilters, complexity: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Complexidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Setor (ex: farmacêutico)"
              onChange={(e) => setSelectedFilters({...selectedFilters, industry: e.target.value})}
            />

            <Input
              placeholder="Tamanho da Equipe"
              onChange={(e) => setSelectedFilters({...selectedFilters, team_size: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Textarea
              placeholder="Objetivos específicos do projeto..."
              value={customization.project_goals}
              onChange={(e) => setCustomization({...customization, project_goals: e.target.value})}
              rows={2}
            />
            <Textarea
              placeholder="Requisitos especiais ou restrições..."
              value={customization.specific_requirements}
              onChange={(e) => setCustomization({...customization, specific_requirements: e.target.value})}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getMethodologyColor(template.methodology)}>
                      {template.methodology.toUpperCase()}
                    </Badge>
                    <Badge className={getComplexityColor(template.complexity_level)}>
                      {template.complexity_level}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{template.duration_range}</p>
                  <p>{template.team_size_range}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Visão</TabsTrigger>
                  <TabsTrigger value="phases">Fases</TabsTrigger>
                  <TabsTrigger value="governance">Governança</TabsTrigger>
                  <TabsTrigger value="ai">IA</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-3">
                  <div>
                    <h5 className="font-medium mb-2">Métricas de Sucesso</h5>
                    <div className="space-y-1">
                      {template.success_metrics.slice(0, 3).map((metric, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Target className="h-3 w-3 text-green-500" />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="phases" className="space-y-3">
                  {template.phases.map((phase, index) => (
                    <div key={index} className="border-l-2 border-primary pl-3">
                      <h6 className="font-medium text-sm">{phase.name}</h6>
                      <p className="text-xs text-gray-600">{phase.methodology_blend}</p>
                      <p className="text-xs text-gray-500">{phase.duration}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="governance" className="space-y-3">
                  <div>
                    <h5 className="font-medium mb-2 text-sm">Estrutura de Decisão</h5>
                    <div className="space-y-1">
                      {template.governance_structure.decision_levels.slice(0, 3).map((level, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span>{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-3">
                  <div>
                    <h5 className="font-medium mb-2 text-sm">Recursos de IA</h5>
                    <div className="space-y-1">
                      {template.ai_features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <Brain className="h-3 w-3 text-purple-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={() => handleTemplateSelect(template)}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Usar Template Adaptativo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdaptiveProjectTemplates;

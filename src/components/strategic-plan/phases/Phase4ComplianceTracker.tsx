
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Target,
  TrendingUp,
  FileText,
  Users,
  Zap
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  law_id: string;
  law_name: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'pending';
  score: number;
  evidence: string[];
  responsible_team: string;
  due_date: string;
  last_updated: string;
}

interface Phase4ComplianceTrackerProps {
  projectId?: string;
}

const Phase4ComplianceTracker: React.FC<Phase4ComplianceTrackerProps> = ({ projectId }) => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [overallScore, setOverallScore] = useState(86);

  useEffect(() => {
    // Simulate compliance tracking data
    const mockCompliance: ComplianceItem[] = [
      {
        id: '1',
        law_id: '1',
        law_name: 'Lei da Complementaridade',
        requirement: 'Identificar e documentar gaps de recursos e capacidades',
        status: 'compliant',
        score: 92,
        evidence: ['Gap Analysis Report', 'Resource Mapping Document', 'Partnership Assessment'],
        responsible_team: 'Strategic Planning',
        due_date: '2024-12-31',
        last_updated: new Date().toISOString()
      },
      {
        id: '2',
        law_id: '2',
        law_name: 'Lei da Reciprocidade',
        requirement: 'Estabelecer estrutura de valor compartilhado balanceada',
        status: 'partial',
        score: 78,
        evidence: ['Value Distribution Framework', 'Partner Satisfaction Survey'],
        responsible_team: 'Partnership Management',
        due_date: '2024-11-30',
        last_updated: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        law_id: '3',
        law_name: 'Lei da Governança Adaptativa',
        requirement: 'Implementar mecanismos de governance flexível',
        status: 'pending',
        score: 65,
        evidence: ['Governance Framework Draft'],
        responsible_team: 'Legal & Compliance',
        due_date: '2024-10-15',
        last_updated: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    setComplianceItems(mockCompliance);
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <Clock className="h-4 w-4" />;
      case 'non_compliant': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const updateCompliance = (itemId: string) => {
    // Simulate compliance update
    setComplianceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, last_updated: new Date().toISOString(), score: Math.min(100, item.score + 5) }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Compliance Tracker - Leis de Gomes-Casseres</span>
          </h3>
          <p className="text-gray-600 mt-1">
            Monitoramento em tempo real do cumprimento das leis estratégicas
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{overallScore}%</div>
          <div className="text-sm text-gray-600">Score Geral</div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Progresso Geral de Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Progress value={overallScore} className="h-4" />
              </div>
              <span className="text-lg font-semibold">{overallScore}%</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {complianceItems.filter(item => item.status === 'compliant').length}
                </div>
                <div className="text-sm text-gray-600">Compliant</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {complianceItems.filter(item => item.status === 'partial').length}
                </div>
                <div className="text-sm text-gray-600">Parcial</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {complianceItems.filter(item => item.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendente</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {complianceItems.filter(item => item.status === 'non_compliant').length}
                </div>
                <div className="text-sm text-gray-600">Não Compliant</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <div className="space-y-4">
        {complianceItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span>{item.law_name}</span>
                </CardTitle>
                <Badge className={getStatusColor(item.status)}>
                  {item.status} - {item.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requisito</h4>
                <p className="text-gray-600">{item.requirement}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>Evidências</span>
                  </h4>
                  <ul className="space-y-1">
                    {item.evidence.map((evidence, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Responsável</span>
                  </h4>
                  <p className="text-sm text-gray-600">{item.responsible_team}</p>
                  
                  <h4 className="font-medium text-gray-900 mb-1 mt-3">Prazo</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(item.due_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Score de Compliance</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Progress value={item.score} className="h-3" />
                  </div>
                  <span className="text-sm font-medium">{item.score}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Última atualização: {new Date(item.last_updated).toLocaleString('pt-BR')}
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateCompliance(item.id)}
                  className="flex items-center space-x-1"
                >
                  <Zap className="h-3 w-3" />
                  <span>Atualizar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Phase4ComplianceTracker;

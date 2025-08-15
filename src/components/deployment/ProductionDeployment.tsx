
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Rocket, 
  GitBranch, 
  Shield, 
  Activity,
  Database,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Monitor
} from 'lucide-react';

interface DeploymentStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration: number;
  description: string;
  requirements: string[];
  automated: boolean;
}

interface Environment {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  version: string;
  lastDeploy: string;
  uptime: number;
  health: {
    api: boolean;
    database: boolean;
    auth: boolean;
    monitoring: boolean;
  };
}

const ProductionDeployment: React.FC = () => {
  const [deploymentStages, setDeploymentStages] = useState<DeploymentStage[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  useEffect(() => {
    initializeDeploymentStages();
    loadEnvironmentStatus();
  }, []);

  const initializeDeploymentStages = () => {
    const stages: DeploymentStage[] = [
      {
        id: 'pre-checks',
        name: 'Verificações Pré-Deploy',
        status: 'pending',
        duration: 0,
        description: 'Validar testes, security scan e qualidade do código',
        requirements: [
          'Todos os testes passando (95%+ coverage)',
          'Security scan sem vulnerabilidades críticas',
          'Code quality score > 8.0',
          'Performance benchmarks aprovados'
        ],
        automated: true
      },
      {
        id: 'build',
        name: 'Build e Otimização',
        status: 'pending',
        duration: 0,
        description: 'Compilar aplicação com otimizações de produção',
        requirements: [
          'Bundle size < 500KB (gzipped)',
          'Tree shaking aplicado',
          'Assets otimizados para CDN',
          'Service worker configurado'
        ],
        automated: true
      },
      {
        id: 'security-hardening',
        name: 'Hardening de Segurança',
        status: 'pending',
        duration: 0,
        description: 'Aplicar configurações de segurança para produção',
        requirements: [
          'HTTPS forçado com HSTS',
          'CSP headers configurados',
          'Rate limiting ativo',
          'WAF configurado'
        ],
        automated: true
      },
      {
        id: 'database-migration',
        name: 'Migração de Database',
        status: 'pending',
        duration: 0,
        description: 'Aplicar migrações e otimizações de database',
        requirements: [
          'Backup completo realizado',
          'Migrações testadas em staging',
          'Índices otimizados',
          'RLS policies verificadas'
        ],
        automated: false
      },
      {
        id: 'blue-green-deploy',
        name: 'Deploy Blue-Green',
        status: 'pending',
        duration: 0,
        description: 'Deploy sem downtime usando estratégia blue-green',
        requirements: [
          'Ambiente green preparado',
          'Load balancer configurado',
          'Health checks funcionando',
          'Rollback automatizado pronto'
        ],
        automated: true
      },
      {
        id: 'smoke-tests',
        name: 'Smoke Tests',
        status: 'pending',
        duration: 0,
        description: 'Testes críticos no ambiente de produção',
        requirements: [
          'Login/logout funcionando',
          'APIs críticas respondendo',
          'Dashboard carregando < 3s',
          'Funcionalidades principais OK'
        ],
        automated: true
      },
      {
        id: 'monitoring-setup',
        name: 'Configuração de Monitoramento',
        status: 'pending',
        duration: 0,
        description: 'Ativar monitoramento e alertas de produção',
        requirements: [
          'APM configurado',
          'Alertas críticos ativos',
          'Logs centralizados',
          'Dashboards de produção'
        ],
        automated: true
      },
      {
        id: 'traffic-switch',
        name: 'Switch de Tráfego',
        status: 'pending',
        duration: 0,
        description: 'Direcionar tráfego para nova versão',
        requirements: [
          'Canary release (10% tráfego)',
          'Métricas estáveis por 10min',
          '100% tráfego após validação',
          'Ambiente blue desativado'
        ],
        automated: false
      }
    ];

    setDeploymentStages(stages);
  };

  const loadEnvironmentStatus = () => {
    const envs: Environment[] = [
      {
        name: 'Development',
        status: 'healthy',
        version: 'v1.2.3-dev.45',
        lastDeploy: '2024-01-15T14:30:00Z',
        uptime: 99.2,
        health: {
          api: true,
          database: true,
          auth: true,
          monitoring: true
        }
      },
      {
        name: 'Staging',
        status: 'healthy',
        version: 'v1.2.2',
        lastDeploy: '2024-01-14T09:15:00Z',
        uptime: 99.8,
        health: {
          api: true,
          database: true,
          auth: true,
          monitoring: true
        }
      },
      {
        name: 'Production',
        status: 'warning',
        version: 'v1.2.1',
        lastDeploy: '2024-01-10T16:45:00Z',
        uptime: 99.95,
        health: {
          api: true,
          database: true,
          auth: true,
          monitoring: false
        }
      }
    ];

    setEnvironments(envs);
  };

  const startDeployment = async () => {
    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      for (let i = 0; i < deploymentStages.length; i++) {
        const stage = deploymentStages[i];
        
        setDeploymentStages(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'running' } : s
        ));

        // Simular tempo de execução baseado na complexidade da stage
        const duration = stage.automated ? 
          Math.random() * 3000 + 1000 : // 1-4s para automatizado
          Math.random() * 8000 + 5000;  // 5-13s para manual

        await new Promise(resolve => setTimeout(resolve, duration));

        // Simular possíveis falhas baseadas na realidade
        const shouldFail = Math.random() < (
          stage.id === 'database-migration' ? 0.15 :
          stage.id === 'blue-green-deploy' ? 0.1 :
          stage.id === 'traffic-switch' ? 0.05 :
          0.02
        );

        const status = shouldFail ? 'failed' : 'success';

        setDeploymentStages(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status, duration: Math.round(duration) } : s
        ));

        if (shouldFail) {
          setDeploymentProgress((i + 1) / deploymentStages.length * 100);
          break;
        }

        setDeploymentProgress((i + 1) / deploymentStages.length * 100);
      }
    } finally {
      setIsDeploying(false);
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEnvironmentIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'offline': return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEnvironmentColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'offline': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const completedStages = deploymentStages.filter(s => s.status === 'success').length;
  const failedStages = deploymentStages.filter(s => s.status === 'failed').length;
  const totalTime = deploymentStages.reduce((acc, stage) => acc + stage.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header do Deploy */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-purple-600" />
              Deploy de Produção - Enterprise Ready
            </CardTitle>
            <Button 
              onClick={startDeployment} 
              disabled={isDeploying}
              className="flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              {isDeploying ? 'Deployment em Curso...' : 'Iniciar Deploy Produção'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${completedStages === deploymentStages.length ? 'text-green-600' : 'text-blue-600'}`}>
                {Math.round(deploymentProgress)}%
              </div>
              <div className="text-sm text-muted-foreground">Progresso</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completedStages}</div>
              <div className="text-sm text-muted-foreground">Stages Completas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{failedStages}</div>
              <div className="text-sm text-muted-foreground">Falhas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(totalTime / 1000)}s</div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
            </div>
          </div>
          {isDeploying && (
            <div className="mt-4">
              <Progress value={deploymentProgress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status dos Ambientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Status dos Ambientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {environments.map((env) => (
              <Card key={env.name} className={`${getEnvironmentColor(env.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getEnvironmentIcon(env.status)}
                      {env.name}
                    </CardTitle>
                    <Badge variant="outline">{env.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span className="font-bold">{env.uptime}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Último deploy: {new Date(env.lastDeploy).toLocaleString('pt-BR')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${env.health.api ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${env.health.api ? 'bg-green-500' : 'bg-red-500'}`} />
                        API
                      </div>
                      <div className={`flex items-center gap-1 ${env.health.database ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${env.health.database ? 'bg-green-500' : 'bg-red-500'}`} />
                        Database
                      </div>
                      <div className={`flex items-center gap-1 ${env.health.auth ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${env.health.auth ? 'bg-green-500' : 'bg-red-500'}`} />
                        Auth
                      </div>
                      <div className={`flex items-center gap-1 ${env.health.monitoring ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${env.health.monitoring ? 'bg-green-500' : 'bg-red-500'}`} />
                        Monitor
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline de Deploy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Pipeline de Deploy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentStages.map((stage, index) => (
              <div key={stage.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex flex-col items-center">
                  {getStageIcon(stage.status)}
                  {index < deploymentStages.length - 1 && (
                    <div className="w-px h-8 bg-gray-300 mt-2" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium flex items-center gap-2">
                      {stage.name}
                      {stage.automated && (
                        <Badge variant="outline" className="text-xs">
                          AUTO
                        </Badge>
                      )}
                    </h4>
                    {stage.duration > 0 && (
                      <Badge variant="outline">
                        {(stage.duration / 1000).toFixed(1)}s
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
                  
                  <div className="space-y-1">
                    {stage.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          stage.status === 'success' ? 'bg-green-500' :
                          stage.status === 'failed' ? 'bg-red-500' :
                          stage.status === 'running' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`} />
                        <span className="text-muted-foreground">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Status */}
      {failedStages > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Deploy Falhado:</strong> {failedStages} stage(s) falharam. 
            Verifique os logs e execute rollback se necessário. Ambiente de produção mantido na versão anterior.
          </AlertDescription>
        </Alert>
      )}

      {completedStages === deploymentStages.length && deploymentStages.length > 0 && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <strong>Deploy Concluído com Sucesso!</strong> Nova versão está ativa em produção. 
            Tempo total: {Math.round(totalTime / 1000)}s. Todos os health checks passaram.
          </AlertDescription>
        </Alert>
      )}

      {/* Controles de Ambiente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Controles de Produção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Rollback
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Backup DB
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Health Check
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionDeployment;

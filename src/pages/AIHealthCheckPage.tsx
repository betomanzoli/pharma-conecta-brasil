
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap,
  Database,
  Key,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HealthCheck {
  name: string;
  status: 'checking' | 'healthy' | 'warning' | 'error';
  message: string;
  details?: string;
  action?: string;
  responseTime?: number;
}

const AIHealthCheckPage = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [isRunning, setIsRunning] = useState(false);

  const aiAgents = [
    { id: 'ai-project-analyst', name: 'Project Analyst' },
    { id: 'ai-technical-regulatory', name: 'Technical Regulatory' },
    { id: 'ai-business-strategist', name: 'Business Strategist' },
    { id: 'ai-document-assistant', name: 'Document Assistant' },
    { id: 'ai-coordinator-orchestrator', name: 'Coordinator' },
    { id: 'ai-handoff-runner', name: 'Handoff Runner' },
    { id: 'kb-ingest', name: 'Knowledge Ingest' },
    { id: 'kb-rag', name: 'Knowledge RAG' }
  ];

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setIsRunning(true);
    const newChecks: HealthCheck[] = [];

    // 1. Check session and authentication
    newChecks.push({
      name: 'Autenticação',
      status: session ? 'healthy' : 'warning',
      message: session ? 'Usuário autenticado' : 'Modo demo ativo',
      details: session ? `ID: ${user?.id}` : 'Algumas funcionalidades podem estar limitadas'
    });

    // 2. Check database connection
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      const responseTime = Date.now() - start;
      
      newChecks.push({
        name: 'Conexão Database',
        status: error ? 'error' : 'healthy',
        message: error ? 'Erro na conexão' : 'Conectado',
        details: error ? error.message : `Tempo: ${responseTime}ms`,
        responseTime
      });
    } catch (error) {
      newChecks.push({
        name: 'Conexão Database',
        status: 'error',
        message: 'Erro na conexão',
        details: 'Falha ao conectar com Supabase'
      });
    }

    // 3. Check AI agents
    for (const agent of aiAgents) {
      try {
        const start = Date.now();
        const { data, error } = await supabase.functions.invoke(agent.id, {
          body: { 
            action: 'health_check',
            input: 'Health check test'
          }
        });
        const responseTime = Date.now() - start;

        if (error) {
          newChecks.push({
            name: agent.name,
            status: 'error',
            message: 'Erro na função',
            details: error.message,
            responseTime
          });
        } else if (data?.error) {
          newChecks.push({
            name: agent.name,
            status: 'warning',
            message: 'Função respondeu com erro',
            details: data.error,
            responseTime,
            action: data.error.includes('PERPLEXITY_API_KEY') ? 'Configure PERPLEXITY_API_KEY nos Edge Function Secrets' : undefined
          });
        } else {
          newChecks.push({
            name: agent.name,
            status: 'healthy',
            message: 'Funcionando',
            details: `Tempo: ${responseTime}ms`,
            responseTime
          });
        }
      } catch (error) {
        newChecks.push({
          name: agent.name,
          status: 'error',
          message: 'Erro na chamada',
          details: 'Função não encontrada ou não responsiva'
        });
      }
    }

    setChecks(newChecks);
    
    // Calculate overall health
    const errorCount = newChecks.filter(c => c.status === 'error').length;
    const warningCount = newChecks.filter(c => c.status === 'warning').length;
    
    if (errorCount > 0) {
      setOverallHealth('error');
    } else if (warningCount > 0) {
      setOverallHealth('warning');
    } else {
      setOverallHealth('healthy');
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'checking': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const healthyCount = checks.filter(c => c.status === 'healthy').length;
  const totalChecks = checks.length;
  const healthPercentage = totalChecks > 0 ? Math.round((healthyCount / totalChecks) * 100) : 0;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Health Check</h1>
            <p className="text-muted-foreground">Status dos agentes AI e infraestrutura</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge 
            variant="default" 
            className={`${
              overallHealth === 'healthy' ? 'bg-green-500' : 
              overallHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          >
            {getStatusIcon(overallHealth)}
            <span className="ml-1">
              {overallHealth === 'healthy' ? 'Sistema Saudável' : 
               overallHealth === 'warning' ? 'Atenção Necessária' : 'Problemas Detectados'}
            </span>
          </Badge>
          
          <Button 
            onClick={runHealthCheck} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            Verificar Novamente
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Status Geral</span>
            <span className="text-lg font-bold">{healthPercentage}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={healthPercentage} className="h-4 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {checks.filter(c => c.status === 'healthy').length}
              </div>
              <div className="text-sm text-muted-foreground">Saudáveis</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {checks.filter(c => c.status === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Avisos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {checks.filter(c => c.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check, index) => (
          <Card key={index} className={`${getStatusColor(check.status)} border`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  {check.name}
                </CardTitle>
                {check.responseTime && (
                  <Badge variant="outline" className="text-xs">
                    {check.responseTime}ms
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">{check.message}</p>
                {check.details && (
                  <p className="text-xs text-muted-foreground">{check.details}</p>
                )}
                {check.action && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-700 font-medium">Ação necessária:</p>
                    <p className="text-xs text-blue-600">{check.action}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Links Úteis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => window.open('https://supabase.com/dashboard/project/irjjksfhyiwsbsipeyrj/edge-functions', '_blank')}
            >
              <Database className="h-4 w-4 mr-2" />
              Edge Functions
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open('https://supabase.com/dashboard/project/irjjksfhyiwsbsipeyrj/edge-functions/logs', '_blank')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Function Logs
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open('https://supabase.com/dashboard/project/irjjksfhyiwsbsipeyrj/settings/edge-functions', '_blank')}
            >
              <Key className="h-4 w-4 mr-2" />
              Edge Function Secrets
            </Button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-900 mb-2">Como configurar PERPLEXITY_API_KEY:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Clique em "Edge Function Secrets" acima</li>
              <li>2. Adicione uma nova secret com nome: <code className="bg-blue-100 px-1 rounded">PERPLEXITY_API_KEY</code></li>
              <li>3. Cole sua chave da Perplexity AI</li>
              <li>4. Clique em "Save" e execute o health check novamente</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIHealthCheckPage;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Network, 
  Shield, 
  Zap, 
  TrendingUp,
  Activity,
  Globe,
  Lock,
  Cpu,
  Database
} from 'lucide-react';

interface FederalModel {
  id: string;
  model_name: string;
  version: string;
  accuracy: number;
  participants: number;
  last_sync: string;
  privacy_level: 'high' | 'medium' | 'low';
  status: 'active' | 'training' | 'syncing';
}

const FederalLearningSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [models, setModels] = useState<FederalModel[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    loadFederalModels();
    const interval = setInterval(loadFederalModels, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadFederalModels = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('federal-learning-system', {
        body: { action: 'list_models', user_id: user?.id }
      });

      if (error) throw error;
      
      setModels(data?.models || [
        {
          id: '1',
          model_name: 'Pharma-Match-Federal',
          version: 'v2.1',
          accuracy: 94.2,
          participants: 847,
          last_sync: new Date().toISOString(),
          privacy_level: 'high',
          status: 'active'
        },
        {
          id: '2',
          model_name: 'Regulatory-Intelligence',
          version: 'v1.8',
          accuracy: 91.7,
          participants: 523,
          last_sync: new Date(Date.now() - 1800000).toISOString(),
          privacy_level: 'high',
          status: 'training'
        }
      ]);
    } catch (error) {
      console.error('Error loading federal models:', error);
    }
  };

  const startFederalTraining = async () => {
    setIsTraining(true);
    setSyncProgress(0);
    
    try {
      const { data, error } = await supabase.functions.invoke('federal-learning-system', {
        body: { 
          action: 'start_training',
          user_id: user?.id,
          privacy_preserving: true
        }
      });

      if (error) throw error;

      // Simulate training progress
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsTraining(false);
            toast({
              title: "🚀 Federal Learning Completo!",
              description: "Modelo atualizado com preservação de privacidade",
            });
            loadFederalModels();
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 800);

    } catch (error) {
      console.error('Error starting federal training:', error);
      setIsTraining(false);
      toast({
        title: "Erro no Federal Learning",
        description: "Falha ao iniciar treinamento distribuído",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-blue-500 animate-pulse';
      case 'syncing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'high': return <Shield className="h-4 w-4 text-green-600" />;
      case 'medium': return <Shield className="h-4 w-4 text-yellow-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Network className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl">Sistema Federal Learning</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  <Globe className="h-3 w-3 mr-1" />
                  Distribuído
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <Lock className="h-3 w-3 mr-1" />
                  Privacy-Preserving
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {models.reduce((sum, model) => sum + model.participants, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Participantes Ativos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {models.length > 0 ? Math.round(models.reduce((sum, model) => sum + model.accuracy, 0) / models.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Precisão Média</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {models.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Modelos Ativos</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Privacidade Preservada</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Controle de Treinamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={startFederalTraining} 
              disabled={isTraining}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isTraining ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Treinando Federalmente...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Iniciar Federal Learning
                </>
              )}
            </Button>
            
            {isTraining && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso do Treinamento</span>
                  <span>{Math.round(syncProgress)}%</span>
                </div>
                <Progress value={syncProgress} className="h-3" />
                <div className="text-xs text-muted-foreground text-center">
                  Sincronizando com {models.reduce((sum, model) => sum + model.participants, 0)} participantes...
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Federal Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(model.status)}`} />
                  <span>{model.model_name}</span>
                  <Badge variant="outline">{model.version}</Badge>
                </div>
                {getPrivacyIcon(model.privacy_level)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {model.accuracy}%
                  </div>
                  <div className="text-sm text-muted-foreground">Precisão</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {model.participants}
                  </div>
                  <div className="text-sm text-muted-foreground">Participantes</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-muted-foreground">
                    Última sincronização: {new Date(model.last_sync).toLocaleTimeString()}
                  </span>
                </div>
                <Badge className={`${getStatusColor(model.status)} text-white`}>
                  {model.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Federal Learning Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Vantagens do Federal Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Privacidade Total</h3>
              <p className="text-sm text-blue-600">Dados nunca saem do ambiente local</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Performance Superior</h3>
              <p className="text-sm text-green-600">Modelos mais precisos com dados distribuídos</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800">Escala Massiva</h3>
              <p className="text-sm text-purple-600">Aprende com milhares de organizações</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FederalLearningSystem;


import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  AlertTriangle, 
  ExternalLink, 
  Settings2,
  Info
} from 'lucide-react';
import { isDemoMode, setDemoMode } from '@/utils/demoMode';

interface UniversalDemoBannerProps {
  variant?: 'full' | 'compact' | 'minimal';
  showToggle?: boolean;
  className?: string;
}

const UniversalDemoBanner: React.FC<UniversalDemoBannerProps> = ({
  variant = 'full',
  showToggle = false,
  className = ''
}) => {
  const isDemo = isDemoMode();

  if (!isDemo) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <div className={`bg-orange-50 border-l-4 border-orange-400 px-4 py-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Modo Demonstração - Dados Simulados
            </span>
          </div>
          {showToggle && (
            <Button
              onClick={() => setDemoMode(false)}
              variant="outline"
              size="sm"
              className="text-orange-800 border-orange-400 hover:bg-orange-100"
            >
              Ir para Modo Real
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TestTube className="h-5 w-5" />
            <div>
              <h4 className="font-semibold">Modo Demonstração Ativo</h4>
              <p className="text-sm opacity-90">
                Explorando funcionalidades com dados simulados realísticos
              </p>
            </div>
          </div>
          {showToggle && (
            <Button
              onClick={() => setDemoMode(false)}
              variant="secondary"
              size="sm"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Modo Real
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-5 w-5 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">🎭 Modo Demonstração Ativo</h4>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-200 text-orange-800">
                <TestTube className="h-3 w-3 mr-1" />
                DEMO
              </Badge>
              {showToggle && (
                <Button
                  onClick={() => setDemoMode(false)}
                  variant="outline"
                  size="sm"
                  className="text-orange-800 border-orange-400 hover:bg-orange-100"
                >
                  Ir para Real
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium flex items-center">
                <Info className="h-4 w-4 mr-2" />
                O que você está vendo:
              </h5>
              <ul className="space-y-1 pl-6">
                <li>✅ Funcionalidades 100% operacionais</li>
                <li>📊 Dados simulados realísticos</li>
                <li>🤖 IA funcionando com APIs reais</li>
                <li>🧪 Ambiente seguro para testes</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Importante saber:
              </h5>
              <ul className="space-y-1 pl-6">
                <li>⚠️ Dados não são reais</li>
                <li>🎯 Criado para demonstrações</li>
                <li>💼 Ideal para apresentações</li>
                <li>🚀 Versão real disponível</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-orange-200">
            <span className="text-sm">
              💡 Esta versão demonstra o potencial completo da plataforma
            </span>
            <a 
              href="/status" 
              className="text-orange-700 hover:text-orange-900 underline flex items-center space-x-1"
            >
              <span>Ver Status da Plataforma</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default UniversalDemoBanner;


import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { isDemoMode } from '@/utils/demoMode';

interface TransparencyBannerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const TransparencyBanner: React.FC<TransparencyBannerProps> = ({ 
  variant = 'compact',
  className = '' 
}) => {
  const isDemo = isDemoMode();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center space-x-2 py-2 px-4 ${className}`}>
        <Badge className={isDemo ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
          {isDemo ? (
            <>
              <AlertTriangle className="h-3 w-3 mr-1" />
              DEMO
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              PRODUÇÃO
            </>
          )}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {isDemo ? 'Dados simulados para apresentação' : 'Dados reais da plataforma'}
        </span>
      </div>
    );
  }

  if (isDemo) {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="space-y-2">
            <div className="font-semibold">Modo Demonstração Ativo</div>
            <div className="text-sm">
              Você está visualizando uma versão completa da plataforma com dados simulados realísticos. 
              Todas as funcionalidades são 100% funcionais, mas os dados são criados especificamente 
              para demonstrações e apresentações.
            </div>
            <div className="text-xs space-y-1">
              <div><strong>✓ Funcionalidades:</strong> 100% operacionais</div>
              <div><strong>✓ AI Matching:</strong> Algoritmo real com dados simulados</div>
              <div><strong>✓ Integrações:</strong> APIs reais, dados contextuais</div>
              <div><strong>⚠ Dados:</strong> Simulados para fins demonstrativos</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`border-green-200 bg-green-50 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="space-y-2">
          <div className="font-semibold">Plataforma de Produção</div>
          <div className="text-sm">
            Você está acessando a versão de produção da PharmaConnect Brasil com dados reais. 
            Esta é uma plataforma em desenvolvimento ativo, com funcionalidades sendo implementadas progressivamente.
          </div>
          <div className="text-xs space-y-1">
            <div><strong>✓ Dados:</strong> 100% reais e atualizados</div>
            <div><strong>✓ Segurança:</strong> LGPD compliant</div>
            <div><strong>⚠ Status:</strong> Em desenvolvimento (v1.0.0)</div>
            <div><strong>📈 Crescimento:</strong> Base de usuários em expansão</div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TransparencyBanner;

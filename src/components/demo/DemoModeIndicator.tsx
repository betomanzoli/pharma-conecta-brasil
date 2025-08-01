
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestTube, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { isDemoMode } from '@/utils/demoMode';

interface DemoModeIndicatorProps {
  variant?: 'badge' | 'alert' | 'inline' | 'header';
  className?: string;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ 
  variant = 'badge', 
  className = '' 
}) => {
  const isDemo = isDemoMode();

  if (!isDemo) {
    return null; // Don't show indicator in production mode
  }

  if (variant === 'header') {
    return (
      <div className={`bg-orange-600 text-white px-4 py-2 text-center text-sm font-medium ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <TestTube className="h-4 w-4" />
          <span>MODO DEMONSTRAÇÃO - Dados simulados para apresentação</span>
          <a 
            href="/status" 
            className="underline hover:no-underline flex items-center space-x-1"
          >
            <span>Ver Status Real</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Modo Demonstração:</strong> Os dados exibidos são simulados para fins de teste e apresentação.
            </div>
            <a 
              href="/status" 
              className="text-orange-700 hover:text-orange-900 underline flex items-center space-x-1"
            >
              <span>Status Real</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`text-sm text-orange-600 font-medium ${className}`}>
        (Dados de Demonstração)
      </span>
    );
  }

  return (
    <Badge variant="secondary" className={`bg-orange-100 text-orange-800 border-orange-300 ${className}`}>
      <TestTube className="h-3 w-3 mr-1" />
      DEMO
    </Badge>
  );
};

export default DemoModeIndicator;


import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TestTube } from 'lucide-react';

interface DemoModeIndicatorProps {
  variant?: 'banner' | 'badge' | 'alert';
  className?: string;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ 
  variant = 'banner', 
  className = '' 
}) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-orange-600 text-white px-4 py-2 text-center text-sm font-medium ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <TestTube className="h-4 w-4" />
          <span>⚠️ MODO DEMONSTRAÇÃO - Dados simulados para apresentação</span>
        </div>
      </div>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Atenção:</strong> Os dados exibidos são simulados para demonstração. 
          Esta não é a versão final da plataforma.
        </AlertDescription>
      </Alert>
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

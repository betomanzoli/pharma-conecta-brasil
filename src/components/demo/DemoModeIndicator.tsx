
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestTube, Info } from 'lucide-react';

interface DemoModeIndicatorProps {
  variant?: 'badge' | 'alert' | 'inline';
  className?: string;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ 
  variant = 'badge', 
  className = '' 
}) => {
  if (variant === 'alert') {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <Info className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Modo Demonstração:</strong> Os dados exibidos são simulados para fins de teste e apresentação.
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

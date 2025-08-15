
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  Building2, 
  AlertTriangle, 
  CheckCircle,
  Settings 
} from 'lucide-react';
import { isDemoMode, setDemoMode, toggleDemoMode } from '@/utils/demoMode';

interface ModeToggleProps {
  variant?: 'toggle' | 'button' | 'badge';
  showLabel?: boolean;
  className?: string;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ 
  variant = 'toggle',
  showLabel = true,
  className = ''
}) => {
  const isDemo = isDemoMode();

  if (variant === 'badge') {
    return (
      <Badge 
        variant={isDemo ? 'destructive' : 'default'}
        className={`${className} ${isDemo ? 'bg-orange-500' : 'bg-green-500'}`}
      >
        {isDemo ? (
          <>
            <TestTube className="h-3 w-3 mr-1" />
            DEMO
          </>
        ) : (
          <>
            <Building2 className="h-3 w-3 mr-1" />
            REAL
          </>
        )}
      </Badge>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={toggleDemoMode}
        variant="outline"
        size="sm"
        className={className}
      >
        {isDemo ? (
          <>
            <TestTube className="h-4 w-4 mr-2" />
            Modo Demo
          </>
        ) : (
          <>
            <Building2 className="h-4 w-4 mr-2" />
            Modo Real
          </>
        )}
      </Button>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">Real</span>
      </div>
      
      <Switch
        checked={isDemo}
        onCheckedChange={setDemoMode}
        className="data-[state=checked]:bg-orange-500"
      />
      
      <div className="flex items-center space-x-2">
        <TestTube className="h-4 w-4 text-orange-600" />
        <span className="text-sm font-medium">Demo</span>
      </div>
      
      {showLabel && (
        <div className="ml-2">
          <Badge variant="outline" className="text-xs">
            {isDemo ? (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Dados Simulados
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Dados Reais
              </>
            )}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ModeToggle;

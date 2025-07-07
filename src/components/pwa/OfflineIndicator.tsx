import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, Signal } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

const OfflineIndicator = () => {
  const { isOffline, networkStatus } = usePWA();

  if (!isOffline && networkStatus === 'fast') return null;

  const getIcon = () => {
    if (isOffline) return WifiOff;
    if (networkStatus === 'slow') return Signal;
    return Wifi;
  };

  const getMessage = () => {
    if (isOffline) return 'Modo Offline - Funcionalidades limitadas';
    if (networkStatus === 'slow') return 'Conexão lenta - Carregamento pode demorar';
    return 'Conectado';
  };

  const getVariant = () => {
    if (isOffline) return 'destructive';
    if (networkStatus === 'slow') return 'default';
    return 'default';
  };

  const Icon = getIcon();

  return (
    <div className="fixed top-16 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80">
      <Alert 
        variant={getVariant() as any}
        className={cn(
          "border-l-4 animate-slide-in-right",
          isOffline && "border-l-destructive bg-destructive/10",
          networkStatus === 'slow' && "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
        )}
      >
        <Icon className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{getMessage()}</span>
          {isOffline && (
            <div className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
          {networkStatus === 'slow' && (
            <div className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;
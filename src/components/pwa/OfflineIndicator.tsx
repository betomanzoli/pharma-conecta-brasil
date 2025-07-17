import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, RefreshCw, Signal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
}

export function OfflineIndicator({ 
  className, 
  showWhenOnline = false 
}: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRetry(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowRetry(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setShowRetry(false);
    } else {
      fetch('/favicon.ico', { cache: 'no-cache' })
        .then(() => {
          setIsOnline(true);
          setShowRetry(false);
        })
        .catch(() => {
          setIsOnline(false);
        });
    }
  };

  if (isOnline && !showWhenOnline) return null;


  return (
    <div className={cn(
      'fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4',
      className
    )}>
      <Alert className={cn(
        'border-2 backdrop-blur-sm',
        isOnline 
          ? 'bg-green-50/90 border-green-200 text-green-800' 
          : 'bg-red-50/90 border-red-200 text-red-800'
      )}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          
          <div className="flex-1">
            <AlertDescription className="font-medium">
              {isOnline ? (
                'Conectado à internet'
              ) : (
                'Sem conexão com a internet'
              )}
            </AlertDescription>
            
            {!isOnline && (
              <AlertDescription className="text-sm mt-1 opacity-80">
                Algumas funcionalidades podem estar limitadas
              </AlertDescription>
            )}
          </div>

          {!isOnline && showRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="h-8 px-3"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Tentar
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

// Hook for checking online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Component for showing offline message in content areas
export function OfflineMessage({ 
  children, 
  className 
}: { 
  children?: React.ReactNode;
  className?: string;
}) {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
        Sem conexão
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Verifique sua conexão com a internet e tente novamente
      </p>
      {children}
    </div>
  );
}

export default OfflineIndicator;
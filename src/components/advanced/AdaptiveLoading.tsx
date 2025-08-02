
import React, { useState, useEffect } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

interface AdaptiveLoadingProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  retryFn?: () => void;
  adaptToConnection?: boolean;
}

interface ConnectionInfo {
  effectiveType: string;
  rtt: number;
  downlink: number;
  saveData: boolean;
}

const AdaptiveLoading: React.FC<AdaptiveLoadingProps> = ({
  loading,
  error,
  children,
  fallback,
  retryFn,
  adaptToConnection = true
}) => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loadingStrategy, setLoadingStrategy] = useState<'full' | 'minimal' | 'skeleton'>('full');

  useEffect(() => {
    // Monitor connection status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Monitor network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionInfo = () => {
        setConnectionInfo({
          effectiveType: connection.effectiveType,
          rtt: connection.rtt,
          downlink: connection.downlink,
          saveData: connection.saveData
        });
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (adaptToConnection && connectionInfo) {
      // Adapt loading strategy based on connection
      if (connectionInfo.saveData || connectionInfo.effectiveType === 'slow-2g') {
        setLoadingStrategy('minimal');
      } else if (connectionInfo.effectiveType === '2g' || connectionInfo.rtt > 1000) {
        setLoadingStrategy('skeleton');
      } else {
        setLoadingStrategy('full');
      }
    }
  }, [connectionInfo, adaptToConnection]);

  const renderLoadingState = () => {
    if (!isOnline) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <WifiOff className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Você está offline
          </h3>
          <p className="text-gray-600 mb-4">
            Verifique sua conexão com a internet e tente novamente.
          </p>
          {retryFn && (
            <button
              onClick={retryFn}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      );
    }

    switch (loadingStrategy) {
      case 'minimal':
        return (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Carregando...</span>
          </div>
        );

      case 'skeleton':
        return (
          <div className="space-y-4 p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              {connectionInfo && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Wifi className="h-3 w-3" />
                    <span>{connectionInfo.effectiveType}</span>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-6 text-sm text-gray-600 text-center">
              {connectionInfo?.saveData 
                ? 'Carregando com economia de dados...' 
                : 'Carregando dados...'
              }
            </p>
          </div>
        );
    }
  };

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <WifiOff className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erro ao carregar dados
      </h3>
      <p className="text-gray-600 mb-4">
        {error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
      </p>
      {retryFn && (
        <button
          onClick={retryFn}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );

  if (error) {
    return renderErrorState();
  }

  if (loading) {
    return fallback || renderLoadingState();
  }

  return <>{children}</>;
};

export default AdaptiveLoading;

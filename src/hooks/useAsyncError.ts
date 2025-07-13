import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAsyncError = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: any, customMessage?: string) => {
    console.error('Async error:', error);
    
    const message = customMessage || 
                   error?.message || 
                   'Ocorreu um erro inesperado. Tente novamente.';
    
    toast({
      title: "Erro",
      description: message,
      variant: "destructive"
    });
  }, [toast]);

  return { handleError };
};
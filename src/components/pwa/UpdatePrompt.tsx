import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

const UpdatePrompt = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });

      // Verificar por atualizações periodicamente
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.waiting) {
            setUpdateAvailable(true);
          }
        } catch (error) {
          console.error('Erro ao verificar atualizações:', error);
        }
      };

      // Verificar a cada 30 minutos
      const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
      
      // Verificar imediatamente
      checkForUpdates();

      return () => clearInterval(interval);
    }
  }, []);

  const handleUpdate = async () => {
    if (!('serviceWorker' in navigator)) return;

    setIsUpdating(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      
      if (registration.waiting) {
        // Enviar mensagem para o service worker atualizar
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        toast.success('Atualizando app...', {
          description: 'A página será recarregada automaticamente.'
        });

        // Recarregar após um breve delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        await registration.update();
        toast.success('App já está atualizado! ✨');
        setUpdateAvailable(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar', {
        description: 'Tente recarregar a página manualmente.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Atualização Disponível</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUpdateAvailable(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Uma nova versão do PharmaNet está disponível com melhorias e correções.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button 
              onClick={handleUpdate} 
              className="flex-1"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {isUpdating ? 'Atualizando...' : 'Atualizar Agora'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setUpdateAvailable(false)}
              disabled={isUpdating}
            >
              Depois
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            🚀 Melhor desempenho • 🐛 Correções de bugs • ✨ Novas funcionalidades
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePrompt;
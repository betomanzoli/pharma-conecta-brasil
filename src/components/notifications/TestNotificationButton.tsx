import React, { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TestNotificationButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const createTestNotification = async (type: string = 'system') => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-test-notification', {
        body: { type }
      });

      if (error) throw error;

      toast.success('Notificação de teste criada!', {
        description: 'Verifique o sino de notificações no header.'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de teste:', error);
      toast.error('Erro ao criar notificação de teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => createTestNotification('system')}
        disabled={loading}
        size="sm"
        variant="outline"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
        Teste Sistema
      </Button>
      <Button
        onClick={() => createTestNotification('mentorship')}
        disabled={loading}
        size="sm"
        variant="outline"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
        Teste Mentoria
      </Button>
      <Button
        onClick={() => createTestNotification('forum')}
        disabled={loading}
        size="sm"
        variant="outline"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
        Teste Fórum
      </Button>
    </div>
  );
};

export default TestNotificationButton;
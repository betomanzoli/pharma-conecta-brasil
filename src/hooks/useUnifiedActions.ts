import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ActionContext {
  entityId?: string;
  entityType?: string;
  targetUserId?: string;
  metadata?: Record<string, any>;
}

export const useUnifiedActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const logMetric = useCallback(async (metric_name: string, metadata?: Record<string, any>) => {
    try {
      await supabase.from('performance_metrics').insert({
        metric_name,
        metric_value: 1,
        metric_unit: 'event',
        tags: metadata || {},
      });
    } catch (e) {
      // silent
    }
  }, []);

  const notify = useCallback(async (title: string, message: string, type: string = 'system', targetUserId?: string) => {
    try {
      if (targetUserId) {
        await supabase.rpc('create_system_notification', {
          target_user_id: targetUserId,
          notification_title: title,
          notification_message: message,
          notification_type: type,
        });
      }
    } catch (e) {
      // ignore rpc failures
    }
  }, []);

  const contact = useCallback(async (ctx: ActionContext) => {
    toast({ title: 'Contato enviado', description: 'O provedor será notificado.' });
    await notify('Novo contato', 'Você recebeu uma nova solicitação de contato.', 'system', ctx.targetUserId);
    await logMetric('contact_request', { entityId: ctx.entityId, entityType: ctx.entityType });
  }, [logMetric, notify, toast]);

  const scheduleDemo = useCallback(async (ctx: ActionContext) => {
    toast({ title: 'Demo solicitada', description: 'Agendamento solicitado. Em breve entraremos em contato.' });
    await notify('Solicitação de Demo', 'Um usuário solicitou um agendamento de demonstração.', 'system', ctx.targetUserId);
    await logMetric('schedule_demo', { entityId: ctx.entityId, entityType: ctx.entityType });
  }, [logMetric, notify, toast]);

  const startSecureChat = useCallback(async (ctx: ActionContext) => {
    await logMetric('start_secure_chat', { entityId: ctx.entityId, entityType: ctx.entityType });
    navigate('/chat');
  }, [logMetric, navigate]);

  const download = useCallback(async (title: string, url: string) => {
    await logMetric('download_resource', { title, url });
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast({ title: 'Download iniciado', description: title });
  }, [logMetric, toast]);

  return { contact, scheduleDemo, startSecureChat, download, logMetric };
};

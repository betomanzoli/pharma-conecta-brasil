import { supabase } from '@/integrations/supabase/client';

export const createSampleNotifications = async (userId: string) => {
  const sampleNotifications = [
    {
      user_id: userId,
      title: 'Bem-vindo à PharmaConnect Brasil!',
      message: 'Sua conta foi criada com sucesso. Explore todas as funcionalidades da plataforma.',
      type: 'system',
      priority: 'high',
      metadata: { welcome: true }
    },
    {
      user_id: userId,
      title: 'AI Matching Ativado',
      message: 'O sistema de AI Matching está pronto para encontrar oportunidades para você.',
      type: 'system',
      priority: 'medium',
      metadata: { feature: 'ai_matching' }
    },
    {
      user_id: userId,
      title: 'Complete seu Perfil',
      message: 'Complete suas informações de perfil para melhorar a qualidade dos matches.',
      type: 'system',
      priority: 'medium',
      action_url: '/profile',
      metadata: { action_required: true }
    }
  ];

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(sampleNotifications);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating sample notifications:', error);
    throw error;
  }
};

export const createMatchFeedbackNotification = async (userId: string, matchData: any) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Feedback de Match Processado',
        message: `Seu feedback sobre o match com "${matchData.provider_name}" foi registrado e ajudará a melhorar nosso AI.`,
        type: 'system',
        priority: 'low',
        metadata: { 
          match_feedback: true,
          provider_name: matchData.provider_name,
          feedback_type: matchData.feedback_type
        }
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating feedback notification:', error);
    throw error;
  }
};

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PersonalizedOnboarding from './PersonalizedOnboarding';
import { supabase } from '@/integrations/supabase/client';

const AutoOnboarding: React.FC = () => {
  const { profile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!profile?.id) return;

      try {
        // Verificar se o usuário já completou o onboarding
        const { data, error } = await supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', profile.id)
          .eq('achievement_type', 'onboarding')
          .eq('achievement_name', 'completed_onboarding')
          .single();

        if (error && error.code === 'PGRST116') {
          // Usuário não completou onboarding
          setHasCompletedOnboarding(false);
          
          // Mostrar onboarding após 2 segundos
          setTimeout(() => {
            setShowOnboarding(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar status do onboarding:', error);
      }
    };

    checkOnboardingStatus();
  }, [profile?.id]);

  const handleOnboardingComplete = async () => {
    if (!profile?.id) return;

    try {
      // Marcar onboarding como completo
      await supabase
        .from('user_achievements')
        .insert({
          user_id: profile.id,
          achievement_type: 'onboarding',
          achievement_name: 'completed_onboarding',
          points: 100
        });

      setShowOnboarding(false);
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    }
  };

  if (hasCompletedOnboarding) return null;

  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bem-vindo ao PharmaConnect Brasil!</DialogTitle>
          <DialogDescription>
            Vamos personalizar sua experiência na plataforma
          </DialogDescription>
        </DialogHeader>
        <PersonalizedOnboarding onComplete={handleOnboardingComplete} />
      </DialogContent>
    </Dialog>
  );
};

export default AutoOnboarding;

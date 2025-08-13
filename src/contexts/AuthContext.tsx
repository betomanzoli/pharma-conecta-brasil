
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, performGlobalSignout } from '@/utils/authCleanup';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  user_type: 'company' | 'laboratory' | 'consultant' | 'individual' | 'admin' | 
            'professional' | 'regulatory_body' | 'sector_entity' | 
            'research_institution' | 'supplier' | 'funding_agency' | 'healthcare_provider';
  phone?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  cancel_at_period_end?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  subscription: Subscription | null;
  loading: boolean;
  supabase: SupabaseClient;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para obter a URL de redirecionamento correta
  const getRedirectUrl = () => {
    const currentHost = window.location.hostname;
    
    if (currentHost === 'pharmaconnect.site' || currentHost === 'www.pharmaconnect.site') {
      return 'https://pharmaconnect.site/auth';
    } else if (currentHost.includes('lovable.app') || currentHost.includes('lovableproject.com')) {
      return `${window.location.origin}/auth`;
    } else {
      return `${window.location.origin}/auth`;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            await fetchProfile(session.user.id);
            await checkSubscription();
          }, 0);
        } else {
          setProfile(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkSubscription();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const validUserTypes = [
          'company', 'laboratory', 'consultant', 'individual', 'admin',
          'professional', 'regulatory_body', 'sector_entity', 
          'research_institution', 'supplier', 'funding_agency', 'healthcare_provider'
        ];
        
        const profileData = {
          ...data,
          user_type: validUserTypes.includes(data.user_type) ? data.user_type : 'individual'
        } as Profile;
        
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Iniciando cadastro para:', email);
      
      cleanupAuthState();
      await performGlobalSignout(supabase);
      
      const redirectUrl = getRedirectUrl();
      
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para ativar sua conta.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando login para:', email);
      
      cleanupAuthState();
      await performGlobalSignout(supabase);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais ou clique em "Esqueci minha senha".';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Confirme seu email antes de fazer login. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user) {
        console.log('Login bem-sucedido para:', data.user.email);
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${data.user.email}!`,
        });
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }

      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login. Tente limpar o cache ou entre em contato com o suporte.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Iniciando logout...');
      
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setSubscription(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Enviando reset de senha para:', email);
      
      const redirectUrl = getRedirectUrl();
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(), 
        {
          redirectTo: redirectUrl,
        }
      );

      if (error) {
        console.error('Erro no reset:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('User not found')) {
          errorMessage = 'Email não encontrado. Verifique se o email está correto ou cadastre-se.';
        } else if (error.message.includes('For security purposes')) {
          errorMessage = 'Por segurança, você só pode solicitar reset a cada 60 segundos.';
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Email enviado!",
        description: "Verifique seu email para redefinir sua senha. Pode demorar alguns minutos para chegar.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('Atualizando senha...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('weak password')) {
          errorMessage = 'Senha muito fraca. Use pelo menos 8 caracteres com letras e números.';
        }
        
        toast({
          title: "Erro ao redefinir senha",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Senha redefinida com sucesso!",
        description: "Sua nova senha foi salva. Você pode fazer login agora.",
      });

      // Redirecionar para login após redefinir senha
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);

      return { error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error };
    }
  };

  const checkSubscription = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      if (data) {
        setSubscription({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          cancel_at_period_end: data.cancel_at_period_end || false,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    subscription,
    loading,
    supabase,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    checkSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

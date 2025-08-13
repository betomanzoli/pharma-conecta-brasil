
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  supabase: SupabaseClient;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  console.log('🔐 AuthProvider rendering...', { 
    user: user?.email, 
    loading,
    sessionExists: !!session,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect iniciando...');
    
    // Configurar listener primeiro para capturar eventos
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', { 
          event, 
          userEmail: session?.user?.email,
          timestamp: new Date().toISOString()
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in successfully:', session.user.email);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Depois verificar sessão existente
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
      } else {
        console.log('📋 Initial session check:', { 
          hasSession: !!session,
          userEmail: session?.user?.email 
        });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🔄 Unsubscribing auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('📝 Attempting signup for:', email);
      
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: userData
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message === 'User already registered' 
            ? 'Este email já está cadastrado. Tente fazer login.' 
            : error.message,
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Signup successful for:', email);
      toast({
        title: "Conta criada!",
        description: "Verifique seu email para ativar sua conta.",
      });

      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        
        let errorMessage = "Email ou senha incorretos.";
        if (error.message.includes('Email not confirmed')) {
          errorMessage = "Por favor, confirme seu email antes de fazer login.";
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Muitas tentativas de login. Tente novamente em alguns minutos.";
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user) {
        console.log('✅ Login successful for:', email);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });
        
        // Usar window.location.href para garantir redirecionamento limpo
        setTimeout(() => {
          console.log('🔄 Redirecting to dashboard...');
          window.location.href = '/dashboard';
        }, 1000);
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected login error:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out user...');
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com segurança.",
      });
      
      setTimeout(() => {
        console.log('🔄 Redirecting to home after logout...');
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('❌ Error signing out:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao sair. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔐 Password reset requested for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(), 
        {
          redirectTo: `${window.location.origin}/auth?type=recovery`,
        }
      );

      if (error) {
        console.error('❌ Password reset error:', error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Password reset email sent to:', email);
      toast({
        title: "Email enviado!",
        description: "Verifique seu email para redefinir sua senha.",
      });

      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected password reset error:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('🔐 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Password update error:', error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Password updated successfully');
      toast({
        title: "Senha redefinida!",
        description: "Você será redirecionado para o dashboard.",
      });

      setTimeout(() => {
        console.log('🔄 Redirecting to dashboard after password update...');
        window.location.href = '/dashboard';
      }, 2000);

      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected password update error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    supabase,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
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

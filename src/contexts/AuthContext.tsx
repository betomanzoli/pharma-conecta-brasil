
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
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cleanup function for auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Defer profile fetching to prevent deadlocks
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

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(async () => {
          await fetchProfile(session.user.id);
          await checkSubscription();
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
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
        console.log('Profile fetched successfully:', data);
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
      } else {
        console.log('No profile found for user:', userId);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Attempting signup for:', email);
      console.log('User data:', userData);
      
      // Clean up existing state first
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      console.log('Signup successful:', data);
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para ativar sua conta.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signin for:', email);
      
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed (expected):', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      console.log('Signin successful:', data);
      
      if (data.user) {
        // Force page refresh for clean state
        window.location.href = '/dashboard';
      }

      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting signout');
      
      // Clean up state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout error (ignored):', err);
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setSubscription(null);
      
      // Force page refresh for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Email enviado!",
        description: "Verifique seu email para redefinir sua senha.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
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

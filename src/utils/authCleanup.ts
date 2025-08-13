
export const cleanupAuthState = () => {
  console.log('Limpando estado de autenticação...');
  
  // Limpar localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('Removendo chave:', key);
      localStorage.removeItem(key);
    }
  });
  
  // Limpar sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log('Removendo chave do session:', key);
        sessionStorage.removeItem(key);
      }
    });
  }
  
  console.log('Limpeza de estado concluída');
};

export const performGlobalSignout = async (supabase: any) => {
  try {
    console.log('Tentando logout global...');
    await supabase.auth.signOut({ scope: 'global' });
    console.log('Logout global realizado');
  } catch (error) {
    console.log('Erro no logout global (continuando):', error);
  }
};


export const cleanupAuthState = () => {
  console.log('Limpando estado de autenticação...');
  
  // Limpar localStorage - versão mais abrangente
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      key.includes('supabase') ||
      key.includes('auth-token') ||
      key.includes('access-token') ||
      key.includes('refresh-token')
    ) {
      console.log('Removendo chave do localStorage:', key);
      localStorage.removeItem(key);
    }
  });
  
  // Limpar sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (
        key.startsWith('supabase.auth.') || 
        key.includes('sb-') ||
        key.includes('supabase') ||
        key.includes('auth-token') ||
        key.includes('access-token') ||
        key.includes('refresh-token')
      ) {
        console.log('Removendo chave do sessionStorage:', key);
        sessionStorage.removeItem(key);
      }
    });
  }
  
  // Tentar limpar IndexedDB se houver dados do Supabase
  try {
    if ('indexedDB' in window) {
      // Lista de possíveis DBs do Supabase
      const supabaseDbs = ['supabase-auth', 'supabase-cache'];
      supabaseDbs.forEach(dbName => {
        try {
          indexedDB.deleteDatabase(dbName);
        } catch (e) {
          console.log('Erro ao limpar IndexedDB:', e);
        }
      });
    }
  } catch (error) {
    console.log('Erro ao acessar IndexedDB:', error);
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

// Função adicional para diagnosticar problemas
export const debugAuthState = () => {
  console.log('=== DEBUG AUTH STATE ===');
  console.log('URL atual:', window.location.href);
  console.log('Domínio:', window.location.hostname);
  
  // Verificar localStorage
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || key.includes('auth') || key.includes('sb-')
  );
  console.log('Chaves relacionadas à auth no localStorage:', authKeys);
  
  // Verificar sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    const sessionAuthKeys = Object.keys(sessionStorage).filter(key => 
      key.includes('supabase') || key.includes('auth') || key.includes('sb-')
    );
    console.log('Chaves relacionadas à auth no sessionStorage:', sessionAuthKeys);
  }
  
  // Verificar cookies
  console.log('Cookies:', document.cookie);
  
  console.log('=== FIM DEBUG ===');
};

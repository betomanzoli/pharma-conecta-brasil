
import React, { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface PrefetchRule {
  condition: () => boolean;
  queryKey: string[];
  queryFn: () => Promise<any>;
  priority: 'high' | 'medium' | 'low';
  dependencies?: string[];
}

// Type for experimental navigator.connection API
interface NavigatorConnection extends Navigator {
  connection?: {
    effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
    addEventListener: (event: string, handler: () => void) => void;
    removeEventListener: (event: string, handler: () => void) => void;
  };
}

const IntelligentPrefetching: React.FC = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const prefetchedRefs = useRef<Set<string>>(new Set());

  // Regras de prefetch inteligente
  const prefetchRules: PrefetchRule[] = [
    {
      condition: () => profile?.user_type === 'company',
      queryKey: ['laboratories', 'available'],
      queryFn: () => fetchAvailableLaboratories(),
      priority: 'high'
    },
    {
      condition: () => profile?.user_type === 'laboratory',
      queryKey: ['projects', 'potential'],
      queryFn: () => fetchPotentialProjects(),
      priority: 'high'
    },
    {
      condition: () => true,
      queryKey: ['marketplace', 'featured'],
      queryFn: () => fetchFeaturedServices(),
      priority: 'medium',
      dependencies: ['user:profile']
    },
    {
      condition: () => {
        const nav = navigator as NavigatorConnection;
        return nav.connection?.effectiveType === '4g';
      },
      queryKey: ['analytics', 'dashboard'],
      queryFn: () => fetchDashboardAnalytics(),
      priority: 'low'
    }
  ];

  useEffect(() => {
    initializePrefetching();
    setupIntersectionObserver();
    setupNetworkObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [profile]);

  const initializePrefetching = () => {
    // Prefetch crítico imediato
    const highPriorityRules = prefetchRules.filter(rule => 
      rule.priority === 'high' && rule.condition()
    );

    highPriorityRules.forEach(rule => {
      const key = rule.queryKey.join(':');
      if (!prefetchedRefs.current.has(key)) {
        executePrefetch(rule);
        prefetchedRefs.current.add(key);
      }
    });

    // Prefetch de prioridade média com delay
    setTimeout(() => {
      const mediumPriorityRules = prefetchRules.filter(rule => 
        rule.priority === 'medium' && rule.condition()
      );

      mediumPriorityRules.forEach(rule => {
        const key = rule.queryKey.join(':');
        if (!prefetchedRefs.current.has(key)) {
          executePrefetch(rule);
          prefetchedRefs.current.add(key);
        }
      });
    }, 2000);

    // Prefetch de baixa prioridade quando idle
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        const lowPriorityRules = prefetchRules.filter(rule => 
          rule.priority === 'low' && rule.condition()
        );

        lowPriorityRules.forEach(rule => {
          const key = rule.queryKey.join(':');
          if (!prefetchedRefs.current.has(key)) {
            executePrefetch(rule);
            prefetchedRefs.current.add(key);
          }
        });
      });
    }
  };

  const setupIntersectionObserver = () => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const prefetchKey = element.dataset.prefetch;
            
            if (prefetchKey && !prefetchedRefs.current.has(prefetchKey)) {
              const rule = prefetchRules.find(r => r.queryKey.join(':') === prefetchKey);
              if (rule) {
                executePrefetch(rule);
                prefetchedRefs.current.add(prefetchKey);
              }
            }
          }
        });
      },
      { rootMargin: '200px' }
    );

    // Observar elementos com data-prefetch
    const prefetchElements = document.querySelectorAll('[data-prefetch]');
    prefetchElements.forEach(el => observerRef.current?.observe(el));
  };

  const setupNetworkObserver = () => {
    const nav = navigator as NavigatorConnection;
    if (nav.connection) {
      const connection = nav.connection;
      
      const handleNetworkChange = () => {
        const effectiveType = connection.effectiveType;
        
        // Ajustar estratégias baseado na conexão
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          // Cancelar prefetches de baixa prioridade
          queryClient.cancelQueries({
            predicate: (query) => {
              const rule = prefetchRules.find(r => 
                JSON.stringify(r.queryKey) === JSON.stringify(query.queryKey)
              );
              return rule?.priority === 'low';
            }
          });
        }
      };

      connection.addEventListener('change', handleNetworkChange);
      
      return () => {
        connection.removeEventListener('change', handleNetworkChange);
      };
    }
  };

  const executePrefetch = async (rule: PrefetchRule) => {
    try {
      // Verificar dependências
      if (rule.dependencies) {
        const dependenciesMet = rule.dependencies.every(dep => {
          const depData = queryClient.getQueryData(dep.split(':'));
          return depData !== undefined;
        });

        if (!dependenciesMet) {
          console.log(`Prefetch adiado - dependências não atendidas:`, rule.queryKey);
          return;
        }
      }

      await queryClient.prefetchQuery({
        queryKey: rule.queryKey,
        queryFn: rule.queryFn,
        staleTime: 5 * 60 * 1000, // 5 minutos
      });

      console.log(`✅ Prefetch concluído: ${rule.queryKey.join(':')}`);
    } catch (error) {
      console.warn(`❌ Prefetch falhou: ${rule.queryKey.join(':')}`, error);
    }
  };

  // Funções de fetch simuladas
  const fetchAvailableLaboratories = async () => {
    return Promise.resolve([]);
  };

  const fetchPotentialProjects = async () => {
    return Promise.resolve([]);
  };

  const fetchFeaturedServices = async () => {
    return Promise.resolve([]);
  };

  const fetchDashboardAnalytics = async () => {
    return Promise.resolve({});
  };

  return null; // Componente invisível
};

export default IntelligentPrefetching;

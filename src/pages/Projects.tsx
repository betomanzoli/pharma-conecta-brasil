
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedProjectsPage from '@/components/projects/EnhancedProjectsPage';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';

const Projects = () => {
  const { profile } = useAuth();
  const isDemo = isDemoMode();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Projetos
                </h1>
                <p className="text-muted-foreground">
                  {isDemo 
                    ? 'Gerencie seus projetos colaborativos (dados demonstrativos)'
                    : 'Gerencie seus projetos colaborativos farmacêuticos'
                  }
                </p>
              </div>
            </div>
          </div>

          <EnhancedProjectsPage />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Projects;


import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedProjectsPage from '@/components/projects/EnhancedProjectsPage';

const Projects = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <EnhancedProjectsPage />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Projects;

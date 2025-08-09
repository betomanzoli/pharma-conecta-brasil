
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

const ProjectManagerAI = () => {
  useEffect(() => {
    document.title = 'Gerente de Projetos IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/gerente-projetos';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Gerente de Projetos IA</h1>
          <p className="text-muted-foreground mb-6">Gere Project Charter, cronograma de marcos e matriz de stakeholders.</p>
          <section className="space-y-4">
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Planejamento</h2>
              <p className="text-sm text-muted-foreground">Em breve: EAP, RACI, riscos e comunicação.</p>
            </div>
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Acompanhamento</h2>
              <p className="text-sm text-muted-foreground">Dashboard de marcos e status regulatório (esqueleto).</p>
            </div>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProjectManagerAI;

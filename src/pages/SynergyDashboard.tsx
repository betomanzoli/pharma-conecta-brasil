
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

const SynergyDashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard de Sinergia | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/sinergia';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Sinergia</h1>
          <p className="text-muted-foreground mb-6">Consolide KPIs e status dos módulos de IA e projetos.</p>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">KPIs</h2>
              <p className="text-sm text-muted-foreground">Em breve: business cases concluídos, tempo médio, taxa de aprovação.</p>
            </div>
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Projetos Ativos</h2>
              <p className="text-sm text-muted-foreground">Lista de projetos e marcos críticos (placeholder).</p>
            </div>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SynergyDashboard;

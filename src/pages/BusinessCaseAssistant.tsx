
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

const BusinessCaseAssistant = () => {
  useEffect(() => {
    document.title = 'Estrategista IA – Business Case | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/estrategista';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Estrategista IA – Business Case</h1>
          <p className="text-muted-foreground mb-6">Gere análises SWOT, business cases e insights de mercado guiados por IA.</p>
          <section className="space-y-4">
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Entrada básica</h2>
              <p className="text-sm text-muted-foreground">Em breve: formulário guiado para oportunidade (produto, alvo, mercado).</p>
            </div>
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Resultados</h2>
              <p className="text-sm text-muted-foreground">Prévia do relatório (PDF/Markdown) com KPIs (ROI, risco, timeline).</p>
            </div>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BusinessCaseAssistant;

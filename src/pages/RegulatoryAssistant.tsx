
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

const RegulatoryAssistant = () => {
  useEffect(() => {
    document.title = 'Técnico‑Regulatório IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/regulatorio';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Técnico‑Regulatório IA</h1>
          <p className="text-muted-foreground mb-6">Avalie viabilidade técnica e caminhos regulatórios (ANVISA, FDA, EMA).</p>
          <section className="space-y-4">
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Dados do produto</h2>
              <p className="text-sm text-muted-foreground">Em breve: tipo (biológico, genérico), rota, classe terapêutica.</p>
            </div>
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Parecer IA</h2>
              <p className="text-sm text-muted-foreground">Resumo: complexidade, timeline regulatória, riscos e requisitos.</p>
            </div>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RegulatoryAssistant;

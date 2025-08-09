
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

const DocumentationAssistant = () => {
  useEffect(() => {
    document.title = 'Assistente de Documentação | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/documentacao';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Assistente de Documentação</h1>
          <p className="text-muted-foreground mb-6">Preencha CAPA, SOPs e CTD com validação de conformidade.</p>
          <section className="space-y-4">
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Templates</h2>
              <p className="text-sm text-muted-foreground">Em breve: seleção de template e guia passo‑a‑passo.</p>
            </div>
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">Validações</h2>
              <p className="text-sm text-muted-foreground">Checklist GMP/ICH com score de completude.</p>
            </div>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DocumentationAssistant;

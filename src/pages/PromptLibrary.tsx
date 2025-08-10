
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

const PromptLibrary = () => {
  useEffect(() => {
    document.title = 'Biblioteca de Prompts | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/prompts';
    document.head.appendChild(link);
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Prompts prontos por fase do projeto para IA farmacêutica.';
    document.head.appendChild(meta);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Biblioteca de Prompts',
      itemListElement: categories.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.title }))
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(link); document.head.removeChild(meta); document.head.removeChild(script); };
  }, []);

  const categories = [
    { title: 'Iniciação', prompts: ['Defina objetivo do projeto', 'Avalie viabilidade inicial'] },
    { title: 'Planejamento', prompts: ['Gerar EAP', 'Criar matriz RACI', 'Mapear stakeholders'] },
    { title: 'Execução', prompts: ['Checklist de submissão CTD', 'Plano de comunicação'] },
    { title: 'Monitoramento', prompts: ['Analisar KPIs', 'Atualizar riscos'] },
    { title: 'Encerramento', prompts: ['Lições aprendidas', 'Relatório final'] },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Biblioteca de Prompts</h1>
          <p className="text-muted-foreground mb-6">Prompts prontos por fase do projeto para acelerar seu uso de IA.</p>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.title} className="rounded-md border p-4">
                <h2 className="text-lg font-semibold mb-2">{cat.title}</h2>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {cat.prompts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PromptLibrary;

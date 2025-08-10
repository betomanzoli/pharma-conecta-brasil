import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface AgentOutputRow {
  id: string;
  agent_type: string;
  output_md: string;
  created_at: string;
}

const SynergyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AgentOutputRow[]>([]);

  useEffect(() => {
    document.title = 'Dashboard de Sinergia | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/sinergia';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Sinergia dos agentes IA: KPIs e últimos outputs consolidados.';
    document.head.appendChild(meta);

    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_agent_outputs')
        .select('id, agent_type, output_md, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) setRows(data as any);
      setLoading(false);
    };

    fetchData();

    return () => { document.head.removeChild(link); document.head.removeChild(meta); };
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach(r => { map[r.agent_type] = (map[r.agent_type] || 0) + 1; });
    return map;
  }, [rows]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Sinergia</h1>
          <p className="text-muted-foreground mb-6">Consolide KPIs e status dos módulos de IA e projetos.</p>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Outputs por Agente</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.keys(counts).length === 0 && (
                      <li className="text-muted-foreground">Sem dados ainda.</li>
                    )}
                    {Object.entries(counts).map(([type, count]) => (
                      <li key={type} className="flex justify-between">
                        <span>{type}</span>
                        <span className="font-medium">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Últimos Outputs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
                    {rows.length === 0 && (
                      <p className="text-muted-foreground">Nenhum output gerado ainda.</p>
                    )}
                    {rows.slice(0, 10).map(r => (
                      <article key={r.id} className="rounded-md border p-3">
                        <div className="text-xs text-muted-foreground mb-1">
                          {new Date(r.created_at).toLocaleString()} • {r.agent_type}
                        </div>
                        <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap max-w-none line-clamp-6">
                          {r.output_md}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SynergyDashboard;

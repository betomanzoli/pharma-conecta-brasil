
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';

const KnowledgeHubPage: React.FC = () => {
  const { ingest, search } = useKnowledgeBase();
  const { redirectToChat } = useMasterChatBridge();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleIngest = async () => {
    const res = await ingest({ title, content, source_url: sourceUrl || undefined, source_type: sourceUrl ? 'url' : 'manual' });
    console.log('Ingested:', res);
    setTitle('');
    setContent('');
    setSourceUrl('');
  };

  const handleSearch = async () => {
    const res = await search(query, 5);
    setResults(res);
  };

  const sendToChat = () => {
    const prompt = `Use este contexto do Knowledge Hub para iniciar uma conversa:\n\n${results.map(r => `- ${r.title}: ${r.content.substring(0,140)}...`).join('\n')}`;
    redirectToChat(prompt, { rag_results: results });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Conhecimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="URL de origem (opcional)" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} />
          <Textarea placeholder="Conteúdo" value={content} onChange={e => setContent(e.target.value)} rows={6} />
          <Button onClick={handleIngest}>Ingerir</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Busca Semântica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Digite sua busca..." value={query} onChange={e => setQuery(e.target.value)} />
            <Button variant="outline" onClick={handleSearch}>Buscar</Button>
            <Button onClick={sendToChat}>Enviar para o Chat</Button>
          </div>
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.chunk_id} className="p-3 rounded border">
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.source_url}</div>
                <div className="text-sm">{r.content}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeHubPage;

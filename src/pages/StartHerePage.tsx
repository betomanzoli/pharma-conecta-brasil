
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StartHerePage: React.FC = () => {
  const [productType, setProductType] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  const saveOnboarding = () => {
    const data = { productType, region, goal, company, ts: Date.now() };
    localStorage.setItem('user_onboarding_data', JSON.stringify(data));
    alert('Dados salvos para iniciar. Você pode prosseguir para o Assistente de IA ou Agents Dashboard.');
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Comece aqui</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} />
          <Select onValueChange={setProductType} value={productType}>
            <SelectTrigger><SelectValue placeholder="Tipo de produto" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="medicamento">Medicamento</SelectItem>
              <SelectItem value="dispositivo">Dispositivo</SelectItem>
              <SelectItem value="cosmético">Cosmético</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setRegion} value={region}>
            <SelectTrigger><SelectValue placeholder="Região" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="br">Brasil</SelectItem>
              <SelectItem value="latam">LATAM</SelectItem>
              <SelectItem value="eu">Europa</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Objetivo (ex: registro ANVISA, expansão...)" value={goal} onChange={e => setGoal(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={saveOnboarding}>Salvar dados</Button>
            <a href="/ai-assistant" className="px-4 py-2 rounded border">Ir ao Assistente</a>
            <a href="/agents-dashboard" className="px-4 py-2 rounded border">Agents Dashboard</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartHerePage;

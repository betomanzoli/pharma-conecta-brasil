
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building2, FlaskConical, TrendingUp } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

const RealPlatformStats = () => {
  const { data: profilesCount } = useSupabaseQuery({
    queryKey: ['profiles-count'],
    table: 'profiles',
    select: 'id',
  });

  const { data: companiesCount } = useSupabaseQuery({
    queryKey: ['companies-count'],
    table: 'companies',
    select: 'id',
  });

  const { data: laboratoriesCount } = useSupabaseQuery({
    queryKey: ['laboratories-count'],
    table: 'laboratories',
    select: 'id',
  });

  const { data: projectsCount } = useSupabaseQuery({
    queryKey: ['projects-count'],
    table: 'partnership_opportunities',
    select: 'id',
  });

  const stats = [
    {
      icon: Users,
      label: 'Usuários Cadastrados',
      value: Array.isArray(profilesCount) ? profilesCount.length : 0,
      description: 'Profissionais registrados'
    },
    {
      icon: Building2,
      label: 'Empresas Ativas',
      value: Array.isArray(companiesCount) ? companiesCount.length : 0,
      description: 'Empresas farmacêuticas'
    },
    {
      icon: FlaskConical,
      label: 'Laboratórios',
      value: Array.isArray(laboratoriesCount) ? laboratoriesCount.length : 0,
      description: 'Laboratórios certificados'
    },
    {
      icon: TrendingUp,
      label: 'Oportunidades',
      value: Array.isArray(projectsCount) ? projectsCount.length : 0,
      description: 'Parcerias em andamento'
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Nossa Plataforma em Números Reais
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Dados atualizados em tempo real da nossa base de usuários
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {stats.every(stat => stat.value === 0) && (
          <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              🚀 Plataforma em fase inicial - Seja um dos primeiros a se cadastrar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealPlatformStats;

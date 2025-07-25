
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, FileCheck, Server, Globe } from 'lucide-react';

export const SecurityCompliance = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Criptografia End-to-End',
      description: 'Todas as comunicações são protegidas com criptografia AES-256',
      status: 'Ativo'
    },
    {
      icon: Lock,
      title: 'Autenticação Multi-Fator',
      description: 'Camadas adicionais de segurança para proteger sua conta',
      status: 'Disponível'
    },
    {
      icon: Eye,
      title: 'Monitoramento 24/7',
      description: 'Detecção proativa de ameaças e atividades suspeitas',
      status: 'Ativo'
    },
    {
      icon: FileCheck,
      title: 'Auditoria Completa',
      description: 'Logs detalhados de todas as atividades da plataforma',
      status: 'Ativo'
    },
    {
      icon: Server,
      title: 'Backup Automatizado',
      description: 'Backup automático com redundância geográfica',
      status: 'Ativo'
    },
    {
      icon: Globe,
      title: 'Compliance Global',
      description: 'Conformidade com LGPD, GDPR e regulamentações internacionais',
      status: 'Certificado'
    }
  ];

  const certifications = [
    {
      name: 'ISO 27001',
      description: 'Gestão de Segurança da Informação',
      icon: '🔒'
    },
    {
      name: 'SOC 2 Type II',
      description: 'Controles de Segurança Auditados',
      icon: '🛡️'
    },
    {
      name: 'LGPD Compliance',
      description: 'Lei Geral de Proteção de Dados',
      icon: '🇧🇷'
    },
    {
      name: 'GDPR Compliance',
      description: 'Regulamento Geral de Proteção de Dados',
      icon: '🇪🇺'
    },
    {
      name: 'AWS Security',
      description: 'Infraestrutura Segura na Nuvem',
      icon: '☁️'
    },
    {
      name: '99.9% Uptime',
      description: 'Garantia de Disponibilidade',
      icon: '⚡'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Segurança e <span className="text-blue-600">Compliance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Proteção de dados de nível empresarial com certificações internacionais
          </p>
        </div>

        {/* Recursos de Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Certificações */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Certificações e Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h4 className="font-semibold text-lg mb-2">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Garantias */}
        <div className="mt-16 bg-blue-600 text-white rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Nossas Garantias</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-blue-100">Uptime Garantido</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">30 dias</div>
                <div className="text-blue-100">Garantia de Satisfação</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Suporte Técnico</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

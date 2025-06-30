
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AIMatchingEngine from '@/components/marketplace/AIMatchingEngine';
import RegulatoryAlerts from '@/components/pharmaceutical/RegulatoryAlerts';
import ComplianceChecker from '@/components/pharmaceutical/ComplianceChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, AlertTriangle, Users, TrendingUp, Building } from 'lucide-react';

const Marketplace = () => {
  const [activeConnections, setActiveConnections] = useState(23);
  const [pendingMatches, setPendingMatches] = useState(7);
  const [complianceScore, setComplianceScore] = useState(92);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Inteligente</h1>
            <p className="text-gray-600">Conecte-se com laboratórios, consultores e empresas farmacêuticas usando IA</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conexões Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{activeConnections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Matches Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingMatches}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Score Compliance</p>
                    <p className="text-2xl font-bold text-gray-900">{complianceScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="matching" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matching" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Matching</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="regulatory" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Regulatório</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matching" className="space-y-6">
              <AIMatchingEngine />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Empresas Disponíveis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'FarmaTech Solutions', type: 'Genéricos', location: 'São Paulo', rating: 4.8 },
                      { name: 'LabAnalyse Premium', type: 'Laboratório', location: 'Rio de Janeiro', rating: 4.9 },
                      { name: 'BioPharma Consulting', type: 'Consultoria', location: 'Belo Horizonte', rating: 4.7 },
                      { name: 'Instituto de Pesquisas', type: 'P&D', location: 'Campinas', rating: 4.6 },
                      { name: 'MedGenesis Lab', type: 'Análises', location: 'Porto Alegre', rating: 4.8 },
                      { name: 'Regulatory Expert', type: 'Regulatório', location: 'Brasília', rating: 4.9 }
                    ].map((company, idx) => (
                      <Card key={idx} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{company.name}</h3>
                          <div className="space-y-2">
                            <Badge variant="outline" className="text-xs">{company.type}</Badge>
                            <p className="text-sm text-gray-600">{company.location}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-medium">{company.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceChecker />
            </TabsContent>

            <TabsContent value="regulatory">
              <RegulatoryAlerts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Marketplace;

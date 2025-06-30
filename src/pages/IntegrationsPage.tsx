
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import FINEPIntegration from '@/components/integration/FINEPIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText, Globe, Zap } from 'lucide-react';

const IntegrationsPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrações Governamentais</h1>
            <p className="text-gray-600">Conecte-se com órgãos governamentais e acesse oportunidades de financiamento</p>
          </div>

          <Tabs defaultValue="finep" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="finep" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>FINEP</span>
              </TabsTrigger>
              <TabsTrigger value="cnpq" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>CNPq</span>
              </TabsTrigger>
              <TabsTrigger value="inpi" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>INPI</span>
              </TabsTrigger>
              <TabsTrigger value="anvisa" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>ANVISA</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="finep">
              <FINEPIntegration />
            </TabsContent>

            <TabsContent value="cnpq">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Integração CNPq
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
                    <p className="text-gray-600">
                      A integração com o CNPq para acesso a editais de pesquisa estará disponível em breve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inpi">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Integração INPI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
                    <p className="text-gray-600">
                      A integração com o INPI para consulta de patentes estará disponível em breve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anvisa">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Integração ANVISA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
                    <p className="text-gray-600">
                      A integração com a ANVISA para alertas regulatórios automatizados estará disponível em breve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default IntegrationsPage;

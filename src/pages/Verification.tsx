
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Upload, Building, CheckSquare } from 'lucide-react';
import VerificationStatus from '@/components/verification/VerificationStatus';
import DocumentUpload from '@/components/verification/DocumentUpload';
import CNPJValidator from '@/components/verification/CNPJValidator';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Verification = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da Página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Central de Verificação
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete sua verificação para aumentar sua credibilidade na plataforma
          </p>
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="cnpj" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>CNPJ</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Ajuda</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <VerificationStatus />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="cnpj">
            <CNPJValidator />
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Como funciona a verificação?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Para Empresas</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Validação de CNPJ junto à Receita Federal</li>
                      <li>• Upload da certidão de CNPJ atualizada</li>
                      <li>• Verificação de licenças específicas</li>
                      <li>• Análise manual pela nossa equipe</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Para Laboratórios</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Validação de CNPJ e licenças ANVISA</li>
                      <li>• Certificados de acreditação (ISO, INMETRO)</li>
                      <li>• Licenças de funcionamento específicas</li>
                      <li>• Verificação de especialidades técnicas</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Para Consultores</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Verificação de identidade profissional</li>
                      <li>• Certificados de formação</li>
                      <li>• Registros em conselhos profissionais</li>
                      <li>• Validação de experiência profissional</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Benefícios da Verificação</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Maior credibilidade no marketplace</li>
                      <li>• Badges de verificação no perfil</li>
                      <li>• Prioridade em buscas e matches</li>
                      <li>• Acesso a recursos premium</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Tipos de Documentos Aceitos</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Documentos Empresariais</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Certidão de CNPJ</li>
                        <li>• Contrato social</li>
                        <li>• Licenças de funcionamento</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Certificações</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• ISO 9001, 17025</li>
                        <li>• Acreditação INMETRO</li>
                        <li>• Certificados ANVISA</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Formatos Aceitos</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• PDF (preferível)</li>
                        <li>• JPEG/PNG</li>
                        <li>• Máximo 10MB</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Tempo de Processamento</h4>
                  <p className="text-sm text-blue-800">
                    A verificação geralmente leva de 2 a 5 dias úteis. Documentos com problemas 
                    podem demorar mais para serem processados. Você receberá notificações sobre 
                    o status da sua verificação.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Verification;

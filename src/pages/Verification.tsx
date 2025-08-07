
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Upload, 
  FileText,
  Building2,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/layout/DemoModeIndicator';

const Verification = () => {
  const { profile } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const verificationSteps = [
    {
      id: 'identity',
      title: 'Verificação de Identidade',
      description: 'Documento de identidade válido (RG, CNH ou Passaporte)',
      status: 'pending',
      icon: User,
      required: true
    },
    {
      id: 'company',
      title: 'Verificação de Empresa',
      description: 'Documento de CNPJ e contrato social',
      status: 'pending',
      icon: Building2,
      required: profile?.user_type === 'company' || profile?.user_type === 'laboratory'
    },
    {
      id: 'professional',
      title: 'Verificação Profissional',
      description: 'CRF ou certificações profissionais relevantes',
      status: 'pending',
      icon: Shield,
      required: profile?.user_type === 'consultant'
    },
    {
      id: 'anvisa',
      title: 'Certificação ANVISA',
      description: 'Licenças e certificações ANVISA aplicáveis',
      status: 'pending',
      icon: FileText,
      required: profile?.user_type === 'laboratory'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Verificado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Não iniciado</Badge>;
    }
  };

  const handleFileUpload = async (stepId: string) => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simular upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setSelectedFile(null);
    
    alert(`Documento enviado para verificação: ${stepId}`);
  };

  const filteredSteps = verificationSteps.filter(step => step.required);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Verificação de Conta
            </h1>
            <p className="text-muted-foreground">
              Complete sua verificação para acessar todas as funcionalidades da plataforma
            </p>
          </div>

          <DemoModeIndicator variant="alert" className="mb-6" />

          <div className="grid gap-6">
            {filteredSteps.map((step) => {
              const Icon = step.icon;
              
              return (
                <Card key={step.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(step.status)}
                        {getStatusBadge(step.status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {step.status === 'pending' && (
                      <div className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor={`file-${step.id}`}>Selecionar documento</Label>
                          <Input
                            id={`file-${step.id}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        
                        <Button 
                          onClick={() => handleFileUpload(step.id)}
                          disabled={!selectedFile || isUploading}
                          className="w-full sm:w-auto"
                        >
                          {isUploading ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Enviar Documento
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {step.status === 'completed' && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Verificação concluída com sucesso!
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sistema de Verificação:</strong> Esta funcionalidade está em desenvolvimento. 
              Os uploads de documentos são simulados e não são processados no momento.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Verification;

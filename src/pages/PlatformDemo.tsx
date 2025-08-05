
import React from 'react';
import Navigation from '@/components/Navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PlatformDemo from '@/components/demo/PlatformDemo';

const PlatformDemoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                MODO DEMONSTRAÇÃO
              </Badge>
            </div>
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demonstração da Plataforma:</strong> Esta é uma versão demonstrativa com dados simulados. 
              Para acessar a plataforma completa com dados reais, faça login ou registre-se.
            </AlertDescription>
          </Alert>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Demonstração PharmaConnect Brasil
          </h1>
          <p className="text-muted-foreground">
            Explore as principais funcionalidades do ecossistema colaborativo farmacêutico
          </p>
        </div>

        <PlatformDemo />
      </div>
    </div>
  );
};

export default PlatformDemoPage;

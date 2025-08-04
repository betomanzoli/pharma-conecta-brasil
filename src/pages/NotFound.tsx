
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Página não encontrada</CardTitle>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Ir para Início
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Páginas principais:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/dashboard" className="text-sm text-primary hover:underline">
                Dashboard
              </Link>
              <Link to="/analytics" className="text-sm text-primary hover:underline">
                Analytics
              </Link>
              <Link to="/ai-dashboard" className="text-sm text-primary hover:underline">
                AI Matching
              </Link>
              <Link to="/master-ai" className="text-sm text-primary hover:underline">
                Master AI Hub
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

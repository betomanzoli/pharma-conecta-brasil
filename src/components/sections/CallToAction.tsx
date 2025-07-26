
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para Transformar Seu Negócio?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Junte-se à revolução digital do setor farmacêutico brasileiro. 
            Comece gratuitamente e descubra oportunidades ilimitadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crescimento Garantido</h3>
              <p className="text-muted-foreground">
                Aumente suas oportunidades de negócio em até 300% com nosso AI Matching
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rede Qualificada</h3>
              <p className="text-muted-foreground">
                Conecte-se apenas com profissionais verificados e empresas certificadas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Matches Precisos</h3>
              <p className="text-muted-foreground">
                IA treinada especificamente para o mercado farmacêutico brasileiro
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              <Link to="/register">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link to="/marketplace">
                Explorar Marketplace
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Sem compromisso • Configuração em 2 minutos • Suporte especializado 24/7
          </p>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              ✅ Grátis para sempre
            </div>
            <div className="flex items-center">
              ✅ Sem cartão de crédito
            </div>
            <div className="flex items-center">
              ✅ Compliance ANVISA
            </div>
          </div>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Oferta Especial de Lançamento
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Primeiros 1000 usuários recebem <span className="font-bold text-blue-600">6 meses Premium GRÁTIS</span>
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
              <span>⏰ Oferta limitada</span>
              <span>•</span>
              <span>🚀 Acesso antecipado a novas features</span>
              <span>•</span>
              <span>💼 Consultoria personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

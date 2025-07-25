
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Star, Users, Zap } from 'lucide-react';

export const CallToAction = () => {
  const benefits = [
    'Acesso gratuito por 30 dias',
    'Configuração completa incluída',
    'Suporte especializado 24/7',
    'Sem compromisso ou taxa de cancelamento',
    'Resultados visíveis em até 15 dias'
  ];

  const testimonials = [
    {
      name: 'Dr. Maria Santos',
      role: 'Diretora Regulatória, PharmaBrasil',
      text: 'A plataforma revolucionou nossa gestão de compliance. ROI de 400% em 6 meses.',
      rating: 5
    },
    {
      name: 'João Silva',
      role: 'CEO, LabTech Solutions',
      text: 'Aumentamos nossa carteira de clientes em 300% através das conexões da plataforma.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Consultora Regulatória',
      text: 'Minha autoridade no setor cresceu significativamente. Recomendo para todos os colegas.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para <span className="text-yellow-300">Transformar</span> Seus Resultados?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Junte-se a milhares de profissionais que já estão maximizando suas oportunidades na plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Benefícios */}
          <div>
            <h3 className="text-2xl font-bold mb-6">O que você recebe:</h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Agendar Demonstração
              </Button>
            </div>
          </div>

          {/* Depoimentos */}
          <div>
            <h3 className="text-2xl font-bold mb-6">O que nossos clientes dizem:</h3>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 border-white/20 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-blue-100">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Estatísticas finais */}
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Resultados Comprovados</h3>
            <p className="text-blue-100">Dados reais de nossos clientes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold">300%</div>
              <div className="text-sm text-blue-100">ROI Médio</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-sm text-blue-100">Profissionais Ativos</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold">15 dias</div>
              <div className="text-sm text-blue-100">Tempo para Resultados</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-blue-100">Satisfação</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-blue-100 mb-4">
            Mais de 500 empresas já confiam em nossa plataforma
          </p>
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
            Teste Grátis por 30 Dias - Sem Cartão de Crédito
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

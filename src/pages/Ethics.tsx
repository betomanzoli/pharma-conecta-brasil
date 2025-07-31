
import React from 'react';
import Navigation from '@/components/Navigation';
import { Heart, Users, Shield, Leaf, Handshake, Award } from 'lucide-react';

const Ethics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Código de Ética
            </h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Nossos princípios e valores que orientam todas as operações do PharmaConnect Brasil
            </p>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Missão e Valores
                </h2>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>Missão:</strong> Conectar profissionais do setor farmacêutico brasileiro para 
                  acelerar a inovação e melhorar o acesso a medicamentos de qualidade.
                </p>
                <p className="text-gray-700">
                  <strong>Valores:</strong> Transparência, integridade, colaboração, inovação e compromisso 
                  com a saúde pública brasileira.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Compromisso com os Usuários
                </h2>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Tratamento justo e igualitário para todos os usuários</li>
                  <li>• Proteção rigorosa de dados pessoais e empresariais</li>
                  <li>• Transparência em todas as operações e processos</li>
                  <li>• Suporte técnico responsivo e qualificado</li>
                  <li>• Melhoria contínua baseada em feedback dos usuários</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Integridade e Conformidade
                </h2>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Cumprimento rigoroso de todas as regulamentações da ANVISA</li>
                  <li>• Conformidade com a LGPD e outras leis de proteção de dados</li>
                  <li>• Prevenção ativa contra fraudes e práticas antiéticas</li>
                  <li>• Auditoria regular de processos e sistemas</li>
                  <li>• Canal de denúncias para práticas inadequadas</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Handshake className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Relacionamentos Comerciais Éticos
                </h2>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Promoção de relacionamentos comerciais transparentes</li>
                  <li>• Prevenção de conflitos de interesse</li>
                  <li>• Facilitação de negócios justos e equilibrados</li>
                  <li>• Respeito à propriedade intelectual de todos os usuários</li>
                  <li>• Mediação imparcial em disputas entre usuários</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Responsabilidade Social e Ambiental
                </h2>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Promoção de práticas sustentáveis no setor farmacêutico</li>
                  <li>• Apoio ao desenvolvimento de medicamentos acessíveis</li>
                  <li>• Incentivo à inovação em saúde pública</li>
                  <li>• Redução do impacto ambiental de nossas operações</li>
                  <li>• Contribuição para o fortalecimento do SUS</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Excelência e Inovação
                </h2>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Busca constante pela excelência em todos os serviços</li>
                  <li>• Investimento contínuo em tecnologia e inovação</li>
                  <li>• Capacitação constante de nossa equipe</li>
                  <li>• Foco na experiência do usuário e satisfação do cliente</li>
                  <li>• Contribuição para a evolução do ecossistema farmacêutico brasileiro</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Canal de Ética
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Para reportar violações éticas ou esclarecer dúvidas:
                </p>
                <div className="space-y-1">
                  <p className="text-gray-700">
                    <strong>Email:</strong> etica@pharmaconnectbrasil.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Telefone:</strong> 0800-123-4567 (24h)
                  </p>
                  <p className="text-gray-700">
                    <strong>Canal Online:</strong> Disponível na plataforma (100% confidencial)
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ethics;

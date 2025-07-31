
import React from 'react';
import Navigation from '@/components/Navigation';
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Scale className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Termos de Uso
            </h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Aceitação dos Termos
                </h2>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Ao acessar e usar o PharmaConnect Brasil, você concorda com estes termos de uso. 
                  Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Descrição do Serviço
                </h2>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  O PharmaConnect Brasil é uma plataforma digital que conecta:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Empresas farmacêuticas</li>
                  <li>• Laboratórios de análise</li>
                  <li>• Consultores especializados</li>
                  <li>• Outros profissionais do setor farmacêutico</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Responsabilidades do Usuário
                </h2>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Fornecer informações precisas e atualizadas</li>
                  <li>• Manter a confidencialidade de suas credenciais</li>
                  <li>• Usar a plataforma apenas para fins profissionais legítimos</li>
                  <li>• Respeitar os direitos de propriedade intelectual</li>
                  <li>• Cumprir todas as regulamentações aplicáveis do setor farmacêutico</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Limitação de Responsabilidade
                </h2>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  O PharmaConnect Brasil atua como intermediador. Não nos responsabilizamos por:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Qualidade dos serviços prestados entre usuários</li>
                  <li>• Disputas comerciais entre as partes</li>
                  <li>• Conformidade regulatória dos usuários</li>
                  <li>• Decisões comerciais baseadas em informações da plataforma</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Propriedade Intelectual
                </h2>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Todo o conteúdo da plataforma, incluindo design, funcionalidades, algoritmos e marca, 
                  são propriedade do PharmaConnect Brasil e estão protegidos por leis de propriedade intelectual.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Modificações
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Reservamos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação na plataforma.
                  O uso continuado constitui aceitação dos novos termos.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Contato
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Para questões sobre estes termos:
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@pharmaconnectbrasil.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Telefone:</strong> (11) 3000-0000
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

export default Terms;


import React from 'react';
import Navigation from '@/components/Navigation';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Política de Privacidade
            </h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Informações que Coletamos
                </h2>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Dados de identificação (nome, email, telefone)</li>
                  <li>• Informações profissionais (cargo, empresa, especialização)</li>
                  <li>• Dados de utilização da plataforma</li>
                  <li>• Informações de comunicação entre usuários</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Como Utilizamos suas Informações
                </h2>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Facilitar conexões entre profissionais do setor farmacêutico</li>
                  <li>• Melhorar nossos algoritmos de matching</li>
                  <li>• Fornecer suporte técnico e atendimento ao cliente</li>
                  <li>• Enviar comunicações relevantes sobre a plataforma</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Proteção de Dados
                </h2>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• Criptografia de dados em trânsito e em repouso</li>
                  <li>• Acesso restrito por autenticação multifator</li>
                  <li>• Auditorias regulares de segurança</li>
                  <li>• Conformidade com LGPD e regulamentações internacionais</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Seus Direitos
                </h2>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Conforme a LGPD, você tem direito a:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Acessar seus dados pessoais</li>
                  <li>• Solicitar correção de dados inexatos</li>
                  <li>• Solicitar exclusão de dados</li>
                  <li>• Revogar consentimento a qualquer momento</li>
                  <li>• Portabilidade dos dados</li>
                </ul>
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
                  Para exercer seus direitos ou esclarecer dúvidas sobre nossa política de privacidade:
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacidade@pharmaconnectbrasil.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Telefone:</strong> (11) 3000-0000
                  </p>
                  <p className="text-gray-700">
                    <strong>Encarregado de Dados:</strong> dpo@pharmaconnectbrasil.com
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

export default Privacy;

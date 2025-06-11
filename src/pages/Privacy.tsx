
import { Shield, Lock, Database, FileText, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidade LGPD</h1>
          <p className="text-gray-600">
            Última atualização: 11 de junho de 2025
          </p>
        </div>

        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) 
            e demais regulamentações aplicáveis no Brasil.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Introdução */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                1. Introdução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A PharmaConnect Brasil ("nós", "nosso" ou "Plataforma") é uma plataforma digital especializada em conectar 
                profissionais da indústria farmacêutica brasileira. Respeitamos sua privacidade e estamos comprometidos em 
                proteger seus dados pessoais de acordo com as melhores práticas de segurança e conformidade com a LGPD.
              </p>
              <p>
                Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações 
                pessoais quando você utiliza nossa plataforma.
              </p>
            </CardContent>
          </Card>

          {/* Dados Coletados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Database className="h-5 w-5 mr-2" />
                2. Dados Pessoais Coletados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">2.1 Dados de Identificação:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>CPF ou CNPJ</li>
                <li>Número de telefone</li>
                <li>Endereço profissional</li>
              </ul>

              <h4 className="font-semibold">2.2 Dados Profissionais:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Cargo e função</li>
                <li>Empresa/Instituição</li>
                <li>Área de especialização</li>
                <li>Experiência profissional</li>
                <li>Certificações e credenciais</li>
                <li>Registro profissional (CRF, quando aplicável)</li>
              </ul>

              <h4 className="font-semibold">2.3 Dados de Uso:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Logs de acesso</li>
                <li>Endereço IP</li>
                <li>Dados de navegação</li>
                <li>Preferências e configurações</li>
              </ul>
            </CardContent>
          </Card>

          {/* Finalidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Shield className="h-5 w-5 mr-2" />
                3. Finalidades do Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
              
              <h4 className="font-semibold">3.1 Operação da Plataforma:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Criar e gerenciar sua conta</li>
                <li>Facilitar conexões profissionais</li>
                <li>Fornecer funcionalidades de busca e recomendação</li>
                <li>Processar transações e serviços</li>
              </ul>

              <h4 className="font-semibold">3.2 Comunicação:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Enviar notificações sobre a plataforma</li>
                <li>Comunicar atualizações regulatórias</li>
                <li>Responder a solicitações de suporte</li>
              </ul>

              <h4 className="font-semibold">3.3 Melhoria dos Serviços:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Análise de uso para melhorias</li>
                <li>Personalização da experiência</li>
                <li>Desenvolvimento de novas funcionalidades</li>
              </ul>
            </CardContent>
          </Card>

          {/* Base Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                4. Base Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>O tratamento de seus dados pessoais é baseado em:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Consentimento:</strong> Para dados fornecidos voluntariamente</li>
                <li><strong>Execução de contrato:</strong> Para prestação dos serviços contratados</li>
                <li><strong>Legítimo interesse:</strong> Para melhoria dos serviços e segurança</li>
                <li><strong>Cumprimento de obrigação legal:</strong> Para conformidade regulatória</li>
              </ul>
            </CardContent>
          </Card>

          {/* Compartilhamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Lock className="h-5 w-5 mr-2" />
                5. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Seus dados podem ser compartilhados apenas nas seguintes situações:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Com outros usuários da plataforma, conforme suas configurações de privacidade</li>
                <li>Com prestadores de serviços essenciais (hospedagem, pagamentos, etc.)</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para proteger nossos direitos legais ou segurança da plataforma</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Importante:</strong> Nunca vendemos seus dados pessoais para terceiros.
              </p>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Shield className="h-5 w-5 mr-2" />
                6. Segurança dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Armazenamento seguro em servidores certificados</li>
                <li>Controle de acesso baseado em funções</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
                <li>Treinamento da equipe em proteção de dados</li>
              </ul>
            </CardContent>
          </Card>

          {/* Direitos do Titular */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                7. Seus Direitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                <li><strong>Acesso:</strong> Obter cópia dos seus dados</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
                <li><strong>Anonimização:</strong> Tornar dados anônimos quando possível</li>
                <li><strong>Bloqueio:</strong> Suspender o uso de dados desnecessários</li>
                <li><strong>Eliminação:</strong> Excluir dados quando aplicável</li>
                <li><strong>Portabilidade:</strong> Transferir dados para outro fornecedor</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Informação:</strong> Conhecer entidades com quem compartilhamos dados</li>
              </ul>
            </CardContent>
          </Card>

          {/* Retenção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Database className="h-5 w-5 mr-2" />
                8. Retenção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Mantemos seus dados pessoais pelo tempo necessário para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Prestação dos serviços contratados</li>
                <li>Cumprimento de obrigações legais</li>
                <li>Exercício de direitos em processos judiciais</li>
              </ul>
              <p>
                Após esse período, os dados são eliminados de forma segura ou anonimizados para fins estatísticos.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Phone className="h-5 w-5 mr-2" />
                9. Contato e DPO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política:</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Encarregado de Proteção de Dados (DPO)</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span>dpo@pharmaconnect.com.br</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span>(11) 3000-0000</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Responderemos sua solicitação em até 15 dias úteis, conforme previsto na LGPD.
              </p>
            </CardContent>
          </Card>

          {/* Alterações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                10. Alterações na Política
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
                através da plataforma ou por e-mail. Recomendamos revisar esta página regularmente.
              </p>
              <p className="text-sm text-gray-600">
                A versão mais atual sempre estará disponível em: www.pharmaconnect.com.br/privacy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Privacy;


import { FileText, Users, Shield, AlertTriangle, Scale, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Termos de Uso</h1>
          <p className="text-gray-600">
            Última atualização: 11 de junho de 2025
          </p>
        </div>

        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Ao utilizar a PharmaConnect Brasil, você concorda integralmente com estes Termos de Uso. 
            Leia atentamente antes de prosseguir.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Definições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                1. Definições
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Para os fins destes Termos de Uso, consideram-se:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Plataforma:</strong> PharmaConnect Brasil, ecossistema digital para profissionais farmacêuticos</li>
                <li><strong>Usuário:</strong> Pessoa física ou jurídica que utiliza os serviços da Plataforma</li>
                <li><strong>Conteúdo:</strong> Qualquer informação, texto, imagem ou dado inserido na Plataforma</li>
                <li><strong>Serviços:</strong> Funcionalidades oferecidas pela Plataforma</li>
                <li><strong>Conta:</strong> Registro individual de acesso aos Serviços</li>
              </ul>
            </CardContent>
          </Card>

          {/* Objeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Users className="h-5 w-5 mr-2" />
                2. Objeto e Finalidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A PharmaConnect Brasil é uma plataforma digital especializada em conectar profissionais, empresas, 
                laboratórios e fornecedores da indústria farmacêutica brasileira.
              </p>
              
              <h4 className="font-semibold">2.1 Serviços Oferecidos:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Networking profissional especializado</li>
                <li>Marketplace para serviços farmacêuticos</li>
                <li>Informações regulatórias e compliance</li>
                <li>Fóruns de discussão técnica</li>
                <li>Biblioteca de conhecimento</li>
                <li>Oportunidades de carreira</li>
                <li>Eventos e capacitações</li>
              </ul>

              <h4 className="font-semibold">2.2 Público-Alvo:</h4>
              <p>
                Destinado exclusivamente a profissionais qualificados da indústria farmacêutica, incluindo 
                farmacêuticos, pesquisadores, profissionais de regulatório, qualidade, produção e comercial.
              </p>
            </CardContent>
          </Card>

          {/* Cadastro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Users className="h-5 w-5 mr-2" />
                3. Cadastro e Conta de Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">3.1 Elegibilidade:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ser maior de 18 anos</li>
                <li>Ter formação ou experiência na área farmacêutica</li>
                <li>Fornecer informações verídicas e completas</li>
                <li>Possuir registro profissional válido (quando aplicável)</li>
              </ul>

              <h4 className="font-semibold">3.2 Verificação:</h4>
              <p>
                Reservamo-nos o direito de verificar as credenciais profissionais e solicitar documentos 
                comprobatórios para validação do perfil.
              </p>

              <h4 className="font-semibold">3.3 Responsabilidades:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter dados atualizados</li>
                <li>Proteger credenciais de acesso</li>
                <li>Notificar uso indevido da conta</li>
                <li>Usar a Plataforma conforme sua finalidade</li>
              </ul>
            </CardContent>
          </Card>

          {/* Condições de Uso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Shield className="h-5 w-5 mr-2" />
                4. Condições de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">4.1 Uso Permitido:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Networking profissional legítimo</li>
                <li>Busca de oportunidades de negócio</li>
                <li>Compartilhamento de conhecimento técnico</li>
                <li>Participação em discussões construtivas</li>
              </ul>

              <h4 className="font-semibold">4.2 Uso Proibido:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violação de direitos autorais ou propriedade intelectual</li>
                <li>Compartilhamento de informações confidenciais sem autorização</li>
                <li>Spam, marketing não solicitado ou prospecção abusiva</li>
                <li>Criação de perfis falsos ou fraudulentos</li>
                <li>Uso para fins não relacionados à indústria farmacêutica</li>
                <li>Violação de regulamentações ANVISA ou outras autoridades</li>
                <li>Tentativas de comprometer a segurança da Plataforma</li>
              </ul>
            </CardContent>
          </Card>

          {/* Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                5. Conteúdo e Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">5.1 Conteúdo do Usuário:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Você mantém direitos sobre o conteúdo que publica</li>
                <li>Concede licença à Plataforma para uso necessário aos Serviços</li>
                <li>É responsável pela veracidade e legalidade do conteúdo</li>
                <li>Deve respeitar direitos de terceiros</li>
              </ul>

              <h4 className="font-semibold">5.2 Conteúdo da Plataforma:</h4>
              <p>
                Todo conteúdo original da PharmaConnect Brasil (textos, design, código, etc.) é de nossa 
                propriedade e protegido por direitos autorais.
              </p>

              <h4 className="font-semibold">5.3 Moderação:</h4>
              <p>
                Reservamo-nos o direito de remover conteúdo que viole estes Termos ou seja inadequado 
                para a comunidade profissional.
              </p>
            </CardContent>
          </Card>

          {/* Transações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Scale className="h-5 w-5 mr-2" />
                6. Transações e Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">6.1 Marketplace:</h4>
              <p>
                A Plataforma facilita conexões entre prestadores e contratantes de serviços, mas não é 
                parte nas transações comerciais entre usuários.
              </p>

              <h4 className="font-semibold">6.2 Responsabilidades:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Usuários são responsáveis por suas negociações</li>
                <li>Contratos devem seguir legislação brasileira</li>
                <li>Disputas devem ser resolvidas entre as partes</li>
                <li>Cumprir obrigações fiscais e regulatórias</li>
              </ul>

              <h4 className="font-semibold">6.3 Taxas de Serviço:</h4>
              <p>
                Podemos cobrar taxas por serviços premium, transações ou funcionalidades avançadas, 
                sempre com transparência prévia.
              </p>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Shield className="h-5 w-5 mr-2" />
                7. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O tratamento de dados pessoais segue nossa Política de Privacidade, em conformidade com a LGPD 
                e demais regulamentações aplicáveis.
              </p>
              
              <h4 className="font-semibold">7.1 Compromissos:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Transparência no uso de dados</li>
                <li>Segurança no armazenamento</li>
                <li>Respeito aos direitos do titular</li>
                <li>Conformidade regulatória</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <AlertTriangle className="h-5 w-5 mr-2" />
                8. Limitações e Exclusões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">8.1 Disponibilidade:</h4>
              <p>
                A Plataforma é fornecida "como está". Não garantimos disponibilidade ininterrupta 
                ou ausência de erros.
              </p>

              <h4 className="font-semibold">8.2 Limitação de Responsabilidade:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Não somos responsáveis por transações entre usuários</li>
                <li>Informações de terceiros não são de nossa responsabilidade</li>
                <li>Decisões baseadas no conteúdo são de responsabilidade do usuário</li>
              </ul>

              <h4 className="font-semibold">8.3 Isenções:</h4>
              <p>
                Não nos responsabilizamos por danos indiretos, lucros cessantes ou prejuízos emergentes, 
                exceto quando vedado por lei.
              </p>
            </CardContent>
          </Card>

          {/* Suspensão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <AlertTriangle className="h-5 w-5 mr-2" />
                9. Suspensão e Encerramento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">9.1 Motivos para Suspensão:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violação destes Termos de Uso</li>
                <li>Uso inadequado da Plataforma</li>
                <li>Fornecimento de informações falsas</li>
                <li>Atividades que prejudiquem outros usuários</li>
              </ul>

              <h4 className="font-semibold">9.2 Processo:</h4>
              <p>
                Tentaremos notificar sobre violações e dar oportunidade de correção, exceto em casos graves 
                que exijam ação imediata.
              </p>

              <h4 className="font-semibold">9.3 Encerramento Voluntário:</h4>
              <p>
                Usuários podem encerrar suas contas a qualquer momento através das configurações da conta 
                ou solicitação ao suporte.
              </p>
            </CardContent>
          </Card>

          {/* Alterações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <FileText className="h-5 w-5 mr-2" />
                10. Alterações nos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Podemos atualizar estes Termos de Uso periodicamente para refletir mudanças em nossos 
                serviços ou na legislação.
              </p>
              
              <h4 className="font-semibold">10.1 Notificação:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mudanças significativas serão notificadas por e-mail</li>
                <li>Versão atual sempre disponível na Plataforma</li>
                <li>Uso continuado implica aceitação das mudanças</li>
              </ul>
            </CardContent>
          </Card>

          {/* Lei Aplicável */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Scale className="h-5 w-5 mr-2" />
                11. Lei Aplicável e Foro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Estes Termos de Uso são regidos pelas leis brasileiras, especialmente:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Código de Defesa do Consumidor</li>
                <li>Marco Civil da Internet</li>
                <li>Lei Geral de Proteção de Dados (LGPD)</li>
                <li>Regulamentações ANVISA</li>
              </ul>
              
              <p className="mt-4">
                <strong>Foro:</strong> Comarca de São Paulo/SP para resolução de eventuais disputas.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Phone className="h-5 w-5 mr-2" />
                12. Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Para dúvidas sobre estes Termos de Uso:</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">PharmaConnect Brasil</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>legal@pharmaconnect.com.br</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span>(11) 3000-0000</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Horário de atendimento: Segunda a sexta, das 9h às 18h (horário de Brasília).
              </p>
            </CardContent>
          </Card>

          {/* Aceitação */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-blue-800 font-medium">
                Ao utilizar a PharmaConnect Brasil, você declara ter lido, compreendido e aceito 
                integralmente estes Termos de Uso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Terms;

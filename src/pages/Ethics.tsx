
import { Shield, Heart, Users, Scale, AlertTriangle, Award, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";

const Ethics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Código de Ética</h1>
          <p className="text-gray-600">
            Última atualização: 11 de junho de 2025
          </p>
        </div>

        <Alert className="mb-8 bg-green-50 border-green-200">
          <Heart className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Este Código de Ética estabelece os princípios e valores que orientam nossa comunidade profissional, 
            promovendo um ambiente ético, respeitoso e comprometido com a excelência na indústria farmacêutica.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Missão e Valores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Heart className="h-5 w-5 mr-2" />
                1. Missão e Valores Fundamentais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">1.1 Nossa Missão:</h4>
              <p>
                Promover a conexão ética e colaborativa entre profissionais da indústria farmacêutica brasileira, 
                contribuindo para o avanço da saúde pública através da inovação, conhecimento e práticas responsáveis.
              </p>

              <h4 className="font-semibold">1.2 Valores Fundamentais:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Integridade:</strong> Transparência e honestidade em todas as interações</li>
                <li><strong>Excelência:</strong> Busca contínua pela qualidade e melhores práticas</li>
                <li><strong>Responsabilidade:</strong> Compromisso com a saúde pública e bem-estar social</li>
                <li><strong>Colaboração:</strong> Trabalho conjunto para benefício mútuo e da sociedade</li>
                <li><strong>Inovação:</strong> Estímulo ao desenvolvimento científico e tecnológico</li>
                <li><strong>Diversidade:</strong> Respeito e valorização das diferenças</li>
                <li><strong>Sustentabilidade:</strong> Compromisso com práticas ambientalmente responsáveis</li>
              </ul>
            </CardContent>
          </Card>

          {/* Princípios Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Award className="h-5 w-5 mr-2" />
                2. Princípios Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">2.1 Competência Profissional:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter conhecimentos técnicos atualizados</li>
                <li>Reconhecer limitações e buscar capacitação contínua</li>
                <li>Colaborar apenas em áreas de competência comprovada</li>
                <li>Compartilhar conhecimento de forma responsável</li>
              </ul>

              <h4 className="font-semibold">2.2 Responsabilidade Científica:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Basear decisões em evidências científicas sólidas</li>
                <li>Respeitar metodologias e protocolos estabelecidos</li>
                <li>Reportar resultados de forma precisa e imparcial</li>
                <li>Reconhecer e citar adequadamente fontes e contribuições</li>
              </ul>

              <h4 className="font-semibold">2.3 Compromisso com a Qualidade:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seguir rigorosamente normas regulatórias</li>
                <li>Implementar sistemas de gestão da qualidade</li>
                <li>Promover melhoria contínua dos processos</li>
                <li>Garantir segurança e eficácia dos produtos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Conduta na Plataforma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Users className="h-5 w-5 mr-2" />
                3. Conduta na Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">3.1 Interações Respeitosas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tratar todos os membros com cortesia e respeito</li>
                <li>Evitar linguagem ofensiva, discriminatória ou inadequada</li>
                <li>Reconhecer e valorizar diferentes perspectivas</li>
                <li>Manter diálogo construtivo e profissional</li>
              </ul>

              <h4 className="font-semibold">3.2 Compartilhamento de Informações:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Verificar veracidade antes de compartilhar informações</li>
                <li>Respeitar direitos autorais e propriedade intelectual</li>
                <li>Não divulgar informações confidenciais ou proprietárias</li>
                <li>Identificar claramente opiniões pessoais vs. fatos</li>
              </ul>

              <h4 className="font-semibold">3.3 Networking Ético:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Estabelecer conexões baseadas em interesses profissionais legítimos</li>
                <li>Ser transparente sobre intenções e objetivos</li>
                <li>Evitar spam ou comunicação não solicitada excessiva</li>
                <li>Honrar compromissos e acordos estabelecidos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Conflitos de Interesse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <AlertTriangle className="h-5 w-5 mr-2" />
                4. Gestão de Conflitos de Interesse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">4.1 Identificação de Conflitos:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Reconhecer situações que possam gerar conflitos</li>
                <li>Avaliar impactos de relacionamentos pessoais ou financeiros</li>
                <li>Considerar influências externas em decisões profissionais</li>
              </ul>

              <h4 className="font-semibold">4.2 Declaração e Transparência:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Declarar conflitos de interesse quando relevantes</li>
                <li>Ser transparente sobre vínculos organizacionais</li>
                <li>Divulgar relacionamentos comerciais ou financeiros pertinentes</li>
              </ul>

              <h4 className="font-semibold">4.3 Gestão Adequada:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Abstenção em situações de conflito direto</li>
                <li>Buscar orientação quando em dúvida</li>
                <li>Priorizar interesse público sobre ganhos pessoais</li>
              </ul>
            </CardContent>
          </Card>

          {/* Conformidade Regulatória */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Shield className="h-5 w-5 mr-2" />
                5. Conformidade Regulatória
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">5.1 Regulamentações ANVISA:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Cumprir rigorosamente normas da ANVISA</li>
                <li>Manter-se atualizado sobre mudanças regulatórias</li>
                <li>Reportar não conformidades quando identificadas</li>
                <li>Colaborar com inspeções e auditorias</li>
              </ul>

              <h4 className="font-semibold">5.2 Boas Práticas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seguir BPF (Boas Práticas de Fabricação)</li>
                <li>Implementar BPC (Boas Práticas Clínicas) quando aplicável</li>
                <li>Aderir a BPL (Boas Práticas de Laboratório)</li>
                <li>Observar BPD (Boas Práticas de Distribuição)</li>
              </ul>

              <h4 className="font-semibold">5.3 Responsabilidade Legal:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conhecer e cumprir legislação aplicável</li>
                <li>Manter documentação adequada</li>
                <li>Implementar sistemas de rastreabilidade</li>
                <li>Garantir segurança e qualidade dos produtos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacidade e Confidencialidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Shield className="h-5 w-5 mr-2" />
                6. Privacidade e Confidencialidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">6.1 Proteção de Dados:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Respeitar privacidade de outros usuários</li>
                <li>Não compartilhar dados pessoais sem consentimento</li>
                <li>Seguir princípios da LGPD</li>
                <li>Utilizar dados apenas para fins autorizados</li>
              </ul>

              <h4 className="font-semibold">6.2 Informações Confidenciais:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter sigilo sobre informações sensíveis</li>
                <li>Respeitar acordos de confidencialidade</li>
                <li>Não utilizar informações privilegiadas indevidamente</li>
                <li>Proteger segredos comerciais e industriais</li>
              </ul>
            </CardContent>
          </Card>

          {/* Responsabilidade Social */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Heart className="h-5 w-5 mr-2" />
                7. Responsabilidade Social e Ambiental
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">7.1 Impacto Social:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contribuir para melhoria da saúde pública</li>
                <li>Promover acesso equitativo a medicamentos</li>
                <li>Apoiar educação e conscientização em saúde</li>
                <li>Considerar impactos sociais das decisões profissionais</li>
              </ul>

              <h4 className="font-semibold">7.2 Sustentabilidade:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Adotar práticas ambientalmente responsáveis</li>
                <li>Minimizar desperdícios e impactos ambientais</li>
                <li>Promover economia circular quando possível</li>
                <li>Considerar sustentabilidade em decisões de negócio</li>
              </ul>

              <h4 className="font-semibold">7.3 Diversidade e Inclusão:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Promover ambiente inclusivo e diverso</li>
                <li>Combater discriminação em todas as formas</li>
                <li>Valorizar diferentes perspectivas e experiências</li>
                <li>Apoiar equidade de oportunidades</li>
              </ul>
            </CardContent>
          </Card>

          {/* Violações e Consequências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <AlertTriangle className="h-5 w-5 mr-2" />
                8. Violações e Consequências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">8.1 Identificação de Violações:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Desrespeito aos princípios éticos estabelecidos</li>
                <li>Comportamento discriminatório ou ofensivo</li>
                <li>Violação de confidencialidade</li>
                <li>Uso inadequado da plataforma</li>
                <li>Não conformidade regulatória</li>
              </ul>

              <h4 className="font-semibold">8.2 Processo de Investigação:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Análise imparcial e confidencial</li>
                <li>Direito de defesa ao acusado</li>
                <li>Coleta de evidências e testemunhos</li>
                <li>Decisão baseada em fatos e evidências</li>
              </ul>

              <h4 className="font-semibold">8.3 Medidas Disciplinares:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Advertência formal</li>
                <li>Suspensão temporária</li>
                <li>Restrição de funcionalidades</li>
                <li>Exclusão permanente da plataforma</li>
                <li>Comunicação a órgãos reguladores quando aplicável</li>
              </ul>
            </CardContent>
          </Card>

          {/* Denúncias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Scale className="h-5 w-5 mr-2" />
                9. Canal de Denúncias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">9.1 Como Denunciar:</h4>
              <p>
                Encorajamos a comunicação de violações éticas através de nossos canais oficiais:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Canal de Ética</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>etica@pharmaconnect.com.br</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span>(11) 3000-0001 (Linha Ética)</span>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold">9.2 Proteções:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Possibilidade de denúncia anônima</li>
                <li>Proteção contra retaliações</li>
                <li>Confidencialidade do processo</li>
                <li>Feedback sobre andamento quando solicitado</li>
              </ul>
            </CardContent>
          </Card>

          {/* Compromisso Contínuo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Award className="h-5 w-5 mr-2" />
                10. Compromisso com a Melhoria Contínua
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">10.1 Revisão Periódica:</h4>
              <p>
                Este Código de Ética é revisado anualmente ou quando necessário, considerando:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mudanças regulatórias</li>
                <li>Evolução das melhores práticas</li>
                <li>Feedback da comunidade</li>
                <li>Novos desafios éticos</li>
              </ul>

              <h4 className="font-semibold">10.2 Educação Continuada:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Programas de treinamento em ética</li>
                <li>Workshops sobre dilemas éticos</li>
                <li>Discussões e casos práticos</li>
                <li>Recursos educacionais atualizados</li>
              </ul>

              <h4 className="font-semibold">10.3 Cultura Ética:</h4>
              <p>
                Buscamos construir uma cultura organizacional baseada em valores éticos sólidos, 
                onde cada membro se sinta responsável pelo bem-estar da comunidade e da sociedade.
              </p>
            </CardContent>
          </Card>

          {/* Compromisso */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-green-800 mb-2">Nosso Compromisso</h4>
              <p className="text-green-800">
                A PharmaConnect Brasil se compromete a ser um ambiente ético, profissional e colaborativo, 
                onde todos os membros possam contribuir para o avanço da indústria farmacêutica brasileira 
                de forma responsável e sustentável.
              </p>
              <p className="text-green-800 mt-2">
                Juntos, construímos um futuro mais saudável para o Brasil.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Ethics;

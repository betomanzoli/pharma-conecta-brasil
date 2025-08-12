
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAIEventLogger } from './useAIEventLogger';

export const useButtonActivation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logAIEvent } = useAIEventLogger();

  const activateButton = useCallback(async (
    buttonType: string, 
    context?: any,
    targetRoute?: string
  ) => {
    try {
      await logAIEvent({
        source: 'button_activation',
        action: 'click',
        message: `Button activated: ${buttonType}`,
        metadata: { context, target_route: targetRoute }
      });

      switch (buttonType) {
        case 'ai_matching':
          navigate('/marketplace');
          toast({
            title: 'AI Matching Ativado',
            description: 'Redirecionando para o sistema de matching inteligente'
          });
          break;

        case 'project_analysis':
          navigate('/ai/analista-projetos');
          toast({
            title: 'Análise de Projetos',
            description: 'Acessando ferramenta de análise com IA'
          });
          break;

        case 'regulatory_assistant':
          navigate('/ai/assistente-regulatorio');
          toast({
            title: 'Assistente Regulatório',
            description: 'Carregando análise técnico-regulatória'
          });
          break;

        case 'business_strategist':
          navigate('/ai/estrategista-negocios');
          toast({
            title: 'Estrategista de Negócios',
            description: 'Iniciando análise estratégica'
          });
          break;

        case 'master_chat':
          navigate('/chat');
          toast({
            title: 'Master AI Assistant',
            description: 'Conectando ao assistente principal'
          });
          break;

        case 'knowledge_base':
          navigate('/biblioteca');
          toast({
            title: 'Biblioteca de Conhecimento',
            description: 'Acessando recursos e templates'
          });
          break;

        case 'forum':
          navigate('/forum');
          toast({
            title: 'Fórum da Comunidade',
            description: 'Conectando com a comunidade'
          });
          break;

        case 'mentorship':
          navigate('/mentoria');
          toast({
            title: 'Programa de Mentoria',
            description: 'Explorando oportunidades de mentoria'
          });
          break;

        case 'partnerships':
          navigate('/parcerias');
          toast({
            title: 'Parcerias Estratégicas',
            description: 'Descobrindo oportunidades de parceria'
          });
          break;

        case 'analytics':
          toast({
            title: 'Analytics em Desenvolvimento',
            description: 'Funcionalidade será ativada em breve'
          });
          break;

        case 'reports':
          toast({
            title: 'Relatórios Automáticos',
            description: 'Sistema de relatórios em implementação'
          });
          break;

        case 'integrations':
          toast({
            title: 'Integrações',
            description: 'Painel de integrações será lançado em breve'
          });
          break;

        default:
          if (targetRoute) {
            navigate(targetRoute);
          } else {
            toast({
              title: 'Funcionalidade Ativada',
              description: `${buttonType} está sendo implementado`
            });
          }
      }

    } catch (error) {
      console.error('Erro na ativação do botão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível ativar a funcionalidade',
        variant: 'destructive'
      });
    }
  }, [navigate, toast, logAIEvent]);

  return { activateButton };
};

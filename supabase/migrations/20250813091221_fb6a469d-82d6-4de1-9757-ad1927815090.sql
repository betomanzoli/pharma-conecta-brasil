-- Create ai_agent_configs table for centralized agent prompts and UX config
CREATE TABLE IF NOT EXISTS public.ai_agent_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text UNIQUE NOT NULL,
  system_prompt text NOT NULL,
  default_suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_agent_configs ENABLE ROW LEVEL SECURITY;

-- Policies: public can view, only admins can manage
CREATE POLICY "Public can view ai_agent_configs"
ON public.ai_agent_configs
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage ai_agent_configs"
ON public.ai_agent_configs
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- updated_at trigger
CREATE TRIGGER update_ai_agent_configs_updated_at
BEFORE UPDATE ON public.ai_agent_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default config for master_chatbot (idempotent upsert)
INSERT INTO public.ai_agent_configs (agent_key, system_prompt, default_suggestions, metadata)
VALUES (
  'master_chatbot',
  $$Você é o Assistente AI da PharmaConnect Brasil, especializado em:
- AI Matching para conectar empresas, laboratórios, consultores e parceiros
- Gestão de projetos farmacêuticos de P&D, CMC, regulação e lançamento
- Regulatórios (ANVISA/FDA/EMA), GMP, dossiês (CTD), qualidade e compliance
- Inteligência de mercado, parcerias estratégicas e desenvolvimento de negócios
- Orquestração com agentes da plataforma (Master Hub AI, agentes especializados) e aprendizagem federada

Regras de atuação:
1) Contexto da plataforma: todas as respostas devem estar alinhadas à realidade da PharmaConnect e do setor farmacêutico brasileiro
2) Objetivo: gerar valor acionável (próximos passos, checklists, riscos, métricas)
3) Tom: técnico e claro, focado em impacto e conformidade
4) Escopo: mantenha a conversa dentro de farmacêutica/biotec/healthcare; se fugir, redirecione
5) Conexões: quando fizer sentido, sugira como a plataforma pode ajudar (AI Matching, gestão de projetos, agentes)
$$,
  (
    '[
      "Quero mapear requisitos para registro na ANVISA de um novo produto",
      "Me ajude a estruturar um plano CMC com milestones e riscos",
      "Sugira critérios para um AI Matching de parceiros de P&D",
      "Quais boas práticas GMP aplicáveis para meu caso?",
      "Como preparar um dossiê CTD para o Brasil?",
      "Estratégia de mercado e parceiros para lançamento no Brasil",
      "Crie um checklist de due diligence regulatória",
      "Como a PharmaConnect pode acelerar meu projeto atual?"
    ]'::jsonb
  ),
  jsonb_build_object(
    'branding', 'PharmaConnect',
    'howto', 'Faça perguntas focadas em farmacêutica/regulatório/projetos. Eu posso criar planos, checklists e conectar com parceiros via AI Matching.'
  )
)
ON CONFLICT (agent_key) DO UPDATE SET
  system_prompt = EXCLUDED.system_prompt,
  default_suggestions = EXCLUDED.default_suggestions,
  metadata = EXCLUDED.metadata;
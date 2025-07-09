-- Criar tabelas para dados da ANVISA API real
-- Tabelas para conjuntos de dados
CREATE TABLE public.anvisa_conjuntos_dados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  organizacao TEXT,
  categoria TEXT,
  tags TEXT[],
  data_criacao TIMESTAMP WITH TIME ZONE,
  data_atualizacao TIMESTAMP WITH TIME ZONE,
  recursos_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo',
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.anvisa_conjunto_detalhe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conjunto_id UUID REFERENCES anvisa_conjuntos_dados(id),
  external_id TEXT UNIQUE,
  nome TEXT NOT NULL,
  formato TEXT,
  tamanho TEXT,
  url_download TEXT,
  ultima_modificacao TIMESTAMP WITH TIME ZONE,
  dados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para observância legal
CREATE TABLE public.anvisa_observancia_legal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo_observancia TEXT,
  norma_legal TEXT,
  url_norma TEXT,
  data_vigencia DATE,
  status TEXT DEFAULT 'ativo',
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para ODS
CREATE TABLE public.anvisa_ods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  numero_ods INTEGER,
  metas TEXT[],
  indicadores TEXT[],
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para formatos
CREATE TABLE public.anvisa_formatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  nome TEXT NOT NULL,
  extensao TEXT,
  mime_type TEXT,
  descricao TEXT,
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para solicitações
CREATE TABLE public.anvisa_solicitacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  protocolo TEXT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  solicitante TEXT,
  data_solicitacao TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pendente',
  prazo_resposta DATE,
  categoria TEXT,
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.anvisa_resposta_solicitacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID REFERENCES anvisa_solicitacoes(id),
  external_id TEXT UNIQUE,
  resposta TEXT NOT NULL,
  data_resposta TIMESTAMP WITH TIME ZONE,
  respondente TEXT,
  anexos TEXT[],
  status TEXT DEFAULT 'respondida',
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para organizações
CREATE TABLE public.anvisa_organizacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo_organizacao TEXT,
  esfera TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  site TEXT,
  status TEXT DEFAULT 'ativo',
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.anvisa_organizacao_detalhe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizacao_id UUID REFERENCES anvisa_organizacoes(id),
  external_id TEXT UNIQUE,
  area_atuacao TEXT,
  responsavel TEXT,
  cargo_responsavel TEXT,
  conjuntos_dados_count INTEGER DEFAULT 0,
  dados_adicionais JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para temas
CREATE TABLE public.anvisa_temas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria_pai TEXT,
  nivel INTEGER DEFAULT 1,
  cor_hexadecimal TEXT,
  icone TEXT,
  conjuntos_count INTEGER DEFAULT 0,
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para recursos
CREATE TABLE public.anvisa_recurso (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conjunto_id UUID REFERENCES anvisa_conjuntos_dados(id),
  external_id TEXT UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  formato TEXT,
  url TEXT,
  tamanho_bytes BIGINT,
  hash_arquivo TEXT,
  ultima_modificacao TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'ativo',
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para reusos
CREATE TABLE public.anvisa_reusos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  autor TEXT,
  organizacao_autor TEXT,
  url_reuso TEXT,
  tipo_reuso TEXT,
  categoria TEXT,
  conjuntos_utilizados TEXT[],
  data_criacao TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'ativo',
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.anvisa_reuso_detalhe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reuso_id UUID REFERENCES anvisa_reusos(id),
  external_id TEXT UNIQUE,
  tecnologias_utilizadas TEXT[],
  publico_alvo TEXT,
  impacto_estimado TEXT,
  metricas JSONB DEFAULT '{}',
  feedback_usuarios JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.anvisa_reusos_pendentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  autor TEXT,
  data_submissao TIMESTAMP WITH TIME ZONE,
  status_homologacao TEXT DEFAULT 'pendente',
  observacoes_avaliacao TEXT,
  avaliador TEXT,
  data_avaliacao TIMESTAMP WITH TIME ZONE,
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_anvisa_conjuntos_external_id ON anvisa_conjuntos_dados(external_id);
CREATE INDEX idx_anvisa_conjuntos_organizacao ON anvisa_conjuntos_dados(organizacao);
CREATE INDEX idx_anvisa_conjuntos_categoria ON anvisa_conjuntos_dados(categoria);
CREATE INDEX idx_anvisa_conjuntos_status ON anvisa_conjuntos_dados(status);
CREATE INDEX idx_anvisa_conjuntos_data_atualizacao ON anvisa_conjuntos_dados(data_atualizacao);

CREATE INDEX idx_anvisa_detalhe_conjunto_id ON anvisa_conjunto_detalhe(conjunto_id);
CREATE INDEX idx_anvisa_detalhe_formato ON anvisa_conjunto_detalhe(formato);

CREATE INDEX idx_anvisa_observancia_tipo ON anvisa_observancia_legal(tipo_observancia);
CREATE INDEX idx_anvisa_observancia_status ON anvisa_observancia_legal(status);

CREATE INDEX idx_anvisa_solicitacoes_status ON anvisa_solicitacoes(status);
CREATE INDEX idx_anvisa_solicitacoes_data ON anvisa_solicitacoes(data_solicitacao);
CREATE INDEX idx_anvisa_solicitacoes_protocolo ON anvisa_solicitacoes(protocolo);

CREATE INDEX idx_anvisa_organizacoes_tipo ON anvisa_organizacoes(tipo_organizacao);
CREATE INDEX idx_anvisa_organizacoes_status ON anvisa_organizacoes(status);

CREATE INDEX idx_anvisa_temas_categoria ON anvisa_temas(categoria_pai);
CREATE INDEX idx_anvisa_temas_nivel ON anvisa_temas(nivel);

CREATE INDEX idx_anvisa_recurso_conjunto_id ON anvisa_recurso(conjunto_id);
CREATE INDEX idx_anvisa_recurso_formato ON anvisa_recurso(formato);
CREATE INDEX idx_anvisa_recurso_status ON anvisa_recurso(status);

CREATE INDEX idx_anvisa_reusos_status ON anvisa_reusos(status);
CREATE INDEX idx_anvisa_reusos_tipo ON anvisa_reusos(tipo_reuso);
CREATE INDEX idx_anvisa_reusos_categoria ON anvisa_reusos(categoria);

CREATE INDEX idx_anvisa_reuso_detalhe_reuso_id ON anvisa_reuso_detalhe(reuso_id);

CREATE INDEX idx_anvisa_pendentes_status ON anvisa_reusos_pendentes(status_homologacao);
CREATE INDEX idx_anvisa_pendentes_data ON anvisa_reusos_pendentes(data_submissao);

-- Políticas de RLS
ALTER TABLE anvisa_conjuntos_dados ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_conjunto_detalhe ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_observancia_legal ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_ods ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_formatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_resposta_solicitacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_organizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_organizacao_detalhe ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_recurso ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_reusos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_reuso_detalhe ENABLE ROW LEVEL SECURITY;
ALTER TABLE anvisa_reusos_pendentes ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública para todos os dados da ANVISA
CREATE POLICY "Public can view ANVISA data" ON anvisa_conjuntos_dados FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA conjunto detalhe" ON anvisa_conjunto_detalhe FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA observancia legal" ON anvisa_observancia_legal FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA ODS" ON anvisa_ods FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA formatos" ON anvisa_formatos FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA solicitacoes" ON anvisa_solicitacoes FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA resposta solicitacao" ON anvisa_resposta_solicitacao FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA organizacoes" ON anvisa_organizacoes FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA organizacao detalhe" ON anvisa_organizacao_detalhe FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA temas" ON anvisa_temas FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA recurso" ON anvisa_recurso FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA reusos" ON anvisa_reusos FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA reuso detalhe" ON anvisa_reuso_detalhe FOR SELECT USING (true);
CREATE POLICY "Public can view ANVISA reusos pendentes" ON anvisa_reusos_pendentes FOR SELECT USING (true);

-- Permitir que admins gerenciem todos os dados da ANVISA
CREATE POLICY "Admins can manage ANVISA data" ON anvisa_conjuntos_dados FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA conjunto detalhe" ON anvisa_conjunto_detalhe FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA observancia legal" ON anvisa_observancia_legal FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA ODS" ON anvisa_ods FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA formatos" ON anvisa_formatos FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA solicitacoes" ON anvisa_solicitacoes FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA resposta solicitacao" ON anvisa_resposta_solicitacao FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA organizacoes" ON anvisa_organizacoes FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA organizacao detalhe" ON anvisa_organizacao_detalhe FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA temas" ON anvisa_temas FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA recurso" ON anvisa_recurso FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA reusos" ON anvisa_reusos FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA reuso detalhe" ON anvisa_reuso_detalhe FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage ANVISA reusos pendentes" ON anvisa_reusos_pendentes FOR ALL USING (is_admin());

-- Triggers para atualização automática de timestamps
CREATE OR REPLACE FUNCTION update_anvisa_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_anvisa_conjuntos_dados_updated_at BEFORE UPDATE ON anvisa_conjuntos_dados FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_conjunto_detalhe_updated_at BEFORE UPDATE ON anvisa_conjunto_detalhe FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_observancia_legal_updated_at BEFORE UPDATE ON anvisa_observancia_legal FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_ods_updated_at BEFORE UPDATE ON anvisa_ods FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_formatos_updated_at BEFORE UPDATE ON anvisa_formatos FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_solicitacoes_updated_at BEFORE UPDATE ON anvisa_solicitacoes FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_resposta_solicitacao_updated_at BEFORE UPDATE ON anvisa_resposta_solicitacao FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_organizacoes_updated_at BEFORE UPDATE ON anvisa_organizacoes FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_organizacao_detalhe_updated_at BEFORE UPDATE ON anvisa_organizacao_detalhe FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_temas_updated_at BEFORE UPDATE ON anvisa_temas FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_recurso_updated_at BEFORE UPDATE ON anvisa_recurso FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_reusos_updated_at BEFORE UPDATE ON anvisa_reusos FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_reuso_detalhe_updated_at BEFORE UPDATE ON anvisa_reuso_detalhe FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_anvisa_reusos_pendentes_updated_at BEFORE UPDATE ON anvisa_reusos_pendentes FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();

-- Configurar as APIs da ANVISA na tabela de configurações
INSERT INTO api_configurations (integration_name, base_url, is_active, sync_frequency_hours) VALUES
('anvisa_dados_gov_br', 'https://dados.gov.br/dados/api', true, 6),
('anvisa_ckan_api', 'https://dados.gov.br/dados/api/publico', true, 6)
ON CONFLICT (integration_name) DO UPDATE SET
base_url = EXCLUDED.base_url,
is_active = EXCLUDED.is_active,
sync_frequency_hours = EXCLUDED.sync_frequency_hours,
updated_at = now();
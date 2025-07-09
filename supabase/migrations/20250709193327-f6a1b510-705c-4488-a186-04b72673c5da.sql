-- Criar tabelas para dados da FDA API
CREATE TABLE public.fda_drugs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  application_number TEXT,
  product_number TEXT,
  brand_name TEXT,
  generic_name TEXT NOT NULL,
  dosage_form TEXT,
  route TEXT,
  marketing_status TEXT,
  te_code TEXT,
  rld TEXT,
  rs TEXT,
  strength TEXT,
  reference_drug TEXT,
  active_ingredient TEXT,
  submission_type TEXT,
  submission_number TEXT,
  submission_status TEXT,
  submission_classification TEXT,
  submission_date DATE,
  review_priority TEXT,
  biologic_license_category TEXT,
  fda_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.fda_adverse_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  safetyreportid TEXT,
  safetyreportversion TEXT,
  receivedate TEXT,
  receiptdate TEXT,
  primarysource TEXT,
  reporttype TEXT,
  serious TEXT,
  seriousnessother TEXT,
  seriousnessdeath TEXT,
  seriousnesslifethreatening TEXT,
  seriousnesshospitalization TEXT,
  seriousnessdisabling TEXT,
  seriousnesscongenitalanomali TEXT,
  patientsex TEXT,
  patientage TEXT,
  patientageunit TEXT,
  medicinalproduct TEXT,
  reaction_text TEXT,
  reaction_outcome TEXT,
  fda_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.fda_food_enforcement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  recall_number TEXT,
  reason_for_recall TEXT,
  status TEXT,
  distribution_pattern TEXT,
  product_quantity TEXT,
  recalling_firm TEXT,
  classification TEXT,
  code_info TEXT,
  product_description TEXT,
  product_type TEXT,
  event_id TEXT,
  more_code_info TEXT,
  initial_firm_notification TEXT,
  report_date DATE,
  voluntary_mandated TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  fda_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.fda_device_adverse_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  event_date_format TEXT,
  mdr_report_key TEXT,
  event_location TEXT,
  report_number TEXT,
  report_source_code TEXT,
  report_to_fda TEXT,
  date_report TEXT,
  event_type TEXT,
  product_problem_flag TEXT,
  date_of_event TEXT,
  reprocessed_and_reused_flag TEXT,
  previous_use_code TEXT,
  remedial_action TEXT,
  removal_correction_number TEXT,
  device_date_of_manufacturer TEXT,
  single_use_flag TEXT,
  device_name TEXT,
  device_class TEXT,
  implant_flag TEXT,
  lot_number TEXT,
  manufacturer_name TEXT,
  model_number TEXT,
  patient_sequence_number TEXT,
  date_received TEXT,
  adverse_event_flag TEXT,
  product_problem TEXT,
  event_description TEXT,
  fda_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_fda_drugs_application_number ON fda_drugs(application_number);
CREATE INDEX idx_fda_drugs_brand_name ON fda_drugs(brand_name);
CREATE INDEX idx_fda_drugs_generic_name ON fda_drugs(generic_name);
CREATE INDEX idx_fda_drugs_marketing_status ON fda_drugs(marketing_status);
CREATE INDEX idx_fda_drugs_submission_date ON fda_drugs(submission_date);

CREATE INDEX idx_fda_adverse_events_safetyreportid ON fda_adverse_events(safetyreportid);
CREATE INDEX idx_fda_adverse_events_receivedate ON fda_adverse_events(receivedate);
CREATE INDEX idx_fda_adverse_events_serious ON fda_adverse_events(serious);
CREATE INDEX idx_fda_adverse_events_medicinalproduct ON fda_adverse_events(medicinalproduct);

CREATE INDEX idx_fda_food_enforcement_recall_number ON fda_food_enforcement(recall_number);
CREATE INDEX idx_fda_food_enforcement_status ON fda_food_enforcement(status);
CREATE INDEX idx_fda_food_enforcement_classification ON fda_food_enforcement(classification);
CREATE INDEX idx_fda_food_enforcement_report_date ON fda_food_enforcement(report_date);

CREATE INDEX idx_fda_device_adverse_events_mdr_report_key ON fda_device_adverse_events(mdr_report_key);
CREATE INDEX idx_fda_device_adverse_events_event_type ON fda_device_adverse_events(event_type);
CREATE INDEX idx_fda_device_adverse_events_device_class ON fda_device_adverse_events(device_class);

-- Políticas de RLS
ALTER TABLE fda_drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fda_adverse_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fda_food_enforcement ENABLE ROW LEVEL SECURITY;
ALTER TABLE fda_device_adverse_events ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública para todos os dados da FDA
CREATE POLICY "Public can view FDA drugs" ON fda_drugs FOR SELECT USING (true);
CREATE POLICY "Public can view FDA adverse events" ON fda_adverse_events FOR SELECT USING (true);
CREATE POLICY "Public can view FDA food enforcement" ON fda_food_enforcement FOR SELECT USING (true);
CREATE POLICY "Public can view FDA device adverse events" ON fda_device_adverse_events FOR SELECT USING (true);

-- Permitir que admins gerenciem todos os dados da FDA
CREATE POLICY "Admins can manage FDA drugs" ON fda_drugs FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage FDA adverse events" ON fda_adverse_events FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage FDA food enforcement" ON fda_food_enforcement FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage FDA device adverse events" ON fda_device_adverse_events FOR ALL USING (is_admin());

-- Triggers para atualização automática de timestamps
CREATE TRIGGER update_fda_drugs_updated_at BEFORE UPDATE ON fda_drugs FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_fda_adverse_events_updated_at BEFORE UPDATE ON fda_adverse_events FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_fda_food_enforcement_updated_at BEFORE UPDATE ON fda_food_enforcement FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();
CREATE TRIGGER update_fda_device_adverse_events_updated_at BEFORE UPDATE ON fda_device_adverse_events FOR EACH ROW EXECUTE FUNCTION update_anvisa_updated_at_column();

-- Configurar APIs brasileiras e FDA na tabela de configurações
INSERT INTO api_configurations (integration_name, base_url, is_active, sync_frequency_hours) VALUES
('fda_api', 'https://api.fda.gov', true, 24),
('receita_federal_api', 'https://www.receitafederal.fazenda.gov.br/interface', true, 12),
('finep_api', 'http://www.finep.gov.br/dadosabertos', true, 24),
('inpi_api', 'https://gru.inpi.gov.br/pePI/api', true, 24),
('bndes_api', 'https://www.bndes.gov.br/wps/portal/site/home/transparencia', true, 24),
('cvm_api', 'https://dados.cvm.gov.br/dados', true, 12),
('bacen_api', 'https://dadosabertos.bcb.gov.br', true, 6),
('ibge_api', 'https://servicodados.ibge.gov.br/api/v1', true, 24),
('planalto_legis_api', 'https://www.planalto.gov.br/ccivil_03/leis', true, 24),
('senado_legis_api', 'https://legis.senado.leg.br/dadosabertos', true, 24)
ON CONFLICT (integration_name) DO UPDATE SET
base_url = EXCLUDED.base_url,
is_active = EXCLUDED.is_active,
sync_frequency_hours = EXCLUDED.sync_frequency_hours,
updated_at = now();
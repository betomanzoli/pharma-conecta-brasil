
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[${new Date().toISOString()}] ${step}`, details || '');
};

interface IntegrationConfig {
  name: string;
  baseUrl: string;
  endpoints: string[];
  dataType: string;
  enabled: boolean;
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    name: 'anvisa',
    baseUrl: 'https://dados.anvisa.gov.br/api',
    endpoints: ['/3/action/package_list', '/3/action/organization_list'],
    dataType: 'regulatory_alert',
    enabled: true
  },
  {
    name: 'fda',
    baseUrl: 'https://api.fda.gov',
    endpoints: ['/drug/event.json?limit=10', '/drug/enforcement.json?limit=10'],
    dataType: 'regulatory_alert',
    enabled: true
  },
  {
    name: 'pubmed',
    baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
    endpoints: ['/esearch.fcgi?db=pubmed&term=pharmaceutical&retmax=10&retmode=json'],
    dataType: 'research_publication',
    enabled: true
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Comprehensive Integration Sync - Starting');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { source, force_sync = false } = await req.json();
    logStep('Request parameters', { source, force_sync });

    const results = {
      synced_sources: [] as string[],
      total_records: 0,
      errors: [] as string[],
      timestamp: new Date().toISOString()
    };

    // Filter integrations based on source parameter
    const targetIntegrations = source 
      ? INTEGRATIONS.filter(i => i.name === source)
      : INTEGRATIONS.filter(i => i.enabled);

    for (const integration of targetIntegrations) {
      try {
        logStep(`Syncing ${integration.name}`);
        
        // Check if we need to sync (unless force_sync is true)
        if (!force_sync) {
          const { data: lastSync } = await supabase
            .from('api_configurations')
            .select('last_sync')
            .eq('integration_name', integration.name)
            .single();
            
          if (lastSync?.last_sync) {
            const lastSyncTime = new Date(lastSync.last_sync);
            const now = new Date();
            const hoursSinceSync = (now.getTime() - lastSyncTime.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceSync < 24) {
              logStep(`Skipping ${integration.name} - synced ${hoursSinceSync.toFixed(1)} hours ago`);
              continue;
            }
          }
        }

        // Sync each endpoint for this integration
        for (const endpoint of integration.endpoints) {
          try {
            const url = `${integration.baseUrl}${endpoint}`;
            logStep(`Fetching from ${url}`);
            
            const response = await fetch(url, {
              headers: {
                'User-Agent': 'FarmaTech-Integration/1.0',
                'Accept': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Process data based on integration type
            const processedRecords = await processIntegrationData(supabase, integration, data);
            results.total_records += processedRecords;
            
            logStep(`Processed ${processedRecords} records from ${integration.name}`);
            
          } catch (endpointError: any) {
            logStep(`Error with endpoint ${endpoint}`, endpointError.message);
            results.errors.push(`${integration.name}/${endpoint}: ${endpointError.message}`);
          }
        }

        // Update last sync time
        await supabase
          .from('api_configurations')
          .upsert({
            integration_name: integration.name,
            last_sync: new Date().toISOString(),
            is_active: true
          });

        results.synced_sources.push(integration.name);
        
      } catch (integrationError: any) {
        logStep(`Error with integration ${integration.name}`, integrationError.message);
        results.errors.push(`${integration.name}: ${integrationError.message}`);
      }
    }

    logStep('Sync completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    logStep('Error in comprehensive sync', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processIntegrationData(supabase: any, integration: IntegrationConfig, data: any): Promise<number> {
  let recordsProcessed = 0;

  try {
    switch (integration.name) {
      case 'anvisa':
        if (data.result?.length) {
          for (const item of data.result.slice(0, 10)) {
            await supabase.from('integration_data').upsert({
              source: 'anvisa',
              data_type: integration.dataType,
              title: item.title || item.name || 'ANVISA Data',
              description: item.notes || item.description || '',
              content: item,
              url: item.url,
              published_at: new Date().toISOString()
            });
            recordsProcessed++;
          }
        }
        break;

      case 'fda':
        if (data.results?.length) {
          for (const item of data.results.slice(0, 10)) {
            await supabase.from('integration_data').upsert({
              source: 'fda',
              data_type: integration.dataType,
              title: item.product_description || item.reason_for_recall || 'FDA Alert',
              description: item.initial_firm_notification || item.product_description || '',
              content: item,
              published_at: item.report_date || new Date().toISOString()
            });
            recordsProcessed++;
          }
        }
        break;

      case 'pubmed':
        if (data.esearchresult?.idlist?.length) {
          for (const id of data.esearchresult.idlist.slice(0, 5)) {
            await supabase.from('integration_data').upsert({
              source: 'pubmed',
              data_type: 'research_publication',
              title: `PubMed Article ${id}`,
              description: 'Research publication from PubMed',
              content: { pubmed_id: id },
              url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
              published_at: new Date().toISOString()
            });
            recordsProcessed++;
          }
        }
        break;
    }
  } catch (error: any) {
    console.error(`Error processing ${integration.name} data:`, error);
  }

  return recordsProcessed;
}

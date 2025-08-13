export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ab_test_results: {
        Row: {
          conversion_event: string | null
          conversion_value: number | null
          created_at: string
          id: string
          test_completed_at: string | null
          test_id: string
          test_name: string
          test_started_at: string
          updated_at: string
          user_id: string | null
          variant: string
        }
        Insert: {
          conversion_event?: string | null
          conversion_value?: number | null
          created_at?: string
          id?: string
          test_completed_at?: string | null
          test_id: string
          test_name: string
          test_started_at: string
          updated_at?: string
          user_id?: string | null
          variant: string
        }
        Update: {
          conversion_event?: string | null
          conversion_value?: number | null
          created_at?: string
          id?: string
          test_completed_at?: string | null
          test_id?: string
          test_name?: string
          test_started_at?: string
          updated_at?: string
          user_id?: string | null
          variant?: string
        }
        Relationships: []
      }
      ai_agent_configs: {
        Row: {
          agent_key: string
          created_at: string
          default_suggestions: Json
          enabled: boolean
          id: string
          metadata: Json
          system_prompt: string
          updated_at: string
        }
        Insert: {
          agent_key: string
          created_at?: string
          default_suggestions?: Json
          enabled?: boolean
          id?: string
          metadata?: Json
          system_prompt: string
          updated_at?: string
        }
        Update: {
          agent_key?: string
          created_at?: string
          default_suggestions?: Json
          enabled?: boolean
          id?: string
          metadata?: Json
          system_prompt?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_agent_outputs: {
        Row: {
          agent_type: string
          created_at: string
          handoff_to: string[]
          id: string
          input: Json
          kpis: Json
          output_md: string
          project_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_type: string
          created_at?: string
          handoff_to?: string[]
          id?: string
          input?: Json
          kpis?: Json
          output_md: string
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_type?: string
          created_at?: string
          handoff_to?: string[]
          id?: string
          input?: Json
          kpis?: Json
          output_md?: string
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_outputs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "ai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_events: {
        Row: {
          action: string
          created_at: string
          id: string
          intents: string[] | null
          message: string
          metadata: Json | null
          project_id: string | null
          source: string
          topics: string[] | null
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          id?: string
          intents?: string[] | null
          message: string
          metadata?: Json | null
          project_id?: string | null
          source: string
          topics?: string[] | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          intents?: string[] | null
          message?: string
          metadata?: Json | null
          project_id?: string | null
          source?: string
          topics?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          thread_id: string
          tokens: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          thread_id: string
          tokens?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          thread_id?: string
          tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "v_ai_chat_context"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      ai_chat_threads: {
        Row: {
          conversation_summary: string | null
          created_at: string
          id: string
          last_message_preview: string | null
          messages_count: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_summary?: string | null
          created_at?: string
          id?: string
          last_message_preview?: string | null
          messages_count?: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_summary?: string | null
          created_at?: string
          id?: string
          last_message_preview?: string | null
          messages_count?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_embedding_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          embedding_data: Json
          entity_id: string
          entity_type: string
          expires_at: string | null
          id: string
          similarity_score: number | null
          updated_at: string | null
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          embedding_data: Json
          entity_id: string
          entity_type: string
          expires_at?: string | null
          id?: string
          similarity_score?: number | null
          updated_at?: string | null
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          embedding_data?: Json
          entity_id?: string
          entity_type?: string
          expires_at?: string | null
          id?: string
          similarity_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_embeddings: {
        Row: {
          created_at: string
          dimension: number | null
          embedding_data: Json
          entity_id: string | null
          entity_type: string
          id: string
          model: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dimension?: number | null
          embedding_data: Json
          entity_id?: string | null
          entity_type: string
          id?: string
          model?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dimension?: number | null
          embedding_data?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
          model?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_handoff_jobs: {
        Row: {
          agent_output_id: string | null
          created_at: string
          error: string | null
          id: string
          input: Json
          project_id: string | null
          source_agent: string
          status: string
          target_agent: string
          tries: number
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_output_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          input?: Json
          project_id?: string | null
          source_agent: string
          status?: string
          target_agent: string
          tries?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_output_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          input?: Json
          project_id?: string | null
          source_agent?: string
          status?: string
          target_agent?: string
          tries?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      anvisa_conjunto_detalhe: {
        Row: {
          conjunto_id: string | null
          created_at: string
          dados: Json | null
          external_id: string | null
          formato: string | null
          id: string
          nome: string
          tamanho: string | null
          ultima_modificacao: string | null
          updated_at: string
          url_download: string | null
        }
        Insert: {
          conjunto_id?: string | null
          created_at?: string
          dados?: Json | null
          external_id?: string | null
          formato?: string | null
          id?: string
          nome: string
          tamanho?: string | null
          ultima_modificacao?: string | null
          updated_at?: string
          url_download?: string | null
        }
        Update: {
          conjunto_id?: string | null
          created_at?: string
          dados?: Json | null
          external_id?: string | null
          formato?: string | null
          id?: string
          nome?: string
          tamanho?: string | null
          ultima_modificacao?: string | null
          updated_at?: string
          url_download?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anvisa_conjunto_detalhe_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "anvisa_conjuntos_dados"
            referencedColumns: ["id"]
          },
        ]
      }
      anvisa_conjuntos_dados: {
        Row: {
          categoria: string | null
          created_at: string
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          organizacao: string | null
          recursos_count: number | null
          status: string | null
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          organizacao?: string | null
          recursos_count?: number | null
          status?: string | null
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          organizacao?: string | null
          recursos_count?: number | null
          status?: string | null
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_formatos: {
        Row: {
          created_at: string
          descricao: string | null
          extensao: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          mime_type: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          extensao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          mime_type?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          extensao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          mime_type?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_laboratorios: {
        Row: {
          anvisa_data: Json | null
          atividades: string[] | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          endereco: string | null
          estado: string | null
          external_id: string
          id: string
          nome: string
          situacao: string | null
          updated_at: string
        }
        Insert: {
          anvisa_data?: Json | null
          atividades?: string[] | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          endereco?: string | null
          estado?: string | null
          external_id: string
          id?: string
          nome: string
          situacao?: string | null
          updated_at?: string
        }
        Update: {
          anvisa_data?: Json | null
          atividades?: string[] | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          endereco?: string | null
          estado?: string | null
          external_id?: string
          id?: string
          nome?: string
          situacao?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_medicamentos: {
        Row: {
          anvisa_data: Json | null
          categoria: string | null
          created_at: string
          data_vencimento: string | null
          external_id: string
          id: string
          laboratorio: string | null
          nome_comercial: string
          principio_ativo: string
          status_registro: string | null
          updated_at: string
        }
        Insert: {
          anvisa_data?: Json | null
          categoria?: string | null
          created_at?: string
          data_vencimento?: string | null
          external_id: string
          id?: string
          laboratorio?: string | null
          nome_comercial: string
          principio_ativo: string
          status_registro?: string | null
          updated_at?: string
        }
        Update: {
          anvisa_data?: Json | null
          categoria?: string | null
          created_at?: string
          data_vencimento?: string | null
          external_id?: string
          id?: string
          laboratorio?: string | null
          nome_comercial?: string
          principio_ativo?: string
          status_registro?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_observancia_legal: {
        Row: {
          created_at: string
          data_vigencia: string | null
          descricao: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          norma_legal: string | null
          status: string | null
          tipo_observancia: string | null
          titulo: string
          updated_at: string
          url_norma: string | null
        }
        Insert: {
          created_at?: string
          data_vigencia?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          norma_legal?: string | null
          status?: string | null
          tipo_observancia?: string | null
          titulo: string
          updated_at?: string
          url_norma?: string | null
        }
        Update: {
          created_at?: string
          data_vigencia?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          norma_legal?: string | null
          status?: string | null
          tipo_observancia?: string | null
          titulo?: string
          updated_at?: string
          url_norma?: string | null
        }
        Relationships: []
      }
      anvisa_ods: {
        Row: {
          created_at: string
          descricao: string | null
          external_id: string | null
          id: string
          indicadores: string[] | null
          metadados: Json | null
          metas: string[] | null
          nome: string
          numero_ods: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          external_id?: string | null
          id?: string
          indicadores?: string[] | null
          metadados?: Json | null
          metas?: string[] | null
          nome: string
          numero_ods?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          external_id?: string | null
          id?: string
          indicadores?: string[] | null
          metadados?: Json | null
          metas?: string[] | null
          nome?: string
          numero_ods?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_organizacao_detalhe: {
        Row: {
          area_atuacao: string | null
          cargo_responsavel: string | null
          conjuntos_dados_count: number | null
          created_at: string
          dados_adicionais: Json | null
          external_id: string | null
          id: string
          organizacao_id: string | null
          responsavel: string | null
          updated_at: string
        }
        Insert: {
          area_atuacao?: string | null
          cargo_responsavel?: string | null
          conjuntos_dados_count?: number | null
          created_at?: string
          dados_adicionais?: Json | null
          external_id?: string | null
          id?: string
          organizacao_id?: string | null
          responsavel?: string | null
          updated_at?: string
        }
        Update: {
          area_atuacao?: string | null
          cargo_responsavel?: string | null
          conjuntos_dados_count?: number | null
          created_at?: string
          dados_adicionais?: Json | null
          external_id?: string | null
          id?: string
          organizacao_id?: string | null
          responsavel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anvisa_organizacao_detalhe_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "anvisa_organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      anvisa_organizacoes: {
        Row: {
          created_at: string
          descricao: string | null
          email: string | null
          endereco: string | null
          esfera: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          nome: string
          sigla: string | null
          site: string | null
          status: string | null
          telefone: string | null
          tipo_organizacao: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          esfera?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          nome: string
          sigla?: string | null
          site?: string | null
          status?: string | null
          telefone?: string | null
          tipo_organizacao?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          esfera?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          nome?: string
          sigla?: string | null
          site?: string | null
          status?: string | null
          telefone?: string | null
          tipo_organizacao?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_recurso: {
        Row: {
          conjunto_id: string | null
          created_at: string
          descricao: string | null
          external_id: string | null
          formato: string | null
          hash_arquivo: string | null
          id: string
          metadados: Json | null
          nome: string
          status: string | null
          tamanho_bytes: number | null
          ultima_modificacao: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          conjunto_id?: string | null
          created_at?: string
          descricao?: string | null
          external_id?: string | null
          formato?: string | null
          hash_arquivo?: string | null
          id?: string
          metadados?: Json | null
          nome: string
          status?: string | null
          tamanho_bytes?: number | null
          ultima_modificacao?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          conjunto_id?: string | null
          created_at?: string
          descricao?: string | null
          external_id?: string | null
          formato?: string | null
          hash_arquivo?: string | null
          id?: string
          metadados?: Json | null
          nome?: string
          status?: string | null
          tamanho_bytes?: number | null
          ultima_modificacao?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anvisa_recurso_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "anvisa_conjuntos_dados"
            referencedColumns: ["id"]
          },
        ]
      }
      anvisa_resposta_solicitacao: {
        Row: {
          anexos: string[] | null
          created_at: string
          data_resposta: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          respondente: string | null
          resposta: string
          solicitacao_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          anexos?: string[] | null
          created_at?: string
          data_resposta?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          respondente?: string | null
          resposta: string
          solicitacao_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          anexos?: string[] | null
          created_at?: string
          data_resposta?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          respondente?: string | null
          resposta?: string
          solicitacao_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anvisa_resposta_solicitacao_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "anvisa_solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      anvisa_reuso_detalhe: {
        Row: {
          created_at: string
          external_id: string | null
          feedback_usuarios: Json | null
          id: string
          impacto_estimado: string | null
          metricas: Json | null
          publico_alvo: string | null
          reuso_id: string | null
          tecnologias_utilizadas: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_id?: string | null
          feedback_usuarios?: Json | null
          id?: string
          impacto_estimado?: string | null
          metricas?: Json | null
          publico_alvo?: string | null
          reuso_id?: string | null
          tecnologias_utilizadas?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_id?: string | null
          feedback_usuarios?: Json | null
          id?: string
          impacto_estimado?: string | null
          metricas?: Json | null
          publico_alvo?: string | null
          reuso_id?: string | null
          tecnologias_utilizadas?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anvisa_reuso_detalhe_reuso_id_fkey"
            columns: ["reuso_id"]
            isOneToOne: false
            referencedRelation: "anvisa_reusos"
            referencedColumns: ["id"]
          },
        ]
      }
      anvisa_reusos: {
        Row: {
          autor: string | null
          categoria: string | null
          conjuntos_utilizados: string[] | null
          created_at: string
          data_criacao: string | null
          descricao: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          organizacao_autor: string | null
          status: string | null
          tipo_reuso: string | null
          titulo: string
          updated_at: string
          url_reuso: string | null
        }
        Insert: {
          autor?: string | null
          categoria?: string | null
          conjuntos_utilizados?: string[] | null
          created_at?: string
          data_criacao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          organizacao_autor?: string | null
          status?: string | null
          tipo_reuso?: string | null
          titulo: string
          updated_at?: string
          url_reuso?: string | null
        }
        Update: {
          autor?: string | null
          categoria?: string | null
          conjuntos_utilizados?: string[] | null
          created_at?: string
          data_criacao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          organizacao_autor?: string | null
          status?: string | null
          tipo_reuso?: string | null
          titulo?: string
          updated_at?: string
          url_reuso?: string | null
        }
        Relationships: []
      }
      anvisa_reusos_pendentes: {
        Row: {
          autor: string | null
          avaliador: string | null
          created_at: string
          data_avaliacao: string | null
          data_submissao: string | null
          descricao: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          observacoes_avaliacao: string | null
          status_homologacao: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor?: string | null
          avaliador?: string | null
          created_at?: string
          data_avaliacao?: string | null
          data_submissao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          observacoes_avaliacao?: string | null
          status_homologacao?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string | null
          avaliador?: string | null
          created_at?: string
          data_avaliacao?: string | null
          data_submissao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          observacoes_avaliacao?: string | null
          status_homologacao?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_solicitacoes: {
        Row: {
          categoria: string | null
          created_at: string
          data_solicitacao: string | null
          descricao: string | null
          external_id: string | null
          id: string
          metadados: Json | null
          prazo_resposta: string | null
          protocolo: string | null
          solicitante: string | null
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_solicitacao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          prazo_resposta?: string | null
          protocolo?: string | null
          solicitante?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_solicitacao?: string | null
          descricao?: string | null
          external_id?: string | null
          id?: string
          metadados?: Json | null
          prazo_resposta?: string | null
          protocolo?: string | null
          solicitante?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      anvisa_temas: {
        Row: {
          categoria_pai: string | null
          conjuntos_count: number | null
          cor_hexadecimal: string | null
          created_at: string
          descricao: string | null
          external_id: string | null
          icone: string | null
          id: string
          metadados: Json | null
          nivel: number | null
          nome: string
          updated_at: string
        }
        Insert: {
          categoria_pai?: string | null
          conjuntos_count?: number | null
          cor_hexadecimal?: string | null
          created_at?: string
          descricao?: string | null
          external_id?: string | null
          icone?: string | null
          id?: string
          metadados?: Json | null
          nivel?: number | null
          nome: string
          updated_at?: string
        }
        Update: {
          categoria_pai?: string | null
          conjuntos_count?: number | null
          cor_hexadecimal?: string | null
          created_at?: string
          descricao?: string | null
          external_id?: string | null
          icone?: string | null
          id?: string
          metadados?: Json | null
          nivel?: number | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_configurations: {
        Row: {
          api_key: string | null
          base_url: string | null
          created_at: string | null
          id: string
          integration_name: string
          is_active: boolean | null
          last_sync: string | null
          sync_frequency_hours: number | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          base_url?: string | null
          created_at?: string | null
          id?: string
          integration_name: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_frequency_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          base_url?: string | null
          created_at?: string | null
          id?: string
          integration_name?: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_frequency_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      api_monitoring_events: {
        Row: {
          created_at: string | null
          endpoint: string | null
          error_message: string | null
          event_type: string
          id: string
          response_time: number | null
          service: string
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          response_time?: number | null
          service: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          response_time?: number | null
          service?: string
        }
        Relationships: []
      }
      brazilian_content: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          difficulty_level: string | null
          downloads_count: number | null
          estimated_read_time: number | null
          id: string
          is_featured: boolean | null
          last_updated: string | null
          publication_date: string | null
          source_url: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string
          content: string
          created_at?: string | null
          difficulty_level?: string | null
          downloads_count?: number | null
          estimated_read_time?: number | null
          id?: string
          is_featured?: boolean | null
          last_updated?: string | null
          publication_date?: string | null
          source_url?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          difficulty_level?: string | null
          downloads_count?: number | null
          estimated_read_time?: number | null
          id?: string
          is_featured?: boolean | null
          last_updated?: string | null
          publication_date?: string | null
          source_url?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brazilian_content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brazilian_content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_metrics: {
        Row: {
          created_at: string
          id: string
          measured_at: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_unit: string | null
          metric_value: number
          segment: string | null
          time_period: string
        }
        Insert: {
          created_at?: string
          id?: string
          measured_at?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_unit?: string | null
          metric_value: number
          segment?: string | null
          time_period: string
        }
        Update: {
          created_at?: string
          id?: string
          measured_at?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number
          segment?: string | null
          time_period?: string
        }
        Relationships: []
      }
      cache_entries: {
        Row: {
          cache_data: Json
          cache_key: string
          created_at: string | null
          id: string
          source: string
          ttl: number
          updated_at: string | null
        }
        Insert: {
          cache_data: Json
          cache_key: string
          created_at?: string | null
          id?: string
          source: string
          ttl: number
          updated_at?: string | null
        }
        Update: {
          cache_data?: Json
          cache_key?: string
          created_at?: string | null
          id?: string
          source?: string
          ttl?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          chat_id: string | null
          edited_at: string | null
          id: string
          message: string
          message_type: string
          metadata: Json | null
          sent_at: string
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          edited_at?: string | null
          id?: string
          message: string
          message_type?: string
          metadata?: Json | null
          sent_at?: string
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          edited_at?: string | null
          id?: string
          message?: string
          message_type?: string
          metadata?: Json | null
          sent_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          chat_type: string
          created_at: string
          created_by: string | null
          id: string
          last_activity: string
          last_message: string | null
          participants: string[]
          updated_at: string
        }
        Insert: {
          chat_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_activity?: string
          last_message?: string | null
          participants: string[]
          updated_at?: string
        }
        Update: {
          chat_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_activity?: string
          last_message?: string | null
          participants?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cnpj_validations: {
        Row: {
          anvisa_registration_data: Json | null
          cnpj: string
          company_name: string
          created_at: string
          id: string
          last_check: string | null
          profile_id: string
          receita_federal_data: Json | null
          status: string
          updated_at: string
          user_id: string
          validated_at: string | null
        }
        Insert: {
          anvisa_registration_data?: Json | null
          cnpj: string
          company_name: string
          created_at?: string
          id?: string
          last_check?: string | null
          profile_id: string
          receita_federal_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
          validated_at?: string | null
        }
        Update: {
          anvisa_registration_data?: Json | null
          cnpj?: string
          company_name?: string
          created_at?: string
          id?: string
          last_check?: string | null
          profile_id?: string
          receita_federal_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cnpj_validations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cnpj_validations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          compliance_status: string | null
          created_at: string | null
          description: string | null
          expertise_area: string[] | null
          id: string
          industrial_segment: string | null
          name: string
          phone: string | null
          profile_id: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          state: string | null
          subsegment: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          compliance_status?: string | null
          created_at?: string | null
          description?: string | null
          expertise_area?: string[] | null
          id?: string
          industrial_segment?: string | null
          name: string
          phone?: string | null
          profile_id?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          state?: string | null
          subsegment?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          compliance_status?: string | null
          created_at?: string | null
          description?: string | null
          expertise_area?: string[] | null
          id?: string
          industrial_segment?: string | null
          name?: string
          phone?: string | null
          profile_id?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          state?: string | null
          subsegment?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_interactions: {
        Row: {
          company_a_id: string | null
          company_b_id: string | null
          compatibility_score: number | null
          created_at: string | null
          id: string
          interaction_type: string
          notes: string | null
        }
        Insert: {
          company_a_id?: string | null
          company_b_id?: string | null
          compatibility_score?: number | null
          created_at?: string | null
          id?: string
          interaction_type: string
          notes?: string | null
        }
        Update: {
          company_a_id?: string | null
          company_b_id?: string | null
          compatibility_score?: number | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_interactions_company_a_id_fkey"
            columns: ["company_a_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_interactions_company_b_id_fkey"
            columns: ["company_b_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_tracking: {
        Row: {
          company_id: string | null
          compliance_type: string
          created_at: string | null
          details: Json | null
          expires_at: string | null
          id: string
          last_check: string | null
          profile_id: string | null
          score: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          compliance_type: string
          created_at?: string | null
          details?: Json | null
          expires_at?: string | null
          id?: string
          last_check?: string | null
          profile_id?: string | null
          score?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          compliance_type?: string
          created_at?: string | null
          details?: Json | null
          expires_at?: string | null
          id?: string
          last_check?: string | null
          profile_id?: string | null
          score?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_tracking_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tracking_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tracking_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          availability: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          expertise: string[]
          hourly_rate: number | null
          id: string
          location: string | null
          profile_id: string | null
          projects_completed: number | null
          sentiment_label: string | null
          sentiment_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          expertise: string[]
          hourly_rate?: number | null
          id?: string
          location?: string | null
          profile_id?: string | null
          projects_completed?: number | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          expertise?: string[]
          hourly_rate?: number | null
          id?: string
          location?: string | null
          profile_id?: string | null
          projects_completed?: number | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cron_jobs: {
        Row: {
          created_at: string
          function_name: string
          id: string
          is_active: boolean | null
          job_name: string
          last_run: string | null
          next_run: string | null
          schedule: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          function_name: string
          id?: string
          is_active?: boolean | null
          job_name: string
          last_run?: string | null
          next_run?: string | null
          schedule: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          function_name?: string
          id?: string
          is_active?: boolean | null
          job_name?: string
          last_run?: string | null
          next_run?: string | null
          schedule?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment_listings: {
        Row: {
          category: string
          condition: string
          created_at: string
          currency: string | null
          description: string
          id: string
          images: string[] | null
          location: string | null
          price: number | null
          seller_id: string
          specifications: Json | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          condition?: string
          created_at?: string
          currency?: string | null
          description: string
          id?: string
          images?: string[] | null
          location?: string | null
          price?: number | null
          seller_id: string
          specifications?: Json | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          currency?: string | null
          description?: string
          id?: string
          images?: string[] | null
          location?: string | null
          price?: number | null
          seller_id?: string
          specifications?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment_quotes: {
        Row: {
          buyer_id: string
          created_at: string
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          quoted_price: number
          status: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          quoted_price: number
          status?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          quoted_price?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_quotes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "equipment_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      fda_adverse_events: {
        Row: {
          created_at: string
          external_id: string | null
          fda_data: Json | null
          id: string
          medicinalproduct: string | null
          patientage: string | null
          patientageunit: string | null
          patientsex: string | null
          primarysource: string | null
          reaction_outcome: string | null
          reaction_text: string | null
          receiptdate: string | null
          receivedate: string | null
          reporttype: string | null
          safetyreportid: string | null
          safetyreportversion: string | null
          serious: string | null
          seriousnesscongenitalanomali: string | null
          seriousnessdeath: string | null
          seriousnessdisabling: string | null
          seriousnesshospitalization: string | null
          seriousnesslifethreatening: string | null
          seriousnessother: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_id?: string | null
          fda_data?: Json | null
          id?: string
          medicinalproduct?: string | null
          patientage?: string | null
          patientageunit?: string | null
          patientsex?: string | null
          primarysource?: string | null
          reaction_outcome?: string | null
          reaction_text?: string | null
          receiptdate?: string | null
          receivedate?: string | null
          reporttype?: string | null
          safetyreportid?: string | null
          safetyreportversion?: string | null
          serious?: string | null
          seriousnesscongenitalanomali?: string | null
          seriousnessdeath?: string | null
          seriousnessdisabling?: string | null
          seriousnesshospitalization?: string | null
          seriousnesslifethreatening?: string | null
          seriousnessother?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_id?: string | null
          fda_data?: Json | null
          id?: string
          medicinalproduct?: string | null
          patientage?: string | null
          patientageunit?: string | null
          patientsex?: string | null
          primarysource?: string | null
          reaction_outcome?: string | null
          reaction_text?: string | null
          receiptdate?: string | null
          receivedate?: string | null
          reporttype?: string | null
          safetyreportid?: string | null
          safetyreportversion?: string | null
          serious?: string | null
          seriousnesscongenitalanomali?: string | null
          seriousnessdeath?: string | null
          seriousnessdisabling?: string | null
          seriousnesshospitalization?: string | null
          seriousnesslifethreatening?: string | null
          seriousnessother?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fda_device_adverse_events: {
        Row: {
          adverse_event_flag: string | null
          created_at: string
          date_of_event: string | null
          date_received: string | null
          date_report: string | null
          device_class: string | null
          device_date_of_manufacturer: string | null
          device_name: string | null
          event_date_format: string | null
          event_description: string | null
          event_location: string | null
          event_type: string | null
          external_id: string | null
          fda_data: Json | null
          id: string
          implant_flag: string | null
          lot_number: string | null
          manufacturer_name: string | null
          mdr_report_key: string | null
          model_number: string | null
          patient_sequence_number: string | null
          previous_use_code: string | null
          product_problem: string | null
          product_problem_flag: string | null
          remedial_action: string | null
          removal_correction_number: string | null
          report_number: string | null
          report_source_code: string | null
          report_to_fda: string | null
          reprocessed_and_reused_flag: string | null
          single_use_flag: string | null
          updated_at: string
        }
        Insert: {
          adverse_event_flag?: string | null
          created_at?: string
          date_of_event?: string | null
          date_received?: string | null
          date_report?: string | null
          device_class?: string | null
          device_date_of_manufacturer?: string | null
          device_name?: string | null
          event_date_format?: string | null
          event_description?: string | null
          event_location?: string | null
          event_type?: string | null
          external_id?: string | null
          fda_data?: Json | null
          id?: string
          implant_flag?: string | null
          lot_number?: string | null
          manufacturer_name?: string | null
          mdr_report_key?: string | null
          model_number?: string | null
          patient_sequence_number?: string | null
          previous_use_code?: string | null
          product_problem?: string | null
          product_problem_flag?: string | null
          remedial_action?: string | null
          removal_correction_number?: string | null
          report_number?: string | null
          report_source_code?: string | null
          report_to_fda?: string | null
          reprocessed_and_reused_flag?: string | null
          single_use_flag?: string | null
          updated_at?: string
        }
        Update: {
          adverse_event_flag?: string | null
          created_at?: string
          date_of_event?: string | null
          date_received?: string | null
          date_report?: string | null
          device_class?: string | null
          device_date_of_manufacturer?: string | null
          device_name?: string | null
          event_date_format?: string | null
          event_description?: string | null
          event_location?: string | null
          event_type?: string | null
          external_id?: string | null
          fda_data?: Json | null
          id?: string
          implant_flag?: string | null
          lot_number?: string | null
          manufacturer_name?: string | null
          mdr_report_key?: string | null
          model_number?: string | null
          patient_sequence_number?: string | null
          previous_use_code?: string | null
          product_problem?: string | null
          product_problem_flag?: string | null
          remedial_action?: string | null
          removal_correction_number?: string | null
          report_number?: string | null
          report_source_code?: string | null
          report_to_fda?: string | null
          reprocessed_and_reused_flag?: string | null
          single_use_flag?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fda_device_events: {
        Row: {
          created_at: string
          date_received: string | null
          device_name: string | null
          event_type: string | null
          external_id: string
          fda_data: Json | null
          id: string
          manufacturer: string | null
          mdr_report_key: string | null
          patient_problem_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_received?: string | null
          device_name?: string | null
          event_type?: string | null
          external_id: string
          fda_data?: Json | null
          id?: string
          manufacturer?: string | null
          mdr_report_key?: string | null
          patient_problem_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_received?: string | null
          device_name?: string | null
          event_type?: string | null
          external_id?: string
          fda_data?: Json | null
          id?: string
          manufacturer?: string | null
          mdr_report_key?: string | null
          patient_problem_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fda_drugs: {
        Row: {
          active_ingredient: string | null
          application_number: string | null
          biologic_license_category: string | null
          brand_name: string | null
          created_at: string
          dosage_form: string | null
          external_id: string | null
          fda_data: Json | null
          generic_name: string
          id: string
          marketing_status: string | null
          product_number: string | null
          reference_drug: string | null
          review_priority: string | null
          rld: string | null
          route: string | null
          rs: string | null
          strength: string | null
          submission_classification: string | null
          submission_date: string | null
          submission_number: string | null
          submission_status: string | null
          submission_type: string | null
          te_code: string | null
          updated_at: string
        }
        Insert: {
          active_ingredient?: string | null
          application_number?: string | null
          biologic_license_category?: string | null
          brand_name?: string | null
          created_at?: string
          dosage_form?: string | null
          external_id?: string | null
          fda_data?: Json | null
          generic_name: string
          id?: string
          marketing_status?: string | null
          product_number?: string | null
          reference_drug?: string | null
          review_priority?: string | null
          rld?: string | null
          route?: string | null
          rs?: string | null
          strength?: string | null
          submission_classification?: string | null
          submission_date?: string | null
          submission_number?: string | null
          submission_status?: string | null
          submission_type?: string | null
          te_code?: string | null
          updated_at?: string
        }
        Update: {
          active_ingredient?: string | null
          application_number?: string | null
          biologic_license_category?: string | null
          brand_name?: string | null
          created_at?: string
          dosage_form?: string | null
          external_id?: string | null
          fda_data?: Json | null
          generic_name?: string
          id?: string
          marketing_status?: string | null
          product_number?: string | null
          reference_drug?: string | null
          review_priority?: string | null
          rld?: string | null
          route?: string | null
          rs?: string | null
          strength?: string | null
          submission_classification?: string | null
          submission_date?: string | null
          submission_number?: string | null
          submission_status?: string | null
          submission_type?: string | null
          te_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fda_food_enforcement: {
        Row: {
          city: string | null
          classification: string | null
          code_info: string | null
          country: string | null
          created_at: string
          distribution_pattern: string | null
          event_id: string | null
          external_id: string | null
          fda_data: Json | null
          id: string
          initial_firm_notification: string | null
          more_code_info: string | null
          product_description: string | null
          product_quantity: string | null
          product_type: string | null
          reason_for_recall: string | null
          recall_number: string | null
          recalling_firm: string | null
          report_date: string | null
          state: string | null
          status: string | null
          updated_at: string
          voluntary_mandated: string | null
        }
        Insert: {
          city?: string | null
          classification?: string | null
          code_info?: string | null
          country?: string | null
          created_at?: string
          distribution_pattern?: string | null
          event_id?: string | null
          external_id?: string | null
          fda_data?: Json | null
          id?: string
          initial_firm_notification?: string | null
          more_code_info?: string | null
          product_description?: string | null
          product_quantity?: string | null
          product_type?: string | null
          reason_for_recall?: string | null
          recall_number?: string | null
          recalling_firm?: string | null
          report_date?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          voluntary_mandated?: string | null
        }
        Update: {
          city?: string | null
          classification?: string | null
          code_info?: string | null
          country?: string | null
          created_at?: string
          distribution_pattern?: string | null
          event_id?: string | null
          external_id?: string | null
          fda_data?: Json | null
          id?: string
          initial_firm_notification?: string | null
          more_code_info?: string | null
          product_description?: string | null
          product_quantity?: string | null
          product_type?: string | null
          reason_for_recall?: string | null
          recall_number?: string | null
          recalling_firm?: string | null
          report_date?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          voluntary_mandated?: string | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_solution: boolean
          likes_count: number
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean
          likes_count?: number
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean
          likes_count?: number
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reply_likes: {
        Row: {
          created_at: string
          id: string
          reply_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_reply_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reply_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reply_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          category: string
          created_at: string
          description: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          last_activity_at: string | null
          replies_count: number
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id: string
          category?: string
          created_at?: string
          description: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_activity_at?: string | null
          replies_count?: number
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_activity_at?: string | null
          replies_count?: number
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      function_invocations: {
        Row: {
          function_name: string
          id: string
          invoked_at: string
          metadata: Json
          user_id: string
        }
        Insert: {
          function_name: string
          id?: string
          invoked_at?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          function_name?: string
          id?: string
          invoked_at?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: []
      }
      integration_data: {
        Row: {
          content: Json | null
          created_at: string | null
          data_type: string
          description: string | null
          expires_at: string | null
          id: string
          published_at: string | null
          source: string
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          data_type: string
          description?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          source: string
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          data_type?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          source?: string
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_pdf: string | null
          invoice_url: string | null
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_pdf?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_pdf?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          dimension: number | null
          embedding: Json | null
          id: string
          metadata: Json
          source_id: string
          user_id: string
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string
          dimension?: number | null
          embedding?: Json | null
          id?: string
          metadata?: Json
          source_id: string
          user_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          dimension?: number | null
          embedding?: Json | null
          id?: string
          metadata?: Json
          source_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_chunks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_downloads: {
        Row: {
          downloaded_at: string
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_downloads_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "knowledge_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_items: {
        Row: {
          author_id: string
          category: string
          content_type: string
          created_at: string
          description: string
          downloads_count: number
          duration: string | null
          file_size: string | null
          file_url: string | null
          id: string
          is_featured: boolean
          is_premium: boolean
          rating: number | null
          ratings_count: number
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id: string
          category?: string
          content_type: string
          created_at?: string
          description: string
          downloads_count?: number
          duration?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean
          is_premium?: boolean
          rating?: number | null
          ratings_count?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string
          category?: string
          content_type?: string
          created_at?: string
          description?: string
          downloads_count?: number
          duration?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean
          is_premium?: boolean
          rating?: number | null
          ratings_count?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_items_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_items_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_ratings: {
        Row: {
          created_at: string
          id: string
          item_id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_ratings_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "knowledge_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          source_type: string
          source_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          source_type: string
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          source_type?: string
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      laboratories: {
        Row: {
          address: string | null
          available_capacity: number | null
          certifications: string[] | null
          city: string | null
          created_at: string | null
          description: string | null
          equipment_list: string[] | null
          id: string
          industrial_segment: string | null
          location: string
          name: string
          operating_hours: string | null
          phone: string | null
          profile_id: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          specializations: string[] | null
          state: string | null
          subsegment: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          available_capacity?: number | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          equipment_list?: string[] | null
          id?: string
          industrial_segment?: string | null
          location: string
          name: string
          operating_hours?: string | null
          phone?: string | null
          profile_id?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          specializations?: string[] | null
          state?: string | null
          subsegment?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          available_capacity?: number | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          equipment_list?: string[] | null
          id?: string
          industrial_segment?: string | null
          location?: string
          name?: string
          operating_hours?: string | null
          phone?: string | null
          profile_id?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          specializations?: string[] | null
          state?: string | null
          subsegment?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laboratories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laboratories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laboratories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      match_feedback: {
        Row: {
          created_at: string
          feedback_type: string
          id: string
          match_id: string
          match_score: number | null
          provider_name: string | null
          provider_type: string | null
          rejection_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_type: string
          id?: string
          match_id: string
          match_score?: number | null
          provider_name?: string | null
          provider_type?: string | null
          rejection_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_type?: string
          id?: string
          match_id?: string
          match_score?: number | null
          provider_name?: string | null
          provider_type?: string | null
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          mentor_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          mentor_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          mentor_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability_schedule: Json | null
          average_rating: number | null
          bio: string | null
          created_at: string
          experience_years: number
          hourly_rate: number | null
          id: string
          is_active: boolean
          profile_id: string
          specialty: string[]
          total_ratings: number
          total_sessions: number
          updated_at: string
        }
        Insert: {
          availability_schedule?: Json | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          profile_id: string
          specialty?: string[]
          total_ratings?: number
          total_sessions?: number
          updated_at?: string
        }
        Update: {
          availability_schedule?: Json | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          profile_id?: string
          specialty?: string[]
          total_ratings?: number
          total_sessions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          meeting_link: string | null
          meeting_url: string | null
          mentee_id: string
          mentee_notes: string | null
          mentee_rating: number | null
          mentor_id: string
          mentor_notes: string | null
          mentor_rating: number | null
          price: number | null
          scheduled_at: string
          session_summary: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          meeting_url?: string | null
          mentee_id: string
          mentee_notes?: string | null
          mentee_rating?: number | null
          mentor_id: string
          mentor_notes?: string | null
          mentor_rating?: number | null
          price?: number | null
          scheduled_at: string
          session_summary?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          meeting_url?: string | null
          mentee_id?: string
          mentee_notes?: string | null
          mentee_rating?: number | null
          mentor_id?: string
          mentor_notes?: string | null
          mentor_rating?: number | null
          price?: number | null
          scheduled_at?: string
          session_summary?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_sessions_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_sessions_mentor_id_mentors_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ml_model_weights: {
        Row: {
          accuracy_score: number
          created_at: string
          id: string
          is_active: boolean
          model_version: string
          trained_at: string
          training_data_size: number
          updated_at: string
          weights: Json
        }
        Insert: {
          accuracy_score?: number
          created_at?: string
          id?: string
          is_active?: boolean
          model_version: string
          trained_at?: string
          training_data_size?: number
          updated_at?: string
          weights?: Json
        }
        Update: {
          accuracy_score?: number
          created_at?: string
          id?: string
          is_active?: boolean
          model_version?: string
          trained_at?: string
          training_data_size?: number
          updated_at?: string
          weights?: Json
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean
          forum_enabled: boolean
          id: string
          knowledge_enabled: boolean
          marketing_enabled: boolean
          mentorship_enabled: boolean
          push_notifications: boolean
          system_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          forum_enabled?: boolean
          id?: string
          knowledge_enabled?: boolean
          marketing_enabled?: boolean
          mentorship_enabled?: boolean
          push_notifications?: boolean
          system_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          forum_enabled?: boolean
          id?: string
          knowledge_enabled?: boolean
          marketing_enabled?: boolean
          mentorship_enabled?: boolean
          push_notifications?: boolean
          system_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          order_type: string
          plan_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          order_type?: string
          plan_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          order_type?: string
          plan_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      partnership_opportunities: {
        Row: {
          budget_range: string | null
          company_id: string | null
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          partnership_type: string
          requirements: string[] | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_range?: string | null
          company_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          partnership_type: string
          requirements?: string[] | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_range?: string | null
          company_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          partnership_type?: string
          requirements?: string[] | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partnership_opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last4: string | null
          stripe_payment_method_id: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last4?: string | null
          stripe_payment_method_id: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last4?: string | null
          stripe_payment_method_id?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string
          id: string
          measured_at: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          tags: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          measured_at?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          tags?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          measured_at?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          tags?: Json | null
        }
        Relationships: []
      }
      personalization_data: {
        Row: {
          confidence_score: number
          created_at: string
          id: string
          is_active: boolean
          preference_type: string
          preference_value: Json
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          id?: string
          is_active?: boolean
          preference_type: string
          preference_value?: Json
          source?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          id?: string
          is_active?: boolean
          preference_type?: string
          preference_value?: Json
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmaceutical_products: {
        Row: {
          active_ingredient: string
          anvisa_registration: string | null
          company_id: string | null
          created_at: string | null
          id: string
          name: string
          status: string
          therapeutic_class: string
          updated_at: string | null
        }
        Insert: {
          active_ingredient: string
          anvisa_registration?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          status?: string
          therapeutic_class: string
          updated_at?: string | null
        }
        Update: {
          active_ingredient?: string
          anvisa_registration?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          status?: string
          therapeutic_class?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmaceutical_products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          provider_id: string | null
          requester_id: string
          requirements: string[] | null
          service_type: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          provider_id?: string | null
          requester_id: string
          requirements?: string[] | null
          service_type: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          provider_id?: string | null
          requester_id?: string
          requirements?: string[] | null
          service_type?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          consultant_id: string | null
          created_at: string | null
          description: string | null
          id: string
          industry_id: string | null
          lab_id: string | null
          name: string
          status: string | null
        }
        Insert: {
          consultant_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry_id?: string | null
          lab_id?: string | null
          name: string
          status?: string | null
        }
        Update: {
          consultant_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry_id?: string | null
          lab_id?: string | null
          name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "laboratories"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string | null
          id: string
          project_request_id: string | null
          rated_id: string
          rater_id: string
          rating: number
          review: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_request_id?: string | null
          rated_id: string
          rater_id: string
          rating: number
          review?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_request_id?: string | null
          rated_id?: string
          rater_id?: string
          rating?: number
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_project_request_id_fkey"
            columns: ["project_request_id"]
            isOneToOne: false
            referencedRelation: "project_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      regulatory_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          published_at: string
          severity: string
          source: string
          title: string
          url: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          published_at: string
          severity: string
          source: string
          title: string
          url?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          published_at?: string
          severity?: string
          source?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      regulatory_api_logs: {
        Row: {
          api_source: string
          created_at: string | null
          data_updated: boolean | null
          endpoint: string
          error_message: string | null
          id: string
          records_processed: number | null
          response_time_ms: number | null
          status_code: number | null
          success: boolean | null
        }
        Insert: {
          api_source: string
          created_at?: string | null
          data_updated?: boolean | null
          endpoint: string
          error_message?: string | null
          id?: string
          records_processed?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          success?: boolean | null
        }
        Update: {
          api_source?: string
          created_at?: string | null
          data_updated?: boolean | null
          endpoint?: string
          error_message?: string | null
          id?: string
          records_processed?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          success?: boolean | null
        }
        Relationships: []
      }
      regulatory_matching_results: {
        Row: {
          compatibility_score: number
          compliance_score: number
          created_at: string
          id: string
          match_id: string
          match_type: string
          regulatory_alerts: string[] | null
          regulatory_factors: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          compatibility_score?: number
          compliance_score?: number
          created_at?: string
          id?: string
          match_id: string
          match_type: string
          regulatory_alerts?: string[] | null
          regulatory_factors?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          compatibility_score?: number
          compliance_score?: number
          created_at?: string
          id?: string
          match_id?: string
          match_type?: string
          regulatory_alerts?: string[] | null
          regulatory_factors?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string | null
          event_description: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_description: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_description?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sentiment_analysis: {
        Row: {
          analyzed_at: string
          confidence: number
          created_at: string
          id: string
          keywords: string[] | null
          original_text: string
          profile_id: string
          profile_type: string
          sentiment_label: string
          sentiment_score: number
          updated_at: string
        }
        Insert: {
          analyzed_at?: string
          confidence?: number
          created_at?: string
          id?: string
          keywords?: string[] | null
          original_text: string
          profile_id: string
          profile_type: string
          sentiment_label?: string
          sentiment_score?: number
          updated_at?: string
        }
        Update: {
          analyzed_at?: string
          confidence?: number
          created_at?: string
          id?: string
          keywords?: string[] | null
          original_text?: string
          profile_id?: string
          profile_type?: string
          sentiment_label?: string
          sentiment_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          company_id: string | null
          created_at: string | null
          expires_at: string | null
          features: string[]
          id: string
          plan_type: string
          started_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          features?: string[]
          id?: string
          plan_type: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          features?: string[]
          id?: string
          plan_type?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          earned_at: string
          id: string
          metadata: Json | null
          points: number
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          points?: number
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_security_settings: {
        Row: {
          allowed_ip_ranges: string[] | null
          auto_lock_enabled: boolean | null
          created_at: string | null
          device_tracking: boolean | null
          id: string
          login_notifications: boolean | null
          max_failed_attempts: number | null
          password_expiry_days: number | null
          require_2fa_for_sensitive: boolean | null
          session_timeout: number | null
          suspicious_activity_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_ip_ranges?: string[] | null
          auto_lock_enabled?: boolean | null
          created_at?: string | null
          device_tracking?: boolean | null
          id?: string
          login_notifications?: boolean | null
          max_failed_attempts?: number | null
          password_expiry_days?: number | null
          require_2fa_for_sensitive?: boolean | null
          session_timeout?: number | null
          suspicious_activity_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_ip_ranges?: string[] | null
          auto_lock_enabled?: boolean | null
          created_at?: string | null
          device_tracking?: boolean | null
          id?: string
          login_notifications?: boolean | null
          max_failed_attempts?: number | null
          password_expiry_days?: number | null
          require_2fa_for_sensitive?: boolean | null
          session_timeout?: number | null
          suspicious_activity_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_verification_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          file_name: string
          file_size: number
          id: string
          mime_type: string
          profile_id: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          file_name: string
          file_size: number
          id?: string
          mime_type: string
          profile_id: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          profile_id?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_verification_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_verification_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_verification_status: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          profile_id: string
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          profile_id: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          profile_id?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_verification_status_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_verification_status_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_verification_status_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_verification_status_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          role?: string
        }
        Relationships: []
      }
      verification_badges: {
        Row: {
          badge_color: string | null
          badge_description: string | null
          badge_icon: string | null
          badge_name: string
          badge_type: string
          created_at: string
          earned_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          profile_id: string
          updated_at: string
          user_id: string
          verification_criteria: Json | null
        }
        Insert: {
          badge_color?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_name: string
          badge_type: string
          created_at?: string
          earned_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          profile_id: string
          updated_at?: string
          user_id: string
          verification_criteria?: Json | null
        }
        Update: {
          badge_color?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_name?: string
          badge_type?: string
          created_at?: string
          earned_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          profile_id?: string
          updated_at?: string
          user_id?: string
          verification_criteria?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_badges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_badges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          mentee_id: string
          mentor_id: string
          recording_url: string | null
          room_id: string
          session_id: string | null
          started_at: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          mentee_id: string
          mentor_id: string
          recording_url?: string | null
          room_id: string
          session_id?: string | null
          started_at?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          recording_url?: string | null
          room_id?: string
          session_id?: string | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentorship_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      v_ai_chat_context: {
        Row: {
          messages_desc: Json[] | null
          thread_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      audit_log: {
        Args: {
          action_type: string
          table_name: string
          record_id: string
          details?: Json
        }
        Returns: undefined
      }
      clean_expired_embedding_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clean_old_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_system_notification: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type?: string
        }
        Returns: string
      }
      enqueue_ai_handoffs: {
        Args: {
          p_source_agent: string
          p_target_agents: string[]
          p_input?: Json
          p_project_id?: string
          p_agent_output_id?: string
        }
        Returns: number
      }
      get_analytics_data: {
        Args: { start_date?: string; end_date?: string; user_filter?: string }
        Returns: Json
      }
      get_available_mentors: {
        Args: {
          specialty_filter?: string[]
          min_rating?: number
          max_hourly_rate?: number
        }
        Returns: {
          mentor_id: string
          profile_id: string
          first_name: string
          last_name: string
          specialty: string[]
          experience_years: number
          hourly_rate: number
          bio: string
          average_rating: number
          total_sessions: number
          total_ratings: number
        }[]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_description: string
          p_ip_address?: string
          p_user_agent?: string
          p_metadata?: Json
        }
        Returns: string
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: boolean
      }
      rag_search: {
        Args: { p_query: string; p_top_k?: number }
        Returns: {
          chunk_id: string
          source_id: string
          title: string
          source_url: string
          content: string
          rank: number
        }[]
      }
      safe_get_user_profile: {
        Args: { user_id: string }
        Returns: {
          id: string
          email: string
          first_name: string
          last_name: string
          user_type: string
        }[]
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: Json
      }
    }
    Enums: {
      user_type:
        | "company"
        | "laboratory"
        | "consultant"
        | "individual"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["company", "laboratory", "consultant", "individual", "admin"],
    },
  },
} as const

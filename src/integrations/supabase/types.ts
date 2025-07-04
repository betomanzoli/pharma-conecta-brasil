export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          name: string
          phone: string | null
          profile_id: string | null
          state: string | null
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
          name: string
          phone?: string | null
          profile_id?: string | null
          state?: string | null
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
          name?: string
          phone?: string | null
          profile_id?: string | null
          state?: string | null
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
            foreignKeyName: "consultants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        ]
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
        ]
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
          location: string
          name: string
          operating_hours: string | null
          phone: string | null
          profile_id: string | null
          state: string | null
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
          location: string
          name: string
          operating_hours?: string | null
          phone?: string | null
          profile_id?: string | null
          state?: string | null
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
          location?: string
          name?: string
          operating_hours?: string | null
          phone?: string | null
          profile_id?: string | null
          state?: string | null
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
            foreignKeyName: "laboratories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        ]
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
            foreignKeyName: "project_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_system_notification: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type?: string
        }
        Returns: string
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
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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

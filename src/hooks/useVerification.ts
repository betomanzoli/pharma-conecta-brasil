
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type VerificationStatusRow = Database['public']['Tables']['user_verification_status']['Row'];
type VerificationDocumentRow = Database['public']['Tables']['user_verification_documents']['Row'];
type VerificationBadgeRow = Database['public']['Tables']['verification_badges']['Row'];

interface VerificationStatus {
  id: string;
  verification_type: string;
  status: 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired';
  verified_at?: string;
  expires_at?: string;
  rejection_reason?: string;
  verification_data?: any;
}

interface VerificationDocument {
  id: string;
  document_type: string;
  document_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface VerificationBadge {
  id: string;
  badge_type: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  badge_color: string;
  earned_at: string;
  expires_at?: string;
  is_active: boolean;
}

export const useVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus[]>([]);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [badges, setBadges] = useState<VerificationBadge[]>([]);

  // Buscar status de verificação do usuário
  const fetchVerificationStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_verification_status')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Converter os dados do banco para o formato esperado
      const mappedData: VerificationStatus[] = (data || []).map((row: VerificationStatusRow) => ({
        id: row.id,
        verification_type: row.verification_type,
        status: row.status as 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired',
        verified_at: row.verified_at || undefined,
        expires_at: row.expires_at || undefined,
        rejection_reason: row.rejection_reason || undefined,
        verification_data: row.verification_data || undefined,
      }));

      setVerificationStatus(mappedData);
    } catch (error) {
      console.error('Erro ao buscar status de verificação:', error);
    }
  };

  // Buscar documentos do usuário
  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_verification_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Converter os dados do banco para o formato esperado
      const mappedData: VerificationDocument[] = (data || []).map((row: VerificationDocumentRow) => ({
        id: row.id,
        document_type: row.document_type,
        document_url: row.document_url,
        file_name: row.file_name,
        file_size: row.file_size,
        mime_type: row.mime_type,
        uploaded_at: row.uploaded_at,
      }));

      setDocuments(mappedData);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  // Buscar badges do usuário
  const fetchBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('verification_badges')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      
      // Converter os dados do banco para o formato esperado
      const mappedData: VerificationBadge[] = (data || []).map((row: VerificationBadgeRow) => ({
        id: row.id,
        badge_type: row.badge_type,
        badge_name: row.badge_name,
        badge_description: row.badge_description || undefined,
        badge_icon: row.badge_icon || undefined,
        badge_color: row.badge_color,
        earned_at: row.earned_at,
        expires_at: row.expires_at || undefined,
        is_active: row.is_active,
      }));

      setBadges(mappedData);
    } catch (error) {
      console.error('Erro ao buscar badges:', error);
    }
  };

  // Upload de documento
  const uploadDocument = async (file: File, documentType: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      // Criar nome único do arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload para storage (simulado - você deve implementar storage real)
      const documentUrl = `https://placeholder.com/uploads/${fileName}`;

      // Salvar documento no banco
      const { data, error } = await supabase
        .from('user_verification_documents')
        .insert({
          user_id: user.id,
          profile_id: user.id,
          document_type: documentType,
          document_url: documentUrl,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Documento enviado!",
        description: "Seu documento foi enviado para análise.",
      });

      // Atualizar status para "in_review"
      await updateVerificationStatus(documentType, 'in_review');
      
      await fetchDocuments();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar documento",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status de verificação
  const updateVerificationStatus = async (verificationType: string, status: string, rejectionReason?: string) => {
    if (!user) return;

    try {
      const updateData: any = { status };
      if (status === 'verified') {
        updateData.verified_at = new Date().toISOString();
      }
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('user_verification_status')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('verification_type', verificationType);

      if (error) throw error;
      await fetchVerificationStatus();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Validar CNPJ
  const validateCNPJ = async (cnpj: string, companyName: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cnpj_validations')
        .insert({
          user_id: user.id,
          profile_id: user.id,
          cnpj: cnpj,
          company_name: companyName
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "CNPJ enviado para validação",
        description: "Aguarde enquanto validamos os dados da empresa.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao validar CNPJ",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verificar se usuário tem um tipo específico de verificação
  const hasVerification = (type: string): boolean => {
    return verificationStatus.some(v => v.verification_type === type && v.status === 'verified');
  };

  // Obter status de uma verificação específica
  const getVerificationStatus = (type: string): VerificationStatus | null => {
    return verificationStatus.find(v => v.verification_type === type) || null;
  };

  useEffect(() => {
    if (user) {
      fetchVerificationStatus();
      fetchDocuments();
      fetchBadges();
    }
  }, [user]);

  return {
    loading,
    verificationStatus,
    documents,
    badges,
    uploadDocument,
    validateCNPJ,
    updateVerificationStatus,
    hasVerification,
    getVerificationStatus,
    refetch: () => {
      fetchVerificationStatus();
      fetchDocuments();
      fetchBadges();
    }
  };
};

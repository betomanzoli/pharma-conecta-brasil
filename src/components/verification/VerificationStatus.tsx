
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { useVerification } from '@/hooks/useVerification';
import { useAuth } from '@/contexts/AuthContext';

const VerificationStatus = () => {
  const { user, profile } = useAuth();
  const { verificationStatus, badges, hasVerification, getVerificationStatus } = useVerification();

  if (!user || !profile) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'in_review':
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_review':
        return 'text-blue-600 bg-blue-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verificado';
      case 'pending':
        return 'Pendente';
      case 'in_review':
        return 'Em Análise';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  const getVerificationTypeText = (type: string) => {
    switch (type) {
      case 'identity':
        return 'Verificação de Identidade';
      case 'company':
        return 'Verificação da Empresa';
      case 'laboratory':
        return 'Certificação de Laboratório';
      case 'consultant':
        return 'Certificação de Consultor';
      case 'anvisa':
        return 'Registro ANVISA';
      default:
        return type;
    }
  };

  const overallVerificationScore = () => {
    const totalChecks = verificationStatus.length;
    const verifiedChecks = verificationStatus.filter(v => v.status === 'verified').length;
    return totalChecks > 0 ? Math.round((verifiedChecks / totalChecks) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Status Geral de Verificação */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <span>Status de Verificação</span>
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{overallVerificationScore()}%</div>
              <div className="text-sm text-muted-foreground">Completo</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationStatus.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(verification.status)}
                  <div>
                    <h4 className="font-medium">{getVerificationTypeText(verification.verification_type)}</h4>
                    {verification.rejection_reason && (
                      <p className="text-sm text-red-600 mt-1">{verification.rejection_reason}</p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(verification.status)}>
                  {getStatusText(verification.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges de Verificação */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suas Certificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="text-center p-4 border rounded-lg">
                  <div 
                    className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: badge.badge_color + '20', color: badge.badge_color }}
                  >
                    <Shield className="h-6 w-6" />
                  </div>
                  <h4 className="font-medium text-sm">{badge.badge_name}</h4>
                  {badge.badge_description && (
                    <p className="text-xs text-muted-foreground mt-1">{badge.badge_description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Passos */}
      {overallVerificationScore() < 100 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-700">Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verificationStatus
                .filter(v => v.status === 'pending' || v.status === 'rejected')
                .map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm">
                      Complete sua {getVerificationTypeText(verification.verification_type).toLowerCase()}
                    </span>
                    <Button size="sm" variant="outline">
                      Continuar
                    </Button>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationStatus;

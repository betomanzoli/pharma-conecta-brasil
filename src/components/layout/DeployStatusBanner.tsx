
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";

interface DeployStatusBannerProps {
  status: 'idle' | 'deploying' | 'success' | 'error';
  url?: string;
  onRetry?: () => void;
}

const DeployStatusBanner = ({ status, url, onRetry }: DeployStatusBannerProps) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'deploying') {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Deploy em andamento... Aguarde alguns minutos.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'success' && url) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 flex items-center justify-between">
          <span>Site deployado com sucesso!</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(url, '_blank')}
            className="ml-2"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ver Site
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Erro no deploy. Verifique as configurações.</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
              Tentar Novamente
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DeployStatusBanner;


import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ComplianceDisclaimer = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200 mb-6">
      <AlertTriangle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 font-medium">
        Plataforma desenvolvida exclusivamente para profissionais da indústria farmacêutica brasileira. 
        Todas as informações são para fins educacionais e networking profissional no mercado nacional. 
        Conformidade total com LGPD e regulamentações brasileiras.
      </AlertDescription>
    </Alert>
  );
};

export default ComplianceDisclaimer;

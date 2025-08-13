
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordForm = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail || !resetEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Digite um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    await resetPassword(resetEmail);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          required
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="seu@email.com"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
      </Button>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Se você não receber o email em alguns minutos, verifique sua pasta de spam ou tente novamente.
        </AlertDescription>
      </Alert>
    </form>
  );
};

export default ResetPasswordForm;

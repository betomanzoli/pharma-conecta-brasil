
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const NewPasswordForm = () => {
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Verifique se as senhas são iguais.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    await updatePassword(newPassword);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleNewPassword} className="space-y-4">
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Defina uma nova senha forte com pelo menos 6 caracteres.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="new-password">Nova Senha</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite sua nova senha"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
        <Input
          id="confirm-new-password"
          type="password"
          required
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirme sua nova senha"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
        disabled={isLoading}
      >
        {isLoading ? "Redefinindo..." : "Redefinir Senha"}
      </Button>
    </form>
  );
};

export default NewPasswordForm;


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";
import NewPasswordForm from "./NewPasswordForm";

interface AuthTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const AuthTabs = ({ activeTab, onTabChange }: AuthTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="login" className="text-xs sm:text-sm">
          Login
        </TabsTrigger>
        <TabsTrigger value="register" className="text-xs sm:text-sm">
          Cadastro
        </TabsTrigger>
        <TabsTrigger value="reset" className="text-xs sm:text-sm">
          Recuperar
        </TabsTrigger>
        <TabsTrigger value="new-password" className="text-xs sm:text-sm">
          Nova Senha
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-6">
        <LoginForm />
      </TabsContent>

      <TabsContent value="register" className="mt-6">
        <RegisterForm />
      </TabsContent>

      <TabsContent value="reset" className="mt-6">
        <ResetPasswordForm />
      </TabsContent>

      <TabsContent value="new-password" className="mt-6">
        <NewPasswordForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;


import { useState } from "react";
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
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Cadastro</TabsTrigger>
        <TabsTrigger value="reset">Recuperar</TabsTrigger>
        <TabsTrigger value="new-password">Nova Senha</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>

      <TabsContent value="reset">
        <ResetPasswordForm />
      </TabsContent>

      <TabsContent value="new-password">
        <NewPasswordForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;

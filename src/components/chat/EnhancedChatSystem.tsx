
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatInterface from './ChatInterface';
import AIAssistant from '../ai/AIAssistant';
import { MessageCircle, Bot, Users } from 'lucide-react';

const EnhancedChatSystem = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sistema de Comunicação</h1>
        <p className="text-muted-foreground">Chat colaborativo e assistente AI</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat Colaborativo</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>Assistente AI</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Grupos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <ChatInterface />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIAssistant />
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grupos de Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade em desenvolvimento para grupos de trabalho colaborativo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedChatSystem;

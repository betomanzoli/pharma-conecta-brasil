
import React from 'react';
import EnhancedAIAssistant from '@/components/ai/EnhancedAIAssistant';

const AIAssistantPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">
          Assistentes especializados para análises farmacêuticas avançadas
        </p>
      </div>
      <EnhancedAIAssistant />
    </div>
  );
};

export default AIAssistantPage;

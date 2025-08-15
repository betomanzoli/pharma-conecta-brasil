
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Bem-vindo ao PharmaConnect</h1>
        <p className="text-muted-foreground">Faça login ou vá para o Dashboard.</p>
      </div>
    </div>
  );
};

export default LandingPage;

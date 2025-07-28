
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ContextualHelpCenter from '../help/ContextualHelpCenter';
import { HelpCircle } from 'lucide-react';

const GlobalHelpSystem = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Central de Ajuda</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ContextualHelpCenter />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GlobalHelpSystem;

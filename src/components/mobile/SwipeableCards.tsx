
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { X, Check, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProfessionalCard from "./ProfessionalCard";

interface SwipeableCard {
  id: string;
  content: React.ReactNode;
  data?: any;
}

interface Professional {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  specialties: string[];
  rating: number;
  experience: string;
  avatar?: string;
  isVerified?: boolean;
  type: "professional" | "laboratory" | "consultant" | "supplier";
}

interface SwipeableCardsProps {
  professionals?: Professional[];
  cards?: SwipeableCard[];
  title: string;
  onSwipeLeft?: (card: SwipeableCard | Professional) => void;
  onSwipeRight?: (card: SwipeableCard | Professional) => void;
  onSwipeUp?: (card: SwipeableCard | Professional) => void;
  onSwipeDown?: (card: SwipeableCard | Professional) => void;
  className?: string;
  enableTouchGestures?: boolean;
  enableActions?: boolean;
  actions?: {
    left?: { icon: React.ReactNode; color: string; label: string };
    right?: { icon: React.ReactNode; color: string; label: string };
    up?: { icon: React.ReactNode; color: string; label: string };
    down?: { icon: React.ReactNode; color: string; label: string };
  };
}

const SwipeableCards = ({ 
  professionals = [], 
  cards = [], 
  title,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  enableTouchGestures = true,
  enableActions = false,
  actions = {
    left: { icon: <X className="h-6 w-6" />, color: 'bg-red-500', label: 'Rejeitar' },
    right: { icon: <Check className="h-6 w-6" />, color: 'bg-green-500', label: 'Aceitar' },
    up: { icon: <Star className="h-6 w-6" />, color: 'bg-yellow-500', label: 'Favoritar' },
    down: { icon: <Heart className="h-6 w-6" />, color: 'bg-pink-500', label: 'Curtir' }
  }
}: SwipeableCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragState, setDragState] = useState({
    isDragging: false,
    deltaX: 0,
    deltaY: 0,
    startX: 0,
    startY: 0
  });

  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use cards if provided, otherwise convert professionals to cards
  const items = cards.length > 0 ? cards : professionals.map(prof => ({
    id: prof.id,
    content: <ProfessionalCard {...prof} />,
    data: prof
  }));
  
  const currentItem = items[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchGestures) return;
    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      deltaX: 0,
      deltaY: 0,
      startX: touch.clientX,
      startY: touch.clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging || !enableTouchGestures) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragState.startX;
    const deltaY = touch.clientY - dragState.startY;

    setDragState(prev => ({
      ...prev,
      deltaX,
      deltaY
    }));
  };

  const handleTouchEnd = () => {
    if (!dragState.isDragging || !currentItem || !enableTouchGestures) return;

    const threshold = 100;
    const { deltaX, deltaY } = dragState;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight(currentItem);
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft(currentItem);
        }
      } else {
        if (deltaY < 0 && onSwipeUp) {
          onSwipeUp(currentItem);
        } else if (deltaY > 0 && onSwipeDown) {
          onSwipeDown(currentItem);
        }
      }
      nextCard();
    }

    setDragState({
      isDragging: false,
      deltaX: 0,
      deltaY: 0,
      startX: 0,
      startY: 0
    });
  };

  const nextCard = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  };

  const prevCard = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleAction = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!currentItem) return;

    switch (direction) {
      case 'left':
        onSwipeLeft?.(currentItem);
        break;
      case 'right':
        onSwipeRight?.(currentItem);
        break;
      case 'up':
        onSwipeUp?.(currentItem);
        break;
      case 'down':
        onSwipeDown?.(currentItem);
        break;
    }
    nextCard();
  };

  const getCardTransform = () => {
    if (!dragState.isDragging || !enableTouchGestures) return 'translate3d(0, 0, 0) rotate(0deg)';
    
    const { deltaX, deltaY } = dragState;
    const rotation = deltaX * 0.1;
    
    return `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${rotation}deg)`;
  };

  const getActionOpacity = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!dragState.isDragging || !enableTouchGestures) return 0;
    
    const { deltaX, deltaY } = dragState;
    const threshold = 50;
    
    switch (direction) {
      case 'left':
        return deltaX < -threshold ? Math.min(1, Math.abs(deltaX) / 100) : 0;
      case 'right':
        return deltaX > threshold ? Math.min(1, deltaX / 100) : 0;
      case 'up':
        return deltaY < -threshold ? Math.min(1, Math.abs(deltaY) / 100) : 0;
      case 'down':
        return deltaY > threshold ? Math.min(1, deltaY / 100) : 0;
      default:
        return 0;
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevCard} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} de {items.length}
          </span>
          <Button variant="outline" size="sm" onClick={nextCard} disabled={currentIndex === items.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Card Display */}
      <div className="relative h-96">
        {/* Background cards (stack effect) */}
        {items.slice(currentIndex + 1, currentIndex + 3).map((item, index) => (
          <Card
            key={item.id}
            className={cn(
              'absolute inset-0 pointer-events-none transition-transform duration-300',
              index === 0 ? 'scale-95 translate-y-2' : 'scale-90 translate-y-4'
            )}
            style={{ zIndex: 10 - index }}
          >
            <CardContent className="p-6 h-full">
              {item.content}
            </CardContent>
          </Card>
        ))}

        {/* Current card */}
        {currentItem && (
          <Card
            ref={cardRef}
            className={cn(
              "absolute inset-0 transition-all duration-200 border-2 hover:border-primary/50",
              enableTouchGestures && "cursor-grab active:cursor-grabbing"
            )}
            style={{
              transform: getCardTransform(),
              zIndex: 20
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <CardContent className="p-6 h-full relative">
              {currentItem.content}

              {/* Action indicators */}
              {enableActions && enableTouchGestures && (
                <>
                  <div
                    className={cn(
                      'absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full text-white transition-opacity',
                      actions.left?.color
                    )}
                    style={{ opacity: getActionOpacity('left') }}
                  >
                    {actions.left?.icon}
                  </div>

                  <div
                    className={cn(
                      'absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full text-white transition-opacity',
                      actions.right?.color
                    )}
                    style={{ opacity: getActionOpacity('right') }}
                  >
                    {actions.right?.icon}
                  </div>

                  <div
                    className={cn(
                      'absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full text-white transition-opacity',
                      actions.up?.color
                    )}
                    style={{ opacity: getActionOpacity('up') }}
                  >
                    {actions.up?.icon}
                  </div>

                  <div
                    className={cn(
                      'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full text-white transition-opacity',
                      actions.down?.color
                    )}
                    style={{ opacity: getActionOpacity('down') }}
                  >
                    {actions.down?.icon}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action buttons */}
        {enableActions && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <Button
              size="sm"
              onClick={() => handleAction('left')}
              className={cn('w-12 h-12 rounded-full text-white shadow-lg', actions.left?.color)}
              title={actions.left?.label}
            >
              {actions.left?.icon}
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleAction('down')}
              className={cn('w-12 h-12 rounded-full text-white shadow-lg', actions.down?.color)}
              title={actions.down?.label}
            >
              {actions.down?.icon}
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleAction('up')}
              className={cn('w-12 h-12 rounded-full text-white shadow-lg', actions.up?.color)}
              title={actions.up?.label}
            >
              {actions.up?.icon}
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleAction('right')}
              className={cn('w-12 h-12 rounded-full text-white shadow-lg', actions.right?.color)}
              title={actions.right?.label}
            >
              {actions.right?.icon}
            </Button>
          </div>
        )}
      </div>

      {/* Progress indicators */}
      {items.length > 1 && (
        <div className="flex justify-center space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
      )}

      {/* Touch instructions for mobile */}
      {enableTouchGestures && (
        <div className="lg:hidden text-center">
          <p className="text-xs text-muted-foreground">
            Deslize para navegar • Toque nos botões para ações →
          </p>
        </div>
      )}
    </div>
  );
};

export default SwipeableCards;

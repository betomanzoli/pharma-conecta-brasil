
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfessionalCard from "./ProfessionalCard";

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
  professionals: Professional[];
  title: string;
}

const SwipeableCards = ({ professionals, title }: SwipeableCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % professionals.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + professionals.length) % professionals.length);
  };

  if (professionals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum profissional encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevCard} disabled={professionals.length <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} de {professionals.length}
          </span>
          <Button variant="outline" size="sm" onClick={nextCard} disabled={professionals.length <= 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Card Display */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {professionals.map((professional) => (
            <div key={professional.id} className="w-full flex-shrink-0 px-1">
              <ProfessionalCard {...professional} />
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      {professionals.length > 1 && (
        <div className="flex justify-center space-x-2">
          {professionals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Touch instructions for mobile */}
      <div className="lg:hidden text-center">
        <p className="text-xs text-gray-500">
          Deslize para ver mais profissionais →
        </p>
      </div>
    </div>
  );
};

export default SwipeableCards;

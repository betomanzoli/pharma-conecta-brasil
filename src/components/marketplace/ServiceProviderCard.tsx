
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  MessageCircle, 
  Calendar,
  FlaskConical,
  Users,
  Building
} from 'lucide-react';

interface ServiceProvider {
  id: string;
  name: string;
  type: 'laboratory' | 'consultant' | 'company';
  location: string;
  rating: number;
  specialties: string[];
  description: string;
  verified: boolean;
  price_range: string;
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onContact: (providerId: string) => void;
  onSchedule: (providerId: string) => void;
  actions?: React.ReactNode;
}

const ServiceProviderCard = ({ provider, onContact, onSchedule, actions }: ServiceProviderCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'laboratory': return <FlaskConical className="h-4 w-4" />;
      case 'consultant': return <Users className="h-4 w-4" />;
      case 'company': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'laboratory': return 'Laboratório';
      case 'consultant': return 'Consultor';
      case 'company': return 'Empresa';
      default: return 'Provedor';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getTypeIcon(provider.type)}
            <Badge variant="outline">
              {getTypeLabel(provider.type)}
            </Badge>
            {provider.verified && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Verificado
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{provider.rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {provider.name}
        </h3>

        <div className="flex items-center space-x-1 text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{provider.location}</span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {provider.description}
        </p>

        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Especialidades:</p>
          <div className="flex flex-wrap gap-1">
            {provider.specialties.slice(0, 3).map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {provider.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.specialties.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">
            {provider.price_range}
          </p>
        </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContact(provider.id)}
              className="flex-1 flex items-center justify-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contatar</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onSchedule(provider.id)}
              className="flex-1 flex items-center justify-center space-x-1 bg-[#1565C0] hover:bg-[#1565C0]/90"
            >
              <Calendar className="h-4 w-4" />
              <span>Agendar</span>
            </Button>
          </div>

          {actions && (
            <div className="mt-3">
              {actions}
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default ServiceProviderCard;

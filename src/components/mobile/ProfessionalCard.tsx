
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Phone, 
  MessageCircle, 
  QrCode,
  Star,
  Building2,
  FlaskConical
} from "lucide-react";

interface ProfessionalCardProps {
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

const ProfessionalCard = ({
  name,
  title,
  company,
  location,
  specialties,
  rating,
  experience,
  avatar,
  isVerified = false,
  type
}: ProfessionalCardProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "laboratory":
        return <FlaskConical className="h-4 w-4" />;
      case "consultant":
        return <GraduationCap className="h-4 w-4" />;
      case "supplier":
        return <Building2 className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "laboratory":
        return "bg-blue-100 text-blue-800";
      case "consultant":
        return "bg-green-100 text-green-800";
      case "supplier":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary-50 text-primary text-lg font-semibold">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
            {isVerified && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                Verificado
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1 mb-2">
            <Badge className={`text-xs ${getTypeColor()}`}>
              {getTypeIcon()}
              <span className="ml-1 capitalize">{type}</span>
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 font-medium truncate">{title}</p>
          <p className="text-sm text-gray-500 truncate">{company}</p>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Briefcase className="h-3 w-3" />
              <span>{experience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              +{specialties.length - 3} mais
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          <Phone className="h-3 w-3 mr-1" />
          Ligar
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <MessageCircle className="h-3 w-3 mr-1" />
          Mensagem
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <QrCode className="h-3 w-3 mr-1" />
          Compartilhar
        </Button>
      </div>
    </Card>
  );
};

export default ProfessionalCard;

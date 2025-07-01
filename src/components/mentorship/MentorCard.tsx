
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Calendar, 
  MessageCircle,
  GraduationCap,
  Clock
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  experience_years: number;
  rating: number;
  total_sessions: number;
  location: string;
  bio: string;
  hourly_rate: number;
  avatar_url?: string;
  available_times: string[];
}

interface MentorCardProps {
  mentor: Mentor;
  onSchedule: (mentorId: string) => void;
  onMessage: (mentorId: string) => void;
}

const MentorCard = ({ mentor, onSchedule, onMessage }: MentorCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.avatar_url} alt={mentor.name} />
            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{mentor.name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{mentor.rating}</span>
                <span className="text-sm text-gray-500">({mentor.total_sessions} sessões)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <GraduationCap className="h-4 w-4" />
                <span>{mentor.experience_years} anos de experiência</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{mentor.location}</span>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{mentor.bio}</p>
            
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Especialidades:</p>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.slice(0, 3).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {mentor.expertise.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{mentor.expertise.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">R$ {mentor.hourly_rate}/hora</span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMessage(mentor.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Mensagem
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSchedule(mentor.id)}
                  className="bg-[#1565C0] hover:bg-[#1565C0]/90"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorCard;

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign,
  Star,
  Video
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCardProps {
  session: {
    id: string;
    mentor_id: string;
    mentee_id: string;
    title: string;
    description: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    price: number;
    mentor_rating?: number;
    mentee_rating?: number;
  };
  currentUserId: string;
  mentorName?: string;
  onJoin?: (sessionId: string) => void;
  onRate?: (sessionId: string, rating: number) => void;
}

const SessionCard = ({ session, currentUserId, mentorName, onJoin, onRate }: SessionCardProps) => {
  const isUpcoming = new Date(session.scheduled_at) > new Date();
  const isMentor = session.mentor_id === currentUserId;
  const isPast = new Date(session.scheduled_at) < new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      case 'in_progress': return 'Em Andamento';
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {session.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {session.description}
            </p>
          </div>
          <Badge className={getStatusColor(session.status)}>
            {getStatusLabel(session.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>
              {format(new Date(session.scheduled_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              {format(new Date(session.scheduled_at), 'HH:mm', { locale: ptBR })} 
              ({session.duration_minutes}min)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>{isMentor ? 'Como Mentor' : mentorName || 'Mentor'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-green-600 font-medium">
              R$ {session.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Rating section */}
        {session.status === 'completed' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avaliação:</span>
              <div className="flex items-center space-x-2">
                {isMentor ? (
                  session.mentor_rating ? (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{session.mentor_rating}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Não avaliado</span>
                  )
                ) : (
                  session.mentee_rating ? (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{session.mentee_rating}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Não avaliado</span>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          {session.status === 'scheduled' && isUpcoming && (
            <Button
              size="sm"
              onClick={() => onJoin?.(session.id)}
              className="bg-[#1565C0] hover:bg-[#1565C0]/90"
            >
              <Video className="h-4 w-4 mr-1" />
              Iniciar Sessão
            </Button>
          )}
          
          {session.status === 'completed' && !isMentor && !session.mentee_rating && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRate?.(session.id, 5)}
            >
              <Star className="h-4 w-4 mr-1" />
              Avaliar
            </Button>
          )}

          {session.status === 'completed' && isMentor && !session.mentor_rating && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRate?.(session.id, 5)}
            >
              <Star className="h-4 w-4 mr-1" />
              Avaliar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
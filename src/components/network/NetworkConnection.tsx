
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Building, 
  UserPlus,
  MessageCircle,
  Star,
  Briefcase,
  Users
} from 'lucide-react';

interface NetworkConnectionProps {
  connection: {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    expertise: string[];
    avatar?: string;
    connection_status: 'connected' | 'pending' | 'none';
    user_type: 'company' | 'laboratory' | 'consultant' | 'individual';
  };
  onConnect: (connectionId: string) => void;
}

const NetworkConnection = ({ connection, onConnect }: NetworkConnectionProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'company': return <Building className="h-4 w-4" />;
      case 'laboratory': return <Briefcase className="h-4 w-4" />;
      case 'consultant': return <Star className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800';
      case 'laboratory': return 'bg-green-100 text-green-800';
      case 'consultant': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={connection.avatar} />
            <AvatarFallback>
              {connection.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {connection.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {connection.company}
            </p>
            <div className="flex items-center mt-1">
              <Badge className={`text-xs ${getTypeColor(connection.user_type)}`}>
                <span className="flex items-center space-x-1">
                  {getTypeIcon(connection.user_type)}
                  <span>{connection.title}</span>
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {connection.location && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{connection.location}</span>
          </div>
        )}

        {connection.expertise.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {connection.expertise.slice(0, 3).map((exp, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {exp}
                </Badge>
              ))}
              {connection.expertise.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{connection.expertise.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onConnect(connection.id)}
            disabled={connection.connection_status !== 'none'}
            className="flex-1"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            {connection.connection_status === 'pending' ? 'Pendente' : 
             connection.connection_status === 'connected' ? 'Conectado' : 'Conectar'}
          </Button>
          <Button size="sm" variant="outline">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkConnection;

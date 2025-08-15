
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, Star, MapPin, MessageCircle } from 'lucide-react';
import { isDemoMode, demoData } from '@/utils/demoMode';

const ConsultantsPage = () => {
  const isDemo = isDemoMode();
  const consultants = isDemo ? demoData.consultants || [] : [];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Consultores</h1>
              <p className="text-muted-foreground">
                Encontre especialistas para seus projetos
              </p>
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar Consultores
            </Button>
          </div>

          {consultants.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultants.map((consultant, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage src={consultant.avatar} />
                      <AvatarFallback>
                        {consultant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{consultant.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{consultant.specialization}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{consultant.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{consultant.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {consultant.expertise.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {consultant.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{consultant.expertise.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contatar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum consultor encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {isDemo 
                    ? 'Em modo real, consultores especializados apareceriam aqui'
                    : 'Nossa rede de consultores estará disponível em breve'}
                </p>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Explorar Consultores
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ConsultantsPage;

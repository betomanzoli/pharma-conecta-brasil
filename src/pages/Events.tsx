
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, ExternalLink, Search, Filter, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  isOnline: boolean;
  registrationUrl?: string;
  price?: string;
  category: string;
}

const Events = () => {
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Congresso Brasileiro de Ciências Farmacêuticas',
      description: 'O maior evento de ciências farmacêuticas do Brasil, reunindo profissionais, pesquisadores e empresas do setor.',
      date: '2024-03-15',
      time: '09:00',
      location: 'Centro de Convenções Anhembi - São Paulo',
      type: 'congress',
      organizer: 'Conselho Federal de Farmácia',
      attendees: 1250,
      maxAttendees: 2000,
      isOnline: false,
      registrationUrl: 'https://example.com/congresso',
      price: 'R$ 450,00',
      category: 'Educacional'
    },
    {
      id: '2',
      title: 'Webinar: Novas Diretrizes da ANVISA',
      description: 'Apresentação das principais mudanças nas diretrizes regulatórias da ANVISA para 2024.',
      date: '2024-02-20',
      time: '14:00',
      location: 'Online',
      type: 'webinar',
      organizer: 'ANVISA',
      attendees: 850,
      maxAttendees: 1000,
      isOnline: true,
      registrationUrl: 'https://example.com/webinar',
      price: 'Gratuito',
      category: 'Regulatório'
    },
    {
      id: '3',
      title: 'Workshop: Validação de Métodos Analíticos',
      description: 'Workshop prático sobre validação de métodos analíticos aplicados ao controle de qualidade farmacêutica.',
      date: '2024-02-28',
      time: '08:30',
      location: 'Laboratório Central - Rio de Janeiro',
      type: 'workshop',
      organizer: 'Instituto de Análises Farmacêuticas',
      attendees: 45,
      maxAttendees: 60,
      isOnline: false,
      registrationUrl: 'https://example.com/workshop',
      price: 'R$ 280,00',
      category: 'Técnico'
    },
    {
      id: '4',
      title: 'Feira Internacional de Insumos Farmacêuticos',
      description: 'Exposição dos principais fornecedores de insumos farmacêuticos com oportunidades de negócio.',
      date: '2024-04-10',
      time: '10:00',
      location: 'Expo Center Norte - São Paulo',
      type: 'exhibition',
      organizer: 'Associação Brasileira da Indústria Farmacêutica',
      attendees: 3200,
      maxAttendees: 5000,
      isOnline: false,
      registrationUrl: 'https://example.com/feira',
      price: 'R$ 120,00',
      category: 'Comercial'
    }
  ]);
  
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const { toast } = useToast();

  React.useEffect(() => {
    filterEvents();
  }, [searchTerm, typeFilter, categoryFilter, locationFilter]);

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    if (locationFilter !== 'all') {
      if (locationFilter === 'online') {
        filtered = filtered.filter(event => event.isOnline);
      } else {
        filtered = filtered.filter(event => !event.isOnline);
      }
    }

    setFilteredEvents(filtered);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'congress':
        return 'bg-blue-100 text-blue-800';
      case 'webinar':
        return 'bg-green-100 text-green-800';
      case 'workshop':
        return 'bg-purple-100 text-purple-800';
      case 'exhibition':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'congress':
        return 'Congresso';
      case 'webinar':
        return 'Webinar';
      case 'workshop':
        return 'Workshop';
      case 'exhibition':
        return 'Feira';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleRegister = (event: Event) => {
    toast({
      title: "Inscrição realizada",
      description: `Você se inscreveu no evento "${event.title}"`,
    });
  };

  const isEventFull = (event: Event) => {
    return event.maxAttendees && event.attendees >= event.maxAttendees;
  };

  const getAvailabilityPercentage = (event: Event) => {
    if (!event.maxAttendees) return 0;
    return (event.attendees / event.maxAttendees) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Eventos Farmacêuticos
              </h1>
              <p className="text-gray-600 mt-2">
                Congressos, webinars, workshops e feiras do setor farmacêutico
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="congress">Congresso</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="exhibition">Feira</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Educacional">Educacional</SelectItem>
                  <SelectItem value="Regulatório">Regulatório</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Locais</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presential">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
              </p>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>

            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className={getTypeColor(event.type)}>
                            {getTypeLabel(event.type)}
                          </Badge>
                          <Badge variant="secondary">{event.category}</Badge>
                          {event.isOnline && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Online
                            </Badge>
                          )}
                          {isEventFull(event) && (
                            <Badge variant="destructive">
                              Lotado
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl text-primary mb-2">
                          {event.title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mb-2">
                          Organizado por: {event.organizer}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {event.price}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <div>
                          <div>{formatDate(event.date)}</div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <div>
                          <div>
                            {event.attendees}
                            {event.maxAttendees && ` / ${event.maxAttendees}`} participantes
                          </div>
                          {event.maxAttendees && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${getAvailabilityPercentage(event)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        {event.maxAttendees && (
                          <span>
                            {event.maxAttendees - event.attendees} vagas restantes
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {event.registrationUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </a>
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          onClick={() => handleRegister(event)}
                          disabled={isEventFull(event)}
                        >
                          {isEventFull(event) ? 'Lotado' : 'Inscrever-se'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;

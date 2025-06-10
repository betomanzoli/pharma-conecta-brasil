
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Video, Building } from "lucide-react";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Webinar: Novas Diretrizes ANVISA 2024",
      type: "Webinar",
      date: "15 Jan 2024",
      time: "14:00 - 16:00",
      speaker: "Dra. Ana Rodrigues",
      location: "Online",
      attendees: 120,
      price: "Gratuito",
      topics: ["ANVISA", "Regulatório", "Compliance"],
      description: "Discussão sobre as principais mudanças nas diretrizes ANVISA para 2024 e impactos na indústria."
    },
    {
      id: 2,
      title: "Conferência Farmacêutica Brasil 2024",
      type: "Conferência",
      date: "20-22 Fev 2024",
      time: "09:00 - 18:00",
      speaker: "Múltiplos palestrantes",
      location: "São Paulo Convention Center",
      attendees: 500,
      price: "R$ 450",
      topics: ["P&D", "Inovação", "Mercado Farmacêutico"],
      description: "Principal evento da indústria farmacêutica brasileira com networking e conteúdo técnico."
    },
    {
      id: 3,
      title: "Workshop: Controle de Qualidade Avançado",
      type: "Workshop",
      date: "10 Mar 2024",
      time: "08:00 - 17:00",
      speaker: "Dr. Carlos Ferreira",
      location: "AnalyticLab São Paulo",
      attendees: 25,
      price: "R$ 320",
      topics: ["Controle de Qualidade", "Métodos Analíticos", "Validação"],
      description: "Workshop prático sobre técnicas avançadas de controle de qualidade farmacêutico."
    }
  ];

  const upcomingWebinars = [
    {
      id: 1,
      title: "Tendências em Biotecnologia Farmacêutica",
      date: "25 Jan 2024",
      time: "19:00",
      speaker: "Dra. Maria Santos"
    },
    {
      id: 2,
      title: "IA na Descoberta de Medicamentos",
      date: "30 Jan 2024",
      time: "20:00",
      speaker: "Dr. João Silva"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ComplianceDisclaimer />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eventos Farmacêuticos
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Participe de webinars, conferências e workshops para expandir seu conhecimento
          </p>
          
          {/* Event Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button className="bg-primary">
              <Calendar className="h-4 w-4 mr-2" />
              Todos os Eventos
            </Button>
            <Button variant="outline">Webinars</Button>
            <Button variant="outline">Conferências</Button>
            <Button variant="outline">Workshops</Button>
            <Button variant="outline">Gratuitos</Button>
          </div>
        </div>

        {/* Featured Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Eventos em Destaque</h2>
          
          <div className="space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {event.location === "Online" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{event.attendees} participantes</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Palestrante:</strong> {event.speaker}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-primary mb-2">{event.price}</div>
                      <Button>Inscrever-se</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Webinars */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Próximos Webinars</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{webinar.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Video className="h-4 w-4" />
                      <span>Online</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Palestrante:</strong> {webinar.speaker}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      Participar Gratuitamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Events;

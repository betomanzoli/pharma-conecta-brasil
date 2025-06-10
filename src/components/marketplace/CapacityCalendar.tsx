
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";

const CapacityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const capacityData = [
    {
      date: "2024-01-15",
      availability: "high",
      slots: 8,
      booked: 2,
      services: ["Microbiologia", "Físico-química"]
    },
    {
      date: "2024-01-16",
      availability: "medium",
      slots: 6,
      booked: 4,
      services: ["Estabilidade", "Analítica"]
    },
    {
      date: "2024-01-17",
      availability: "low",
      slots: 4,
      booked: 3,
      services: ["Microbiologia"]
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "high":
        return <CheckCircle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      case "low":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Calendário de Capacidade</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {capacityData.map((day) => (
            <div
              key={day.date}
              className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setSelectedDate(day.date)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{new Date(day.date).toLocaleDateString('pt-BR')}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {day.slots - day.booked} vagas disponíveis de {day.slots}
                    </span>
                  </div>
                </div>
                <Badge className={getAvailabilityColor(day.availability)}>
                  {getAvailabilityIcon(day.availability)}
                  <span className="ml-1 capitalize">{day.availability}</span>
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {day.services.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
              
              {selectedDate === day.date && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Reservar Horário
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacityCalendar;

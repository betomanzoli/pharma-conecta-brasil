import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CalendarIcon, 
  Clock, 
  User, 
  Star, 
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface MentorshipSession {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  mentor: {
    profile_id: string;
    profile: {
      first_name: string;
      last_name: string;
    };
    average_rating: number;
    specialty: string[];
  };
}

interface MentorAvailability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  mentor: {
    id: string;
    profile_id: string;
    profile: {
      first_name: string;
      last_name: string;
    };
    average_rating: number;
    specialty: string[];
    hourly_rate: number;
  };
}

const MentorshipCalendar: React.FC = () => {
  const { profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('week');
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [availabilities, setAvailabilities] = useState<MentorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchSessions();
    fetchAvailabilities();
  }, [profile?.id, selectedDate, weekStart]);

  const fetchSessions = async () => {
    if (!profile?.id) return;

    try {
      const startDate = viewMode === 'week' ? weekStart : selectedDate;
      const endDate = viewMode === 'week' ? endOfWeek(weekStart, { weekStartsOn: 1 }) : addDays(selectedDate, 30);

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          id,
          title,
          scheduled_at,
          duration_minutes,
          status,
          mentor:mentors(
            profile_id,
            average_rating,
            specialty,
            profile:profiles(first_name, last_name)
          )
        `)
        .eq('mentee_id', profile.id)
        .gte('scheduled_at', startDate.toISOString())
        .lte('scheduled_at', endDate.toISOString())
        .order('scheduled_at');

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
      toast.error('Erro ao carregar sessões de mentoria');
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_availability')
        .select(`
          id,
          day_of_week,
          start_time,
          end_time,
          mentor:mentors(
            id,
            profile_id,
            average_rating,
            specialty,
            hourly_rate,
            profile:profiles(first_name, last_name)
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      setAvailabilities(data || []);
    } catch (error) {
      console.error('Erro ao buscar disponibilidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => 
      isSameDay(parseISO(session.scheduled_at), date)
    );
  };

  const getAvailabilitiesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availabilities.filter(availability => 
      availability.day_of_week === dayOfWeek
    );
  };

  const handleScheduleSession = async (availability: MentorAvailability, time: string) => {
    // Esta função seria expandida para abrir um modal de agendamento
    toast.info('Funcionalidade de agendamento será implementada', {
      description: `Mentor: ${availability.mentor.profile.first_name} às ${time}`
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = direction === 'prev' 
      ? addDays(weekStart, -7)
      : addDays(weekStart, 7);
    setWeekStart(newWeekStart);
  };

  const renderWeekView = () => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold">
              {format(weekStart, 'MMM yyyy', { locale: ptBR })}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Mês
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayName = format(day, 'EEE', { locale: ptBR });
            const dayNumber = format(day, 'd');
            const sessionsForDay = getSessionsForDate(day);
            const availabilitiesForDay = getAvailabilitiesForDate(day);

            return (
              <Card key={index} className="min-h-[200px]">
                <CardHeader className="pb-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase">
                      {dayName}
                    </div>
                    <div className="text-lg font-semibold">{dayNumber}</div>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {/* Sessões agendadas */}
                      {sessionsForDay.map((session) => (
                        <div
                          key={session.id}
                          className="p-2 bg-blue-50 border border-blue-200 rounded text-xs"
                        >
                          <div className="font-medium text-blue-900">
                            {format(parseISO(session.scheduled_at), 'HH:mm')}
                          </div>
                          <div className="text-blue-700 truncate">
                            {session.title}
                          </div>
                          <Badge 
                            variant={
                              session.status === 'completed' ? 'default' :
                              session.status === 'cancelled' ? 'destructive' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {session.status}
                          </Badge>
                        </div>
                      ))}

                      {/* Disponibilidades */}
                      {availabilitiesForDay.map((availability) => (
                        <div
                          key={availability.id}
                          className="p-2 bg-green-50 border border-green-200 rounded text-xs cursor-pointer hover:bg-green-100"
                          onClick={() => handleScheduleSession(availability, availability.start_time)}
                        >
                          <div className="font-medium text-green-900">
                            {availability.start_time} - {availability.end_time}
                          </div>
                          <div className="text-green-700 truncate">
                            {availability.mentor.profile.first_name} {availability.mentor.profile.last_name}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-green-600">
                              {availability.mentor.average_rating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                hasSession: (date) => getSessionsForDate(date).length > 0,
                hasAvailability: (date) => getAvailabilitiesForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasSession: { backgroundColor: 'rgb(59 130 246 / 0.1)', color: 'rgb(59 130 246)' },
                hasAvailability: { backgroundColor: 'rgb(34 197 94 / 0.1)', color: 'rgb(34 197 94)' },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(selectedDate, 'dd \'de\' MMMM', { locale: ptBR })}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {/* Sessões do dia selecionado */}
                {getSessionsForDate(selectedDate).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 border rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">
                          {format(parseISO(session.scheduled_at), 'HH:mm')}
                        </span>
                      </div>
                      <Badge variant="secondary">{session.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      {session.title}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>
                        {session.mentor?.profile?.first_name} {session.mentor?.profile?.last_name}
                      </span>
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{session.mentor?.average_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                ))}

                {/* Disponibilidades do dia selecionado */}
                {getAvailabilitiesForDate(selectedDate).map((availability) => (
                  <div
                    key={availability.id}
                    className="p-3 border rounded-lg bg-green-50 cursor-pointer hover:bg-green-100"
                    onClick={() => handleScheduleSession(availability, availability.start_time)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium">
                          {availability.start_time} - {availability.end_time}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-green-700">
                        Disponível
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-green-600" />
                        <span>
                          {availability.mentor.profile.first_name} {availability.mentor.profile.last_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{availability.mentor.average_rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-green-600 font-medium">
                          R$ {availability.mentor.hourly_rate}/h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {getSessionsForDate(selectedDate).length === 0 && 
                 getAvailabilitiesForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma sessão ou disponibilidade para este dia</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === 'week' ? renderWeekView() : renderMonthView()}
    </div>
  );
};

export default MentorshipCalendar;
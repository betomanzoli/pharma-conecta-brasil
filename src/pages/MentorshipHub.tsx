
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import MentorCard from '@/components/mentorship/MentorCard';
import MentorshipFilters from '@/components/mentorship/MentorshipFilters';
import SessionCard from '@/components/mentorship/SessionCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface MentorshipSession {
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
  mentor_notes?: string;
  mentee_notes?: string;
}

const MentorshipHub = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
    if (profile?.id) {
      fetchSessions();
    }
  }, [profile?.id]);

  useEffect(() => {
    filterMentors();
  }, [searchTerm, experienceFilter, specialtyFilter, mentors]);

  const fetchSessions = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          *,
          mentor:mentors!mentorship_sessions_mentor_id_mentors_fkey(
            profile_id,
            specialty,
            hourly_rate,
            profiles!mentors_profile_id_fkey(first_name, last_name)
          )
        `)
        .or(`mentor_id.eq.${profile.id},mentee_id.eq.${profile.id}`)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;

      const formattedSessions: MentorshipSession[] = (data || []).map(session => ({
        id: session.id,
        mentor_id: session.mentor_id,
        mentee_id: session.mentee_id,
        title: session.title,
        description: session.description || '',
        scheduled_at: session.scheduled_at,
        duration_minutes: session.duration_minutes,
        status: session.status,
        price: Number(session.price) || 0,
        mentor_rating: session.mentor_rating,
        mentee_rating: session.mentee_rating,
        mentor_notes: session.mentor_notes,
        mentee_notes: session.mentee_notes
      }));

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase.rpc('get_available_mentors');

      if (error) throw error;

      const formattedMentors: Mentor[] = (data || []).map(mentor => ({
        id: mentor.mentor_id,
        name: `${mentor.first_name || ''} ${mentor.last_name || ''}`.trim() || 'Mentor',
        expertise: mentor.specialty || [],
        experience_years: mentor.experience_years,
        rating: Number(mentor.average_rating) || 0,
        total_sessions: mentor.total_sessions,
        location: 'Brasil', // Pode ser expandido para incluir localização real
        bio: mentor.bio || 'Mentor experiente na área farmacêutica',
        hourly_rate: Number(mentor.hourly_rate) || 0,
        available_times: ['09:00-12:00', '14:00-17:00'] // Pode ser expandido com disponibilidade real
      }));

      setMentors(formattedMentors);
      setFilteredMentors(formattedMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: "Erro ao carregar mentores",
        description: "Não foi possível carregar a lista de mentores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (experienceFilter !== 'all') {
      filtered = filtered.filter(mentor => {
        switch (experienceFilter) {
          case 'junior': return mentor.experience_years <= 3;
          case 'mid': return mentor.experience_years >= 4 && mentor.experience_years <= 7;
          case 'senior': return mentor.experience_years >= 8;
          default: return true;
        }
      });
    }

    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(mentor =>
        mentor.expertise.some(skill => 
          skill.toLowerCase().includes(specialtyFilter.toLowerCase())
        )
      );
    }

    setFilteredMentors(filtered);
  };

  const handleSchedule = () => {
    // Refresh sessions after scheduling
    fetchSessions();
  };

  const handleMessage = (mentorId: string) => {
    const selectedMentor = mentors.find(m => m.id === mentorId);
    toast({
      title: "Mensagem enviada",
      description: `Sua mensagem foi enviada para ${selectedMentor?.name}`,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Hub de Mentoria
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre mentores especializados e acelere seu desenvolvimento profissional
            </p>
          </div>

          <Tabs defaultValue="find-mentors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="find-mentors" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Encontrar Mentores</span>
              </TabsTrigger>
              <TabsTrigger value="my-sessions" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Minhas Sessões</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Mensagens</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="find-mentors" className="space-y-6">
              <MentorshipFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                experienceFilter={experienceFilter}
                setExperienceFilter={setExperienceFilter}
                specialtyFilter={specialtyFilter}
                setSpecialtyFilter={setSpecialtyFilter}
              />

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-16 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredMentors.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum mentor encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros de busca
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      onSchedule={handleSchedule}
                      onMessage={handleMessage}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-sessions" className="space-y-4">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma sessão agendada
                    </h3>
                    <p className="text-gray-600">
                      Suas sessões de mentoria aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      currentUserId={profile?.id || ''}
                      mentorName="Mentor" // Pode ser expandido para incluir nome real
                      onJoin={(sessionId) => {
                        toast({
                          title: "Iniciando sessão",
                          description: "Redirecionando para a sala de videoconferência...",
                        });
                      }}
                      onRate={(sessionId, rating) => {
                        toast({
                          title: "Avaliação registrada",
                          description: "Obrigado pelo seu feedback!",
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma mensagem
                  </h3>
                  <p className="text-gray-600">
                    Suas conversas com mentores aparecerão aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MentorshipHub;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import MentorCard from '@/components/mentorship/MentorCard';
import MentorshipFilters from '@/components/mentorship/MentorshipFilters';
import { useToast } from '@/hooks/use-toast';

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

const MentorshipHub = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchTerm, experienceFilter, specialtyFilter, mentors]);

  const fetchMentors = async () => {
    try {
      // Mock data - em produção, viria do Supabase
      const mockMentors: Mentor[] = [
        {
          id: '1',
          name: 'Dr. Carlos Mendes',
          expertise: ['Regulatório ANVISA', 'Registro de Medicamentos', 'Compliance'],
          experience_years: 15,
          rating: 4.9,
          total_sessions: 124,
          location: 'São Paulo, SP',
          bio: 'Especialista em assuntos regulatórios com mais de 15 anos de experiência na ANVISA e indústria farmacêutica.',
          hourly_rate: 250,
          available_times: ['09:00-12:00', '14:00-17:00']
        },
        {
          id: '2',
          name: 'Dra. Ana Santos',
          expertise: ['Pesquisa Clínica', 'Bioequivalência', 'Farmacovigilância'],
          experience_years: 12,
          rating: 4.8,
          total_sessions: 89,
          location: 'Rio de Janeiro, RJ',
          bio: 'Pesquisadora clínica com vasta experiência em estudos de bioequivalência e farmacovigilância.',
          hourly_rate: 200,
          available_times: ['08:00-11:00', '15:00-18:00']
        },
        {
          id: '3',
          name: 'Prof. Roberto Lima',
          expertise: ['Controle de Qualidade', 'Validação', 'Boas Práticas'],
          experience_years: 20,
          rating: 4.7,
          total_sessions: 156,
          location: 'Campinas, SP',
          bio: 'Professor universitário e consultor em controle de qualidade e validação de processos farmacêuticos.',
          hourly_rate: 300,
          available_times: ['10:00-12:00', '14:00-16:00']
        }
      ];

      setMentors(mockMentors);
      setFilteredMentors(mockMentors);
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

  const handleSchedule = (mentorId: string) => {
    toast({
      title: "Agendamento solicitado",
      description: "Sua solicitação de mentoria foi enviada",
    });
  };

  const handleMessage = (mentorId: string) => {
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada para o mentor",
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

            <TabsContent value="my-sessions">
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

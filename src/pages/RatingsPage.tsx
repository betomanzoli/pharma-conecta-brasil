
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Search, Award, TrendingUp, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import RatingSystem from '@/components/rating/RatingSystem';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  averageRating: number;
  totalRatings: number;
}

const RatingsPage = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', profile?.id);

      if (error) throw error;

      // Buscar avaliações para cada usuário
      const usersWithRatings = await Promise.all(
        profiles?.map(async (user) => {
          const { data: ratings } = await supabase
            .from('ratings')
            .select('rating')
            .eq('rated_id', user.id);

          const averageRating = ratings?.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0;

          return {
            ...user,
            averageRating,
            totalRatings: ratings?.length || 0
          };
        }) || []
      );

      setUsers(usersWithRatings);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topRatedUsers = [...users]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Avaliações</h1>
            <p className="text-muted-foreground">
              Avalie profissionais e veja avaliações da comunidade
            </p>
          </div>

          <Tabs defaultValue="rate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rate">Avaliar Usuários</TabsTrigger>
              <TabsTrigger value="top">Top Avaliados</TabsTrigger>
              <TabsTrigger value="myratings">Minhas Avaliações</TabsTrigger>
            </TabsList>

            <TabsContent value="rate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Buscar Usuários para Avaliar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUsers.map((user) => (
                        <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">
                                {user.first_name} {user.last_name}
                              </h3>
                              <Badge variant="outline">{user.user_type}</Badge>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="flex space-x-1">
                                {renderStars(user.averageRating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {user.averageRating.toFixed(1)} ({user.totalRatings})
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="w-full"
                            >
                              Avaliar
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedUser && (
                <RatingSystem
                  ratedUserId={selectedUser.id}
                  onRatingSubmitted={() => {
                    setSelectedUser(null);
                    fetchUsers();
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Top 10 Mais Bem Avaliados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topRatedUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {user.first_name} {user.last_name}
                            </h3>
                            <Badge variant="outline">{user.user_type}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {renderStars(user.averageRating)}
                            </div>
                            <span className="text-sm font-medium">
                              {user.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.totalRatings} avaliações
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="myratings" className="space-y-4">
              <RatingSystem
                ratedUserId={profile?.id || ''}
                onRatingSubmitted={() => fetchUsers()}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RatingsPage;

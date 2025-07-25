
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Trophy, Star, Award, Target, TrendingUp, Users, MessageSquare, BookOpen, Zap, Crown, Medal, Gift } from 'lucide-react';

const Gamification = () => {
  const [userLevel, setUserLevel] = useState(1);
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState(0);

  const { data: achievements = [] } = useSupabaseQuery({
    queryKey: ['user-achievements'],
    table: 'user_achievements',
    select: '*',
    filters: {}
  });

  const { data: leaderboard = [] } = useSupabaseQuery({
    queryKey: ['leaderboard'],
    table: 'profiles',
    select: '*',
    filters: {}
  });

  const badges = [
    {
      id: 'first_connection',
      name: 'Primeira Conexão',
      description: 'Fez sua primeira conexão na plataforma',
      icon: Users,
      color: 'bg-blue-500',
      earned: true
    },
    {
      id: 'mentor_master',
      name: 'Mentor Master',
      description: 'Completou 10 sessões de mentoria',
      icon: Award,
      color: 'bg-purple-500',
      earned: true
    },
    {
      id: 'knowledge_seeker',
      name: 'Buscador de Conhecimento',
      description: 'Baixou 25 recursos da biblioteca',
      icon: BookOpen,
      color: 'bg-green-500',
      earned: false
    },
    {
      id: 'forum_contributor',
      name: 'Contribuidor do Fórum',
      description: 'Fez 50 posts no fórum',
      icon: MessageSquare,
      color: 'bg-orange-500',
      earned: false
    },
    {
      id: 'regulatory_expert',
      name: 'Especialista Regulatório',
      description: 'Acessou alertas regulatórios 30 dias consecutivos',
      icon: Target,
      color: 'bg-red-500',
      earned: false
    },
    {
      id: 'network_builder',
      name: 'Construtor de Rede',
      description: 'Tem mais de 100 conexões',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      earned: false
    }
  ];

  const challenges = [
    {
      id: 'weekly_mentor',
      name: 'Mentor da Semana',
      description: 'Complete 3 sessões de mentoria esta semana',
      progress: 1,
      target: 3,
      reward: 500,
      expires: '2024-02-01'
    },
    {
      id: 'forum_activity',
      name: 'Atividade no Fórum',
      description: 'Faça 5 posts no fórum esta semana',
      progress: 2,
      target: 5,
      reward: 300,
      expires: '2024-02-01'
    },
    {
      id: 'knowledge_download',
      name: 'Explorador de Conhecimento',
      description: 'Baixe 10 recursos da biblioteca',
      progress: 7,
      target: 10,
      reward: 200,
      expires: '2024-01-31'
    },
    {
      id: 'regulatory_check',
      name: 'Atualização Regulatória',
      description: 'Acesse alertas regulatórios 7 dias consecutivos',
      progress: 4,
      target: 7,
      reward: 400,
      expires: '2024-01-30'
    }
  ];

  const levels = [
    { level: 1, name: 'Iniciante', minPoints: 0, maxPoints: 1000, color: 'bg-gray-400' },
    { level: 2, name: 'Aprendiz', minPoints: 1000, maxPoints: 2500, color: 'bg-green-400' },
    { level: 3, name: 'Competente', minPoints: 2500, maxPoints: 5000, color: 'bg-blue-400' },
    { level: 4, name: 'Proficiente', minPoints: 5000, maxPoints: 10000, color: 'bg-purple-400' },
    { level: 5, name: 'Especialista', minPoints: 10000, maxPoints: 20000, color: 'bg-orange-400' },
    { level: 6, name: 'Mestre', minPoints: 20000, maxPoints: 50000, color: 'bg-red-400' },
    { level: 7, name: 'Guru', minPoints: 50000, maxPoints: 100000, color: 'bg-yellow-400' },
    { level: 8, name: 'Lenda', minPoints: 100000, maxPoints: Infinity, color: 'bg-gradient-to-r from-purple-400 to-pink-400' }
  ];

  const mockLeaderboard = [
    { id: 1, name: 'Dr. Maria Silva', points: 15400, level: 5, avatar: 'MS' },
    { id: 2, name: 'João Santos', points: 12800, level: 4, avatar: 'JS' },
    { id: 3, name: 'Ana Costa', points: 11200, level: 4, avatar: 'AC' },
    { id: 4, name: 'Carlos Mendes', points: 9600, level: 3, avatar: 'CM' },
    { id: 5, name: 'Lucia Oliveira', points: 8900, level: 3, avatar: 'LO' },
    { id: 6, name: 'Pedro Rocha', points: 7500, level: 3, avatar: 'PR' },
    { id: 7, name: 'Fernanda Lima', points: 6200, level: 2, avatar: 'FL' },
    { id: 8, name: 'Roberto Alves', points: 5800, level: 2, avatar: 'RA' },
    { id: 9, name: 'Você', points: 4650, level: 2, avatar: 'VC' },
    { id: 10, name: 'Mariana Ferreira', points: 4100, level: 2, avatar: 'MF' }
  ];

  useEffect(() => {
    // Simular dados do usuário
    const currentUserPoints = 4650;
    const currentUserRank = 9;
    
    setUserPoints(currentUserPoints);
    setUserRank(currentUserRank);
    
    // Calcular nível baseado nos pontos
    const currentLevel = levels.find(level => 
      currentUserPoints >= level.minPoints && currentUserPoints < level.maxPoints
    );
    
    if (currentLevel) {
      setUserLevel(currentLevel.level);
    }
  }, []);

  const getCurrentLevel = () => {
    return levels.find(level => level.level === userLevel);
  };

  const getNextLevel = () => {
    return levels.find(level => level.level === userLevel + 1);
  };

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevel();
    const currentLevel = getCurrentLevel();
    
    if (!nextLevel || !currentLevel) return 100;
    
    const progress = ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-orange-600" />;
      default: return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Sistema de Gamificação</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso e conquistas na plataforma</p>
      </div>

      {/* Status do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Seu Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Pontos Totais</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">#{userRank}</div>
              <div className="text-sm text-muted-foreground">Ranking</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{userLevel}</div>
              <div className="text-sm text-muted-foreground">Nível</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{badges.filter(b => b.earned).length}</div>
              <div className="text-sm text-muted-foreground">Conquistas</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso para o próximo nível</span>
              <span className="text-sm text-muted-foreground">
                {getCurrentLevel()?.name} → {getNextLevel()?.name}
              </span>
            </div>
            <Progress value={getProgressToNextLevel()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{userPoints.toLocaleString()} pontos</span>
              <span>{getNextLevel()?.minPoints.toLocaleString()} pontos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="badges">Conquistas</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          <TabsTrigger value="levels">Níveis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{challenge.name}</span>
                    <Badge variant="outline">
                      <Gift className="mr-1 h-3 w-3" />
                      {challenge.reward} pts
                    </Badge>
                  </CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{challenge.progress}/{challenge.target}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Expira em: {new Date(challenge.expires).toLocaleDateString('pt-BR')}</span>
                      <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <Card key={badge.id} className={`${badge.earned ? 'border-green-200 bg-green-50' : 'opacity-50'}`}>
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    {badge.earned ? (
                      <Badge variant="default" className="bg-green-500">
                        <Award className="mr-1 h-3 w-3" />
                        Conquistado
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Target className="mr-1 h-3 w-3" />
                        Não conquistado
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Global</CardTitle>
              <CardDescription>Os usuários mais ativos da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaderboard.map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-3 rounded-lg ${user.name === 'Você' ? 'bg-blue-50 border-blue-200 border' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(index + 1)}
                        <span className="font-semibold">#{index + 1}</span>
                      </div>
                      <Avatar>
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Nível {user.level}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{user.points.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">pontos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="levels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levels.map((level) => (
              <Card key={level.level} className={`${level.level === userLevel ? 'border-blue-200 bg-blue-50' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Nível {level.level}: {level.name}</span>
                    {level.level === userLevel && (
                      <Badge variant="default">
                        <Zap className="mr-1 h-3 w-3" />
                        Atual
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pontos necessários</span>
                      <span>
                        {level.minPoints.toLocaleString()} - {level.maxPoints === Infinity ? '∞' : level.maxPoints.toLocaleString()}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${level.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gamification;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Edit3, 
  Shield, 
  Mail, 
  Phone,
  Building2,
  FlaskConical,
  GraduationCap,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type: 'company' | 'laboratory' | 'consultant' | 'individual' | 'admin';
  phone?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  subscription_status?: string;
  compliance_score?: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with mock data for demonstration
      const enrichedUsers = data?.map(user => ({
        ...user,
        status: (Math.random() > 0.1 ? 'active' : 'inactive') as 'active' | 'inactive' | 'suspended' | 'pending',
        last_login: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        subscription_status: Math.random() > 0.3 ? 'premium' : 'free',
        compliance_score: Math.floor(Math.random() * 40) + 60,
        user_type: user.user_type as 'company' | 'laboratory' | 'consultant' | 'individual' | 'admin'
      })) || [];

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = userTypeFilter === 'all' || user.user_type === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'laboratory':
        return <FlaskConical className="h-4 w-4" />;
      case 'consultant':
        return <GraduationCap className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, text: 'Ativo' },
      inactive: { variant: 'secondary' as const, icon: Clock, text: 'Inativo' },
      suspended: { variant: 'destructive' as const, icon: Ban, text: 'Suspenso' },
      pending: { variant: 'outline' as const, icon: Clock, text: 'Pendente' }
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'delete') => {
    try {
      // In a real app, this would call the appropriate API
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : user.status }
          : user
      ));

      if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== userId));
      }

      toast({
        title: "Sucesso",
        description: `Usuário ${action === 'activate' ? 'ativado' : action === 'suspend' ? 'suspenso' : 'removido'} com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível executar a ação",
        variant: "destructive"
      });
    }
  };

  const getStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      companies: users.filter(u => u.user_type === 'company').length,
      laboratories: users.filter(u => u.user_type === 'laboratory').length,
      consultants: users.filter(u => u.user_type === 'consultant').length,
      premium: users.filter(u => u.subscription_status === 'premium').length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Ativos</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Empresas</p>
                <p className="text-2xl font-bold">{stats.companies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Labs</p>
                <p className="text-2xl font-bold">{stats.laboratories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-sm font-medium">Consultores</p>
                <p className="text-2xl font-bold">{stats.consultants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Premium</p>
                <p className="text-2xl font-bold">{stats.premium}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie usuários, permissões e status da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email, nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="company">Empresas</SelectItem>
                <SelectItem value="laboratory">Laboratórios</SelectItem>
                <SelectItem value="consultant">Consultores</SelectItem>
                <SelectItem value="individual">Individuais</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="suspended">Suspensos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon(user.user_type)}
                      <div>
                        <p className="font-medium">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4">
                      <Badge variant="outline">{user.user_type}</Badge>
                      {getStatusBadge(user.status)}
                      {user.subscription_status === 'premium' && (
                        <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.status === 'suspended' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, 'activate')}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Ativar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, 'suspend')}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Suspender
                      </Button>
                    )}

                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuário</DialogTitle>
                          <DialogDescription>
                            Modificar informações do usuário {selectedUser?.email}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="first_name">Nome</Label>
                              <Input 
                                id="first_name" 
                                defaultValue={selectedUser?.first_name}
                              />
                            </div>
                            <div>
                              <Label htmlFor="last_name">Sobrenome</Label>
                              <Input 
                                id="last_name" 
                                defaultValue={selectedUser?.last_name}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email"
                              defaultValue={selectedUser?.email}
                            />
                          </div>

                          <div>
                            <Label htmlFor="user_type">Tipo de Usuário</Label>
                            <Select defaultValue={selectedUser?.user_type}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="company">Empresa</SelectItem>
                                <SelectItem value="laboratory">Laboratório</SelectItem>
                                <SelectItem value="consultant">Consultor</SelectItem>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setEditDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={() => setEditDialogOpen(false)}>
                              Salvar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Mobile view details */}
                <div className="md:hidden mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{user.user_type}</Badge>
                  {getStatusBadge(user.status)}
                  {user.subscription_status === 'premium' && (
                    <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhum usuário encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
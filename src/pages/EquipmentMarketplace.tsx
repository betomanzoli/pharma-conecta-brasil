
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Plus, 
  Search, 
  MapPin, 
  DollarSign, 
  MessageSquare,
  Star,
  Filter,
  Camera,
  Calendar
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Equipment {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  specifications: any;
  status: string;
  seller_id: string;
  created_at: string;
}

interface Quote {
  id: string;
  listing_id: string;
  buyer_id: string;
  quoted_price: number;
  message: string;
  status: string;
  created_at: string;
}

const EquipmentMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    priceRange: 'all',
    location: ''
  });

  useEffect(() => {
    loadEquipment();
    if (user) loadQuotes();
  }, [user]);

  const loadEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  const loadQuotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('equipment_quotes')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    }
  };

  const handleAddEquipment = async (formData: FormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const equipmentData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        condition: formData.get('condition') as string,
        price: parseFloat(formData.get('price') as string),
        location: formData.get('location') as string,
        specifications: JSON.parse((formData.get('specifications') as string) || '{}'),
        seller_id: user.id
      };

      const { error } = await supabase
        .from('equipment_listings')
        .insert(equipmentData);

      if (error) throw error;

      toast({
        title: "Equipamento adicionado!",
        description: "Seu equipamento foi listado com sucesso.",
      });

      loadEquipment();
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o equipamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSubmit = async (formData: FormData, listingId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const quoteData = {
        listing_id: listingId,
        buyer_id: user.id,
        quoted_price: parseFloat(formData.get('quoted_price') as string),
        message: formData.get('message') as string
      };

      const { error } = await supabase
        .from('equipment_quotes')
        .insert(quoteData);

      if (error) throw error;

      toast({
        title: "Proposta enviada!",
        description: "Sua proposta foi enviada ao vendedor.",
      });

      loadQuotes();
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a proposta.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.condition !== 'all' && item.condition !== filters.condition) return false;
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'laboratory', label: 'Equipamentos de Laboratório' },
    { value: 'analytical', label: 'Equipamentos Analíticos' },
    { value: 'pharmaceutical', label: 'Equipamentos Farmacêuticos' },
    { value: 'biotechnology', label: 'Biotecnologia' },
    { value: 'quality_control', label: 'Controle de Qualidade' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace de Equipamentos</h1>
              <p className="text-muted-foreground">
                Compre e venda equipamentos farmacêuticos e laboratoriais
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Vender Equipamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Equipamento</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddEquipment(formData);
                }}>
                  <div className="space-y-4">
                    <Input name="title" placeholder="Título do equipamento" required />
                    <Textarea name="description" placeholder="Descrição detalhada" required />
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select name="condition" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Condição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="excellent">Excelente</SelectItem>
                        <SelectItem value="good">Bom</SelectItem>
                        <SelectItem value="fair">Regular</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input name="price" type="number" placeholder="Preço (R$)" required />
                    <Input name="location" placeholder="Localização" required />
                    <Textarea name="specifications" placeholder="Especificações técnicas (JSON)" />
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adicionando...' : 'Adicionar Equipamento'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.category} onValueChange={(value) => 
                  setFilters(prev => ({...prev, category: value}))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filters.condition} onValueChange={(value) => 
                  setFilters(prev => ({...prev, condition: value}))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Condições</SelectItem>
                    <SelectItem value="new">Novo</SelectItem>
                    <SelectItem value="excellent">Excelente</SelectItem>
                    <SelectItem value="good">Bom</SelectItem>
                    <SelectItem value="fair">Regular</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input 
                  placeholder="Localização"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                />
                
                <Button variant="outline" onClick={() => setFilters({
                  category: 'all',
                  condition: 'all',
                  priceRange: 'all',
                  location: ''
                })}>
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Badge variant={item.condition === 'new' ? 'default' : 'secondary'}>
                      {item.condition}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      R$ {item.price.toLocaleString()}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Fazer Proposta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Fazer Proposta</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          handleQuoteSubmit(formData, item.id);
                        }}>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Equipamento:</label>
                              <p className="text-sm text-muted-foreground">{item.title}</p>
                            </div>
                            <Input 
                              name="quoted_price" 
                              type="number" 
                              placeholder="Sua proposta (R$)" 
                              required 
                            />
                            <Textarea 
                              name="message" 
                              placeholder="Mensagem para o vendedor (opcional)" 
                            />
                            <Button type="submit" disabled={loading} className="w-full">
                              {loading ? 'Enviando...' : 'Enviar Proposta'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhum equipamento encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou seja o primeiro a listar um equipamento!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EquipmentMarketplace;

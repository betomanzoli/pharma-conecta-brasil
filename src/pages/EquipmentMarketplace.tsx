
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, MessageSquare, Star, MapPin, Calendar, Package, Zap, Settings, Microscope, FlaskConical, Beaker } from 'lucide-react';

const EquipmentMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const { toast } = useToast();

  const { data: listings = [] } = useSupabaseQuery({
    queryKey: ['equipment-listings'],
    table: 'equipment_listings',
    select: '*',
    filters: {}
  });

  const { data: quotes = [] } = useSupabaseQuery({
    queryKey: ['equipment-quotes'],
    table: 'equipment_quotes',
    select: '*',
    filters: {}
  });

  const categories = [
    { id: 'all', name: 'Todos', icon: Package },
    { id: 'analytical', name: 'Equipamentos Analíticos', icon: Microscope },
    { id: 'production', name: 'Equipamentos de Produção', icon: Settings },
    { id: 'laboratory', name: 'Equipamentos de Laboratório', icon: FlaskConical },
    { id: 'quality', name: 'Controle de Qualidade', icon: Beaker },
    { id: 'packaging', name: 'Embalagem', icon: Package },
    { id: 'maintenance', name: 'Manutenção', icon: Zap }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateListing = async (formData: FormData) => {
    try {
      const { data, error } = await supabase
        .from('equipment_listings')
        .insert([{
          title: formData.get('title'),
          description: formData.get('description'),
          category: formData.get('category'),
          condition: formData.get('condition'),
          price: parseFloat(formData.get('price') as string),
          location: formData.get('location'),
          specifications: JSON.parse(formData.get('specifications') as string || '{}'),
          seller_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Equipamento listado com sucesso!",
        description: "Seu equipamento foi adicionado ao marketplace.",
      });

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar listagem:', error);
      toast({
        title: "Erro ao criar listagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitQuote = async (formData: FormData) => {
    try {
      const { data, error } = await supabase
        .from('equipment_quotes')
        .insert([{
          listing_id: selectedListing?.id,
          buyer_id: (await supabase.auth.getUser()).data.user?.id,
          quoted_price: parseFloat(formData.get('price') as string),
          message: formData.get('message')
        }]);

      if (error) throw error;

      toast({
        title: "Cotação enviada com sucesso!",
        description: "O vendedor receberá sua proposta.",
      });

      setIsQuoteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao enviar cotação:', error);
      toast({
        title: "Erro ao enviar cotação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-500';
      case 'excellent': return 'bg-blue-500';
      case 'good': return 'bg-yellow-500';
      case 'fair': return 'bg-orange-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return 'Novo';
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'fair': return 'Regular';
      case 'poor': return 'Ruim';
      default: return 'Não especificado';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace de Equipamentos</h1>
          <p className="text-muted-foreground">Compre e venda equipamentos farmacêuticos</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Listar Equipamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Listar Novo Equipamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateListing(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat.id !== 'all').map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" required />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="condition">Condição</Label>
                  <Select name="condition" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Condição" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Novo</SelectItem>
                      <SelectItem value="excellent">Excelente</SelectItem>
                      <SelectItem value="good">Bom</SelectItem>
                      <SelectItem value="fair">Regular</SelectItem>
                      <SelectItem value="poor">Ruim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input id="price" name="price" type="number" step="0.01" required />
                </div>
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input id="location" name="location" required />
                </div>
              </div>
              
              <div>
                <Label htmlFor="specifications">Especificações Técnicas (JSON)</Label>
                <Textarea 
                  id="specifications" 
                  name="specifications" 
                  placeholder='{"modelo": "XYZ-123", "ano": 2020, "voltagem": "220V"}'
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Listagem</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList>
          <TabsTrigger value="listings">Listagens ({filteredListings.length})</TabsTrigger>
          <TabsTrigger value="quotes">Minhas Cotações ({quotes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {listing.description}
                      </CardDescription>
                    </div>
                    <Badge className={`${getConditionColor(listing.condition)} text-white`}>
                      {getConditionText(listing.condition)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {listing.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <Badge variant="outline">{listing.category}</Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {listing.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(listing.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          setSelectedListing(listing);
                          setIsQuoteDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Cotar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="quotes" className="space-y-4">
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Cotação para: {quote.listing?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Valor proposto: R$ {quote.quoted_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>
                      {quote.status === 'pending' ? 'Pendente' : 'Aceito'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Cotação</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmitQuote(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div>
              <Label htmlFor="price">Preço Proposto (R$)</Label>
              <Input id="price" name="price" type="number" step="0.01" required />
            </div>
            
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" name="message" placeholder="Inclua detalhes sobre sua proposta..." />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Cotação</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentMarketplace;

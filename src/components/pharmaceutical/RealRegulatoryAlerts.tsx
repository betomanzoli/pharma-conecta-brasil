
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Shield,
  Calendar,
  FileText
} from 'lucide-react';
import { brazilianRegulatoryService, ANVISAAlert } from '@/services/brazilianRegulatoryService';
import { useToast } from '@/hooks/use-toast';

const RealRegulatoryAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ANVISAAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCachedAlerts();
  }, []);

  const loadCachedAlerts = async () => {
    try {
      setLoading(true);
      const cachedAlerts = await brazilianRegulatoryService.getCachedAlerts();
      setAlerts(cachedAlerts);
      setError(null);
    } catch (error) {
      console.error('Error loading cached alerts:', error);
      setError('Erro ao carregar alertas salvos');
    } finally {
      setLoading(false);
    }
  };

  const searchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newAlerts = await brazilianRegulatoryService.getANVISAAlerts(
        searchQuery || 'medicamentos farmacêuticos'
      );
      
      setAlerts(newAlerts);
      
      toast({
        title: "Alertas atualizados",
        description: `${newAlerts.length} alertas encontrados da ANVISA`,
      });
    } catch (error) {
      console.error('Error searching alerts:', error);
      setError('Erro ao buscar novos alertas. Tente novamente.');
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar novos alertas da ANVISA",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchAlerts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Alertas Regulatórios ANVISA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Buscar alertas específicos (ex: antibióticos, vacinas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {alerts.length} alertas encontrados
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadCachedAlerts}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading && alerts.length === 0 ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Nenhum alerta encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Faça uma busca para encontrar alertas regulatórios da ANVISA
              </p>
              <Button onClick={searchAlerts} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar Alertas
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={brazilianRegulatoryService.getSeverityColor(alert.severity) as any}
                      className="text-xs"
                    >
                      {brazilianRegulatoryService.getSeverityLabel(alert.severity)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alert.alert_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(alert.published_at)}
                  </div>
                </div>

                <h3 className="font-medium mb-2 leading-tight">
                  {alert.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {alert.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Fonte: {alert.source}
                  </span>
                  
                  {alert.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(alert.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver Original
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Os alertas são obtidos através de busca inteligente nos dados oficiais da ANVISA. 
                Sempre consulte o site oficial para informações mais detalhadas.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealRegulatoryAlerts;

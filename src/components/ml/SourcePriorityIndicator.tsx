
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export interface PrioritizedResult {
  id: string;
  source_id: string;
  source_name: string;
  source_type: string;
  priority_score: number;
  confidence_level: number;
  metadata: {
    relevance_score: number;
    freshness_score: number;
    quality_score: number;
    [key: string]: any;
  };
  reasoning: string;
  estimated_response_time: number;
}

interface SourcePriorityIndicatorProps {
  source: PrioritizedResult;
  showDetails?: boolean;
}

const SourcePriorityIndicator: React.FC<SourcePriorityIndicatorProps> = ({
  source,
  showDetails = false
}) => {
  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-blue-600 bg-blue-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 0.8) return 'Muito Alta';
    if (score >= 0.6) return 'Alta';
    if (score >= 0.4) return 'Média';
    return 'Baixa';
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'database':
        return <CheckCircle className="w-4 h-4" />;
      case 'api':
        return <TrendingUp className="w-4 h-4" />;
      case 'file':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <TrendingDown className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getSourceTypeIcon(source.source_type)}
            {source.source_name}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={getPriorityColor(source.priority_score)}
          >
            {getPriorityLabel(source.priority_score)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Score de Prioridade</span>
          <span className="font-medium">
            {(source.priority_score * 100).toFixed(1)}%
          </span>
        </div>
        
        <Progress 
          value={source.priority_score * 100} 
          className="h-2"
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Confiança</span>
          <span>{(source.confidence_level * 100).toFixed(1)}%</span>
        </div>

        {showDetails && source.metadata && (
          <div className="space-y-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Relevância:</span>
                <span className="font-medium">
                  {source.metadata.relevance_score ? (source.metadata.relevance_score * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Atualidade:</span>
                <span className="font-medium">
                  {source.metadata.freshness_score ? (source.metadata.freshness_score * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
            
            <div className="text-xs">
              <div className="flex justify-between">
                <span>Qualidade:</span>
                <span className="font-medium">
                  {source.metadata.quality_score ? (source.metadata.quality_score * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <span>Tempo estimado: </span>
              <span className="font-medium">
                {source.estimated_response_time}ms
              </span>
            </div>
          </div>
        )}

        {source.reasoning && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p className="italic">{source.reasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SourcePriorityIndicator;

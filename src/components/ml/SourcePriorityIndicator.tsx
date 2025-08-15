
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { PrioritizedResult } from '@/services/mlPrioritizationService';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Shield, 
  Star,
  Brain
} from 'lucide-react';

interface SourcePriorityIndicatorProps {
  prioritizedResult: PrioritizedResult;
  compact?: boolean;
  showReasoning?: boolean;
}

const SourcePriorityIndicator: React.FC<SourcePriorityIndicatorProps> = ({
  prioritizedResult,
  compact = false,
  showReasoning = true
}) => {
  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityLevel = (score: number) => {
    if (score >= 80) return 'Alta';
    if (score >= 60) return 'Média';
    if (score >= 40) return 'Baixa';
    return 'Muito Baixa';
  };

  const getScoreIcon = (metric: string) => {
    const icons: Record<string, any> = {
      accuracy: Target,
      relevance: Brain,
      freshness: Clock,
      reliability: Shield,
      user_feedback: Star
    };
    return icons[metric] || TrendingUp;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(prioritizedResult.priority_score)}`} />
        <Badge variant="outline" className="text-xs">
          {getPriorityLevel(prioritizedResult.priority_score)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {prioritizedResult.priority_score.toFixed(1)}
        </span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${getPriorityColor(prioritizedResult.priority_score)}`} />
              <span className="font-semibold text-sm">
                {prioritizedResult.source_type.toUpperCase()}
              </span>
            </div>
            <Badge className={`${getPriorityColor(prioritizedResult.priority_score)} text-white`}>
              {getPriorityLevel(prioritizedResult.priority_score)}
            </Badge>
          </div>

          {/* Priority Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Score de Prioridade</span>
              <span className="text-sm text-muted-foreground">
                {prioritizedResult.priority_score.toFixed(1)}/100
              </span>
            </div>
            <Progress 
              value={prioritizedResult.priority_score} 
              className="h-2"
            />
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confiança</span>
              <span className="text-sm text-muted-foreground">
                {prioritizedResult.confidence.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={prioritizedResult.confidence} 
              className="h-2"
            />
          </div>

          {/* Individual Scores */}
          {prioritizedResult.metadata?.individual_scores && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Métricas Individuais</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(prioritizedResult.metadata.individual_scores).map(([metric, score]) => {
                  const IconComponent = getScoreIcon(metric);
                  return (
                    <div key={metric} className="flex items-center space-x-2">
                      <IconComponent className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {metric.replace('_', ' ')}:
                      </span>
                      <span className="text-xs font-medium">
                        {Math.round(score as number)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reasoning */}
          {showReasoning && prioritizedResult.reasoning.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Justificativa</h4>
              <div className="space-y-1">
                {prioritizedResult.reasoning.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Metadata */}
          {prioritizedResult.metadata?.metrics_snapshot && (
            <div className="pt-2 border-t">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium">
                    {Math.round(prioritizedResult.metadata.metrics_snapshot.accuracy)}%
                  </div>
                  <div className="text-muted-foreground">Precisão</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {prioritizedResult.metadata.metrics_snapshot.response_time}ms
                  </div>
                  <div className="text-muted-foreground">Resposta</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {Math.round(prioritizedResult.metadata.metrics_snapshot.success_rate)}%
                  </div>
                  <div className="text-muted-foreground">Sucesso</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcePriorityIndicator;

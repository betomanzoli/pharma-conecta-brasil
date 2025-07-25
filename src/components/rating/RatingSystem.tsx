
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Rating {
  id: string;
  rater_id: string;
  rated_id: string;
  project_request_id?: string;
  rating: number;
  review: string;
  created_at: string;
  rater?: {
    first_name: string;
    last_name: string;
  };
  rated?: {
    first_name: string;
    last_name: string;
  };
}

interface RatingSystemProps {
  ratedUserId: string;
  projectRequestId?: string;
  onRatingSubmitted?: () => void;
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  ratedUserId,
  projectRequestId,
  onRatingSubmitted
}) => {
  const { profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState<Rating | null>(null);
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id && ratedUserId) {
      fetchExistingRating();
      fetchUserRatings();
    }
  }, [profile?.id, ratedUserId]);

  const fetchExistingRating = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('rater_id', profile?.id)
        .eq('rated_id', ratedUserId)
        .eq('project_request_id', projectRequestId || null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setExistingRating(data);
        setRating(data.rating);
        setReview(data.review || '');
      }
    } catch (error) {
      console.error('Erro ao buscar avaliação existente:', error);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          rater:profiles!ratings_rater_id_fkey(first_name, last_name)
        `)
        .eq('rated_id', ratedUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setUserRatings(data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!rating || !profile?.id) return;

    setSubmitting(true);
    try {
      const ratingData = {
        rater_id: profile.id,
        rated_id: ratedUserId,
        project_request_id: projectRequestId,
        rating,
        review: review.trim()
      };

      if (existingRating) {
        const { error } = await supabase
          .from('ratings')
          .update(ratingData)
          .eq('id', existingRating.id);

        if (error) throw error;
        toast.success('Avaliação atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('ratings')
          .insert(ratingData);

        if (error) throw error;
        toast.success('Avaliação enviada com sucesso!');
      }

      fetchExistingRating();
      fetchUserRatings();
      onRatingSubmitted?.();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          index < currentRating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  const getAverageRating = () => {
    if (userRatings.length === 0) return 0;
    return userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário de Avaliação */}
      {profile?.id !== ratedUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>
                {existingRating ? 'Atualizar Avaliação' : 'Deixar Avaliação'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Classificação
              </label>
              <div className="flex space-x-1">
                {renderStars(rating, true)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Comentário (opcional)
              </label>
              <Textarea
                placeholder="Compartilhe sua experiência..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={submitRating}
              disabled={!rating || submitting}
              className="w-full"
            >
              {submitting ? 'Enviando...' : 
               existingRating ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resumo das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Avaliações</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(Math.round(getAverageRating()))}
              </div>
              <span className="text-sm text-muted-foreground">
                {getAverageRating().toFixed(1)} ({userRatings.length} avaliações)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userRatings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma avaliação ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userRatings.map((userRating) => (
                <div key={userRating.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {userRating.rater?.first_name} {userRating.rater?.last_name}
                      </span>
                      <Badge variant="secondary">
                        {userRating.rating} ⭐
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(userRating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-1 mb-2">
                    {renderStars(userRating.rating)}
                  </div>
                  {userRating.review && (
                    <p className="text-sm text-gray-600">{userRating.review}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingSystem;

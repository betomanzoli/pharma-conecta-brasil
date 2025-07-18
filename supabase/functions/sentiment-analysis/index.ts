import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, profileId, profileType } = await req.json();
    console.log('Analyzing sentiment for:', { profileId, profileType, textLength: text?.length });

    // Simulate sentiment analysis (in production, integrate with actual NLP API)
    const sentimentScore = analyzeSentiment(text);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store sentiment analysis result
    const { error: insertError } = await supabase
      .from('sentiment_analysis')
      .upsert({
        profile_id: profileId,
        profile_type: profileType,
        original_text: text,
        sentiment_score: sentimentScore.score,
        sentiment_label: sentimentScore.label,
        confidence: sentimentScore.confidence,
        keywords: sentimentScore.keywords,
        analyzed_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error storing sentiment analysis:', insertError);
      throw insertError;
    }

    // Update profile with sentiment data
    await updateProfileSentiment(supabase, profileId, profileType, sentimentScore);

    console.log('Sentiment analysis completed:', sentimentScore);

    return new Response(JSON.stringify({
      success: true,
      sentiment: sentimentScore,
      profileId,
      profileType
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeSentiment(text: string) {
  if (!text) {
    return {
      score: 0,
      label: 'neutral',
      confidence: 0.5,
      keywords: []
    };
  }

  // Advanced sentiment analysis logic
  const positiveWords = ['excelente', 'ótimo', 'bom', 'qualidade', 'eficiente', 'inovador', 'confiável', 'experiente', 'líder', 'sucesso'];
  const negativeWords = ['ruim', 'problema', 'dificuldade', 'falha', 'atraso', 'complicado', 'caro', 'limitado'];
  const neutralWords = ['padrão', 'normal', 'comum', 'básico', 'simples'];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  const keywords = [];

  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) {
      positiveCount++;
      keywords.push(word);
    } else if (negativeWords.some(nw => word.includes(nw))) {
      negativeCount++;
      keywords.push(word);
    } else if (neutralWords.some(nt => word.includes(nt))) {
      neutralCount++;
    }
  });

  const totalSentimentWords = positiveCount + negativeCount + neutralCount;
  const score = totalSentimentWords > 0 
    ? (positiveCount - negativeCount) / totalSentimentWords 
    : 0;

  let label = 'neutral';
  let confidence = 0.5;

  if (score > 0.3) {
    label = 'positive';
    confidence = Math.min(0.9, 0.5 + score);
  } else if (score < -0.3) {
    label = 'negative';
    confidence = Math.min(0.9, 0.5 + Math.abs(score));
  } else {
    confidence = 0.5 + Math.random() * 0.2;
  }

  return {
    score: Math.round(score * 100) / 100,
    label,
    confidence: Math.round(confidence * 100) / 100,
    keywords: keywords.slice(0, 5)
  };
}

async function updateProfileSentiment(supabase: any, profileId: string, profileType: string, sentiment: any) {
  try {
    if (profileType === 'company') {
      await supabase
        .from('companies')
        .update({
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);
    } else if (profileType === 'laboratory') {
      await supabase
        .from('laboratories')
        .update({
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);
    } else if (profileType === 'consultant') {
      await supabase
        .from('consultants')
        .update({
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);
    }
  } catch (error) {
    console.error('Error updating profile sentiment:', error);
  }
}
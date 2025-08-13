
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Releitura por requisição para evitar "demo mode" em caso de segredo atualizado
  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return new Response(JSON.stringify({ error: "not_authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, message, thread_id, user_id, title } = body;

    switch (action) {
      case 'init_thread': {
        // Criar nova thread de chat
        const { data: thread, error } = await supabase
          .from('ai_chat_threads')
          .insert({
            user_id: auth.user.id,
            title: title || 'Nova Conversa Master AI'
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ thread_id: thread.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case 'list_threads': {
        // Listar threads do usuário
        const { data: threads, error } = await supabase
          .from('ai_chat_threads')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('updated_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        return new Response(JSON.stringify({ threads }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case 'get_messages': {
        // Buscar mensagens de uma thread
        const { data: messages, error } = await supabase
          .from('ai_chat_messages')
          .select('*')
          .eq('thread_id', thread_id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return new Response(JSON.stringify({ messages }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case 'chat': {
        // Processar mensagem de chat
        console.log('Processing chat with PERPLEXITY_API_KEY available:', !!PERPLEXITY_API_KEY);
        
        // Salvar mensagem do usuário
        const { error: userMsgError } = await supabase
          .from('ai_chat_messages')
          .insert({
            thread_id,
            user_id: auth.user.id,
            role: 'user',
            content: message
          });

        if (userMsgError) throw userMsgError;

        // Contagem total de mensagens da thread
        const { count: totalCount } = await supabase
          .from('ai_chat_messages')
          .select('id', { count: 'exact', head: true })
          .eq('thread_id', thread_id);

        let didSummarize = false;

        // Verificar se já existe um resumo recente
        const { data: lastSummary } = await supabase
          .from('ai_chat_messages')
          .select('*')
          .eq('thread_id', thread_id)
          .contains('metadata', { type: 'summary' })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const SUMMARIZE_THRESHOLD = 40;

        // Criar um resumo quando a conversa fica muito longa e ainda não há resumo
        if ((totalCount || 0) > SUMMARIZE_THRESHOLD && !lastSummary) {
          const { data: oldMessages } = await supabase
            .from('ai_chat_messages')
            .select('role, content, created_at, id')
            .eq('thread_id', thread_id)
            .order('created_at', { ascending: true })
            .limit(30);

          let summaryText = '';
          const toSummarize = oldMessages?.map(m => `${m.role}: ${m.content}`).join('\n') || '';

          if (PERPLEXITY_API_KEY) {
            try {
              const summarizeResp = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.1-sonar-small-128k-online',
                  messages: [
                    { role: 'system', content: 'Você é um assistente que gera resumos curtos, objetivos e contextuais em português.' },
                    { role: 'user', content: `Resuma a conversa abaixo mantendo intenções, decisões e pendências em até 12 linhas.\n\n${toSummarize}` }
                  ],
                  max_tokens: 400,
                  temperature: 0.3,
                }),
              });

              if (summarizeResp.ok) {
                const sdata = await summarizeResp.json();
                summaryText = sdata.choices?.[0]?.message?.content || '';
              } else {
                const errorText = await summarizeResp.text();
                console.error('Perplexity summarize error:', errorText);
                summaryText = '';
              }
            } catch (err) {
              console.error('Perplexity summarize fetch failed:', err);
              summaryText = '';
            }
          }

          if (!summaryText) {
            summaryText = 'Resumo automático indisponível no momento. Continuaremos com o contexto recente.';
          }

          const { error: insertSummaryError } = await supabase
            .from('ai_chat_messages')
            .insert({
              thread_id,
              user_id: auth.user.id,
              role: 'system',
              content: `Resumo da conversa até aqui:\n${summaryText}`,
              metadata: { type: 'summary', summarized_count: oldMessages?.length || 0, created_at: new Date().toISOString() }
            });

          if (!insertSummaryError) didSummarize = true;
        }

        // Buscar contexto da conversa: incluir resumo (se existir) + últimas mensagens
        const CONTEXT_LIMIT = 12;

        const { data: recentMessages } = await supabase
          .from('ai_chat_messages')
          .select('role, content')
          .eq('thread_id', thread_id)
          .order('created_at', { ascending: false })
          .limit(CONTEXT_LIMIT);

        const { data: summaryMessage } = await supabase
          .from('ai_chat_messages')
          .select('content')
          .eq('thread_id', thread_id)
          .contains('metadata', { type: 'summary' })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const conversationContext = [
          summaryMessage?.content ? `system: ${summaryMessage.content}` : '',
          ...(recentMessages?.reverse()?.map((msg: any) => `${msg.role}: ${msg.content}`) || [])
        ].filter(Boolean).join('\n');

        const systemPrompt = `Você é um assistente AI especializado no setor farmacêutico brasileiro. 
Seu conhecimento abrange:
- Regulamentações da ANVISA, FDA e EMA
- Processos de registro de medicamentos
- Boas práticas de fabricação (GMP)
- Análise de mercado farmacêutico
- Desenvolvimento de produtos farmacêuticos
- Compliance regulatório
- Parcerias estratégicas no setor

Responda de forma técnica mas acessível, sempre considerando as especificidades do mercado brasileiro.
Se não souber algo específico, seja honesto e sugira onde o usuário pode buscar mais informações.

Contexto da conversa:
${conversationContext}

Responda à seguinte mensagem:`;

        let assistantResponse = "";

        if (PERPLEXITY_API_KEY) {
          // Usar Perplexity API com modelo correto
          try {
            console.log('Attempting Perplexity API call...');
            const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "llama-3.1-sonar-small-128k-online",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7,
              }),
            });

            console.log('Perplexity response status:', perplexityResponse.status);

            if (perplexityResponse.ok) {
              const data = await perplexityResponse.json();
              assistantResponse = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
              console.log('Perplexity response received successfully');
            } else {
              const errText = await perplexityResponse.text();
              console.error("Perplexity API error:", errText);
              
              // Verificar se é erro de modelo e tentar com modelo diferente
              if (errText.includes('invalid_model') || errText.includes('model')) {
                console.log('Trying with alternative model...');
                const retryResponse = await fetch("https://api.perplexity.ai/chat/completions", {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    model: "llama-3.1-sonar-large-128k-online",
                    messages: [
                      { role: "system", content: systemPrompt },
                      { role: "user", content: message }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                  }),
                });

                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  assistantResponse = retryData.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
                  console.log('Alternative model worked successfully');
                } else {
                  throw new Error('Both models failed');
                }
              } else {
                throw new Error(`API Error: ${errText}`);
              }
            }
          } catch (err) {
            console.error("Perplexity fetch failed:", err);
            assistantResponse = `Sobre "${message}":\n\nSou seu assistente AI farmacêutico especializado. Posso orientá-lo sobre regulamentações (ANVISA/FDA/EMA), desenvolvimento de produtos, registro de medicamentos e estratégias de compliance.\n\nComo posso ajudá-lo especificamente hoje?`;
          }
        } else {
          console.log('No PERPLEXITY_API_KEY found, using fallback');
          assistantResponse = `Olá! Sobre "${message}":\n\nSou seu assistente AI farmacêutico especializado. Posso ajudá-lo com:\n\n• Análises regulatórias (ANVISA, FDA, EMA)\n• Desenvolvimento de produtos farmacêuticos\n• Estratégias de registro de medicamentos\n• Compliance e boas práticas (GMP)\n• Parcerias e oportunidades de mercado\n• Análise de mercado farmacêutico brasileiro\n\nComo posso detalhar sua consulta especificamente?`;
        }

        // Sugerir abertura de novo chat e adicionar nota ao final da resposta
        if ((totalCount || 0) > 60) {
          assistantResponse += `\n\nNota: Esta conversa já está extensa. Posso abrir um novo chat e carregar um resumo para continuar do ponto em que paramos.`;
        } else if (didSummarize) {
          assistantResponse += `\n\nNota: Gerei um resumo da conversa para manter o contexto eficiente.`;
        }

        // Salvar resposta do assistente
        const { error: assistantMsgError } = await supabase
          .from('ai_chat_messages')
          .insert({
            thread_id,
            user_id: auth.user.id,
            role: 'assistant',
            content: assistantResponse,
            metadata: {
              model: PERPLEXITY_API_KEY ? "perplexity" : "fallback",
              response_length: assistantResponse.length
            }
          });

        if (assistantMsgError) throw assistantMsgError;

        // Log do evento
        await supabase.from("ai_chat_events").insert({
          user_id: auth.user.id,
          source: "master_chatbot",
          action: "chat_message",
          message: message,
          metadata: {
            thread_id,
            response_length: assistantResponse.length,
            context_messages: (recentMessages?.length || 0),
            api_used: PERPLEXITY_API_KEY ? "perplexity" : "fallback"
          }
        });

        return new Response(JSON.stringify({ 
          assistant_message: assistantResponse,
          metadata: {
            model: PERPLEXITY_API_KEY ? "perplexity" : "fallback",
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error("Ação não suportada");
    }

  } catch (error: any) {
    console.error("master-chatbot error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "internal_error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

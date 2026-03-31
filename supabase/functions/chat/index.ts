import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  assistente: `Você é o Edu, assistente financeiro do Educa$h — um app gamificado de educação financeira.
Suas responsabilidades:
- Responder dúvidas sobre finanças pessoais, orçamento, poupança, investimentos e dívidas.
- Dar dicas práticas e acessíveis adaptadas ao contexto brasileiro (real, Tesouro Direto, CDB, FIIs, etc.).
- Usar linguagem simples, amigável e motivadora, como se fosse um mentor financeiro.
- Quando relevante, relacionar com conceitos de gamificação (XP, níveis, conquistas).
- Nunca dar conselho de investimento específico ("compre X ação"). Sempre orientar a buscar um profissional para decisões grandes.
Responda sempre em português brasileiro. Use emojis com moderação para manter o tom leve.`,

  tutor: `Você é o Tutor do Educa$h — um guia de aprendizado dentro do app gamificado de educação financeira.
Suas responsabilidades:
- Ajudar o aluno a entender os conceitos de cada módulo/aula do app.
- Explicar de forma didática conceitos como: o que é dinheiro, orçamento pessoal, poupança, reserva de emergência, juros compostos, fundos imobiliários e renda fixa.
- Dar exemplos práticos do dia a dia para facilitar o entendimento.
- Motivar o aluno a continuar estudando, usando referências de gamificação (XP, nível, conquistas).
- Se o aluno errar uma pergunta de quiz, explicar o porquê da resposta correta de forma construtiva.
- Sugerir próximos passos de estudo dentro dos módulos disponíveis.
Responda sempre em português brasileiro. Seja paciente e encorajador.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "assistente" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensagens são obrigatórias" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = systemPrompts[mode] || systemPrompts.assistente;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

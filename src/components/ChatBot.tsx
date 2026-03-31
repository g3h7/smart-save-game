import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, GraduationCap, Wallet } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "assistente" | "tutor";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const modeConfig = {
  assistente: {
    label: "Assistente",
    icon: Wallet,
    greeting: "Olá! 👋 Sou o **Edu**, seu assistente financeiro. Como posso te ajudar hoje?",
  },
  tutor: {
    label: "Tutor",
    icon: GraduationCap,
    greeting: "Oi! 📚 Sou seu Tutor de aprendizado. Me pergunte sobre qualquer módulo ou conceito!",
  },
};

async function streamChat({
  messages,
  mode,
  onDelta,
  onDone,
  signal,
}: {
  messages: Msg[];
  mode: Mode;
  onDelta: (text: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode }),
    signal,
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || `Erro ${resp.status}`);
  }

  if (!resp.body) throw new Error("Stream indisponível");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: rDone, value } = await reader.read();
    if (rDone) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("assistente");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Reset messages when mode changes
  useEffect(() => {
    setMessages([]);
  }, [mode]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((p) => {
        const last = p[p.length - 1];
        if (last?.role === "assistant") {
          return p.map((m, i) => (i === p.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...p, { role: "assistant", content: assistantSoFar }];
      });
    };

    abortRef.current = new AbortController();

    try {
      await streamChat({
        messages: [...messages, userMsg],
        mode,
        onDelta: upsert,
        onDone: () => setLoading(false),
        signal: abortRef.current.signal,
      });
    } catch (e: any) {
      if (e.name !== "AbortError") {
        toast.error(e.message || "Erro ao enviar mensagem");
      }
      setLoading(false);
    }
  };

  const cfg = modeConfig[mode];

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-button flex items-center justify-center hover:brightness-110 transition-all animate-bounce-soft"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-card rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <cfg.icon size={20} />
              <span className="font-display font-bold text-sm">Educa$h {cfg.label}</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-80">
              <X size={18} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-border shrink-0">
            {(Object.keys(modeConfig) as Mode[]).map((m) => {
              const c = modeConfig[m];
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-display font-bold transition-colors ${
                    mode === m
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <c.icon size={14} />
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Greeting */}
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <cfg.icon size={14} className="text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-sm max-w-[80%]">
                <ReactMarkdown>{cfg.greeting}</ReactMarkdown>
              </div>
            </div>

            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-3 py-2 text-sm max-w-[80%]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <cfg.icon size={14} className="text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-sm max-w-[80%] prose prose-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              )
            )}

            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <cfg.icon size={14} className="text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-sm">
                  <span className="animate-pulse">Pensando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground w-9 h-9 rounded-lg flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

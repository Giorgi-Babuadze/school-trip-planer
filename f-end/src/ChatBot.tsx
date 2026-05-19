import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, MapPin, Bus, Utensils, ChevronDown } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: "📍", label: "Destinations", text: "What destinations are available and how much do they cost?" },
  { icon: "🚌", label: "Transportation", text: "How is transportation chosen for my trip?" },
  { icon: "🍽️", label: "Meals", text: "What meal options are available and what are the prices?" },
  { icon: "📋", label: "How to plan", text: "How do I plan a school trip step by step?" },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "👋 Hello! I'm your SchoolTrip.ge assistant. I can help you plan the perfect school trip — destinations, pricing, transport, meals and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      scrollToBottom();
    } else {
      // Count new assistant messages while closed
      setUnread((u) => u + 0);
    }
  }, [messages]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setShowScrollBtn(!atBottom);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: idRef.current++,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build history for Gemini (exclude the initial greeting)
    const history = messages
      .filter((m) => m.id !== 0)
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), history }),
      });

      const data = await res.json();
      const replyText = data.response || data.message || "Sorry, I couldn't get a response. Please try again.";

      const assistantMsg: Message = {
        id: idRef.current++,
        role: "assistant",
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!open) setUnread((u) => u + 1);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          role: "assistant",
          text: "⚠️ Something went wrong. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @keyframes bubbleIn {
          0%   { opacity: 0; transform: scale(0.5) translateY(20px); }
          70%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatOpen {
          0%   { opacity: 0; transform: scale(0.92) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes msgIn {
          0%   { opacity: 0; transform: translateY(8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
        .chat-bubble-btn { animation: bubbleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .chat-window     { animation: chatOpen 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .msg-in          { animation: msgIn 0.25s ease forwards; }
        .dot1 { animation: typing 1s ease infinite 0ms; }
        .dot2 { animation: typing 1s ease infinite 150ms; }
        .dot3 { animation: typing 1s ease infinite 300ms; }
      `}</style>

      {/* ── Floating bubble ── */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
        }}
      >
        {/* Pulse ring when closed */}
        {!open && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "hsl(var(--primary))",
            animation: "pulse-ring 1.8s ease-out infinite",
          }} />
        )}

        <button
          className="chat-bubble-btn"
          onClick={() => { setOpen((o) => !o); setUnread(0); }}
          style={{
            position: "relative",
            width: 56, height: 56,
            borderRadius: "50%",
            background: open
              ? "hsl(var(--muted))"
              : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            border: "none",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 24px hsl(var(--primary) / 0.4)",
            transition: "background 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {open
            ? <X style={{ width: 22, height: 22, color: "hsl(var(--foreground))" }} />
            : <MessageCircle style={{ width: 24, height: 24, color: "#fff" }} />
          }
          {/* Unread badge */}
          {unread > 0 && !open && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              width: 20, height: 20, borderRadius: "50%",
              background: "#ef4444",
              color: "#fff", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid hsl(var(--background))",
            }}>
              {unread}
            </div>
          )}
        </button>
      </div>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: "fixed",
            bottom: 96, right: 28,
            width: 370,
            height: 520,
            zIndex: 9998,
            borderRadius: 20,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            display: "flex", alignItems: "center", gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Bot style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                SchoolTrip Assistant
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Online — here to help plan your trip
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            style={{
              flex: 1, overflowY: "auto", padding: "14px 14px 8px",
              display: "flex", flexDirection: "column", gap: 10,
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--border)) transparent",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="msg-in"
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))"
                    : "hsl(var(--muted))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {msg.role === "user"
                    ? <User style={{ width: 14, height: 14, color: "#fff" }} />
                    : <Bot style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                  }
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 2,
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    padding: "9px 13px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))"
                      : "hsl(var(--muted))",
                    color: msg.role === "user" ? "#fff" : "hsl(var(--foreground))",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", padding: "0 4px" }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="msg-in" style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "hsl(var(--muted))",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Bot style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                </div>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "hsl(var(--muted))",
                  display: "flex", gap: 4, alignItems: "center",
                }}>
                  {["dot1","dot2","dot3"].map((cls) => (
                    <div key={cls} className={cls} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "hsl(var(--muted-foreground))",
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollBtn && (
            <button
              onClick={() => scrollToBottom()}
              style={{
                position: "absolute", bottom: 72, right: 18,
                width: 32, height: 32, borderRadius: "50%",
                background: "hsl(var(--primary))", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px hsl(var(--primary)/0.4)",
                zIndex: 10,
              }}
            >
              <ChevronDown style={{ width: 16, height: 16, color: "#fff" }} />
            </button>
          )}

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div style={{
              padding: "6px 14px 8px",
              display: "flex", gap: 6, flexWrap: "wrap",
              flexShrink: 0,
            }}>
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => sendMessage(qp.text)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 99,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--muted))";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--background))";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                  }}
                >
                  <span>{qp.icon}</span> {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "10px 14px 14px",
            borderTop: "1px solid hsl(var(--border))",
            display: "flex", gap: 8, alignItems: "center",
            flexShrink: 0,
            background: "hsl(var(--card))",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about trips, destinations, pricing..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 99,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                fontSize: 13.5,
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "hsl(var(--primary))";
                e.target.style.boxShadow = "0 0 0 2px hsl(var(--primary)/0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "hsl(var(--border))";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))"
                  : "hsl(var(--muted))",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => { if (input.trim() && !loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              {loading
                ? <Loader2 style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", animation: "spin 1s linear infinite" }} />
                : <Send style={{ width: 15, height: 15, color: input.trim() ? "#fff" : "hsl(var(--muted-foreground))", marginLeft: 1 }} />
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

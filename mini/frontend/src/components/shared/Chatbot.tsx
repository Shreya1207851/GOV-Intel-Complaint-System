import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { assistantApi } from "@/services/assistantApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const buildWelcomeMessage = (role?: string) => {
  if (role === "admin") {
    return "Hello Admin. Ask me about complaint trends, SLA risk, or operational summaries across the system.";
  }

  if (role === "authority") {
    return "Hello Officer. Ask me about department workload, priority cases, or what to act on next.";
  }

  return "Hi! I'm GovAI Assistant. Ask me about your complaints, status updates, or what action to take next.";
};

const getPromptIdeas = (role?: string) => {
  if (role === "admin") {
    return [
      "Summarize complaint status across departments.",
      "Which department has the highest workload right now?",
      "What should I focus on first today?",
    ];
  }

  if (role === "authority") {
    return [
      "Show my department's highest priority complaints.",
      "Which complaints are aging the most?",
      "What actions should my team take next?",
    ];
  }

  return [
    "What is the status of my latest complaint?",
    "Which of my complaints still need attention?",
    "What should I do if my complaint is unresolved?",
  ];
};

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: buildWelcomeMessage(user?.role) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const promptIdeas = getPromptIdeas(user?.role);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setMessages([{ id: "1", role: "assistant", text: buildWelcomeMessage(user?.role) }]);
  }, [user?.role]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `u${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    try {
      setLoading(true);
      const response = await assistantApi.chat(
        nextMessages.map((message) => ({
          role: message.role,
          text: message.text,
        }))
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `a${Date.now()}`,
          role: "assistant",
          text: response.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e${Date.now()}`,
          role: "assistant",
          text: error instanceof Error
            ? error.message
            : "The assistant is unavailable right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    void sendMessage(input);
  };

  if (!user || (user.role !== "citizen" && user.role !== "admin" && user.role !== "authority")) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex max-h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="gradient-primary flex shrink-0 items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="h-5 w-5" />
                <span className="font-heading text-sm font-semibold">GovAI Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {promptIdeas.map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => void sendMessage(idea)}
                      className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[75%] whitespace-pre-line rounded-xl px-3 py-2 text-sm",
                      message.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground"
                    )}
                  >
                    {message.text}
                  </div>

                  {message.role === "user" && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start gap-2">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="flex shrink-0 gap-2 border-t border-border p-3">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask GovAI Assistant anything..."
                className="text-sm"
                disabled={loading}
              />
              <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

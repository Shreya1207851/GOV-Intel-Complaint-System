import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, TrendingUp, Clock3, FileSearch, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { assistantApi } from "@/services/assistantApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const buildIntro = (role?: string) => {
  if (role === "admin") {
    return {
      eyebrow: "Control room",
      title: "Ask GovAI to read the system",
      subtitle: "Use live complaint context to review workload, SLA risk, and department pressure before making decisions.",
      placeholder: "Ask about backlog, department load, or operational risks...",
    };
  }

  if (role === "authority") {
    return {
      eyebrow: "Department workspace",
      title: "Ask GovAI what your team should do next",
      subtitle: "Review complaint priority, aging cases, and next actions using your current department queue.",
      placeholder: "Ask about urgent complaints, workload, or team priorities...",
    };
  }

  return {
    eyebrow: "Citizen helpdesk",
    title: "Ask GovAI about your complaint journey",
    subtitle: "Get help with statuses, pending issues, and the next best step for the complaints you have already filed.",
    placeholder: "Ask about your latest complaint, progress, or next steps...",
  };
};

const buildPromptIdeas = (role?: string) => {
  if (role === "admin") {
    return [
      { icon: TrendingUp, text: "Summarize complaint status across departments." },
      { icon: ShieldCheck, text: "Which department has the highest SLA risk right now?" },
      { icon: FileSearch, text: "What should I focus on first today?" },
      { icon: Clock3, text: "Where are the oldest unresolved complaints?" },
    ];
  }

  if (role === "authority") {
    return [
      { icon: FileSearch, text: "Show my department's highest priority complaints." },
      { icon: Clock3, text: "Which complaints are aging the most?" },
      { icon: TrendingUp, text: "Summarize my current workload." },
      { icon: ShieldCheck, text: "What actions should my team take next?" },
    ];
  }

  return [
    { icon: FileSearch, text: "What is the status of my latest complaint?" },
    { icon: Clock3, text: "Which of my complaints still need attention?" },
    { icon: ShieldCheck, text: "What should I do if a complaint is unresolved?" },
    { icon: TrendingUp, text: "Give me a summary of my current complaints." },
  ];
};

const buildGreeting = (role?: string) => {
  if (role === "admin") return "Hello Admin. I can summarize complaint operations, backlog pressure, and department-level trends.";
  if (role === "authority") return "Hello Officer. I can help you review priorities, aging complaints, and recommended next actions.";
  return "Hi! I can help you understand complaint status, delays, and the best next step for your cases.";
};

const AssistantPage: React.FC = () => {
  const { user } = useAuth();
  const intro = useMemo(() => buildIntro(user?.role), [user?.role]);
  const promptIdeas = useMemo(() => buildPromptIdeas(user?.role), [user?.role]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: buildGreeting(user?.role) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: "1", role: "assistant", text: buildGreeting(user?.role) }]);
  }, [user?.role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
          text: error instanceof Error ? error.message : "Assistant is unavailable right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    void sendMessage(input);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
      <section className="rounded-[30px] border border-border/60 bg-card/90 p-6 shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">{intro.eyebrow}</p>
        <h1 className="mt-4 max-w-[11ch] text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl">
          {intro.title}
        </h1>
        <p className="mt-5 max-w-[44ch] text-sm leading-7 text-muted-foreground sm:text-base">
          {intro.subtitle}
        </p>

        <div className="mt-8 space-y-3">
          {promptIdeas.map((idea) => {
            const Icon = idea.icon;
            return (
              <button
                key={idea.text}
                type="button"
                onClick={() => void sendMessage(idea.text)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-4 text-left transition hover:border-primary/30 hover:bg-background"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{idea.text}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-border/60 bg-card/90 shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="border-b border-border/60 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-white shadow-[0_0_24px_rgba(59,130,246,0.24)]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Smart assistant</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Ask GovAI anything</h2>
              <p className="mt-1 text-sm text-muted-foreground">Context-aware answers using your live complaint data and role-based access.</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[620px] flex-col">
          <div className="flex-1 space-y-4 overflow-auto px-6 py-5">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-7",
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted/60 text-foreground"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-3xl rounded-bl-md bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border/60 p-5">
            <div className="flex items-center gap-3 rounded-[26px] border border-border/60 bg-background/70 p-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={intro.placeholder}
                className="border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
                disabled={loading}
              />
              <Button className="h-11 rounded-2xl px-5" onClick={handleSubmit} disabled={!input.trim() || loading}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssistantPage;

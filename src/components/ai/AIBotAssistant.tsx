
"use client";

import * as React from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiBotInformationAssistant } from '@/ai/flows/ai-bot-information-assistant';
import { cn } from '@/lib/utils';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

const SUGGESTED_QUESTIONS = [
  "What is the Tinewonsa Project?",
  "How can I volunteer?",
  "Tell me about the Impact Store.",
  "How does the Dollar-A-Day campaign work?"
];

export function AIBotAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'bot', text: 'Hello! I am the DIBF Assistant. I can help you understand our mission, explore our initiatives, or find ways to get involved. What would you like to know?' }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const scrollAnchorRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiBotInformationAssistant(textToSend);
      setMessages(prev => [...prev, { role: 'bot', text: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {isOpen ? (
        <Card className="w-[350px] sm:w-[420px] h-[550px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border-primary/10 animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 rounded-3xl overflow-hidden">
          <CardHeader className="bg-secondary text-white p-5 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-base font-headline">DIBF Assistant</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Always Active</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white hover:bg-white/10 h-10 w-10 rounded-full transition-all">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="flex-1 bg-background/50">
            <div className="p-5 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-secondary rounded-tl-none border border-border/50'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border/50 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isLoading && (
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-accent" /> Suggested Questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-white hover:bg-primary hover:text-white border border-border/50 px-3 py-2 rounded-full transition-all duration-300 text-secondary font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={scrollAnchorRef} className="h-2" />
            </div>
          </ScrollArea>

          <CardFooter className="p-5 border-t bg-white shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-3"
            >
              <Input 
                placeholder="Ask about our mission or impact..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl bg-muted/30 border-none focus-visible:ring-primary h-12"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading} className="shrink-0 h-12 w-12 rounded-xl shadow-lg transition-transform active:scale-95">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-16 w-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] bg-primary hover:bg-primary/90 flex items-center justify-center p-0 transition-all hover:scale-110 active:scale-90 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="w-7 h-7 text-white relative z-10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white animate-pulse"></span>
        </Button>
      )}
    </div>
  );
}


"use client";

import * as React from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiBotInformationAssistant } from '@/ai/flows/ai-bot-information-assistant';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

export function AIBotAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'bot', text: 'Hello! I am the DIBF Assistant. How can I help you today with information about our initiatives, mission, or ways to get involved?' }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const scrollAnchorRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiBotInformationAssistant(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {isOpen ? (
        <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-primary text-white p-4 flex flex-row items-center justify-between rounded-t-lg shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-sm font-headline">DIBF AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-sm' 
                    : 'bg-muted text-secondary rounded-tl-none border border-border shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none animate-pulse text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={scrollAnchorRef} className="h-2" />
            </div>
          </ScrollArea>

          <CardFooter className="p-4 border-t bg-background shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-2"
            >
              <Input 
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading} className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-16 w-16 shadow-2xl shadow-primary/30 flex items-center justify-center p-0 transition-transform hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-7 h-7" />
        </Button>
      )}
    </div>
  );
}

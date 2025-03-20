'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Loader2, Trash2 } from 'lucide-react';
import { chatWithGemini, ChatMessage, saveMessagesToStorage, loadMessagesFromStorage, cloneChatSession } from '@/lib/gemini';
import { useRouter } from 'next/navigation';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  error?: boolean;
}

const WELCOME_MESSAGE = {
  text: "👋 Hi! I'm your movie expert assistant. I can help you:\n\n" +
        "🔍 Search for movies using 'Take me to {tên phim}'\n" +
        "🎬 Answer questions about movies\n" +
        "🌟 Provide movie recommendations\n" +
        "📚 Share movie facts and trivia\n\n" +
        "How can I help you today?",
  isUser: false,
  timestamp: new Date()
};

export function ChatBot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages.map(msg => ({
        text: msg.text,
        isUser: !msg.isBot,
        timestamp: new Date(),
      })));
      setHasShownWelcome(true);
    }
  }, []);

  // Show welcome message when chat is opened for the first time
  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setMessages([WELCOME_MESSAGE]);
      setHasShownWelcome(true);
    }
  }, [isOpen, hasShownWelcome]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Save messages to localStorage whenever they change
    const chatMessages: ChatMessage[] = messages.map(msg => ({
      text: msg.text,
      isBot: !msg.isUser,
    }));
    saveMessagesToStorage(chatMessages);
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = retryMessage || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = {
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setRetryMessage(null);
    setIsLoading(true);

    try {
      const response = await chatWithGemini(messageToSend, router);
      
      // Try to parse the response as JSON if it's a search command
      try {
        const jsonResponse = JSON.parse(response);
        if (jsonResponse.action === 'search' && jsonResponse.keyword) {
          // Add bot's confirmation message
          const confirmMessage = {
            text: `🔍 Searching for "${jsonResponse.keyword}"...`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, confirmMessage]);
          
          // Navigate to search page with the keyword
          router.push(`/tim-kiem?keyword=${encodeURIComponent(jsonResponse.keyword)}`, undefined);
          setIsOpen(false); // Close the chat window
          return;
        }
      } catch (e) {
        // Not a JSON response, continue with normal message handling
      }

      const botMessage = {
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      setRetryMessage(messageToSend); // Store the failed message for retry
    } finally {
      setIsLoading(false);
    }
  };
  const handleRetry = () => {
    if (retryMessage) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleClearHistory = async () => {
    // Clear messages from state
    setMessages([WELCOME_MESSAGE]);
    // Clear messages from localStorage
    saveMessagesToStorage([]);
    // Reset chat session
    await cloneChatSession();
    // Reset welcome state
    setHasShownWelcome(true);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-[9999]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 w-[350px] rounded-lg bg-card shadow-xl transition-all duration-300 z-[9999] ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Movie Expert</h2>
            <p className="text-sm text-muted-foreground">Ask me anything about movies!</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleClearHistory}
            title="Clear chat history"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : message.error
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.error && retryMessage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={handleRetry}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about movies..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
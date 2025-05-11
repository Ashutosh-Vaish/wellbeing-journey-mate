
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const initialBotMessage: Message = {
  content: "Hello! I'm here to listen. How are you feeling today?",
  isUser: false,
  timestamp: new Date(),
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      toast({
        description: "New message received",
      });
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const generateBotResponse = (userInput: string): Message => {
    // Simple response logic based on user input keywords
    const userInputLower = userInput.toLowerCase();
    let response = "";

    if (userInputLower.includes("sad") || userInputLower.includes("depress") || userInputLower.includes("down")) {
      response = "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to try a breathing exercise or read an affirmation?";
    } else if (userInputLower.includes("anxious") || userInputLower.includes("worry") || userInputLower.includes("stress")) {
      response = "Anxiety can be challenging. Have you tried any breathing exercises lately? They can help ground you when you're feeling overwhelmed.";
    } else if (userInputLower.includes("happy") || userInputLower.includes("good") || userInputLower.includes("great")) {
      response = "I'm glad to hear you're doing well! It's important to celebrate these positive moments. What's been going well for you?";
    } else if (userInputLower.includes("tired") || userInputLower.includes("exhaust") || userInputLower.includes("sleep")) {
      response = "Rest is really important for mental health. Have you been able to establish a good sleep routine lately?";
    } else if (userInputLower.includes("help") || userInputLower.includes("resource")) {
      response = "There are many resources available to help. You can check our Resources section for more information, or consider reaching out to a mental health professional.";
    } else {
      response = "Thank you for sharing. How else have you been feeling lately?";
    }

    return {
      content: response,
      isUser: false,
      timestamp: new Date(),
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg bg-card">
      <div className="p-3 border-b flex items-center gap-2 bg-muted/10">
        <MessageCircle size={20} />
        <h3 className="font-medium">Chat Support</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1 text-right">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground max-w-[80%] rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type how you're feeling..."
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

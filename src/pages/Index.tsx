
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";
import Chat from "@/components/Chat";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const [greeting, setGreeting] = useState<string>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  // Get username from localStorage or default to "there"
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('username') || "there";
  });

  // Motivational quotes
  const quotes = [
    "Self-care is not self-indulgence, it is self-preservation.",
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or frustrated.",
    "Mental health problems don't define who you are. They are something you experience.",
    "Be patient with yourself. You're doing the best you can with what you have in this moment.",
    "It's okay to take a break. The world will not fall apart without you.",
    "Healing takes time, and asking for help is a courageous step.",
    "Small steps every day lead to big changes over time."
  ];

  const [quote, setQuote] = useState<string>(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  // Function to refresh the motivational quote
  const refreshQuote = () => {
    let newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    // Make sure we don't get the same quote
    while (newQuote === quote && quotes.length > 1) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setQuote(newQuote);
    
    toast({
      description: "New inspiration loaded!",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:py-8 md:px-0 pb-20 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{greeting}, {username}!</h1>
        <p className="text-muted-foreground">How are you feeling today?</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <MoodTracker />
            
            <Card className="bg-gradient-to-r from-secondary to-secondary/50 mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Today's Inspiration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <p className="text-lg font-medium italic mb-4">{quote}</p>
                  <button 
                    onClick={refreshQuote}
                    className="text-sm text-primary hover:text-primary/80 underline"
                  >
                    Show another quote
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Chat />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Link to="/journal">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-2">📓</div>
                <h3 className="text-center font-medium">Journal</h3>
                <p className="text-xs text-center text-muted-foreground">Express your thoughts</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/breathing">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-2">🧘</div>
                <h3 className="text-center font-medium">Breathing</h3>
                <p className="text-xs text-center text-muted-foreground">Find calm with breath</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/affirmations">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-2">💭</div>
                <h3 className="text-center font-medium">Affirmations</h3>
                <p className="text-xs text-center text-muted-foreground">Positive thoughts</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/progress">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-center font-medium">Progress</h3>
                <p className="text-xs text-center text-muted-foreground">Track your journey</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

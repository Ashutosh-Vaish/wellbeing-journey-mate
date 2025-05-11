import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const defaultAffirmations = [
  "I am worthy of love and respect.",
  "I am in control of my thoughts and emotions.",
  "I have the power to create change.",
  "I am becoming the best version of myself.",
  "I am grateful for everything I have.",
  "I trust in my ability to solve problems.",
  "My potential is limitless, and I can achieve my goals.",
  "I am allowed to make mistakes and learn from them.",
  "I have the courage to be myself.",
  "Every day, I am getting stronger."
];

interface AffirmationItem {
  id: string;
  text: string;
  favorite: boolean;
  createdAt: string;
}

const Affirmations: React.FC = () => {
  const { toast } = useToast();
  const [affirmations, setAffirmations] = useState<AffirmationItem[]>([]);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [currentAffirmation, setCurrentAffirmation] = useState<AffirmationItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    // Get from localStorage or use defaults
    const savedAffirmations = localStorage.getItem('affirmations');
    
    if (savedAffirmations) {
      setAffirmations(JSON.parse(savedAffirmations));
    } else {
      const initialAffirmations: AffirmationItem[] = defaultAffirmations.map(text => ({
        id: Math.random().toString(36).substring(2, 9),
        text,
        favorite: false,
        createdAt: new Date().toISOString()
      }));
      setAffirmations(initialAffirmations);
      localStorage.setItem('affirmations', JSON.stringify(initialAffirmations));
    }
  }, []);

  useEffect(() => {
    if (affirmations.length > 0) {
      const displayableAffirmations = filter === 'favorites' 
        ? affirmations.filter(a => a.favorite)
        : affirmations;
        
      if (displayableAffirmations.length > 0) {
        const randomIndex = Math.floor(Math.random() * displayableAffirmations.length);
        setCurrentAffirmation(displayableAffirmations[randomIndex]);
      } else if (filter === 'favorites') {
        // No favorites, show message instead
        setCurrentAffirmation(null);
      } else {
        // All affirmations but still none? (unlikely)
        setCurrentAffirmation(null);
      }
    }
  }, [affirmations, filter]);

  const getNewAffirmation = () => {
    const displayableAffirmations = filter === 'favorites' 
      ? affirmations.filter(a => a.favorite)
      : affirmations;
      
    if (displayableAffirmations.length > 0) {
      let randomIndex = Math.floor(Math.random() * displayableAffirmations.length);
      
      // Try to avoid showing the same affirmation twice in a row
      if (displayableAffirmations.length > 1 && currentAffirmation) {
        while (displayableAffirmations[randomIndex].id === currentAffirmation.id) {
          randomIndex = Math.floor(Math.random() * displayableAffirmations.length);
        }
      }
      
      setCurrentAffirmation(displayableAffirmations[randomIndex]);
    }
  };

  const addAffirmation = () => {
    if (newAffirmation.trim()) {
      const newItem: AffirmationItem = {
        id: Math.random().toString(36).substring(2, 9),
        text: newAffirmation.trim(),
        favorite: false,
        createdAt: new Date().toISOString()
      };
      
      const updatedAffirmations = [...affirmations, newItem];
      setAffirmations(updatedAffirmations);
      localStorage.setItem('affirmations', JSON.stringify(updatedAffirmations));
      setNewAffirmation('');
      
      toast({
        title: "Affirmation Added",
        description: "Your affirmation has been added successfully.",
      });
    }
  };

  const toggleFavorite = (id: string) => {
    const updatedAffirmations = affirmations.map(affirmation => {
      if (affirmation.id === id) {
        return { ...affirmation, favorite: !affirmation.favorite };
      }
      return affirmation;
    });
    
    setAffirmations(updatedAffirmations);
    localStorage.setItem('affirmations', JSON.stringify(updatedAffirmations));
    
    if (currentAffirmation?.id === id) {
      setCurrentAffirmation({ ...currentAffirmation, favorite: !currentAffirmation.favorite });
    }
  };

  const deleteAffirmation = (id: string) => {
    const updatedAffirmations = affirmations.filter(affirmation => affirmation.id !== id);
    setAffirmations(updatedAffirmations);
    localStorage.setItem('affirmations', JSON.stringify(updatedAffirmations));
    
    if (currentAffirmation?.id === id) {
      getNewAffirmation();
    }
    
    toast({
      title: "Affirmation Deleted",
      description: "Your affirmation has been removed.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle>Daily Affirmation</CardTitle>
          <CardDescription>
            Read this affirmation aloud to yourself and feel its power.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[12rem]">
          {currentAffirmation ? (
            <div className="text-center">
              <p className="text-2xl font-medium italic text-primary">"{currentAffirmation.text}"</p>
              <div className="mt-4 flex justify-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={currentAffirmation.favorite ? "text-yellow-500" : ""}
                  onClick={() => toggleFavorite(currentAffirmation.id)}
                >
                  {currentAffirmation.favorite ? "★ Favorited" : "☆ Add to Favorites"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {filter === 'favorites' 
                ? "You don't have any favorite affirmations yet." 
                : "No affirmations available."}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className={filter === 'all' ? "bg-primary/20" : ""}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant="secondary"
              className={filter === 'favorites' ? "bg-primary/20" : ""}
              onClick={() => setFilter('favorites')}
            >
              Favorites
            </Button>
            <Button onClick={getNewAffirmation}>
              New Affirmation
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Your Own Affirmation</CardTitle>
          <CardDescription>
            Create personal affirmations that resonate with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              placeholder="Enter a positive affirmation..."
              className="flex-grow"
              onKeyDown={(e) => e.key === 'Enter' && addAffirmation()}
            />
            <Button onClick={addAffirmation}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Your Affirmations</h3>
        {affirmations.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't added any custom affirmations yet.
          </p>
        ) : (
          affirmations.map(affirmation => (
            <Card key={affirmation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{affirmation.text}</p>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={affirmation.favorite ? "text-yellow-500" : ""}
                      onClick={() => toggleFavorite(affirmation.id)}
                    >
                      {affirmation.favorite ? "★" : "☆"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteAffirmation(affirmation.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Affirmations;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'awful';

const moods: { type: Mood; emoji: string; color: string }[] = [
  { type: 'great', emoji: '😄', color: 'bg-green-100 border-green-300 text-green-700' },
  { type: 'good', emoji: '🙂', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { type: 'okay', emoji: '😐', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { type: 'bad', emoji: '😔', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { type: 'awful', emoji: '😩', color: 'bg-red-100 border-red-300 text-red-700' }
];

interface MoodEntry {
  date: string;
  mood: Mood;
  note?: string;
}

const MoodTracker: React.FC = () => {
  const [todaysMood, setTodaysMood] = useState<Mood | null>(null);
  const [note, setNote] = useState<string>('');
  const [showNote, setShowNote] = useState<boolean>(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  // Load mood history from localStorage
  useEffect(() => {
    const savedMoods = localStorage.getItem('moodHistory');
    if (savedMoods) {
      setMoodHistory(JSON.parse(savedMoods));
    }
    
    // Check if we already logged mood today
    const today = new Date().toISOString().split('T')[0];
    const todaysEntry = savedMoods 
      ? JSON.parse(savedMoods).find((entry: MoodEntry) => entry.date === today)
      : null;
      
    if (todaysEntry) {
      setTodaysMood(todaysEntry.mood);
      setNote(todaysEntry.note || '');
    }
  }, []);

  // Save mood to localStorage
  const saveMood = (selectedMood: Mood) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Remove any existing entry for today
    const filteredHistory = moodHistory.filter(entry => entry.date !== today);
    
    // Add new entry
    const newEntry: MoodEntry = {
      date: today,
      mood: selectedMood,
      note: note.trim() || undefined
    };
    
    const updatedHistory = [...filteredHistory, newEntry];
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    
    setTodaysMood(selectedMood);
    
    if (!note.trim()) {
      setShowNote(true);
    }
  };
  
  const saveNote = () => {
    if (!todaysMood) return;
    
    const today = new Date().toISOString().split('T')[0];
    const updatedHistory = moodHistory.map(entry => 
      entry.date === today ? { ...entry, note } : entry
    );
    
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    setShowNote(false);
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-3 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.type}
              onClick={() => saveMood(mood.type)}
              className={`w-12 h-12 text-2xl flex items-center justify-center rounded-full border-2 transition-all ${
                todaysMood === mood.type
                  ? `${mood.color} scale-110 border-2`
                  : 'bg-secondary hover:scale-105'
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {(todaysMood || showNote) && (
          <div className="mt-4 animate-fade-in">
            <label className="block mb-2 text-sm font-medium">
              Want to add a note? (optional)
            </label>
            <div className="flex gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                placeholder="How are you feeling?"
                rows={2}
              />
              <Button onClick={saveNote} size="sm">Save</Button>
            </div>
          </div>
        )}
        
        {todaysMood && !showNote && (
          <p className="mt-4 text-center text-muted-foreground">
            You've logged your mood for today. You can update it anytime.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

const Journal: React.FC = () => {
  const { toast } = useToast();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: '',
    title: '',
    content: '',
    date: new Date().toISOString(),
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please add both a title and content for your journal entry.",
        variant: "destructive"
      });
      return;
    }

    let updatedEntries: JournalEntry[];

    if (isEditing) {
      updatedEntries = journalEntries.map(entry => 
        entry.id === currentEntry.id ? currentEntry : entry
      );
      toast({
        title: "Entry updated",
        description: "Your journal entry has been updated successfully."
      });
    } else {
      const newEntry = {
        ...currentEntry,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      updatedEntries = [...journalEntries, newEntry];
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully."
      });
    }

    setJournalEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    resetForm();
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted."
    });
  };

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentEntry({
      id: '',
      title: '',
      content: '',
      date: new Date().toISOString(),
      tags: []
    });
    setTagInput('');
    setIsEditing(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !currentEntry.tags?.includes(tagInput.trim())) {
      setCurrentEntry({
        ...currentEntry,
        tags: [...(currentEntry.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry({
      ...currentEntry,
      tags: currentEntry.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Journal Entry" : "New Journal Entry"}</CardTitle>
          <CardDescription>
            Write down your thoughts, feelings, and reflections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
              placeholder="Give your entry a title"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Textarea
              id="content"
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
              placeholder="What's on your mind today?"
              rows={6}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (optional)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags"
                className="flex-grow"
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            
            {currentEntry.tags && currentEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentEntry.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
          <Button onClick={saveEntry}>
            {isEditing ? "Update Entry" : "Save Entry"}
          </Button>
        </CardFooter>
      </Card>

      {journalEntries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Journal Entries</h2>
          
          {[...journalEntries]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription>{formatDate(entry.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{entry.content}</p>
                
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {entry.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => editEntry(entry)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteEntry(entry.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'awful';

interface MoodEntry {
  date: string;
  mood: Mood;
  note?: string;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

const moodScores: Record<Mood, number> = {
  'great': 5,
  'good': 4,
  'okay': 3,
  'bad': 2,
  'awful': 1
};

const moodColors: Record<Mood, string> = {
  'great': '#48bb78', // green
  'good': '#4299e1', // blue
  'okay': '#ecc94b', // yellow
  'bad': '#ed8936', // orange
  'awful': '#f56565'  // red
};

const Progress: React.FC = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('7days');
  
  useEffect(() => {
    const savedMoods = localStorage.getItem('moodHistory');
    if (savedMoods) {
      setMoodHistory(JSON.parse(savedMoods));
    }
    
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }
  }, []);

  const getDateRangeData = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    return moodHistory
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getDaysInRange = () => {
    let days = 7;
    if (timeRange === '30days') days = 30;
    if (timeRange === '90days') days = 90;
    return days;
  };

  const getMoodDataForChart = () => {
    const days = getDaysInRange();
    const rangeData = getDateRangeData(days);
    
    // Create a map for quick lookup of moods by date
    const moodsByDate = new Map(
      rangeData.map(entry => [entry.date, moodScores[entry.mood]])
    );
    
    // Generate all dates in range
    const result = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const formattedDate = new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
      
      result.push({
        date: dateStr,
        formattedDate,
        score: moodsByDate.get(dateStr) || null
      });
    }
    
    return result;
  };

  const getMoodDistribution = () => {
    const days = getDaysInRange();
    const rangeData = getDateRangeData(days);
    
    const distribution: Record<Mood, number> = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      awful: 0
    };
    
    rangeData.forEach(entry => {
      distribution[entry.mood]++;
    });
    
    return Object.entries(distribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      mood: mood as Mood
    }));
  };

  const getJournalActivity = () => {
    const days = getDaysInRange();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    const entriesInRange = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
    
    // Count entries per day
    const entriesByDate = new Map();
    entriesInRange.forEach(entry => {
      const dateStr = new Date(entry.date).toISOString().split('T')[0];
      entriesByDate.set(dateStr, (entriesByDate.get(dateStr) || 0) + 1);
    });
    
    // Generate all dates in range
    const result = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const formattedDate = new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
      
      result.push({
        date: dateStr,
        formattedDate,
        count: entriesByDate.get(dateStr) || 0
      });
    }
    
    return result;
  };

  const getAverageForPeriod = (): number | null => {
    const days = getDaysInRange();
    const rangeData = getDateRangeData(days);
    
    if (rangeData.length === 0) return null;
    
    const sum = rangeData.reduce((acc, entry) => acc + moodScores[entry.mood], 0);
    return parseFloat((sum / rangeData.length).toFixed(1));
  };

  const getMoodChartData = getMoodDataForChart();
  const getDistributionData = getMoodDistribution();
  const getJournalData = getJournalActivity();
  const averageMood = getAverageForPeriod();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        
        <Select
          value={timeRange}
          onValueChange={(value: '7days' | '30days' | '90days') => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            {averageMood !== null ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-5xl font-bold text-primary">{averageMood}</div>
                <div className="ml-2 text-sm text-muted-foreground">/ 5</div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No mood data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {getDistributionData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={getDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {getDistributionData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.mood}`} 
                        fill={moodColors[entry.mood]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                No mood data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="mood">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mood">Mood History</TabsTrigger>
          <TabsTrigger value="journal">Journal Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Mood Over Time</CardTitle>
              <CardDescription>
                Track how your mood has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getMoodChartData.some(entry => entry.score !== null) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getMoodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{ fontSize: 12 }}
                      interval={timeRange === '7days' ? 0 : 'preserveStartEnd'} 
                    />
                    <YAxis 
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => {
                        const moodLabels: Record<number, string> = {
                          1: 'Awful',
                          2: 'Bad',
                          3: 'Okay',
                          4: 'Good',
                          5: 'Great'
                        };
                        return [moodLabels[value] || value, 'Mood'];
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      name="Mood" 
                      connectNulls={true}
                      dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: 'white' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No mood data available for the selected time period.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>
                Track your journaling habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getJournalData.some(entry => entry.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getJournalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{ fontSize: 12 }}
                      interval={timeRange === '7days' ? 0 : 'preserveStartEnd'} 
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      name="Journal Entries" 
                      dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: 'white' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No journal entries available for the selected time period.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;


import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BreathingPattern = {
  name: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  description: string;
};

const breathingPatterns: BreathingPattern[] = [
  { 
    name: "4-7-8 Breathing", 
    inhale: 4, 
    hold1: 7, 
    exhale: 8,
    description: "Helps reduce anxiety and helps with sleep. Inhale through your nose, hold, then exhale through your mouth."
  },
  { 
    name: "Box Breathing", 
    inhale: 4, 
    hold1: 4, 
    exhale: 4, 
    hold2: 4,
    description: "Used by Navy SEALs to remain calm and focused. Inhale, hold, exhale, hold - all for equal counts."
  },
  { 
    name: "Relaxing Breath", 
    inhale: 4, 
    exhale: 6,
    description: "A simple relaxation technique. Inhale through your nose, exhale slowly through your mouth."
  }
];

const Breathing: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [cycles, setCycles] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setCycles(0);
    setTotalTime(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time to change phase
            let nextPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';
            let nextTime = 0;
            
            if (phase === 'inhale') {
              if (selectedPattern.hold1) {
                nextPhase = 'hold1';
                nextTime = selectedPattern.hold1;
              } else {
                nextPhase = 'exhale';
                nextTime = selectedPattern.exhale;
              }
            } else if (phase === 'hold1') {
              nextPhase = 'exhale';
              nextTime = selectedPattern.exhale;
            } else if (phase === 'exhale') {
              if (selectedPattern.hold2) {
                nextPhase = 'hold2';
                nextTime = selectedPattern.hold2;
              } else {
                nextPhase = 'inhale';
                nextTime = selectedPattern.inhale;
                setCycles(c => c + 1);
              }
            } else {
              // hold2
              nextPhase = 'inhale';
              nextTime = selectedPattern.inhale;
              setCycles(c => c + 1);
            }
            
            setPhase(nextPhase);
            return nextTime;
          }
          return prevTime - 1;
        });
        
        setTotalTime(time => time + 1);
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isActive, phase, selectedPattern]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInstructions = (): string => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold1': return 'Hold your breath...';
      case 'exhale': return 'Breathe out slowly...';
      case 'hold2': return 'Hold...';
    }
  };

  const getBubbleScale = (): number => {
    if (phase === 'inhale') {
      return 1 + (1 - timeLeft / selectedPattern.inhale) * 0.5;
    } else if (phase === 'exhale') {
      return 1.5 - (1 - timeLeft / selectedPattern.exhale) * 0.5;
    }
    return phase === 'hold1' ? 1.5 : 1;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Breathing Exercises</CardTitle>
          <CardDescription>
            Take a moment to breathe deeply and find calm within yourself.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Breathing Technique
            </label>
            <Select
              disabled={isActive}
              value={selectedPattern.name}
              onValueChange={(value) => {
                const pattern = breathingPatterns.find(p => p.name === value);
                if (pattern) setSelectedPattern(pattern);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a breathing pattern" />
              </SelectTrigger>
              <SelectContent>
                {breathingPatterns.map((pattern) => (
                  <SelectItem key={pattern.name} value={pattern.name}>
                    {pattern.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm">
            <p>{selectedPattern.description}</p>
          </div>
          
          {isActive ? (
            <div className="text-center py-8 space-y-6">
              <div className="relative flex justify-center">
                <div 
                  className="w-36 h-36 rounded-full bg-primary/20 flex items-center justify-center transition-all"
                  style={{ 
                    transform: `scale(${getBubbleScale()})`,
                    transition: 'transform 1s ease-in-out'
                  }}
                >
                  <span className="text-2xl font-bold">{timeLeft}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium">{getInstructions()}</h3>
                <p>Cycles completed: {cycles}</p>
                <p>Total time: {formatTime(totalTime)}</p>
              </div>
              
              <Button onClick={stopBreathing} variant="outline">
                Stop Exercise
              </Button>
            </div>
          ) : (
            <Button onClick={startBreathing} className="w-full">
              Start Breathing
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Breathing;

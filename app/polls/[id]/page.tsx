'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';

// This would be replaced with actual data fetching
const MOCK_POLLS = {
  '1': {
    id: '1',
    title: 'What is your favorite programming language?',
    description: 'Help us understand which programming languages are most popular among developers.',
    createdBy: 'John Doe',
    votesCount: 42,
    createdAt: '2 days ago',
    options: [
      { id: '1', text: 'JavaScript', votes: 18 },
      { id: '2', text: 'Python', votes: 12 },
      { id: '3', text: 'Java', votes: 7 },
      { id: '4', text: 'TypeScript', votes: 5 },
    ],
  },
  '2': {
    id: '2',
    title: 'Which frontend framework do you prefer?',
    description: 'React, Vue, Angular, or something else? Let us know your preference!',
    createdBy: 'Jane Smith',
    votesCount: 28,
    createdAt: '1 week ago',
    options: [
      { id: '1', text: 'React', votes: 15 },
      { id: '2', text: 'Vue', votes: 8 },
      { id: '3', text: 'Angular', votes: 3 },
      { id: '4', text: 'Svelte', votes: 2 },
    ],
  },
  '3': {
    id: '3',
    title: 'How often do you deploy to production?',
    description: 'We want to understand deployment frequency across different teams and organizations.',
    createdBy: 'Alex Johnson',
    votesCount: 15,
    createdAt: '3 days ago',
    options: [
      { id: '1', text: 'Multiple times per day', votes: 5 },
      { id: '2', text: 'Once per day', votes: 4 },
      { id: '3', text: 'A few times per week', votes: 3 },
      { id: '4', text: 'Once per week', votes: 2 },
      { id: '5', text: 'Less frequently', votes: 1 },
    ],
  },
};

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  // This would be replaced with actual data fetching
  const poll = MOCK_POLLS[id as keyof typeof MOCK_POLLS];
  
  if (!poll) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Poll not found</h2>
            <p className="text-muted-foreground mt-2">The poll you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" asChild>
              <a href="/polls">Back to Polls</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleVote = () => {
    if (!selectedOption) return;
    
    // This would be replaced with actual voting logic
    console.log(`Voted for option ${selectedOption} in poll ${id}`);
    
    // Simulate successful vote
    setHasVoted(true);
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{poll.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>Created by {poll.createdBy}</span>
            <span>•</span>
            <span>{poll.createdAt}</span>
            <span>•</span>
            <span>{totalVotes} votes</span>
          </div>
        </div>

        <p className="text-lg">{poll.description}</p>

        <Card>
          <CardHeader>
            <CardTitle>Cast your vote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {!hasVoted && (
                        <input
                          type="radio"
                          id={`option-${option.id}`}
                          name="poll-option"
                          value={option.id}
                          checked={selectedOption === option.id}
                          onChange={() => setSelectedOption(option.id)}
                          className="h-4 w-4"
                        />
                      )}
                      <label 
                        htmlFor={`option-${option.id}`}
                        className={`${hasVoted ? 'font-medium' : ''}`}
                      >
                        {option.text}
                      </label>
                    </div>
                    {hasVoted && (
                      <span className="text-sm font-medium">{percentage}% ({option.votes})</span>
                    )}
                  </div>
                  
                  {hasVoted && (
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            
            {!hasVoted && (
              <Button 
                onClick={handleVote} 
                disabled={!selectedOption}
                className="mt-4"
              >
                Vote
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
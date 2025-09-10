'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Loader2 } from 'lucide-react';
import { getPollResults } from '@/lib/actions/votes';

type PollOption = {
  id: string;
  text: string;
  poll_id?: string;
  position: number;
};

interface PollResultsProps {
  pollId: string;
  options: PollOption[];
  refreshTrigger?: number;
}

export default function PollResults({ pollId, options, refreshTrigger }: PollResultsProps) {
  const [results, setResults] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const result = await getPollResults(pollId);
        if (result.success && result.results) {
          setResults(result.results);
        }
      } catch (error) {
        console.error('Error fetching poll results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [pollId, refreshTrigger]);

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  const calculatePercentage = (optionId: string) => {
    const votes = results[optionId] || 0;
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Poll Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading results...</span>
          </div>
        ) : totalVotes === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No votes yet</p>
            <p className="text-sm">Be the first to vote on this poll!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {options.map((option) => {
              const percentage = calculatePercentage(option.id);
              const voteCount = results[option.id] || 0;

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm text-muted-foreground">
                      {voteCount} vote{voteCount !== 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Total votes: {totalVotes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
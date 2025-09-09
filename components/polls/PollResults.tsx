'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Loader2 } from 'lucide-react';
import { getPollResults } from '@/lib/actions/votes';

type PollOption = {
  id: string;
  text: string;
  poll_id: string;
};

type PollResultsProps = {
  pollId: string;
  options: PollOption[];
  refreshTrigger?: number; // Used to trigger a refresh when a new vote is cast
};

export default function PollResults({ pollId, options, refreshTrigger = 0 }: PollResultsProps) {
  const [results, setResults] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await getPollResults(pollId);
        if (response.success) {
          setResults(response.results || {});
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch results');
        }
      } catch (err) {
        console.error('Error fetching poll results:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [pollId, refreshTrigger]);

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  const calculatePercentage = (optionId: string) => {
    const votes = results[optionId] || 0;
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5" />
          Poll Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading results...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            <p className="font-medium">Error loading results</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        ) : totalVotes === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
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
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{option.text}</span>
                    <span className="font-bold text-primary">{percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground text-center">
                Total: <span className="font-bold text-primary">{totalVotes}</span> {totalVotes === 1 ? 'vote' : 'votes'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
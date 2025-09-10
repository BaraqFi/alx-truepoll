'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { castVote, castMultipleVotes, hasUserVoted, canUserVote } from '@/lib/actions/votes';
import { toast } from 'sonner';

type PollOption = {
  id: string;
  text: string;
  poll_id?: string;
  position: number;
};

interface VotingFormProps {
  pollId: string;
  options: PollOption[];
  isMultipleChoice: boolean;
  onVoteComplete?: () => void;
}

export default function VotingForm({
  pollId,
  options,
  isMultipleChoice,
  onVoteComplete
}: VotingFormProps) {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleSingleChoice = (value: string) => {
    setSelectedOption(value);
  };

  const handleMultipleChoice = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, optionId]);
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
    }
  };

  // Check if user can vote and has already voted
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!user) {
        setCanVote(false);
        setIsLoading(false);
        return;
      }

      try {
        const [canVoteResult, hasVotedResult] = await Promise.all([
          canUserVote(pollId, user.id),
          hasUserVoted(pollId, user.id)
        ]);

        if (canVoteResult.success) {
          setCanVote(canVoteResult.canVote ?? false);
        }

        if (hasVotedResult.success) {
          setHasVoted(hasVotedResult.hasVoted ?? false);
          if (hasVotedResult.hasVoted && hasVotedResult.selectedOptionIds.length > 0) {
            if (isMultipleChoice) {
              setSelectedOptions(hasVotedResult.selectedOptionIds);
            } else {
              setSelectedOption(hasVotedResult.selectedOptionIds[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVoteStatus();
  }, [user, pollId, isMultipleChoice]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to vote');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let result;
      if (isMultipleChoice) {
        result = await castMultipleVotes({
          pollId,
          optionIds: selectedOptions,
          userId: user.id,
        });
      } else {
        if (!selectedOption) {
          toast.error('Please select an option');
          return;
        }
        result = await castVote({
          pollId,
          optionId: selectedOption,
          userId: user.id,
        });
      }

      if (result.success) {
        toast.success('Vote submitted successfully!');
        setHasVoted(true);
        onVoteComplete?.();
      } else {
        toast.error(result.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isMultipleChoice 
    ? selectedOptions.length > 0 
    : selectedOption !== null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground py-8">
            You need to be logged in to vote on this poll.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!canVote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground py-8">
            You cannot vote on this poll. It may be inactive or expired.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {hasVoted ? 'Your Vote' : 'Cast Your Vote'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMultipleChoice ? (
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleMultipleChoice(option.id, checked as boolean)
                  }
                  disabled={isSubmitting || hasVoted}
                />
                <Label 
                  htmlFor={option.id} 
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={selectedOption || ''}
            onValueChange={handleSingleChoice}
            disabled={isSubmitting || hasVoted}
          >
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {!hasVoted && (
          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Vote...
                </>
              ) : (
                'Submit Vote'
              )}
            </Button>
          </div>
        )}

        {hasVoted && (
          <p className="text-sm text-green-600 text-center py-2">
            ✓ You have already voted on this poll
          </p>
        )}
      </CardContent>
    </Card>
  );
}
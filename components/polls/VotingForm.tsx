'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { castVote, hasUserVoted } from '@/lib/actions/votes';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type PollOption = {
  id: string;
  text: string;
  poll_id: string;
};

type VotingFormProps = {
  pollId: string;
  options: PollOption[];
  isMultipleChoice: boolean;
  userId: string | null;
  initialSelectedOption?: string | null;
  onVoteComplete?: () => void;
};

export default function VotingForm({
  pollId,
  options,
  isMultipleChoice,
  userId,
  initialSelectedOption = null,
  onVoteComplete
}: VotingFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOption);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialSelectedOption ? [initialSelectedOption] : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isLoadingVoteStatus, setIsLoadingVoteStatus] = useState(true);

  // Check if user has already voted
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!userId) {
        setIsLoadingVoteStatus(false);
        return;
      }

      try {
        const result = await hasUserVoted(pollId, userId);
        if (result.success) {
          setHasVoted(result.hasVoted || false);
          setUserVote(result.selectedOptionId);
          if (result.selectedOptionId) {
            setSelectedOption(result.selectedOptionId);
            setSelectedOptions([result.selectedOptionId]);
          }
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      } finally {
        setIsLoadingVoteStatus(false);
      }
    };

    checkVoteStatus();
  }, [pollId, userId]);

  const handleSingleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleMultiOptionChange = (optionId: string, checked: boolean) => {
    setSelectedOptions(prev => {
      if (checked) {
        return [...prev, optionId];
      } else {
        return prev.filter(id => id !== optionId);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('You must be logged in to vote');
      return;
    }

    if (isMultipleChoice && selectedOptions.length === 0) {
      toast.error('Please select at least one option');
      return;
    }

    if (!isMultipleChoice && !selectedOption) {
      toast.error('Please select an option');
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we only support single choice voting
      // In the future, we can extend this to support multiple choice
      const optionToVote = isMultipleChoice ? selectedOptions[0] : selectedOption;
      
      if (!optionToVote) {
        toast.error('Please select an option');
        return;
      }

      const result = await castVote({
        pollId,
        optionId: optionToVote,
        userId
      });

      if (result.success) {
        toast.success('Your vote has been recorded!');
        setHasVoted(true);
        setUserVote(optionToVote);
        if (onVoteComplete) {
          onVoteComplete();
        }
      } else {
        toast.error(`Failed to cast vote: ${result.error}`);
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <Card className="p-6 mt-4">
        <p className="text-center text-muted-foreground mb-4">
          You need to be logged in to vote on this poll.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <a href="/auth/login">Log In to Vote</a>
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoadingVoteStatus) {
    return (
      <Card className="p-6 mt-4">
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </Card>
    );
  }

  if (hasVoted) {
    return (
      <Card className="p-6 mt-4">
        <div className="text-center">
          <p className="text-green-600 font-medium mb-2">✓ You have already voted on this poll</p>
          <p className="text-sm text-muted-foreground">
            Your vote: {options.find(opt => opt.id === userVote)?.text}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 mt-4">
        <h3 className="text-lg font-medium mb-4">Cast Your Vote</h3>
        
        {isMultipleChoice ? (
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked: boolean | 'indeterminate') => handleMultiOptionChange(option.id, checked === true)}
                />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={selectedOption || ''}
            onValueChange={handleSingleOptionChange}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={isSubmitting || (!isMultipleChoice && !selectedOption) || (isMultipleChoice && selectedOptions.length === 0)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Vote'
          )}
        </Button>
      </Card>
    </form>
  );
}
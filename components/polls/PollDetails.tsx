'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import VotingForm from '@/components/polls/VotingForm';
import PollResults from '@/components/polls/PollResults';
import QRCodeDisplay from '@/components/polls/QRCodeDisplay';

type PollOption = {
  id: string;
  text: string;
  position: number;
};

type Poll = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_multiple_choice: boolean;
  poll_options: PollOption[];
};

interface PollDetailsProps {
  poll: Poll;
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PollDetails({ poll, userId, isOpen, onClose }: PollDetailsProps) {
  const [showResults, setShowResults] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  const handleVoteComplete = () => {
    setVoteCount(prev => prev + 1); // Trigger re-fetch in PollResults
    setShowResults(true);
  };

  const toggleView = () => {
    setShowResults(prev => !prev);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{poll.title}</DialogTitle>
          {poll.description && (
            <DialogDescription>{poll.description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="mt-4">
          {showResults ? (
            <PollResults 
              pollId={poll.id}
              options={poll.poll_options.map(o => ({...o, poll_id: poll.id}))}
              refreshTrigger={voteCount}
            />
          ) : (
            <VotingForm
              pollId={poll.id}
              options={poll.poll_options.map(o => ({...o, poll_id: poll.id}))}
              isMultipleChoice={poll.is_multiple_choice}
              userId={userId}
              onVoteComplete={handleVoteComplete}
            />
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={toggleView}>
            {showResults ? 'Show Voting' : 'Show Results'}
          </Button>
          <QRCodeDisplay pollId={poll.id} pollTitle={poll.title} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

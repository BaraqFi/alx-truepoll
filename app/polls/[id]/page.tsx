import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import VotingForm from '@/components/polls/VotingForm';
import QRCodeDisplay from '@/components/polls/QRCodeDisplay';
import PollResults from '@/components/polls/PollResults';
import { getPollById } from '@/lib/actions/polls';
import { notFound } from 'next/navigation';

export default async function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getPollById(id);
  if (!result.success || !result.poll) {
    notFound();
  }
  
  const poll = result.poll;
  
  // Format the date for display
  const formattedDate = new Date(poll.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <a href="/polls">← Back to Polls</a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{poll.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{poll.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-6">
              <span>Created on {formattedDate}</span>
              <span>•</span>
              <span>{poll.is_public ? 'Public Poll' : 'Private Poll'}</span>
              <span>•</span>
              <span>{poll.is_multiple_choice ? 'Multiple Choice' : 'Single Choice'}</span>
            </div>
            
            {/* Voting Form Component */}
            <VotingForm 
              pollId={poll.id}
              options={poll.poll_options}
              isMultipleChoice={poll.is_multiple_choice}
            />
            
            {/* Poll Results Component */}
            <PollResults 
              pollId={poll.id}
              options={poll.poll_options}
            />
            
            {/* QR Code Component */}
            <QRCodeDisplay 
              pollId={poll.id}
              pollTitle={poll.title}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPolls } from '@/lib/actions/polls';
import PollCard from '@/components/polls/PollCard';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_multiple_choice: boolean;
  is_public: boolean;
  is_active: boolean;
  poll_options: Array<{
    id: string;
    text: string;
    position: number;
  }>;
}

export default function MyPollsPageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/polls/my-polls');
      return;
    }

    if (user) {
      loadUserPolls();
    }
  }, [user, authLoading, router]);

  const loadUserPolls = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getUserPolls(user.id);
      if (result.success) {
        setPolls(result.polls || []);
      } else {
        setError(result.error || 'Failed to load polls');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading polls:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePollUpdated = () => {
    // Refresh the polls list when a poll is updated
    loadUserPolls();
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Polls</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view your created polls
            </p>
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your polls...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Polls</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view your created polls
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Polls</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view your created polls
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadUserPolls}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Polls</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view your created polls
          </p>
        </div>
        <Button asChild>
          <Link href="/polls/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Poll
          </Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <EmptyState
          title="No polls created yet"
          description="You haven't created any polls yet. Create your first poll to get started!"
          actionLabel="Create Your First Poll"
          actionHref="/polls/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard 
              key={poll.id} 
              poll={poll} 
              showActions={true}
              onPollUpdated={handlePollUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

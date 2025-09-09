'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { createDemoPolls, getPublicPolls, getUserPolls } from '@/lib/actions/polls';
import { supabase } from '@/lib/supabase';

import PollCard from '@/components/polls/PollCard';
import EmptyState from '@/components/shared/EmptyState';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import PollDetails from '@/components/polls/PollDetails';
import { User } from '@supabase/supabase-js';

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

export default function PollsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { success, polls = [], error } = user 
        ? await getUserPolls(user.id)
        : await getPublicPolls();

      if (success) {
        setPolls(polls as Poll[]);
      } else {
        console.error('Failed to fetch polls:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenPoll = (poll: Poll) => {
    setSelectedPoll(poll);
  };

  const handleClosePoll = () => {
    setSelectedPoll(null);
  };

  const handleCreateDemoPolls = async () => {
    if (user) {
      await createDemoPolls(user.id);
      // Refetch polls
      const { polls = [] } = await getUserPolls(user.id);
      setPolls(polls as Poll[]);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Browse Polls</h1>
            <p className="text-muted-foreground mt-2">
              {user 
                ? "Discover and vote on polls created by the community"
                : "Sign in to create polls and vote on existing ones"
              }
            </p>
          </div>
          {user && (
            <Button asChild>
              <Link href="/polls/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Poll
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted/50 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : polls.length === 0 ? (
          <EmptyState
            title="No polls found"
            description={
              user 
                ? "Create your first poll to get started!" 
                : "There are no public polls available at the moment."
            }
            actionLabel={user ? "Create Poll" : undefined}
            actionHref={user ? "/polls/create" : undefined}
            showDemoButton={!!user && polls.length === 0}
            onDemoButtonClick={handleCreateDemoPolls}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onOpenPoll={handleOpenPoll} />
            ))}
          </div>
        )}

        {!user && !isLoading && (
          <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              Want to create your own polls and vote on others?
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedPoll && (
        <PollDetails
          poll={selectedPoll}
          userId={user?.id || null}
          isOpen={!!selectedPoll}
          onClose={handleClosePoll}
        />
      )}
    </MainLayout>
  );
}

'use client';

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import PollCard from "@/components/polls/PollCard";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_multiple_choice: boolean;
  is_public: boolean;
  is_active: boolean;
  total_votes: number;
  poll_options: Array<{
    id: string;
    text: string;
    position: number;
  }>;
}

interface PollsPageContentProps {
  polls: Poll[];
}

export default function PollsPageContent({ polls }: PollsPageContentProps) {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !!user;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Browse Polls</h1>
            <p className="text-muted-foreground mt-2">
              Discover and vote on polls created by the community
            </p>
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Polls</h1>
          <p className="text-muted-foreground mt-2">
            Discover and vote on polls created by the community
          </p>
        </div>
        {isLoggedIn && (
          <Button asChild>
            <Link href="/polls/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Poll
            </Link>
          </Button>
        )}
      </div>

      {polls.length === 0 ? (
        <EmptyState
          title="No polls found"
          description="There are no public polls available at the moment."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}

      {!isLoggedIn && (
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
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePollForm } from '@/components/polls/CreatePollForm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function CreatePollPageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/polls/create');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a New Poll</h1>
          <p className="text-muted-foreground mt-2">
            Create a poll and gather opinions from the community
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a New Poll</h1>
          <p className="text-muted-foreground mt-2">
            Create a poll and gather opinions from the community
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create a New Poll</h1>
        <p className="text-muted-foreground mt-2">
          Create a poll and gather opinions from the community
        </p>
      </div>

      <CreatePollForm />
    </div>
  );
}

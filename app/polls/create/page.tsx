import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { CreatePollForm } from '@/components/polls/CreatePollForm';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CreatePollPage() {
  // Get the current user from Supabase
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a New Poll</h1>
          <p className="text-muted-foreground mt-2">
            Create a poll and gather opinions from the community
          </p>
        </div>

        <CreatePollForm userId={user.id} />
      </div>
    </MainLayout>
  );
}
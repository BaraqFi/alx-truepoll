import PollCard from '@/components/polls/PollCard';
import EmptyState from '@/components/shared/EmptyState';
import MainLayout from '@/components/layout/MainLayout';

// This would be replaced with actual data fetching
const MOCK_POLLS = [
  {
    id: '1',
    title: 'What is your favorite programming language?',
    description: 'Help us understand which programming languages are most popular among developers.',
    createdBy: 'John Doe',
    votesCount: 42,
    createdAt: '2 days ago',
  },
  {
    id: '2',
    title: 'Which frontend framework do you prefer?',
    description: 'React, Vue, Angular, or something else? Let us know your preference!',
    createdBy: 'Jane Smith',
    votesCount: 28,
    createdAt: '1 week ago',
  },
  {
    id: '3',
    title: 'How often do you deploy to production?',
    description: 'We want to understand deployment frequency across different teams and organizations.',
    createdBy: 'Alex Johnson',
    votesCount: 15,
    createdAt: '3 days ago',
  },
];

export default function PollsPage() {
  const polls = MOCK_POLLS;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Polls</h1>
          <p className="text-muted-foreground mt-2">
            Discover and vote on polls created by the community
          </p>
        </div>

        {polls.length === 0 ? (
          <EmptyState
            title="No polls found"
            description="Be the first to create a poll for the community!"
            actionLabel="Create Poll"
            actionHref="/polls/create"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard
                key={poll.id}
                id={poll.id}
                title={poll.title}
                description={poll.description}
                createdBy={poll.createdBy}
                votesCount={poll.votesCount}
                createdAt={poll.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
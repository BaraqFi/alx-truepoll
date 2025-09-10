import MainLayout from "@/components/layout/MainLayout";
import { getPublicPolls } from "@/lib/actions/polls";
import PollsPageContent from "@/components/polls/PollsPageContent";

export default async function PollsPage() {
  const result = await getPublicPolls();
  const polls = result.success ? result.polls || [] : [];
  
  return (
    <MainLayout>
      <PollsPageContent polls={polls} />
    </MainLayout>
  );
}
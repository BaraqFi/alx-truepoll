import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, BarChart3 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  position: number;
}

interface PollCardProps {
  id: string;
  title: string;
  description?: string | null;
  created_at: string;
  poll_options: PollOption[];
}

export default function PollCard({ 
  id, 
  title, 
  description, 
  created_at,
  poll_options 
}: PollCardProps) {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg leading-tight">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3" />
          {formatDate(created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-3 w-3" />
          <span>{poll_options.length} option{poll_options.length !== 1 ? 's' : ''} available</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild size="sm" className="w-full">
          <Link href={`/polls/${id}`}>View Poll</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
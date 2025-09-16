import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, BarChart3, List } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PollActions from "./PollActions";

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
  is_active?: boolean;
  total_votes?: number;
  created_by?: string;
  poll_options: PollOption[];
};

interface PollCardProps {
  poll: Poll;
  showActions?: boolean;
  onPollUpdated?: () => void;
}

export default function PollCard({ poll, showActions = false, onPollUpdated }: PollCardProps) {
  const { id, title, description, created_at, poll_options, is_active = true, total_votes = 0, created_by } = poll;
  const { user } = useAuth();
  const isOwner = showActions && user?.id === created_by;
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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg leading-tight">{title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3" />
              {formatDate(created_at)}
            </CardDescription>
          </div>
          {/* Status Badge */}
          <Badge variant={is_active ? "default" : "secondary"} className="ml-2">
            {is_active ? "Active" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>{total_votes} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <List className="h-3 w-3" />
            <span>{poll_options.length} option{poll_options.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/polls/${id}`}>
            {is_active ? "Vote Now" : "View Results"}
          </Link>
        </Button>
        
        {/* Owner Actions */}
        {isOwner && (
          <PollActions 
            poll={{ id, title, is_active, total_votes }} 
            onPollUpdated={onPollUpdated}
          />
        )}
      </CardFooter>
    </Card>
  );
}
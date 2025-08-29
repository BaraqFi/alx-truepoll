import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PollCardProps {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  votesCount: number;
  createdAt: string;
}

export default function PollCard({ 
  id, 
  title, 
  description, 
  createdBy, 
  votesCount, 
  createdAt 
}: PollCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-1">By {createdBy}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <span>{votesCount} votes</span>
          <span className="mx-2">•</span>
          <span>{createdAt}</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/polls/${id}`}>View Poll</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-background">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Button className="mt-4" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
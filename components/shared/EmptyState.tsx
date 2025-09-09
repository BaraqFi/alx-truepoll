'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  showDemoButton?: boolean;
  onDemoButtonClick?: () => Promise<void>;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  showDemoButton,
  onDemoButtonClick
}: EmptyStateProps) {
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleDemoButtonClick = async () => {
    if (onDemoButtonClick) {
      setIsLoadingDemo(true);
      try {
        await onDemoButtonClick();
      } catch (error) {
        console.error('Error creating demo polls:', error);
      } finally {
        setIsLoadingDemo(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-background">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Button className="mt-4" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {showDemoButton && (
        <Button 
          className="mt-4" 
          onClick={handleDemoButtonClick}
          disabled={isLoadingDemo}
        >
          {isLoadingDemo ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            'Create Demo Polls'
          )}
        </Button>
      )}
    </div>
  );
}
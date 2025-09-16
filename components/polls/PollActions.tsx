'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  MoreVertical, 
  Lock, 
  Unlock, 
  Share, 
  Trash2,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ClosePollDialog from './ClosePollDialog';

interface PollActionsProps {
  poll: { 
    id: string; 
    title: string; 
    is_active: boolean; 
    total_votes?: number;
  };
  onPollUpdated?: () => void;
}

export default function PollActions({ poll, onPollUpdated }: PollActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  
  const handleClosePoll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/polls/${poll.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close' })
      });
      
      if (!response.ok) {
        // Try to parse error response as JSON, fallback to text
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorResult = await response.json();
            errorMessage = errorResult.error || errorMessage;
          } else {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          // Use the default error message if parsing fails
        }
        toast.error(errorMessage);
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Poll closed successfully');
        setShowCloseDialog(false);
        onPollUpdated?.();
      } else {
        toast.error(result.error || 'Failed to close poll');
      }
    } catch (error) {
      console.error('Error closing poll:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReopenPoll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/polls/${poll.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reopen' })
      });
      
      if (!response.ok) {
        // Try to parse error response as JSON, fallback to text
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorResult = await response.json();
            errorMessage = errorResult.error || errorMessage;
          } else {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          // Use the default error message if parsing fails
        }
        toast.error(errorMessage);
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Poll reopened successfully');
        onPollUpdated?.();
      } else {
        toast.error(result.error || 'Failed to reopen poll');
      }
    } catch (error) {
      console.error('Error reopening poll:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharePoll = async () => {
    try {
      const pollUrl = `${window.location.origin}/polls/${poll.id}`;
      await navigator.clipboard.writeText(pollUrl);
      toast.success('Poll link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {poll.is_active ? (
            <DropdownMenuItem 
              onClick={() => setShowCloseDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Lock className="mr-2 h-4 w-4" />
              Close Poll
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleReopenPoll}>
              <Unlock className="mr-2 h-4 w-4" />
              Reopen Poll
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSharePoll}>
            <Share className="mr-2 h-4 w-4" />
            Share Poll
          </DropdownMenuItem>
          
          {/* Future: Add edit and delete options */}
          {/* 
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit Poll
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Poll
          </DropdownMenuItem>
          */}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ClosePollDialog
        poll={poll}
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={handleClosePoll}
        isLoading={isLoading}
      />
    </>
  );
}

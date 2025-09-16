'use client';

import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClosePollDialogProps {
  poll: { 
    id: string; 
    title: string; 
    total_votes?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export default function ClosePollDialog({ 
  poll, 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}: ClosePollDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Close Poll
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to close "{poll.title}"? 
            <br /><br />
            This will prevent new votes but preserve all existing votes and results.
            {poll.total_votes !== undefined && (
              <>
                <br /><br />
                <strong>Current votes:</strong> {poll.total_votes}
              </>
            )}
            <br /><br />
            You can reopen this poll later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Close Poll
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

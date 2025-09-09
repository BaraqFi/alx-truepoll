'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const { logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        toast.success('Logged out successfully');
        
        // Redirect to home page after successful logout
        router.push('/');
      } catch (error: any) {
        console.error('Logout error:', error);
        toast.error(error.message || 'Failed to logout. Please try again.');
        
        // Redirect to home page even if logout fails
        router.push('/');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-lg">Logging out...</p>
      </div>
    </div>
  );
}
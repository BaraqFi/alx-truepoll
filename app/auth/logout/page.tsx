'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    };

    handleLogout();
  }, [logout, router]);

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Logging out...</p>
      </div>
    </div>
  );
}

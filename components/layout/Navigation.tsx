'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  const isLoggedIn = !!user;

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="font-bold text-xl">TruePoll</Link>
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-xl">TruePoll</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/polls" 
              className={`text-sm ${pathname === '/polls' ? 'font-medium' : 'text-muted-foreground'}`}
            >
              Browse Polls
            </Link>
            {isLoggedIn && (
              <>
                <Link 
                  href="/polls/my-polls" 
                  className={`text-sm ${pathname === '/polls/my-polls' ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  My Polls
                </Link>
                <Link 
                  href="/polls/create" 
                  className={`text-sm ${pathname === '/polls/create' ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  Create Poll
                </Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2 text-sm">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
                  <AvatarFallback>
                    {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/logout">Logout</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
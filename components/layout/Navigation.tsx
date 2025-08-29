'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navigation() {
  const pathname = usePathname();
  
  // This would be replaced with actual auth state
  const isLoggedIn = false;

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
              <Link 
                href="/polls/create" 
                className={`text-sm ${pathname === '/polls/create' ? 'font-medium' : 'text-muted-foreground'}`}
              >
                Create Poll
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
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
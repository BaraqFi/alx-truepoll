import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// This middleware runs on every request
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Create a Supabase client for auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          // Always set cookies with path='/' to ensure they're available across the site
          response.cookies.set({
            name,
            value,
            path: '/',
            ...options,
          });
        },
        remove: (name, options) => {
          // Always set path='/' when removing cookies too
          response.cookies.set({
            name,
            value: '',
            path: '/',
            ...options,
          });
        },
      },
    }
  );
  
  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Middleware auth error:', error);
  }
  
  // Check if the request is for a protected route
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith('/auth') && path !== '/auth/logout';
  const isProtectedRoute = 
    (path.startsWith('/polls/create') || 
    path === '/profile' || 
    path.includes('/polls/my'));
  
  // Redirect logic
  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access protected route without session
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (isAuthRoute && session) {
    // Redirect to polls if trying to access auth routes with active session
    const redirectUrl = new URL('/polls', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return response;
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
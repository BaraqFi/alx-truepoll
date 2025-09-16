import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Ignore cookie setting errors in API routes
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Ignore cookie removal errors in API routes
            }
          },
        },
      }
    );

    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_at,
        is_multiple_choice,
        is_public,
        is_active,
        created_by,
        poll_options (
          id,
          text,
          position
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
    }

    return NextResponse.json({ poll });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Ignore cookie setting errors in API routes
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Ignore cookie removal errors in API routes
            }
          },
        },
      }
    );

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // 'close' or 'reopen'

    // Validate action
    if (!action || !['close', 'reopen'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "close" or "reopen"' }, { status: 400 });
    }

    // Verify ownership
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('created_by, is_active, title')
      .eq('id', id)
      .single();
      
    if (pollError) {
      if (pollError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
    }

    if (!poll || poll.created_by !== user.id) {
      return NextResponse.json({ error: 'You can only modify your own polls' }, { status: 403 });
    }

    // Check current status
    if (action === 'close' && !poll.is_active) {
      return NextResponse.json({ error: 'Poll is already closed' }, { status: 400 });
    }
    
    if (action === 'reopen' && poll.is_active) {
      return NextResponse.json({ error: 'Poll is already open' }, { status: 400 });
    }

    // Update poll status
    const newStatus = action === 'close' ? false : true;
    
    const { error: updateError } = await supabase
      .from('polls')
      .update({ 
        is_active: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (updateError) {
      console.error('Poll update error:', updateError);
      return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      is_active: newStatus,
      message: `Poll ${action === 'close' ? 'closed' : 'reopened'} successfully`
    });
    
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

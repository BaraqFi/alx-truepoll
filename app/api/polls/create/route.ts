import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    if (process.env.NODE_ENV !== 'production') {
      const authCookies = cookieStore.getAll().filter((c: any) =>
        c.name.includes('supabase') || c.name.includes('auth') || c.name.startsWith('sb-')
      );
      console.log('API Route - Auth cookies:', authCookies.map((c: any) => ({ name: c.name, hasValue: Boolean(c.value) })));
    }

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

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Route - User check:', { user: !!user, error: authError });
    }
    
    if (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    if (!user) {
      console.log('No user found in session');
      return NextResponse.json({ error: 'You must be logged in to create a poll' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isMultipleChoice, isPublic, options } = body;

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'At least 2 options are required' }, { status: 400 });
    }

    // Sanitize and validate options
    const sanitizedOptions = options
      .map((option: any, index: number) => ({
        text: typeof option.text === 'string' ? option.text.trim() : '',
        position: index,
      }))
      .filter(option => option.text.length > 0);

    if (sanitizedOptions.length < 2) {
      return NextResponse.json({ error: 'At least 2 valid options are required' }, { status: 400 });
    }

    // Insert the poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: title.trim(),
        description: description ? description.trim() : null,
        created_by: user.id,
        is_multiple_choice: Boolean(isMultipleChoice),
        is_public: Boolean(isPublic),
      })
      .select('id')
      .single();

    if (pollError) {
      console.error('Poll creation error:', pollError);
      return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
    }

    // Insert the poll options
    const pollOptions = sanitizedOptions.map(option => ({
      poll_id: pollData.id,
      text: option.text,
      position: option.position,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      console.error('Options creation error:', optionsError);
      // If options insertion fails, delete the poll to maintain consistency
      await supabase.from('polls').delete().eq('id', pollData.id);
      return NextResponse.json({ error: 'Failed to create poll options' }, { status: 500 });
    }

    return NextResponse.json({ success: true, pollId: pollData.id });
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

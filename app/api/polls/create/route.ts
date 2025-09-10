import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
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
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in to create a poll' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isMultipleChoice, isPublic, options } = body;

    // Insert the poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description: description || null,
        created_by: user.id,
        is_multiple_choice: isMultipleChoice,
        is_public: isPublic,
      })
      .select('id')
      .single();

    if (pollError) {
      return NextResponse.json({ error: `Failed to create poll: ${pollError.message}` }, { status: 500 });
    }

    // Insert the poll options
    const pollOptions = options.map((option: any, index: number) => ({
      poll_id: pollData.id,
      text: option.text.trim(),
      position: index,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      // If options insertion fails, delete the poll to maintain consistency
      await supabase.from('polls').delete().eq('id', pollData.id);
      return NextResponse.json({ error: `Failed to create poll options: ${optionsError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, pollId: pollData.id });
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

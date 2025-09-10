'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@/lib/supabase-server';

type PollOption = {
  text: string;
  position: number;
};

type CreatePollData = {
  title: string;
  description?: string;
  isMultipleChoice: boolean;
  isPublic: boolean;
  expiresAt?: Date;
  options: PollOption[];
};

export async function createPoll(data: CreatePollData, userId: string) {
  try {
    const supabase = await createServerActionClient();
    
    // Verify the user exists and is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.id !== userId) {
      throw new Error('You must be logged in to create a poll');
    }
    
    // Insert the poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title,
        description: data.description || null,
        created_by: userId,
        is_multiple_choice: data.isMultipleChoice,
        is_public: data.isPublic,
      })
      .select('id')
      .single();

    if (pollError) {
      throw new Error(`Failed to create poll: ${pollError.message}`);
    }

    if (!pollData) {
      throw new Error('Failed to create poll: No data returned');
    }

    // Insert the poll options
    const pollOptions = data.options.map((option, index) => ({
      poll_id: pollData.id,
      text: option.text.trim(),
      position: option.position || index,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      // If options insertion fails, delete the poll to maintain consistency
      await supabase.from('polls').delete().eq('id', pollData.id);
      throw new Error(`Failed to create poll options: ${optionsError.message}`);
    }

    // Revalidate the polls page to show the new poll
    revalidatePath('/polls');
    
    return { success: true, pollId: pollData.id };
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserPolls(userId: string) {
  try {
    const supabase = await createServerActionClient();
    
    // Verify the user exists and is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.id !== userId) {
      throw new Error('You must be logged in to view your polls');
    }
    
    const { data, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_at,
        is_multiple_choice,
        is_public,
        poll_options (
          id,
          text,
          position
        )
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch polls: ${error.message}`);
    }

    return { success: true, polls: data || [] };
  } catch (error: any) {
    console.error('Error fetching polls:', error);
    return { success: false, error: error.message };
  }
}

export async function getPublicPolls() {
  try {
    const supabase = await createServerActionClient();
    
    const { data, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_at,
        is_multiple_choice,
        is_public,
        poll_options (
          id,
          text,
          position
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch public polls: ${error.message}`);
    }

    return { success: true, polls: data || [] };
  } catch (error: any) {
    console.error('Error fetching public polls:', error);
    return { success: false, error: error.message };
  }
}

export async function getPollById(pollId: string) {
  try {
    const supabase = await createServerActionClient();
    
    const { data, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_at,
        is_multiple_choice,
        is_public,
        created_by,
        poll_options (
          id,
          text,
          position
        )
      `)
      .eq('id', pollId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Poll not found');
      }
      throw new Error(`Failed to fetch poll: ${error.message}`);
    }

    return { success: true, poll: data };
  } catch (error: any) {
    console.error('Error fetching poll:', error);
    return { success: false, error: error.message };
  }
}

export async function createDemoPolls(userId: string) {
  try {
    const supabase = await createServerActionClient();
    
    // Verify the user exists and is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.id !== userId) {
      throw new Error('You must be logged in to create demo polls');
    }
    
    const demoPolls = [
      {
        title: 'Favorite Programming Language?',
        description: 'Help us decide the most popular programming language among developers.',
        isMultipleChoice: false,
        isPublic: true,
        options: [
          { text: 'JavaScript', position: 0 },
          { text: 'Python', position: 1 },
          { text: 'Java', position: 2 },
          { text: 'C#', position: 3 },
          { text: 'Go', position: 4 },
        ],
      },
      {
        title: 'Best way to learn coding?',
        description: 'What method do you find most effective for learning new programming concepts?',
        isMultipleChoice: true,
        isPublic: true,
        options: [
          { text: 'Online courses', position: 0 },
          { text: 'Coding bootcamps', position: 1 },
          { text: 'Reading documentation', position: 2 },
          { text: 'Building projects', position: 3 },
          { text: 'Pair programming', position: 4 },
        ],
      },
      {
        title: 'Preferred Code Editor?',
        description: 'Which code editor do you use most frequently for development?',
        isMultipleChoice: false,
        isPublic: true,
        options: [
          { text: 'VS Code', position: 0 },
          { text: 'Sublime Text', position: 1 },
          { text: 'Vim/Neovim', position: 2 },
          { text: 'IntelliJ IDEA', position: 3 },
          { text: 'Other', position: 4 },
        ],
      },
    ];

    for (const pollData of demoPolls) {
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: pollData.title,
          description: pollData.description,
          created_by: userId,
          is_multiple_choice: pollData.isMultipleChoice,
          is_public: pollData.isPublic,
        })
        .select('id')
        .single();

      if (pollError) {
        console.error('Error creating demo poll:', pollError.message);
        continue;
      }

      if (poll) {
        const optionsToInsert = pollData.options.map((option) => ({
          poll_id: poll.id,
          text: option.text,
          position: option.position,
        }));

        const { error: optionsError } = await supabase
          .from('poll_options')
          .insert(optionsToInsert);

        if (optionsError) {
          console.error('Error creating demo poll options:', optionsError.message);
          await supabase.from('polls').delete().eq('id', poll.id); // Clean up poll if options fail
        }
      }
    }

    revalidatePath('/polls');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating demo polls:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePoll(pollId: string, userId: string) {
  try {
    const supabase = await createServerActionClient();
    
    // Verify the user exists and is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.id !== userId) {
      throw new Error('You must be logged in to delete polls');
    }
    
    // First check if the user owns this poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (pollError) {
      throw new Error('Poll not found');
    }

    if (poll.created_by !== userId) {
      throw new Error('You can only delete your own polls');
    }

    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);

    if (deleteError) {
      throw new Error(`Failed to delete poll: ${deleteError.message}`);
    }

    revalidatePath('/polls');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting poll:', error);
    return { success: false, error: error.message };
  }
}

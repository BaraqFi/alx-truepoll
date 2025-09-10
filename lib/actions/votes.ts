'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@/lib/supabase-server';

type VoteData = {
  pollId: string;
  optionId: string;
  userId: string;
};

type MultipleVoteData = {
  pollId: string;
  optionIds: string[];
  userId: string;
};

export async function castVote({ pollId, optionId, userId }: VoteData) {
  try {
    const supabase = await createServerActionClient();
    
    // Check if user has already voted on this poll
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw new Error(`Failed to check existing vote: ${checkError.message}`);
    }

    // If user has already voted, update their vote
    if (existingVote) {
      const { error: updateError } = await supabase
        .from('votes')
        .update({ option_id: optionId })
        .eq('id', existingVote.id);

      if (updateError) {
        throw new Error(`Failed to update vote: ${updateError.message}`);
      }
    } else {
      // Otherwise, insert a new vote
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: userId,
        });

      if (insertError) {
        throw new Error(`Failed to cast vote: ${insertError.message}`);
      }
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error casting vote:', error);
    return { success: false, error: error.message };
  }
}

export async function castMultipleVotes({ pollId, optionIds, userId }: MultipleVoteData) {
  try {
    const supabase = await createServerActionClient();
    
    // For multiple choice polls, we need to handle multiple votes
    // First, delete any existing votes for this user on this poll
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('poll_id', pollId)
      .eq('user_id', userId);

    if (deleteError) {
      throw new Error(`Failed to clear existing votes: ${deleteError.message}`);
    }

    // Insert new votes for each selected option
    const votesToInsert = optionIds.map(optionId => ({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
    }));

    const { error: insertError } = await supabase
      .from('votes')
      .insert(votesToInsert);

    if (insertError) {
      throw new Error(`Failed to cast votes: ${insertError.message}`);
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error casting multiple votes:', error);
    return { success: false, error: error.message };
  }
}

export async function getPollResults(pollId: string) {
  try {
    const supabase = await createServerActionClient();
    
    const { data, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId);

    if (error) {
      throw new Error(`Failed to fetch poll results: ${error.message}`);
    }

    // Count votes for each option
    const results: Record<string, number> = {};
    data.forEach(vote => {
      if (results[vote.option_id]) {
        results[vote.option_id]++;
      } else {
        results[vote.option_id] = 1;
      }
    });

    return { success: true, results };
  } catch (error: any) {
    console.error('Error fetching poll results:', error);
    return { success: false, error: error.message };
  }
}

export async function hasUserVoted(pollId: string, userId: string) {
  try {
    const supabase = await createServerActionClient();
    
    const { data, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('user_id', userId);

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw new Error(`Failed to check if user voted: ${error.message}`);
    }

    return { 
      success: true, 
      hasVoted: data && data.length > 0, 
      selectedOptionIds: data ? data.map(vote => vote.option_id) : []
    };
  } catch (error: any) {
    console.error('Error checking if user voted:', error);
    return { success: false, error: error.message };
  }
}

export async function canUserVote(pollId: string, userId: string) {
  try {
    const supabase = await createServerActionClient();
    
    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('is_active, expires_at, is_multiple_choice')
      .eq('id', pollId)
      .single();

    if (pollError) {
      throw new Error('Poll not found');
    }

    if (!poll.is_active) {
      return { success: true, canVote: false, reason: 'Poll is not active' };
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) <= new Date()) {
      return { success: true, canVote: false, reason: 'Poll has expired' };
    }

    // For single choice polls, check if user has already voted
    if (!poll.is_multiple_choice) {
      const { data: existingVote, error: voteError } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();

      if (voteError && voteError.code !== 'PGRST116') {
        throw new Error(`Failed to check existing vote: ${voteError.message}`);
      }

      if (existingVote) {
        return { success: true, canVote: false, reason: 'You have already voted on this poll' };
      }
    }

    return { success: true, canVote: true };
  } catch (error: any) {
    console.error('Error checking if user can vote:', error);
    return { success: false, error: error.message };
  }
}

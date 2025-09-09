'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

type VoteData = {
  pollId: string;
  optionId: string;
  userId: string;
};

export async function castVote({ pollId, optionId, userId }: VoteData) {
  try {
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

export async function getPollResults(pollId: string) {
  try {
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
    const { data, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw new Error(`Failed to check if user voted: ${error.message}`);
    }

    return { 
      success: true, 
      hasVoted: !!data, 
      selectedOptionId: data?.option_id || null 
    };
  } catch (error: any) {
    console.error('Error checking if user voted:', error);
    return { success: false, error: error.message };
  }
}
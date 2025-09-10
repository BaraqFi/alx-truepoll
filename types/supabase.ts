export type Database = {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
          is_public: boolean;
          is_multiple_choice: boolean;
          is_active: boolean;
          total_votes: number;
          tags: string[];
          category: string | null;
          allow_anonymous: boolean;
          max_votes_per_user: number;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_by: string;
          expires_at?: string | null;
          is_public?: boolean;
          is_multiple_choice?: boolean;
          is_active?: boolean;
          total_votes?: number;
          tags?: string[];
          category?: string | null;
          allow_anonymous?: boolean;
          max_votes_per_user?: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_by?: string;
          expires_at?: string | null;
          is_public?: boolean;
          is_multiple_choice?: boolean;
          is_active?: boolean;
          total_votes?: number;
          tags?: string[];
          category?: string | null;
          allow_anonymous?: boolean;
          max_votes_per_user?: number;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          position: number;
          vote_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          position: number;
          vote_count?: number;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          position?: number;
          vote_count?: number;
        };
      };
      votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string | null;
          anonymous_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id?: string | null;
          anonymous_id?: string | null;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          user_id?: string | null;
          anonymous_id?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          website: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
          polls_created: number;
          votes_cast: number;
          email_notifications: boolean;
          public_profile: boolean;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          location?: string | null;
          polls_created?: number;
          votes_cast?: number;
          email_notifications?: boolean;
          public_profile?: boolean;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          location?: string | null;
          polls_created?: number;
          votes_cast?: number;
          email_notifications?: boolean;
          public_profile?: boolean;
        };
      };
      poll_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string | null;
          icon: string | null;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          is_active?: boolean;
        };
      };
      poll_tags: {
        Row: {
          id: string;
          name: string;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          usage_count?: number;
        };
        Update: {
          id?: string;
          name?: string;
          usage_count?: number;
        };
      };
      poll_analytics: {
        Row: {
          id: string;
          poll_id: string;
          date: string;
          views: number;
          votes: number;
          unique_voters: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          date: string;
          views?: number;
          votes?: number;
          unique_voters?: number;
        };
        Update: {
          id?: string;
          poll_id?: string;
          date?: string;
          views?: number;
          votes?: number;
          unique_voters?: number;
        };
      };
    };
    Views: {
      poll_results: {
        Row: {
          poll_id: string;
          option_id: string;
          option_text: string;
          position: number;
          votes_count: number;
          percentage: number;
        };
      };
      active_polls: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
          is_public: boolean;
          is_multiple_choice: boolean;
          is_active: boolean;
          total_votes: number;
          tags: string[];
          category: string | null;
          allow_anonymous: boolean;
          max_votes_per_user: number;
          created_by: string;
          creator_name: string | null;
          creator_username: string | null;
          options_count: number;
        };
      };
      user_poll_stats: {
        Row: {
          user_id: string;
          username: string | null;
          display_name: string | null;
          polls_created: number;
          votes_cast: number;
          total_votes_received: number | null;
          avg_votes_per_poll: number | null;
        };
      };
    };
    Functions: {
      get_poll_with_results: {
        Args: {
          poll_uuid: string;
        };
        Returns: {
          poll_id: string;
          title: string;
          description: string | null;
          created_by: string;
          created_at: string;
          expires_at: string | null;
          is_public: boolean;
          is_multiple_choice: boolean;
          total_votes: number;
          options: any;
        }[];
      };
      can_user_vote: {
        Args: {
          poll_uuid: string;
          user_uuid: string;
        };
        Returns: boolean;
      };
      cleanup_expired_polls: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      update_tag_usage_counts: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
  };
};

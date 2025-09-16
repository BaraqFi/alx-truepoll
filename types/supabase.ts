export type Database = {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          is_public: boolean;
          is_multiple_choice: boolean;
          is_active: boolean;
          total_votes: number;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_by: string;
          is_public?: boolean;
          is_multiple_choice?: boolean;
          is_active?: boolean;
          total_votes?: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_by?: string;
          is_public?: boolean;
          is_multiple_choice?: boolean;
          is_active?: boolean;
          total_votes?: number;
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
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
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
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
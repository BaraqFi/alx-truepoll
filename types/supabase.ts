export type Database = {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string;
          title: string;
          description: string;
          created_at: string;
          created_by: string;
          is_public: boolean;
          is_multiple_choice: boolean;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          created_by: string;
          is_public?: boolean;
          is_multiple_choice?: boolean;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          created_by?: string;
          is_public?: boolean;
          is_multiple_choice?: boolean;
          expires_at?: string | null;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          position: number;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          position: number;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          position?: number;
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
      poll_results: {
        Row: {
          poll_id: string;
          option_id: string;
          votes_count: number;
        };
      };
    };
    Functions: {};
  };
};
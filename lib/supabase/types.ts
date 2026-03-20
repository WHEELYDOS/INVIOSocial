/**
 * lib/supabase/types.ts
 * TypeScript types for all Supabase database tables.
 * Matches the schema defined in supabase/migrations/001_create_tables.sql
 */

export type ConsultationStatus = "pending" | "contacted" | "completed";

export interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: ConsultationStatus;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

// Generic typed database shape for use with createClient<Database>
export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: Consultation;
        Insert: Omit<Consultation, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Consultation, "id">>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, "id" | "subscribed_at"> & {
          id?: string;
          subscribed_at?: string;
        };
        Update: Partial<Omit<NewsletterSubscriber, "id">>;
      };
      contact_submissions: {
        Row: ContactSubmission;
        Insert: Omit<ContactSubmission, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ContactSubmission, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

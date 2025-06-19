export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          company_name: string;
          domain: string;
          city: string | null;
          country: string;
          employee_size: string;
          industry: string | null;
          linkedin_url: string | null;
          raw_json: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          domain: string;
          city?: string | null;
          country: string;
          employee_size: string;
          industry?: string | null;
          linkedin_url?: string | null;
          raw_json?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          domain?: string;
          city?: string | null;
          country?: string;
          employee_size?: string;
          industry?: string | null;
          linkedin_url?: string | null;
          raw_json?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      employee_size_enum:
        | "1‑10"
        | "11‑50"
        | "51‑200"
        | "201‑500"
        | "501‑1 000"
        | "1 001‑5 000"
        | "5 001‑10 000"
        | "10 000+";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

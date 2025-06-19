-- Create enum for employee sizes
CREATE TYPE employee_size_enum AS ENUM (
  '1‑10',
  '11‑50',
  '51‑200',
  '201‑500',
  '501‑1 000',
  '1 001‑5 000',
  '5 001‑10 000',
  '10 000+'
);

-- Create companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  city TEXT,
  country TEXT NOT NULL,
  employee_size employee_size_enum NOT NULL,
  industry TEXT,
  linkedin_url TEXT,
  raw_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_companies_company_name ON companies (company_name);
CREATE INDEX idx_companies_domain ON companies (domain);
CREATE INDEX idx_companies_country ON companies (country);
CREATE INDEX idx_companies_employee_size ON companies (employee_size);
CREATE INDEX idx_companies_created_at ON companies (created_at);

-- Create unique index on domain to prevent duplicates
CREATE UNIQUE INDEX idx_companies_domain_unique ON companies (domain);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust these based on your auth requirements)
-- Allowing read and insert for all users (including unauthenticated)
CREATE POLICY "Enable read access for all users" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON companies
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON companies
  FOR DELETE USING (auth.role() = 'authenticated');
export interface Company {
  company_name: string;
  domain: string;
  city?: string;
  country: string;
  employee_size: EmployeeSize;
  id?: string; // remove this later, just for my memory on what goes into table
  raw_json?: string; // remove this later, just for my memory goes into table
  industry?: string; // enrichment idea
  linkedin_url?: string; // enrichment idea
}

export type EmployeeSize =
  | "1‑10"
  | "11‑50"
  | "51‑200"
  | "201‑500"
  | "501‑1 000"
  | "1 001‑5 000"
  | "5 001‑10 000"
  | "10 000+";

export const employeeSizeOptions: EmployeeSize[] = [
  "1‑10",
  "11‑50",
  "51‑200",
  "201‑500",
  "501‑1 000",
  "1 001‑5 000",
  "5 001‑10 000",
  "10 000+",
];

export type Companies = Company[];

export const defaultCompany: Company = {
  company_name: "Apple",
  domain: "apple.com",
  country: "United States",
  city: "San Francisco",
  employee_size: "1‑10",
  id: "1",
  raw_json: JSON.stringify({
    company_name: "Apple",
    domain: "apple.com",
    country: "United States",
  }),
};

export const defaultCompanies: Companies = [defaultCompany];

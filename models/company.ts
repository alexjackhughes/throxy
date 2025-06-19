export interface Company {
  id?: string;
  company_name: string;
  domain: string;
  city?: string;
  country: string;
  employee_size: EmployeeSize;
  industry?: string;
  linkedin_url?: string;
  raw_json?: string;
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
  id: "1",
  company_name: "Apple",
  domain: "apple.com",
  country: "United States",
  city: "San Francisco",
  employee_size: "10 000+",
  industry: "Technology",
  linkedin_url: "https://linkedin.com/company/apple",
  raw_json: JSON.stringify({
    company_name: "Apple",
    domain: "apple.com",
    country: "United States",
    city: "San Francisco",
    employee_size: "10 000+",
  }),
};

export const defaultCompanies: Companies = [defaultCompany];

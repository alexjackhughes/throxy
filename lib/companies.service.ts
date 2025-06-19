import { supabaseClient } from "./supabase-client";
import { Database } from "./database.types";
import { Company } from "../models/company";

type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

// Convert database row to Company model
export const mapRowToCompany = (row: CompanyRow): Company => ({
  id: row.id,
  company_name: row.company_name,
  domain: row.domain,
  city: row.city || undefined,
  country: row.country,
  employee_size: row.employee_size as Company["employee_size"],
  industry: row.industry || undefined,
  linkedin_url: row.linkedin_url || undefined,
  raw_json: row.raw_json ? JSON.stringify(row.raw_json) : undefined,
});

// Convert Company model to database insert
export const mapCompanyToInsert = (
  company: Omit<Company, "id">
): CompanyInsert => ({
  company_name: company.company_name,
  domain: company.domain,
  city: company.city || null,
  country: company.country,
  employee_size: company.employee_size,
  industry: company.industry || null,
  linkedin_url: company.linkedin_url || null,
  raw_json: company.raw_json ? JSON.parse(company.raw_json) : null,
});

export class CompaniesService {
  // Get all companies
  static async getAll(): Promise<Company[]> {
    const { data, error } = await supabaseClient
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch companies: ${error.message}`);

    return data?.map(mapRowToCompany) || [];
  }

  // Get company by ID
  static async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabaseClient
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw new Error(`Failed to fetch company: ${error.message}`);
    }

    return data ? mapRowToCompany(data) : null;
  }

  // Create a new company
  static async create(company: Omit<Company, "id">): Promise<Company> {
    const insertData = mapCompanyToInsert(company);

    const { data, error } = await supabaseClient
      .from("companies")
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create company: ${error.message}`);

    return mapRowToCompany(data);
  }

  // Update an existing company
  static async update(
    id: string,
    updates: Partial<Omit<Company, "id">>
  ): Promise<Company> {
    const updateData: CompanyUpdate = {};

    if (updates.company_name !== undefined)
      updateData.company_name = updates.company_name;
    if (updates.domain !== undefined) updateData.domain = updates.domain;
    if (updates.city !== undefined) updateData.city = updates.city || null;
    if (updates.country !== undefined) updateData.country = updates.country;
    if (updates.employee_size !== undefined)
      updateData.employee_size = updates.employee_size;
    if (updates.industry !== undefined)
      updateData.industry = updates.industry || null;
    if (updates.linkedin_url !== undefined)
      updateData.linkedin_url = updates.linkedin_url || null;
    if (updates.raw_json !== undefined)
      updateData.raw_json = updates.raw_json
        ? JSON.parse(updates.raw_json)
        : null;

    const { data, error } = await supabaseClient
      .from("companies")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update company: ${error.message}`);

    return mapRowToCompany(data);
  }

  // Delete a company
  static async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete company: ${error.message}`);
  }

  // Bulk insert companies
  static async bulkInsert(
    companies: Omit<Company, "id">[]
  ): Promise<Company[]> {
    const insertData = companies.map(mapCompanyToInsert);

    const { data, error } = await supabaseClient
      .from("companies")
      .insert(insertData)
      .select();

    if (error)
      throw new Error(`Failed to bulk insert companies: ${error.message}`);

    return data?.map(mapRowToCompany) || [];
  }

  // Search companies by name or domain
  static async search(query: string): Promise<Company[]> {
    const { data, error } = await supabaseClient
      .from("companies")
      .select("*")
      .or(`company_name.ilike.%${query}%,domain.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to search companies: ${error.message}`);

    return data?.map(mapRowToCompany) || [];
  }

  // Filter companies by employee size
  static async filterByEmployeeSize(employeeSize: string): Promise<Company[]> {
    const { data, error } = await supabaseClient
      .from("companies")
      .select("*")
      .eq("employee_size", employeeSize)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to filter companies: ${error.message}`);

    return data?.map(mapRowToCompany) || [];
  }

  // Filter companies by country
  static async filterByCountry(country: string): Promise<Company[]> {
    const { data, error } = await supabaseClient
      .from("companies")
      .select("*")
      .eq("country", country)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to filter companies: ${error.message}`);

    return data?.map(mapRowToCompany) || [];
  }

  // Filter companies by multiple criteria
  static async filterCompanies(filters: {
    country?: string;
    employeeSize?: string;
    city?: string;
    search?: string;
  }): Promise<Company[]> {
    let query = supabaseClient.from("companies").select("*");

    // Apply exact match filters first (these work with AND logic)
    if (filters.country) {
      query = query.eq("country", filters.country);
    }

    if (filters.employeeSize) {
      query = query.eq("employee_size", filters.employeeSize);
    }

    if (filters.city) {
      query = query.eq("city", filters.city);
    }

    // Apply search filter using proper text search
    if (filters.search) {
      const searchTerm = filters.search.trim();
      if (searchTerm) {
        // Use separate conditions for company name and domain search
        // This will work as an OR condition between the two fields
        query = query.or(
          `company_name.ilike.%${searchTerm}%,domain.ilike.%${searchTerm}%`
        );
      }
    }

    // Order by created_at
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw new Error(`Failed to filter companies: ${error.message}`);

    return data?.map(mapRowToCompany) || [];
  }
}

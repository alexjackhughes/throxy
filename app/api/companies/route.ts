import { NextRequest, NextResponse } from "next/server";
import { CompaniesService } from "@/lib/companies.service";
import { Companies } from "@/models/company";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const country = searchParams.get("country");
    const employeeSize = searchParams.get("employee_size");
    const city = searchParams.get("city");
    const search = searchParams.get("search");

    let companies: Companies = [];

    // Check if any query parameters are set
    const hasFilters = country || employeeSize || city || search;

    if (!hasFilters) {
      // No filters - get all companies
      companies = await CompaniesService.getAll();
    } else {
      // Apply server-side filtering
      companies = await CompaniesService.filterCompanies({
        country: country || undefined,
        employeeSize: employeeSize || undefined,
        city: city || undefined,
        search: search || undefined,
      });
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

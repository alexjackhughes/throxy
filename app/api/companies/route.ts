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

    let companies: Companies = [];

    // Apply filtering based on query parameters
    if (!country && !employeeSize && !city) {
      // No filters - get all companies
      companies = await CompaniesService.getAll();
    } else if (country && !employeeSize && !city) {
      // Only country filter - use optimized server method
      companies = await CompaniesService.filterByCountry(country);
    } else if (employeeSize && !country && !city) {
      // Only employee size filter - use optimized server method
      companies = await CompaniesService.filterByEmployeeSize(employeeSize);
    } else {
      // Multiple filters or city filter - get all and filter
      companies = await CompaniesService.getAll();

      // Apply client-side filtering for multiple criteria
      if (country) {
        companies = companies.filter((company) => company.country === country);
      }

      if (employeeSize) {
        companies = companies.filter(
          (company) => company.employee_size === employeeSize
        );
      }

      if (city) {
        companies = companies.filter((company) => company.city === city);
      }
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

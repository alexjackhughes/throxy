import { NextRequest, NextResponse } from "next/server";
import { Company } from "../../../models/company";
import { parseCsvToCompanies } from "../../../lib/csv-parser";
import { enrichCompaniesWithOpenAI } from "../../../lib/openai-enrichment";
import { validateEmployeeCounts } from "../../../lib/exa-validation";
import { mapEmployeeSize } from "../../../lib/utils";
import { CompaniesService } from "@/lib/companies.service";

export async function POST(request: NextRequest) {
  try {
    const { csvData } = await request.json();

    // Process and parse the CSV data into Company objects
    let companies = parseCsvToCompanies(csvData);

    // Store the original raw data with temp_id for later reference
    const rawCompaniesData = companies.map((company) => ({
      temp_id: company.temp_id,
      raw_json: JSON.stringify(company),
    }));

    // Validate and correct employee counts using Exa search (now batched)
    companies = await validateEmployeeCounts(companies);

    // Enrich company data using OpenAI
    companies = await enrichCompaniesWithOpenAI(companies);

    // Map employee size to our enum values, we do this to stop any issues with the OpenAI response
    companies = companies.map((company) => ({
      ...company,
      employee_size: mapEmployeeSize(company.employee_size),
    }));

    // Merge the raw_json from original data into the enriched data using temp_id
    const finalCompanies: Omit<Company, "id">[] = companies.map(
      (enrichedCompany) => {
        const originalRawData = rawCompaniesData.find(
          (rawCompany) => rawCompany.temp_id === enrichedCompany.temp_id
        );

        // Remove temp_id from the final company object and add raw_json
        const { ...companyWithoutTempId } = enrichedCompany;
        return {
          ...companyWithoutTempId,
          raw_json: originalRawData?.raw_json,
        };
      }
    );

    // Deduplicate companies by domain to prevent any duplicate rows
    const uniqueCompanies = finalCompanies.reduce((acc, company) => {
      acc[company.domain] = company;
      return acc;
    }, {} as Record<string, Omit<Company, "id">>);

    const deduplicatedCompanies = Object.values(uniqueCompanies);

    // Bulk upsert companies into the database (insert new or update existing by domain)
    const upsertedCompanies = await CompaniesService.bulkUpsert(
      deduplicatedCompanies
    );

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${upsertedCompanies.length} ${
        upsertedCompanies.length === 1 ? "company" : "companies"
      }!`,
      count: upsertedCompanies.length,
    });
  } catch (error) {
    console.error("Error processing CSV data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing CSV data: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

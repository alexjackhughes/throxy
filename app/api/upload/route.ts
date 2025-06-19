import { NextRequest, NextResponse } from "next/server";
import { CompaniesService } from "../../../lib/companies.service";
import { Company, EmployeeSize } from "../../../models/company";

export async function POST(request: NextRequest) {
  try {
    const { csvData } = await request.json();

    console.log("Received CSV data:", csvData);

    // Process and parse the CSV data into Company objects
    const companies = parseCsvToCompanies(csvData);

    console.log("Parsed companies:", companies);

    // Bulk upsert companies into the database (insert new or update existing by domain)
    const upsertedCompanies = await CompaniesService.bulkUpsert(companies);

    console.log(`Successfully upserted ${upsertedCompanies.length} companies`);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${upsertedCompanies.length} companies`,
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

function parseCsvToCompanies(csvData: string): Omit<Company, "id">[] {
  // Split into lines
  const lines = csvData.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  // Get headers from first line
  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().toLowerCase());

  console.log("CSV Headers:", headers);

  // Map common header variations to our Company fields
  const headerMapping: { [key: string]: keyof Omit<Company, "id"> } = {
    company: "company_name",
    "company name": "company_name",
    company_name: "company_name",
    name: "company_name",
    organization: "company_name",

    domain: "domain",
    website: "domain",
    url: "domain",
    site: "domain",

    city: "city",
    location: "city",

    country: "country",
    nation: "country",

    "employee size": "employee_size",
    employee_size: "employee_size",
    employees: "employee_size",
    size: "employee_size",

    industry: "industry",
    sector: "industry",

    linkedin: "linkedin_url",
    "linkedin url": "linkedin_url",
    linkedin_url: "linkedin_url",
  };

  // Find column indices for our fields
  const columnMap: { [K in keyof Omit<Company, "id">]?: number } = {};

  headers.forEach((header, index) => {
    const mappedField = headerMapping[header];
    if (mappedField) {
      columnMap[mappedField] = index;
    }
  });

  console.log("Column mapping:", columnMap);

  // Parse data rows
  const companies: Omit<Company, "id">[] = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(",");

    // Process each column with data cleaning
    const processedColumns = columns.map((column, index) => {
      let processed = column;

      // Check if this is a domain column
      const isDomainColumn =
        columnMap.domain === index ||
        /\.(com|org|net|edu|gov|io|co\.uk|de|fr)/i.test(column) ||
        /^(https?:\/\/|www\.)/i.test(column);

      if (isDomainColumn) {
        // For domains: remove all spaces, www., http://, https://
        processed = processed
          .replace(/\s+/g, "") // Remove all spaces
          .replace(/^https?:\/\//i, "") // Remove http:// or https://
          .replace(/^www\./i, ""); // Remove www.
      } else {
        // For other fields: remove leading and trailing spaces only
        processed = processed.trim();
      }

      return processed;
    });

    // Extract company data
    const companyName =
      columnMap.company_name !== undefined
        ? processedColumns[columnMap.company_name]
        : "";
    const domain =
      columnMap.domain !== undefined ? processedColumns[columnMap.domain] : "";
    const country =
      columnMap.country !== undefined
        ? processedColumns[columnMap.country]
        : "";

    // Skip rows with missing required fields
    if (!companyName || !domain || !country) {
      console.log(
        `Skipping row ${
          i + 1
        }: missing required fields (company_name: ${companyName}, domain: ${domain}, country: ${country})`
      );
      continue;
    }

    // Map employee size to our enum values
    let employeeSize: EmployeeSize = "1‑10"; // default
    if (columnMap.employee_size !== undefined) {
      const rawEmployeeSize = processedColumns[columnMap.employee_size];
      employeeSize = mapEmployeeSize(rawEmployeeSize);
    }

    const company: Omit<Company, "id"> = {
      company_name: companyName,
      domain: domain,
      country: country,
      employee_size: employeeSize,
      city:
        columnMap.city !== undefined
          ? processedColumns[columnMap.city] || undefined
          : undefined,
      industry:
        columnMap.industry !== undefined
          ? processedColumns[columnMap.industry] || undefined
          : undefined,
      linkedin_url:
        columnMap.linkedin_url !== undefined
          ? processedColumns[columnMap.linkedin_url] || undefined
          : undefined,
    };

    companies.push(company);
  }

  console.log(
    `Parsed ${companies.length} valid companies from ${
      lines.length - 1
    } total rows`
  );

  return companies;
}

function mapEmployeeSize(rawSize: string): EmployeeSize {
  const size = rawSize.toLowerCase().trim();

  if (
    size.includes("1-10") ||
    size.includes("1‑10") ||
    size === "1-10" ||
    size === "small"
  ) {
    return "1‑10";
  }
  if (size.includes("11-50") || size.includes("11‑50")) {
    return "11‑50";
  }
  if (size.includes("51-200") || size.includes("51‑200")) {
    return "51‑200";
  }
  if (size.includes("201-500") || size.includes("201‑500")) {
    return "201‑500";
  }
  if (
    size.includes("501-1000") ||
    size.includes("501‑1 000") ||
    size.includes("501-1 000")
  ) {
    return "501‑1 000";
  }
  if (
    size.includes("1001-5000") ||
    size.includes("1 001‑5 000") ||
    size.includes("1001-5000")
  ) {
    return "1 001‑5 000";
  }
  if (size.includes("5001-10000") || size.includes("5 001‑10 000")) {
    return "5 001‑10 000";
  }
  if (size.includes("10000+") || size.includes("10 000+") || size === "large") {
    return "10 000+";
  }

  // Default fallback
  return "1‑10";
}

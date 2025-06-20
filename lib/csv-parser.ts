import { Company, EmployeeSize } from "../models/company";

// Robust CSV parsing function that handles quotes, empty fields, and escapes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current);
      current = "";
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Don't forget the last field
  result.push(current);
  return result;
}

export function parseCsvToCompanies(
  csvData: string
): (Omit<Company, "id"> & { temp_id: number })[] {
  // Split into lines and filter empty lines
  const lines = csvData.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  if (lines.length === 1) {
    throw new Error("CSV file only contains headers, no data rows");
  }

  // Parse headers from first line
  const headerCells = parseCSVLine(lines[0]);
  const headers = headerCells.map((header) => header.trim().toLowerCase());

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

  // Validate that we have at least company_name
  if (columnMap.company_name === undefined) {
    throw new Error(
      "CSV must contain a company name column (company, company name, company_name, name, or organization)"
    );
  }

  const expectedColumnCount = headers.length;
  const companies: (Omit<Company, "id"> & { temp_id: number })[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const columns = parseCSVLine(lines[i]);

      // Validate column count - pad with empty strings if too few, warn if too many
      if (columns.length < expectedColumnCount) {
        // Pad with empty strings
        while (columns.length < expectedColumnCount) {
          columns.push("");
        }
      } else if (columns.length > expectedColumnCount) {
        console.warn(
          `Row ${i + 1} has ${
            columns.length
          } columns, expected ${expectedColumnCount}. Extra columns will be ignored.`
        );
        // Truncate to expected length
        columns.splice(expectedColumnCount);
      }

      // Process each column with data cleaning
      const processedColumns = columns.map((column, index) => {
        let processed = column;

        // Remove all types of quotes from all columns and trim
        processed = processed.replace(/^["'`]+|["'`]+$/g, "").trim();

        // Check if this is a domain column
        const isDomainColumn =
          columnMap.domain === index ||
          /\.(com|org|net|edu|gov|io|co\.uk|de|fr|ca|au)/i.test(processed) ||
          /^(https?:\/\/|www\.)/i.test(processed);

        if (isDomainColumn) {
          // For domains: remove all spaces, www., http://, https://
          processed = processed
            .replace(/\s+/g, "") // Remove all spaces
            .replace(/^https?:\/\//i, "") // Remove http:// or https://
            .replace(/^www\./i, "") // Remove www.
            .replace(/\/$/, ""); // Remove trailing slash
        }

        return processed;
      });

      // Extract company data with safe access
      const getColumnValue = (field: keyof Omit<Company, "id">): string => {
        const index = columnMap[field];
        if (index !== undefined && index < processedColumns.length) {
          return processedColumns[index] || "";
        }
        return "";
      };

      const companyName = getColumnValue("company_name");

      // Skip rows with empty company names
      if (!companyName.trim()) {
        console.warn(`Row ${i + 1} has empty company name, skipping...`);
        continue;
      }

      const domain = getColumnValue("domain");
      const country = getColumnValue("country");
      const city = getColumnValue("city");
      const industry = getColumnValue("industry");
      const linkedinUrl = getColumnValue("linkedin_url");

      let employeeSize: string = "1‑10"; // default
      const rawEmployeeSize = getColumnValue("employee_size");
      if (rawEmployeeSize.trim()) {
        employeeSize = rawEmployeeSize;
      }

      const company: Omit<Company, "id"> & { temp_id: number } = {
        temp_id: companies.length + 1, // Use array length + 1 for consistent numbering
        company_name: companyName,
        domain: domain || "",
        country: country || "",
        employee_size: employeeSize as EmployeeSize,
        city: city || undefined,
        industry: industry || undefined,
        linkedin_url: linkedinUrl || undefined,
        // raw_json will be added later in the main processing function
      };

      companies.push(company);
    } catch (error) {
      console.error(
        `Error parsing row ${i + 1}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error(`Row content: ${lines[i]}`);
      // Continue processing other rows instead of failing completely
      continue;
    }
  }

  if (companies.length === 0) {
    throw new Error("No valid companies found in CSV data");
  }

  console.log(
    `Successfully parsed ${companies.length} companies from ${
      lines.length - 1
    } rows`
  );
  return companies;
}
